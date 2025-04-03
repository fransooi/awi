import ConnectorBase from '../../connector.mjs'
import { SERVERCOMMANDS } from '../../servercommands.mjs';

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
        this.templatePath = awi.system.getEnginePath() + '/connectors/' + this.group;
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
        var data = {};
        data[ this.token ] = {
            version: this.version,
            self: this
        };
        return this.newAnswer( data );
    }
    setEditor( editor )
    {
        this.editor = editor;
    }
    replyError( error, message, editor )
    {
        if ( editor )
            editor.reply( { error: error.getPrint() }, message );
        return error;
    }
    replySuccess( answer, message, editor )
    {
        if ( editor )
            editor.reply( answer.data, message );
        return answer;
    }
    updateTree( newFiles, oldFiles, parentFiles )
    {
        for ( var nf = 0; nf < newFiles.length; nf++ )
        {
            var file = newFiles[ nf ];
            var found = false;
            for ( var of = 0; of < oldFiles.length; of++ )
            {
                var oldFile = oldFiles[ of ];
                if ( oldFile.name === file.name )
                {
                    parentFiles.push( oldFile );
                    found = true;
                    break;
                }
            }
            if ( !found )
            {
                var newf = { 
                    name: file.name,
                    size: file.size,
                    modified: false,
                    isDirectory: file.isDirectory,
                    path: file.relativePath
                };
                if ( file.isDirectory )
                {
                    newf.files = [];
                    parentFiles.push( newf );
                    var tempFiles = [];
                    this.updateTree( file.files, [], tempFiles );
                    newf.files = tempFiles;
                }
                else
                {
                    newf.mime = this.awi.utilities.getMimeType( newf.name );
                    parentFiles.push( newf );
                }
            }
        }
    }
    async updateFileTree(oldFiles)
    {
        if ( !this.project )
            return this.newError( 'awi:project-not-found' );
        var answer = await this.awi.files.getDirectory( this.projectPath, { recursive: true, filters: '*.*', noStats: true, noPaths: true } );
        if ( answer.isError() )
            return answer;
        var newFiles = [];
        this.updateTree( answer.data, oldFiles, newFiles );
        return this.newAnswer( newFiles );
    }
    findFile( path )
    {
        if ( !this.project )
            return null;
        function find( parent, path )
        {
            for ( var f = 0; f < parent.files.length; f++ )
            {
                var file = parent.files[f];
                if ( file.path == path )
                    return file;
                if ( file.isDirectory )
                {
                    var found = find( file, path );
                    if ( found )
                        return found;
                }
            }
            return null;
        }
        return find( this.project.files, path );
    }
    findFileParent( path )
    {
        if ( !this.project )
            return null;
        function find( parent, path )
        {
            for ( var f = 0; f < parent.files.length; f++ )
            {
                var file = parent.files[f];
                if ( file.path == path )
                    return parent;
                if ( file.isDirectory )
                {
                    var found = find( file, path );
                    if ( found )
                        return found;
                }
            }
            return null;
        }
        return find( this.project.files, path );
    }
    async command_newProject( parameters, message, editor )
    {
        // Create the directory
        var projectHandle = this.awi.utilities.replaceStringInText( parameters.name, ' ', '_' );
        var projectPath = this.projectsPath + '/' + this.awi.configuration.user + '/' + this.token + '/' + projectHandle;
        if ( this.awi.system.exists( projectPath ).isSuccess() )
        {
            if ( !parameters.overwrite )
                return this.replyError(this.newError( 'awi:project-exists', parameters.name ), message, editor );
            await this.awi.files.deleteDirectory( projectPath, { keepRoot: true, recursive: true } );
        }
        var answer = await this.awi.files.createDirectories( projectPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );

        // Load the template...
        if ( parameters.template )
        {
            var templatePath = this.templatePath + '/' + this.token + '/templates/' + parameters.template;
            if ( this.awi.system.exists( templatePath ).isSuccess() ){
                // Copy all files from template to project
                answer = await this.awi.files.copyDirectory( templatePath, projectPath );
                if ( answer.isError() )
                    return this.replyError(answer, message, editor );
            }
            else        
                return this.replyError(this.newError( 'awi:template-not-found', parameters.template ), message, editor );
        }
        this.projectName = parameters.name;
        this.projectHandle = projectHandle;
        this.projectPath = projectPath;

        // Create project
        this.project = {
            name: parameters.name,
            handle: projectHandle,
            template: parameters.template,
            type: this.token,
            files: []
        }
        // Save project configuration
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree to add project.json
        answer = await this.updateFileTree( [] );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        // Save updated project.json
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Returns the project
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_loadProject( parameters, message, editor )
    {
        // Project exists?
        var projectPath = this.projectsPath + '/' + this.awi.configuration.user + '/' + this.token + '/' + parameters.projectHandle;
        if ( !this.awi.system.exists( projectPath ).isSuccess() )
            return this.replyError(this.newError( 'awi:project-not-found', parameters.projectHandle ), message, editor);
        // Load the project.json file
        var answer = await this.awi.files.loadJSON( projectPath + '/project.json' );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        this.project = answer.data;
        // Update file tree to current files
        answer = await this.updateFileTree( [] );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer(this.project), message, editor);
    }
    async command_saveProject( parameters, message, editor )
    {
        // Save project configuration
        var answer = await this.awi.files.saveJSON( this.projectPath + '/project.json', this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_renameProject( parameters, message, editor )
    {
        // Rename project
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-found' ), message, editor );

        // Create the directory
        var projectHandle = this.awi.utilities.replaceStringInText( parameters.name, ' ', '_' );
        var projectPath = this.projectsPath + '/' + this.awi.configuration.user + '/' + this.token + '/' + projectHandle;
        if ( this.awi.system.exists( projectPath ).isSuccess() )
            return this.replyError(this.newError( 'awi:project-exists', parameters.name ), message, editor );
        // Create new project directory
        var answer = await this.awi.files.createDirectories( projectPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Copy project files
        answer = await this.awi.files.copyDirectory( this.projectPath, projectPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Save new project configuration
        this.projectName = parameters.name;
        this.projectHandle = projectHandle;
        this.projectPath = projectPath;
        this.project.name = parameters.name;
        this.project.handle = projectHandle;
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Delete old project directory
        answer = await this.awi.files.deleteDirectory( this.projectPath, { keepRoot: false, recursive: true } );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Returns the project
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_deleteProject( parameters, message, editor )
    {
        // Delete project
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-found' ), message, editor );
        // Delete project directory
        var answer = await this.awi.files.deleteDirectory( this.projectPath, { keepRoot: true, recursive: true } );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Reset project
        this.project = null;
        this.projectName = null;
        this.projectHandle = null;
        this.projectPath = null;
        return this.replySuccess(this.newAnswer( true ), message, editor);
    }
    async command_loadFile( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Load the file depending on its mime type
        var file = this.findFile( parameters.path );
        if ( !file )
            return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
        var answer = await this.awi.system.readFile( this.projectPath + '/' + file.path );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        return this.replySuccess(this.newAnswer( { file: file, data: answer.data } ), message, editor);
    }
    async command_saveFile( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Save the file
        var answer = await this.awi.system.writeFile( this.projectPath + '/' + parameters.path, parameters.data );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_renameFile( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Find the file in the tree
        var file = this.findFile( parameters.path );
        if ( !file )
            return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
        // Rename the file
        var answer = await this.awi.system.rename( this.projectPath + '/' + parameters.path, this.projectPath + '/' + parameters.newPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        file.name = this.awi.system.basename( parameters.newPath );
        file.path = parameters.newPath;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_deleteFile( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Delete the file
        var answer = await this.awi.files.delete( this.projectPath + '/' + parameters.path );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_moveFile( parameters, message, editor )
    {
        // Project exists? 
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Find the file in the tree
        var file = this.findFile( parameters.path );
        if ( !file )
            return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
        var oldParent = this.findFileParent( parameters.path );
        var newParentPath = this.awi.system.dirname( parameters.newPath );
        var newParent = this.findFile( newParentPath );
        if ( !newParent )
            return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );

        // Move the file
        var answer = await this.awi.system.copyFile( this.projectPath + '/' + parameters.path, this.projectPath + '/' + parameters.newPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Delete the old file
        answer = await this.awi.system.deleteFile( this.projectPath + '/' + parameters.path );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Remove from current parent
        for ( var f = 0 ; f < oldParent.files.length; f++ )
        {
            if ( oldParent.files[f].path == parameters.path )
            {
                oldParent.files.splice( f, 1 );
                break;
            }
        }
        // Add to new parent
        newParent.files.push( file );
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_createFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Create the folder
        var answer = await this.awi.system.mkdir( this.projectPath + '/' + parameters.path );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_deleteFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Delete the folder
        var answer = await this.awi.system.rmdir( this.projectPath + '/' + parameters.path );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_renameFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Find the folder in the tree
        var folder = this.findFolder( parameters.path );
        if ( !folder )
            return this.replyError(this.newError( 'awi:folder-not-found' ), message, editor );
        // Rename the folder
        var answer = await this.awi.system.rename( this.projectPath + '/' + parameters.path, this.projectPath + '/' + parameters.newPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_copyFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Copy the folder
        var answer = await this.awi.files.copyDirectory( this.projectPath + '/' + parameters.path, this.projectPath + '/' + parameters.newPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_moveFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !this.project )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Move the folder
        var answer = await this.awi.system.rename( this.projectPath + '/' + parameters.path, this.projectPath + '/' + parameters.newPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree
        answer = await this.updateFileTree( this.project.files );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        this.project.files = answer.data;
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
}
