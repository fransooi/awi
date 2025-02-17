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

						if ( message.command == 'connect' )
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
						self.close( null, { connection: connection } );
					} );

			} );
		}
        return this.setConnected( true );
	}
	async user_connect( connection, message )
	{
		var handle = this.awi.utilities.getUniqueIdentifier( this.editors, message.data.key.substring( 0, 5 ), 0 );
        var editor = new EditorWebSocket( this.awi, { 
			handle: handle,
			lastMessage: message,
			connection: connection
        } );
        this.editors[ handle ] = editor;
        this.current = editor;
	}
}
class EditorWebSocket
{
	constructor( awi, config = {} )
	{
		this.awi = awi;
		this.className = 'EditorWebSocket';
        this.handle = config.handle;
        this.connection = config.connection;
        this.lastMessage = config.lastMessage;
        this.lastMessage.handle = this.handle;
        this.lastLine = '';
        this.handle = config.handle;
        this.inputEnabled = true;
        this.reroute = undefined;
        this.basket = {};
        this.toSend = [];
        this.toSendClean = [];
        this.callbacks = {};
        setTimeout( async function()
        {
            self.reply( { 
                parameters: { 
                    userList: self.awi.configuration.getUserList() 
                } } );
        }, 500 )
	}
    reply( parameters )
	{
        var message = {
            handle: this.lastMessage.handle,
            responseTo: this.lastMessage.command,            
            callbackId: this.lastMessage.callbackId,
            messageId: this.lastMessage.messageId,
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
            messageId: this.awi.utilities.getUniqueIdentifier( {}, 'message', 0 )
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
        var parameters = { error: 'awi:command-not-found' };
        var func = this[ 'command_' + message.command ]( message );
        if ( func )
        {
            try
            {
                func( message );
                return;
            } 
            catch( e ) 
            { 
                parameters.error = 'awi:error-processing-command';
                parameters.catchedError = e;
            }
        }
    }
	async command_prompt( message )
	{
        var answer;
		this.toSend = [];
		this.toSendClean = [];
		
        var userName = this.awi.config.getConfig( 'user' ).firstName;        
		console.log( '.<' + userName + '<: ' + message.data.prompt );
        var basket = this.awi.configuration.getBasket( 'user' );
		if ( this.inputEnabled )
		{
			if ( this.reroute )
				answer = await this.reroute( message.data.prompt, basket, { editor: editor } );
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
