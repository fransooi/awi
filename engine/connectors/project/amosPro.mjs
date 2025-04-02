/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     link:
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file amosPro.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Amos Pro connector.
*
*/
import ConnectorProject from './project.mjs'
import { SERVERCOMMANDS } from '../../servercommands.js';
export { ConnectorAmosPro as Connector }

class ConnectorAmosPro extends ConnectorProject
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Amos Pro';
		this.token = 'amosPro';
		this.className = 'ConnectorAmosPro';
        this.group = 'project';    
		this.version = '0.5';

        this.commandMap = {};
        for ( var c in SERVERCOMMANDS ){
            if ( this[ 'command_' + SERVERCOMMANDS[ c ] ] )
                this.commandMap[ c ] = this[ 'command_' + SERVERCOMMANDS[ c ] ];
        }
	}
	async connect( options )
	{
		super.connect( options );
        return this.setConnected( true );
	}
}
