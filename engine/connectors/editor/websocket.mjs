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
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file websocket.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Connector opening a WebSocket server on the machine
*        to receive / send prompts.
*/
import ConnectorBase from '../../connector.mjs'
import Base from '../../base.mjs'
import { SERVERCOMMANDS } from '../../servercommands.js'
import { WebSocketServer } from 'ws'
export { ConnectorWebSocketEditor as Connector }

class ConnectorWebSocketEditor extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'WebSocket Editor Server';
		this.token = 'websocket';
		this.className = 'ConnectorWebSocketEditor';
        this.group = 'editor';
		this.version = '0.5';
		this.editors = {};
	}
	async connect( options )
	{
		super.connect( options );
		if ( !this.wsServer )
		{
			var self = this;
			this.wsServer = new WebSocketServer( { port: 1033 } );
			this.wsServer.on( 'connection', function( ws )
			{
				var connection = ws;
				connection.on( 'message',
					function( json )
					{
						var message = '';
						if ( typeof json != 'string' )
						{
							for ( var c = 0; c < json.length; c++ )
								message += String.fromCharCode( json[ c ] );
							message = JSON.parse( message );
						}
						else
						{
							message = JSON.parse( json );
						}

						if ( message.command == SERVERCOMMANDS.CONNECT )
						{
							self.user_connect( connection, message );
						}
						else
						{
							var editor = self.editors[ message.handle ];
							if ( editor )
                                editor.onMessage( message );
						}
					} );
				connection.on( 'close',
					function( reasonCode, description )
					{
						console.log( 'User disconnected.' );
					} );

			} );
		}
        return this.setConnected( true );
	}
	async user_connect( connection, message )
	{
		//var handle = this.awi.utilities.getUniqueIdentifier( this.editors, message.data.key.substring( 0, 5 ), 0 );
        var handle = this.awi.utilities.getUniqueIdentifier( this.editors, 'toto', 0 );
        var editor = new EditorWebSocket( this.awi, { 
			handle: handle,
			lastMessage: message,
			connection: connection,
			parent: this,
            userName: message.parameters.userName,
            userKey: message.parameters.userKey
        } );
        this.editors[ handle ] = editor;
        this.current = editor;
        await editor.connect({});
	}
}
class EditorWebSocket extends Base
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
        this.toSend = [];
        this.toSendClean = [];
        this.callbacks = {};
        
        // Find all languages available in this server
        this.languageMode='';
        this.projectConnectors=[];
        this.projectConnector=null;
	}
    async connect(options)
    {
        var answer = await this.awi.callConnectors( [ 'isProjectConnector', 'project', { } ] );
        if ( answer.isSuccess() )
            this.projectConnectors=answer.data;
        this.awi.editor.current.print( 'User connected, name: ' + this.userName + ', key: ' + this.userKey + ', handle: ' + this.handle, { user: 'user' } );
        this.reply( { handle: this.handle, user: this.userName } );
        return true;
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
            var text = 'User: ' + this.userName + ' command: ' + message.command;
            var parameters = '';
            for ( var key in message.parameters )
                parameters += key + ': ' + message.parameters[ key ] + ', \n';
            if ( parameters )
                text += '\n' + parameters;
            var func = null;
            if ( this[ 'command_' + message.command ] )
                func = this[ 'command_' + message.command ];
            else if (this.projectConnector)
                func = this.projectConnector[ 'command_' + message.command ];
            if ( func )
            {
                this.awi.editor.current.print( text, { user: 'awi' } );
                return func.apply( this, [ message.parameters ] );
            }
        } 
        catch( e ) 
        { 
            errorParameters.error = 'awi:socket-error-processing-command';
            errorParameters.catchedError = e;
        }
        var text = this.awi.messages.getMessage( errorParameters, { command: message.command } );
        this.awi.editor.current.print( text, { user: 'awi' } );
        this.reply( errorParameters );
    }
	async command_prompt( parameters )
	{
        var answer;
		this.toSend = [];
		this.toSendClean = [];
		
        var userName = this.awi.config.getConfig( 'user' ).firstName;        
		console.log( '.<' + userName + '<: ' + parameters.prompt );
        var basket = this.awi.configuration.getBasket( 'user' );
		if ( this.inputEnabled )
		{
			if ( this.reroute )
				answer = await this.reroute( parameters.prompt, basket, { editor: editor } );
			else
				answer = await this.awi.prompt.prompt( message.data.prompt,basket, { editor: editor } );
            this.awi.configuration.setBasket( 'user', answer.getValue() );
		}
		else
		{
			this.toAsk.push( message );
            if ( !this.handleAsk )
            {
                var self = this;
				this.handleAsk = setInterval(
					function()
					{
						if ( self.inputEnabled && self.toAsk.length > 0 )
						{
                            var mess = self.toAsk.pop();
                            self.command_prompt( mess );
						}
					}, 100 );
			}
		}
	}
    async command_newProject( parameters )
    {
        var answer = await this.command_setMode( parameters );
        if (answer.isError()){
            this.reply( { error: answer.error } );
            return;
        }
        var answer = await this.projectConnector.command_newProject( parameters );
        if (answer.isError()){
            this.reply( { error: answer.error } );
            return;
        }
        this.reply( answer.data );
    }
    async command_setMode( parameters )
    {
        if ( parameters.mode != this.languageMode )
        {            
            for( var l in this.projectConnectors )
            {
                if ( l == parameters.mode )
                {
                    this.languageMode = parameters.mode;
                    this.projectConnector = this.projectConnectors[l].self;
                    this.projectConnector.setEditor( this );
                    this.awi.editor.current.print( this.awi.messages.getMessage( 'awi:language-changed', { mode: parameters.mode } ), { user: 'awi' } );
                    return this.newAnswer( true );
                }
            }
            this.awi.editor.current.print( this.awi.messages.getMessage( 'awi:language-not-found', { mode: message.parameters.mode } ), { user: 'system' } );
            return this.newError( 'awi:language-not-found' );
        }
        return this.newAnswer( true );
    }
	print( text, options = {} )
	{
		options.user = typeof options.user == 'undefined' ? 'awi' : options.user;
		var prompt = this.awi.configuration.getPrompt( options.user );
		if ( !prompt )
			return;

        var pos;
        var lines = text;
        if ( typeof lines == 'string' )            
            lines = text.split( '\n' );
        text = [];
		for ( var l = 0; l < lines.length; l++ )
        {
            if ( lines[ l ] )
            {
                if ( ( pos = lines[ l ].indexOf( 'awi:' ) ) >= 0 )
                {
                    while( pos >= 0 )
                    {
                        var iwa = lines[ l ].indexOf( ':iwa', pos );
                        if ( iwa < 0 )
                            iwa = lines[ l ].length;
                        lines[ l ] = lines [ l ].substring( 0, pos ) + this.awi.messages.getMessage( lines[ l ].substring( pos, iwa ), options ) + lines[ l ].substring( iwa + 4 );
                        pos = lines[ l ].indexOf( 'awi:' );
                    }
                }

                if ( ( pos = lines[ l ].indexOf( '<BR>' ) ) >= 0 )
                {
                    while( pos >= 0 )
                    {
                        text.push( lines[ l ].substring( 0, pos ) );
                        if ( pos > 0 )
                            lines[ l ] = lines[ l ].substring( pos );
                        else
                            lines[ l ] = lines[ l ].substring( pos + 4 );
                        pos = lines[ l ].indexOf( '<BR>' );
                    }
                }
                else
                {
                    text.push( lines[ l ] );
                }
            }
        }
        var justify = this.awi.configuration.getConfigValue( 'user', 'justify', 80 );
        if ( justify >= 0 )
            text = this.awi.utilities.justifyText( text, 80 );

        var newLine = typeof options.newLine == 'undefined' ? true : options.newLine;        
        var showPrompt = typeof options.prompt == 'undefined' ? false : options.prompt;        
        this.toSend = '';
		for ( var t = 0; t < text.length; t++ )
		{
            this.noInput++;
            if ( t == 0 && this.lastPrompt )
                this.lastLine = text[ t ] + ( t == text.length - 1 ? ( newLine ? '\n' : '' ) : '\n' );
            else
                this.lastLine = prompt + text[ t ] + ( t == text.length - 1 ? ( newLine ? '\n' : '' ) : '\n' );
            this.toSend.push( this.lastLine );
            this.toSendClean.push( text[ t ] );            
		}
        this.lastPrompt = false;
        if ( newLine )
        {
            this.noInput++;
            this.lastLine = '';
            if ( showPrompt )
            {
                this.lastLine = prompt;
                if ( typeof showPrompt == 'string' )
                    this.lastLine = showPrompt;                
                this.lastPrompt = true;
            }
            this.toSend.push( this.lastLine );
        }
        if ( options.space )
            this.lastLine += ' ';
        
        this.noInput = 0;
        return this.lastLine;
	}
	setPrompt( prompt )
	{
        this.prompt = prompt;
	}
	rerouteInput( route )
	{
		this.reroute = route;
	}
	disableInput( )
	{
		this.inputEnabled = false;
	}
	saveInputs()
	{
		this.pushedInputs = this.inputEnabled;
		this.inputEnabled = 1;
	}
	restoreInputs( editor )
	{
		this.inputEnabled = this.pushedInputs;
	}
	waitForInput( options = {} )
	{
		this.inputEnabled++;
		if ( options.force || this.inputEnabled == 0 )
		{
			this.inputEnabled = 0;
			var response = {
				data: {
					text: this.toSend.join( '\n' ),
					textClean: this.toSendClean.join( '\n' ),
				} };
			this.reply( response );
			this.toSend = [];
			this.toSendClean = [];
		}
	}
	close( options = {} )
	{
	}	
}
