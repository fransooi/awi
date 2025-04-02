/** --------------------------------------------------------------------------
*
*            / \
*          / _ \               (°°)       Intelligent
*        / ___ \ [ \ [ \  [ \ [   ]       Programmable
*     _/ /   \ \_\  \/\ \/ /  |  | \      Personal
* (_)|____| |____|\__/\__/  [_| |_] \     Assistant
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
*
* ----------------------------------------------------------------------------
* @file editorwebsocket.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Web-Socket based editor 
*
*/
import EditorBase from './editorbase.mjs';
export { EditorWebSocket as Editor }
class EditorWebSocket extends EditorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.className = 'EditorWebSocket';
        this.handle = config.handle;
        this.parent = config.parent;
        this.version = this.parent.version;
        this.connection = config.connection;
        this.lastMessage = config.lastMessage;
        this.lastMessage.handle = this.handle;
        this.userName = config.userName;
        this.userKey = config.userKey;

        this.lastLine = '';
        this.inputEnabled = true;
        this.reroute = undefined;
        this.basket = {};
        this.toPrint = [];
        this.toPrintClean = [];
        this.toReply = {};
        this.callbacks = {};
        
        // Find all languages available in this server
        this.languageMode='';
        this.projectConnectors=[];
        this.projectConnector=null;
	}
    async connect(options, message)
    {
        var answer = await this.awi.callConnectors( [ 'isProjectConnector', 'project', { } ] );
        if ( answer.isSuccess() )
            this.projectConnectors=answer.data;
        this.toPrint.splice(0, 0, 'WebSocket connection established with user: ' + this.userName + ', key: ' + this.userKey + ', handle: ' + this.handle );
        this.toPrintClean.splice(0, 0, 'WebSocket connection established with user: ' + this.userName + ', key: ' + this.userKey + ', handle: ' + this.handle );
        this.toReply = { handle: this.handle, user: this.userName };
        this.command_prompt( { prompt: this.userName }, message );
        return true;
    }
	waitForInput( options = {} )
	{
		super.waitForInput( options );
		if ( this.toPrint.length > 0 && this.promptMessage)
		{
            var reply = {
                text: this.toPrint.join(''),
                textClean: this.toPrintClean.join('\n'),
                lastLine: this.lastLine
            };
            if ( this.toReply )
                for( var p in this.toReply )
                    reply[ p ] = this.toReply[ p ];
			this.reply( reply, this.promptMessage );
			this.toPrint = [];
			this.toPrintClean = [];
            this.toReply = {};
            this.promptMessage = null;
		}
	}
	print( text, options = {} )
	{
        return super.print( text, options );
	}
    reply( parameters, lastMessage=null  )
	{
        var message = {
            handle: lastMessage ? lastMessage.handle : this.lastMessage.handle,
            responseTo: lastMessage ? lastMessage.command : this.lastMessage.command,            
            callbackId: lastMessage ? lastMessage.id : this.lastMessage.id,
            id: this.awi.utilities.getUniqueIdentifier( {}, 'message', 0 ),
            parameters: parameters
        };
        var text = 'REPLY  : "' + message.responseTo + '" to user: ' + this.userName;
        var params = '';
        for ( var key in parameters )
            params += '.        ' + key + ': ' + parameters[ key ].toString().substring( 0, 60 ) + ', \n';
        if ( params )
            text += '\n' + params;
        this.awi.awi.editor.print( text, { user: 'awi' } );

		this.connection.send( JSON.stringify( message ) );
	}
	sendMessage( command, parameters, callback )
	{
        var message = {
            handle: this.handle,
            command: command, 
            parameters: parameters,
            id: this.awi.utilities.getUniqueIdentifier( {}, 'message', 0 )
        };
        if ( callback )
        {
            message.callbackId = this.awi.utilities.getUniqueIdentifier( this.callbacks, 'awi', 0 );
            this.callbacks[ message.callbackId ] = callback;
        }
        var text = 'MESSAGE: "' + command + '" to user: ' + this.userName;
        var params = '';
        for ( var key in parameters )
            params += '.        ' + key + ': ' + parameters[ key ].toString().substring( 0, 60 ) + ', \n';
        if ( params )
            text += '\n' + params;
        this.awi.awi.editor.print( text, { user: 'awi' } );

		this.connection.send( JSON.stringify( message ) );
	}
    onMessage( message )
    {
        this.lastMessage = message;
        if ( message.callbackId )
        {
            var callback = this.callbacks[ message.callbackId ];
            if ( callback )
            {
                this.callbacks[ message.callbackId ] = undefined;
                callback( message );
                return;
            }
        }
        var errorParameters = { error: 'awi:socket-command-not-found' };
        try
        {
            var text = 'COMMAND: "' + message.command + '" from user: ' + this.userName;
            var parameters = '';
            for ( var key in message.parameters )
                parameters += '.        ' + key + ': ' + message.parameters[ key ].toString().substring( 0, 60 ) + ', \n';
            if ( parameters )
                text += '\n' + parameters;
            if ( this[ 'command_' + message.command ] )
            {
                this.awi.awi.editor.print( text, { user: 'awi' } );
                return this[ 'command_' + message.command ]( message.parameters, message );
            }
            else if ( this.projectConnector && this.projectConnector[ 'command_' + message.command ] )
            {
                this.awi.awi.editor.print( text, { user: 'awi' } );
                return this.projectConnector[ 'command_' + message.command ]( message.parameters, message, this );
            }
        } 
        catch( e ) 
        { 
            errorParameters.error = 'awi:socket-error-processing-command';
            errorParameters.catchedError = e;
        }
        var text = this.awi.messages.getMessage( errorParameters, { command: message.command } );
        this.awi.awi.editor.print( text, { user: 'awi' } );
        this.reply( errorParameters );
    }
	async command_prompt( parameters, message )
	{
        var answer;
		
        this.promptMessage = message;
        var basket = this.awi.configuration.getBasket( 'user' );
		if ( this.inputEnabled )
		{
			if ( this.reroute )
				answer = await this.reroute( { prompt: parameters.prompt }, basket, { editor: this } );
			else
				answer = await this.awi.prompt.prompt( { prompt: parameters.prompt }, basket, { editor: this } );
            this.awi.configuration.setBasket( 'user', answer.getValue() );
		}
		else
		{
			this.toAsk.push( { parameters, message } );
            if ( !this.handleAsk )
            {
                var self = this;
				this.handleAsk = setInterval(
					function()
					{
						if ( self.inputEnabled && self.toAsk.length > 0 )
						{
                            var params = self.toAsk.pop();
                            self.command_prompt( { prompt: params.parameters }, params.message );
						}
                        if ( self.toAsk.length == 0 )
                        {
                            clearInterval( self.handleAsk );
                            self.handleAsk = null;
                        }
					}, 100 );
			}
		}
	}
    async command_newProject( parameters, message )
    {
        var answer = await this.command_setMode( parameters );
        if (answer.isError())
            return this.replyError( answer, message );
        var answer = await this.projectConnector.command_newProject( parameters );
        if (answer.isError())
            return this.replyError( answer, message );
        return this.replySuccess( answer, message );
    }
    async command_setMode( parameters, message )
    {
        if ( parameters.mode == this.languageMode )
            return this.replySuccess( this.newAnswer( parameters.mode ), message );
        for( var l in this.projectConnectors )
        {
            if ( l == parameters.mode )
            {
                this.languageMode = parameters.mode;
                this.projectConnector = this.projectConnectors[l].self;
                this.projectConnector.setEditor( this );
                return this.replySuccess( this.newAnswer( parameters.mode ), message );
            }
        }
        return this.replyError( this.newError( 'awi:language-not-found', { value: parameters.mode } ), message );
    }
}
