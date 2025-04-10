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
import { SERVERCOMMANDS } from '../../servercommands.mjs'
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
        this.lastMode = '';
	}
    async connect(options, message)
    {
        this.templatesUrl = options.templatesUrl;
        this.projectsUrl = options.projectsUrl;
        var answer = await this.awi.callConnectors( [ 'isProjectConnector', 'project', { } ] );
        if ( answer.isSuccess() )
        {
            this.projectConnectors=answer.data;
            for( var l in this.projectConnectors )
                this.projectConnectors[ l ].self.setEditor( this, options );
        }
        this.reply( { handle: this.handle, user: this.userName }, message );
        this.waitForInput();
        //this.command_prompt( { prompt: this.userName }, message );
        return true;
    }
    addDataToReply( name, data )
    {
        this.toReply[ name ] = data;
    }
	waitForInput( options = {} )
	{
		super.waitForInput( options );
		if (this.toPrint.length > 0 || !this.awi.utilities.isObjectEmpty(this.toReply))
		{
            var message = {
                text: this.toPrint.join(''),
                textClean: this.toPrintClean.join('\n'),
                lastLine: this.lastLine
            };
            if ( this.toReply )
                for( var p in this.toReply )
                    message[ p ] = this.toReply[ p ];
			this.sendMessage( SERVERCOMMANDS.PROMPT, message );
			this.toPrint = [];
			this.toPrintClean = [];
            this.toReply = {};
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
            else
            {
                this.awi.awi.editor.print( text, { user: 'awi' } );
                if ( message.parameters.mode && this.projectConnectors[ message.parameters.mode ] )
                    return this.projectConnectors[ message.parameters.mode ].self.command( message, this );
                return this.replyError( this.newError( 'awi:mode-not-found', { value: parameters.mode } ), message );
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
    async command_createAccount( parameters, message )
    {
	    if ( this.userName != parameters.userName )
		    return this.replyError( this.newError( 'awi:illegal-value', { value: parameters.userName } ), message );
        var config = this.awi.configuration.checkUserConfig( this.userName );
        if ( config )
            return this.replyError( this.newError( 'awi:account-already-exist', { value: this.userName } ) );

	    config = this.awi.configuration.getNewUserConfig();
	    config.firstName = parameters.firstName;
	    config.lastName = parameters.lastName;
	    config.fullName = parameters.firstName + ' ' + parameters.lastName;
        config.userName = parameters.userName;
        config.email = parameters.email;
        config.country = parameters.country;
        config.language = parameters.language;
        await this.awi.configuration.setNewUserConfig( config.userName.toLowerCase(), config );
        var answer = await this.awi.configuration.saveConfigs();
        if ( answer.isSuccess() )
            return this.replySuccess( this.newAnswer( { userName: parameters.userName } ), message );
        return this.replyError( this.newError( 'awi:error-when-creating-user', { value: parameters.userName } ), message );
    }
    async command_login( parameters, message )
    {
        if ( this.userName != parameters.userName )
            return this.replyError( this.newError( 'awi:illegal-value', { value: parameters.userName } ), message );
        var answer = await this.awi.callConnectors( [ 'setUser', '*', { userName: parameters.userName } ], {}, { editor: this } );
        if ( answer.isSuccess() )
        {
            this.awi.editor.print( [
                '<BR>', 
                'awi:user-changed:iwa', 
                '------------------------------------------------------------------' ],
                    { user: 'information', 
                    userName: parameters.userName,
                    newLine: true, prompt: false } );
            this.command_prompt( {
                prompt: 'Hello Awi... Could you first say hello to the user ' + 
                parameters.userName + ' then invent a funny joke about programming chores?'
            } );
            return this.replySuccess( answer, message );
        }
        return this.replyError( this.newError( 'awi:error-when-logging-in', { value: parameters.userName } ), message );
    }
}
