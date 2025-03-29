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
* @file javascript.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Time Gregorian calendar utilities.
*
*/
import ConnectorProject from './project.mjs'
import { SERVERCOMMANDS } from '../../servercommands.js';
export { ConnectorPhaser as Connector }

class ConnectorPhaser extends ConnectorProject
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Phaser';
		this.token = 'project';
		this.className = 'ConnectorPhaser';
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
    async isProjectConnector(args, basket, control)
    {
        return this.newAnswer( { phaser: { version: this.version, self: this } }, 'object' );
    }
    async handleCommand( command, parameters )
    {
        if ( this.commandMap[ command ] )   
            return await this.commandMap[ command ]( parameters );
        return this.newError( 'awi:not-implemented' );
    }
    async command_newProject( parameters )
    {
        var answer = await super.command_newProject( parameters );
        if ( answer.isError() )
            return answer;

        // Load the template...
        var templatePath = this.awi.system.getEnginePath() + '/connectors/project/phaser/templates/' + parameters.template;
        if ( this.awi.system.exists( templatePath ).isSuccess() ){
            // Copy all files from template to project
            var answer2 = await this.awi.files.copyDirectory( templatePath, answer.data );
            if ( answer2.isError() )
                return answer2;
            // Create the project object
            var answer3 = await this.awi.files.getDirectory( answer.data, { recursive: true, filters: '*.*', noStats: true } );
            if ( answer3.isError() )
                return answer3;
            this.project = {
                name: parameters.name,
                template: parameters.template,
                mode: 'phaser',
                path: answer.data,
                files: answer3.data
            }
            return this.newAnswer( this.project );
        }
        return this.newError( 'awi:template-not-found', parameters.template );
    }
    
}
