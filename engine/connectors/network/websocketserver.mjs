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
import { SERVERCOMMANDS } from '../../servercommands.js'
import { WebSocketServer } from 'ws'
import Awi from '../../awi.mjs'
export { ConnectorWebSocketServer as Connector }

class ConnectorWebSocketServer extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'WebSocket Server';
		this.token = 'websocket';
		this.className = 'ConnectorWebSocketServer';
        this.group = 'network';
		this.version = '0.5';
		this.editors = {};
		this.wsServer = null;
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
						self.user_disconnected( connection );
					} );

			} );
		}
        return this.setConnected( true );
	}
	user_disconnected( connection )
	{
		for ( var e in this.editors )
		{
			var editor = this.editors[ e ];
			if ( editor.connection == connection )
			{
				break;
			}
		}
		if ( editor )
		{
			this.awi.editor.print('awi:socket-user-disconnected', { name: editor.userName, user: 'awi' } );

			editor.close();
			var newEditors = {};
			for ( var e in this.editors )
			{
				if ( e != editor.handle )
				{
					newEditors[ e ] = this.editors[ e ];
				}
			}
			this.editors = newEditors;
		}

	}
	async user_connect( connection, message )
	{
        // Create new session of AWI
        var config =
        {
            prompt: '',
            elements:
            [
                { name: 'connectors/system/node', config: { priority: 100 }, options: {} },
                { name: 'connectors/system/files', config: { priority: 100 }, options: {} },
                { name: 'connectors/awi/messages', config: { priority: 99 }, options: {} },
                { name: 'connectors/awi/utilities', config: { priority: 99 }, options: {} },
                { name: 'connectors/awi/configuration', config: { priority: 99 }, options: {} },
                { name: 'connectors/awi/time', config: { priority: 99  }, options: {} },
                { name: 'connectors/editor/editor', config: { priority: 99 }, options: { default: 'websocket', config: { 
                    lastMessage: message,
                    connection: connection,
                    parent: this,
                    userName: message.parameters.userName,
                    userKey: message.parameters.userKey,
                    connect: false
                }} },
                { name: 'bubbles/awi/*', config: {}, options: {} },
                { name: 'souvenirs/awi/*', config: {}, options: {} },
                { name: 'memories/awi/*', config: {}, options: {} },
                { name: 'connectors/language/javascript', config: { priority: 98 }, options: {} },
				{ name: 'connectors/project/stos', config: { priority: 98 }, options: {} },
				{ name: 'connectors/project/amos1_3', config: { priority: 98 }, options: {} },
				{ name: 'connectors/project/amosPro', config: { priority: 98 }, options: {} },
				{ name: 'connectors/project/javascript', config: { priority: 98 }, options: {} },
				{ name: 'connectors/project/phaser', config: { priority: 98 }, options: {} },
				{ name: 'connectors/project/c64', config: { priority: 98 }, options: {} },
				{ name: 'connectors/awi/parser', config: { priority: 97 }, options: {} },
                { name: 'connectors/awi/persona', config: { priority: 96 }, options: {} },
                { name: 'connectors/awi/prompt', config: { priority: 95 }, options: {} },
                { name: 'connectors/edenai/chat', config: { priority: 94, key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZjYzY2YzMtOTNmZi00YjYyLWIxNDgtY2FhZWJkNjhkZjIxIiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.Y73ATnBg_mMIZVj78A1Jf5RH-eCXfVPrihgqxSRT0R0'}, options: {} },
            ]
        };    
        var awi2 = new Awi( this.awi, config );
        var answer = await awi2.connect( {} );
        if ( answer.isSuccess() )
        {
			this.awi.editor.print('awi:socket-new-connection', { key: message.parameters.userKey, name: message.parameters.userName, user: 'awi' } );
            this.editors[ awi2.editor.current.handle ] = awi2.editor.current;
            this.current = awi2.editor.current;
			this.current.connect( message.parameters, message );
        }
    }
}
