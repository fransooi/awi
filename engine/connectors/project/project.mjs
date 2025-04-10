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
        this.projectsUrl = 'http://localhost:3333/projects';
        this.runUrl = 'http://localhost:3333/projects';
        this.templatesUrl = 'http://localhost:3333/templates';
        this.templatesPath = this.awi.system.getEnginePath() + '/connectors/' + this.group;
        this.projects = {};
	}
	async connect( options )
	{
	    super.connect( options );
        this.commandMap = {};
        for ( var c in SERVERCOMMANDS )
        {
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
    setEditor( editor, options )
    {
        this.editor = editor;
        this.userName = editor.userName;
        this.templatesUrl = options.templatesUrl || this.templatesUrl;
        this.projectsUrl = options.projectsUrl || this.projectsUrl;
        this.runUrl = options.runUrl || this.runUrl;
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
    async updateFileTree(project, projectHandle)
    {
        // If from another platform, enforce reload of the whole tree
        if ( !this.awi.system.checkPathFormat( project.path ) )
        {
            if ( !projectHandle )
                return this.newError( 'awi:illegal-project-format' );
            project.path = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + projectHandle;
            project.files = [];
        }
        // Update URL
        if (projectHandle)
        {
            project.url = this.projectsUrl + '/' + this.userName + '/' + this.token + '/' + projectHandle;
            project.runUrl = this.runUrl + '/' + this.userName + '/' + this.token + '/' + projectHandle;
        }
        var answer = await this.awi.files.getDirectory( project.path, { recursive: true, filters: '*.*', noStats: true, noPaths: true } );
        if ( answer.isError() )
            return answer;
        var newFiles = [];
        this.updateTree( answer.data, project.files, newFiles );
        project.files = newFiles;
        return this.newAnswer( newFiles );
    }
    findFile( project, path )
    {
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
        return find( project, path );
    }
    findFileParent( project, path )
    {
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
        return find( project, path );
    }
    findFolder( project, path )
    {
        function find( parent, path )
        {
            for ( var f = 0; f < parent.files.length; f++ )
            {
                var file = parent.files[f];
                if ( file.path == path && file.isDirectory )
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
        return find( project, path );
    }

    async command( message, editor )
    {
        if ( this[ 'command_' + message.command ] )
            return this[ 'command_' + message.command ]( message.parameters, message, editor );
        return this.replyError( this.newError( 'awi:command-not-found', { value: message.command } ), message, editor );
    }

    // PROJECTS COMMANDS
    ////////////////////////////////////////////////////////////////////////////////////
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
            answer = await this.awi.files.loadIfExist( folder.path + '/description.md', { encoding: 'utf8' } );
            if ( answer.isSuccess() )
                description = answer.data;
            answer = await this.awi.system.exists( folder.path + '/thumbnail.png' );
			if ( answer.isSuccess() )
				iconUrl = this.templatesUrl + '/' + this.token + '/templates/' + folder.name + '/thumbnail.png';
			else
				iconUrl = this.templatesUrl + '/default-thumbnail.png';
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
            while( true )
            {
                answer = await this.awi.files.loadIfExist( folder.path + '/readme.md', { encoding: 'utf8' } );
                if ( answer.isSuccess() )
                    description = answer.data;
                answer = await this.awi.system.exists( folder.path + '/thumbnail.png' );
                if ( answer.isSuccess() )
                    iconUrl = this.projectsUrl + '/' + this.userName + '/' + this.token + '/' + folder.name + '/thumbnail.png';
                else
                    iconUrl = this.templatesUrl + '/default-thumbnail.png';
                // Load the project.json file
                answer = await this.awi.files.loadJSON( folder.path + '/project.json' );
                if ( answer.isError() )
                    break;
                var project = answer.data;
                var projectInfo = { 
                    name: project.name, 
                    handle: project.handle,
                    url: this.projectsUrl + '/' + this.userName + '/' + this.token + '/' + project.handle,
                    description: description, 
                    iconUrl: iconUrl,
                    type: project.type,
                    files: []
                };
                if ( parameters.includeFiles )
                {
                    answer = await this.updateFileTree( project, project.handle );
                    if ( answer.isError() )
                        break;
                    projectInfo.files = project.files;
                }
                projects.push( projectInfo );
                break;
            }
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

        // Create project
        var project = {
            name: parameters.name,
            handle: projectHandle,
            path: projectPath,
            url: this.projectsUrl + '/' + this.userName + '/' + this.token + '/' + projectHandle,
            template: parameters.template,
            type: this.token,
            runUrl: this.runUrl + '/' + this.userName + '/' + this.token + '/' + projectHandle,
            files: []
        }
        // Save project configuration
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Update file tree to add project.json
        answer = await this.updateFileTree( project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Save updated project.json
        answer = await this.awi.files.saveJSON( projectPath + '/project.json', project );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Set as opened project
        this.projects[ projectHandle ] = project;
        // Returns the project
        return this.replySuccess(this.newAnswer( project ), message, editor);
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
        // Update file tree to current files
        var project = answer.data;  
        answer = await this.updateFileTree( project, projectHandle );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        // Set as opened project
        this.projects[ projectHandle ] = project;
        // Returns the project
        return this.replySuccess(this.newAnswer( project ), message, editor);
    }
    async command_saveProject( parameters, message, editor )
    {
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError( this.newError( 'awi:project-not-open' ) );
        var projectPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + parameters.handle;
        var answer = await this.awi.files.saveJSON( projectPath + '/project.json', this.projects[ parameters.handle ] );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        return this.replySuccess(this.newAnswer(true), message, editor);
    }
    async command_renameProject( parameters, message, editor )
    {
        // Rename project
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
    
        // Create the directory
        var oldProjectHandle = parameters.handle;
        var oldProjectPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + oldProjectHandle;
        var newProjectHandle = this.awi.files.convertToFileName( parameters.newName );
        var newProjectPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + newProjectHandle;
        if ( this.awi.system.exists( newProjectPath ).isSuccess() )
            return this.replyError(this.newError( 'awi:project-exists', parameters.newName ), message, editor );
        // Create new project directory
        var answer = await this.awi.files.createDirectories( newProjectPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        // Copy project files
        answer = await this.awi.files.copyDirectory( oldProjectPath, newProjectPath );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        // Delete old project directory
        answer = await this.awi.files.deleteDirectory( oldProjectPath, { keepRoot: false, recursive: true } );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        // Update new project configuration
        answer = await this.awi.files.loadJSON( newProjectPath + '/project.json' );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        var newProject = answer.data;
        newProject.name = parameters.newName;
        newProject.handle = newProjectHandle;
        newProject.url = this.projectsUrl + '/' + this.userName + '/' + this.token + '/' + newProjectHandle;
        newProject.runUrl = this.runUrl + '/' + this.userName + '/' + this.token + '/' + newProjectHandle;
        newProject.files = [];
        answer = await this.updateFileTree( newProject, newProjectHandle );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        answer = await this.awi.files.saveJSON( newProjectPath + '/project.json', newProject );
        if ( answer.isError() )
            return this.replyError(answer, message, editor);
        // Update project handle
        this.projects[ newProjectHandle ] = newProject;
        this.projects[ oldProjectHandle ] = null;
        // Returns the project
        return this.replySuccess(this.newAnswer( newProject ), message, editor);
    }
    async command_deleteProject( parameters, message, editor )
    {
        // Delete project
        if ( !parameters.handle )
            return this.replyError(this.newError( 'awi:project-not-found' ), message, editor );
        // Delete project directory
        var answer = await this.awi.files.deleteDirectory( this.projectsPath + '/' + this.userName + '/' + this.token + '/' + parameters.handle, { keepRoot: true, recursive: true } );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        // Reset project
        this.projects[ parameters.handle ] = null;
        return this.replySuccess(this.newAnswer( true ), message, editor);
    }

    // FILE COMMANDS 
    //////////////////////////////////////////////////////////////////////////////
    async command_newFile( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Create the file
        var project = this.projects[ parameters.handle ];
        if ( !this.findFile( project, parameters.path ) )
        {
            var content = '';
            var path = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + parameters.handle + '/' + parameters.path;
            var answer = await this.awi.system.writeFile( path, content, { encoding: 'utf8' } );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            var answer = await this.updateFileTree( project );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            var file = this.findFile( project, parameters.path );
            return this.replySuccess(this.newAnswer( { file: file, data: content } ), message, editor);
        }
        return this.replyError(this.newError( 'awi:file-exists' ), message, editor);
    }
    async command_loadFile( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Load the file
        var file = this.findFile( this.projects[ parameters.handle ], parameters.path );
        if ( file )
        {
            var answer = await this.awi.system.readFile( file.path, { encoding: 'utf8' } );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( { file: file, data: answer.data } ), message, editor);
        }
        return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
}
    async command_saveFile( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Save the file
        var file = this.findFile( this.projects[ parameters.handle ], parameters.path );
        if ( file )
        {
            var answer = await this.awi.system.writeFile( file.path, parameters.data, { encoding: 'utf8' } );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( { file: file, data: parameters.data } ), message, editor);
        }
        return this.replyError(this.newError( 'awi:file-not-found' ), message, editor);
    }
    async command_renameFile( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Find the file in the tree
        var file = this.findFile( this.projects[ parameters.handle ], parameters.path );
        if ( file )
        {
            // Rename the file
            var newName = this.awi.system.basename( parameters.newPath );
            var newPath = this.awi.system.dirname( parameters.newPath ) + '/' + newName;
            var answer = await this.awi.system.rename( file.path, newPath );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            // Update file tree
            file.name = newName;
            file.path = newPath;
            return this.replySuccess(this.newAnswer(true), message, editor);
        }
        return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
    }
    async command_deleteFile( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Delete the file
        var file = this.findFile( this.projects[ parameters.handle ], parameters.path );
        if ( file )
        {
            var answer = await this.awi.system.delete( file.path );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( true ), message, editor);
        }
        return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
    }
    async command_moveFile( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
        return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
    
        // Find the file in the tree
        var file = this.findFile( this.projects[ parameters.handle ], parameters.path );
        if ( file )
        {
            var answer = await this.copyFile( file.path, parameters.newPath );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            answer = await this.deleteFile( file.path );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( true ), message, editor);
        }
        return this.replyError(this.newError( 'awi:file-not-found' ), message, editor );
    }
    async command_createFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Create the folder
        var folder = this.findFolder( this.projects[ parameters.handle ], parameters.path );
        if ( !folder )
        {
            var folderPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + parameters.handle + '/' + parameters.path;
            var answer = await this.awi.system.mkdir( folderPath );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            // Update file tree
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( this.projects[ parameters.handle ] ), message, editor);
        }
        return this.replyError(this.newError( 'awi:folder-exists' ), message, editor);
    }
    async command_deleteFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Delete the folder
        var folder = this.findFolder( parameters.path );
        if ( folder )
        {
            var answer = await this.awi.files.deleteDirectory( folder.path, { keepRoot: false, recursive: true } );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( this.projects[ parameters.handle ] ), message, editor);
        }
        return this.replyError(this.newError( 'awi:folder-not-found' ), message, editor );
    }
    async command_renameFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-loaded' ), message, editor );
        
        // Find the folder in the tree
        var folder = this.findFolder( parameters.path );
        if ( folder )
        {
            var newPath = this.awi.system.dirname( parameters.newPath ) + '/' + this.awi.system.basename( parameters.newPath );
            var answer = await this.awi.system.rename( folder.path, newPath );
            if ( answer.isError() )
                return this.replyError(answer, message, editor);
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( this.projects[ parameters.handle ] ), message, editor);
        }
        return this.replyError(this.newError( 'awi:folder-not-found' ), message, editor );
    }
    async command_copyFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        // Copy the folder
        var folder = this.findFolder( parameters.path );
        if ( folder )
        {
            var newPath = this.projectsPath + '/' + this.userName + '/' + this.token + '/' + parameters.handle + '/' + parameters.newPath;
            var answer = await this.awi.files.copyDirectory( folder.path, newPath );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            answer = await this.updateFileTree( this.projects[ parameters.handle ] );
            if ( answer.isError() )
                return this.replyError(answer, message, editor );
            return this.replySuccess(this.newAnswer( this.projects[ parameters.handle ] ), message, editor);
        }
        return this.replyError(this.newError( 'awi:folder-not-found' ), message, editor);
    }
    async command_moveFolder( parameters, message, editor )
    {
        // Project exists?
        if ( !parameters.handle || !this.projects[ parameters.handle ] )
            return this.replyError(this.newError( 'awi:project-not-open' ), message, editor );
        
        var answer = this.copyFolder( parameters );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        answer = this.deleteFolder( parameters );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        answer = await this.updateFileTree( this.projects[ parameters.handle ] );
        if ( answer.isError() )
            return this.replyError(answer, message, editor );
        return this.replySuccess(this.newAnswer( this.projects[ parameters.handle ] ), message, editor);
    }
}
