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
        this.projectsPath = '';
        this.serverUrl = 'http://localhost:3333';
        this.projectsUrl = '/awi-projects'; 
        this.templatesPath = this.awi.system.getEnginePath() + '/connectors/' + this.group;
	}
	async connect( options )
	{
		super.connect( options );
       this.commandMap = {};
       for ( var c in SERVERCOMMANDS ){
          if ( this[ 'command_' + SERVERCOMMANDS[ c ] ] )
              this.commandMap[ c ] = this[ 'command_' + SERVERCOMMANDS[ c ] ];
       }
       if ( options.templatesPath )
           this.templatesPath = options.templatesPath;
       if ( options.projectPath )
           this.projectsPath = options.projectPath;
       else
       {
           var path = await this.awi.callParentConnector( 'httpServer', 'getRootDirectory', {} );
           if ( path )
               this.projectsPath = path + '/projects';
           else
               this.projectsPath = this.awi.getEnginePath() + '/data/projects';
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
        this.userName = editor.userName;
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
                    if (file.isDirectory && oldFile.isDirectory)
                    {
                        var tempFiles = [];
                        this.updateTree( file.files, oldFile.files, tempFiles );
                        oldFile.files = tempFiles;
                        parentFiles.push( oldFile );
                        found = true;
                    } else if (file.isDirectory == oldFile.isDirectory)
                    {
                        parentFiles.push( oldFile );
                        found = true;
                    }
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
    async updateFileTree(project)
    {
        var answer = await this.awi.files.getDirectory( project.path, { recursive: true, filters: '*.*', noStats: true, noPaths: true } );
        if ( answer.isError() )
            return answer;
        var newFiles = [];
        this.updateTree( answer.data, project.files, newFiles );
        this.project.files = newFiles;
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
    async command( message, editor )
    {
        if ( this[ 'command_' + message.command ] )
            return this[ 'command_' + message.command ]( message.parameters, message, editor );
        return this.replyError( this.newError( 'awi:command-not-found', { value: message.command } ), message, editor );
    }
    async command_getTemplates( parameters, message, editor )
    {
        var templatesPath = this.templatesPath + '/' + this.token + '/templates';
        var filter = parameters.filter ? parameters.filter : '*.*';
        var answer = await this.awi.files.getDirectory( templatesPath, { recursive: false, listDirectories: true, filters: filter, noStats: true } );
        if ( answer.isError() )
            return this.replyError( answer, message, editor );
        var folders = answer.data;
        var templates = [];
        for ( var f = 0; f < folders.length; f++ )
        {
            var folder = folders[ f ];
            var description = 'No description';
            var iconUrl = null;
            answer = await this.awi.files.loadIfExist( folder.path + '/readme.md', { encoding: 'utf8' } );
            if ( answer.isSuccess() )
                description = answer.data;
            answer = await this.awi.system.exists( folder.path + '/icon.png' );
			if ( answer.isSuccess() )
				iconUrl = this.projectsUrl + '/' + this.userName + '/' + this.token + '/icon.png';
			else
				iconUrl = this.projectsUrl + '/default-icon.png';
            templates.push( { name: folder.name, description: description, iconUrl: iconUrl } );
        }
        return this.replySuccess( this.newAnswer( templates ), message, editor );
    }
    async command_getProjectList( parameters, message, editor )
    {
        var projectsPath = this.projectsPath + '/' + this.userName + '/' + this.token;
        var filter = parameters.filter ? parameters.filter : '*.*';
        var answer = await this.awi.system.exists( projectsPath );
        if ( answer.isError() )
            return this.replySuccess( this.newAnswer( [] ), message, editor );
        answer = await this.awi.files.getDirectory( projectsPath, { recursive: false, listDirectories: true, filters: filter, noStats: true } );
        if ( answer.isError() )
            return this.replyError( answer, message, editor );
        var folders = answer.data;
        var projects = [];
        for ( var f = 0; f < folders.length; f++ )
        {
            var folder = folders[ f ];
            var description = 'No description';
            var iconUrl;
            answer = await this.awi.files.loadIfExist( folder.path + '/readme.md', { encoding: 'utf8' } );
            if ( answer.isSuccess() )
                description = answer.data;
            answer = await this.awi.system.exists( folder.path + '/icon.png' );
            if ( answer.isSuccess() )
                iconUrl = this.projectsUrl + '/' + this.userName + '/' + this.token + '/icon.png';
            else
                iconUrl = this.projectsUrl + '/default-icon.png';
            // Load the project.json file
            answer = await this.awi.files.loadJSON( folder.path + '/project.json' );
            if ( answer.isError() )
                return this.replyError(answer, message, editor);
            var project = answer.data;
            var projectInfo = { 
                name: project.name, 
                handle: project.handle,
                url: project.url,
                description: description, 
                iconUrl: iconUrl,
                type: project.type,
                files: []
            };
            if ( parameters.includeFiles )
            {
                answer = await this.updateFileTree( project );
                if ( answer.isError() )
                    return this.replyError( answer, message, editor );
                projectInfo.files = answer.data;
            }
            projects.push( projectInfo );
        }
        return this.replySuccess( this.newAnswer( projects ), message, editor );
    }
    async command_newProject( parameters, message, editor )
    {
        // Create the directory
        var projectHandle = this.awi.files.convertToFileName( parameters.name );
        var projectPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + projectHandle;
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
            var templatesPath = this.templatesPath + '/' + this.token + '/templates/' + parameters.template;
            if ( this.awi.system.exists( templatesPath ).isSuccess() ){
                // Copy all files from template to project
                answer = await this.awi.files.copyDirectory( templatesPath, projectPath );
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
            path: projectPath,
            url: this.serverUrl + '/projects/' + this.userName + '/' + this.token + '/' + projectHandle,
            template: parameters.template,
            type: this.token,
            files: []
        }
        // Save project configuration
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree to add project.json
        answer = await this.updateFileTree( this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Save updated project.json
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', this.project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Returns the project
        return this.replySuccess(this.newAnswer( this.project ), message, editor);
    }
    async command_openProject( parameters, message, editor )
    {
        var projectHandle = parameters.handle || this.awi.files.convertToFileName( parameters.name );
        var projectPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + projectHandle;
        if ( !this.awi.system.exists( projectPath ).isSuccess() )
            return this.replyError(this.newError( 'awi:project-not-found', parameters.projectHandle ), message, editor);
        // Load the project.json file
        var answer = await this.awi.files.loadJSON( projectPath + '/project.json' );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        this.project = answer.data;
        // Update file tree to current files
        answer = await this.updateFileTree( this.project );
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
        var projectPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + projectHandle;
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
        answer = await this.updateFileTree( this.project );
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
        answer = await this.updateFileTree( this.project );
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
        answer = await this.updateFileTree( this.project );
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
        answer = await this.updateFileTree( this.project );
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
        answer = await this.updateFileTree( this.project );
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
        answer = await this.updateFileTree( this.project );
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
