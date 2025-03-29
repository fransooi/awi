import ConnectorBase from '../../connector.mjs'
import { SERVERCOMMANDS } from '../../servercommands.js';

export default class ConnectorProject extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Project';
		this.token = 'project';
		this.className = 'ConnectorProject';
        this.group = 'project';    
		this.version = '0.5';
        this.projectsPath = awi.system.getEnginePath() + '/data/projects';
	}
	async connect( options )
	{
		super.connect( options );
        this.commandMap = {};
        for ( var c in SERVERCOMMANDS ){
            if ( this[ 'command_' + SERVERCOMMANDS[ c ] ] )
                this.commandMap[ c ] = this[ 'command_' + SERVERCOMMANDS[ c ] ];
        }
        return this.setConnected( true );
	}
    async isProjectConnector(args, basket, control)
    {
        return null;
    }
    setEditor( editor )
    {
        this.editor = editor;
    }
    async handleCommand( command, parameters )
    {
        if ( this.commandMap[ command ] )   
            return await this.commandMap[ command ]( parameters );
        return this.newError( 'awi:not-implemented' );
    }
    async command_newProject( parameters )
    {
        // Create the directory
        var projectName = this.awi.utilities.replaceStringInText( parameters.name, ' ', '_' );
        var projectPath = this.projectsPath + '/' + this.awi.configuration.user + '/' + projectName;
        if ( this.awi.system.exists( projectPath ).isSuccess() )
        {
            if ( !parameters.overwrite )
                return this.newError( 'awi:project-exists', projectName );
            await this.awi.files.deleteDirectory( projectPath, { keepRoot: true, recursive: true } );
        }
        var answer = await this.awi.files.createDirectories( projectPath );
        if ( answer.isError() )
            return answer;
        this.projectName = projectName;
        return this.newAnswer( projectPath );
    }
}
