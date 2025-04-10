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
* @file node.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Connector to Node
*/
import ConnectorBase from '../../connector.mjs'
import FS from 'fs'
import OS from 'os'
import HE from 'he'
import Sha1 from 'sha1'
import Path from 'path'
import { exec, spawn, execFile } from 'child_process'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';    
const __dirname = dirname(fileURLToPath( import.meta.url ) );
import mime from 'mime-types';
export { ConnectorNode as Connector }

class ConnectorNode extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Node';
		this.token = 'system';
		this.className = 'ConnectorNode';
        this.group = 'system';
		this.version = '0.5';

        this.sep = Path.sep;
        this.dirName = this.denormalize( __dirname );
        var self = this;
        if ( typeof config.enginePath == 'undefined' )
            this.getEnginePath = function(){ 
                var path = self.denormalize( self.resolve( self.dirName + '/../..' ) );
                return path };
		else if ( typeof config.enginePath == 'string' )
			this.getEnginePath = function(){ config.enginePath };
		else
			this.getEnginePath = config.enginePath;
	}
	async quit()
	{
		if ( this.tempDirectoryPath )
			this.awi.utilities.deleteDirectory( this.tempDirectoryPath, { recursive: true, keepRoot: false } );
		process.exit( 0 );
	}
	async connect( options )
	{
		super.connect( options );
		return super.setConnected( true );
	}
	async readFile( path, options )
	{
        path = this.normalize( path );
		try
		{
			return this.newAnswer( FS.readFileSync( path, options ) );
		}
		catch( e )
		{
			return this.newError( 'awi:file-not-found' );
		}
	}
	async writeFile( path, data, options )
	{
        path = this.normalize( path );
		try
		{
			return this.newAnswer( FS.writeFileSync( path, data, options ) );
		}
		catch( e )
		{
			return this.newError( 'awi:cannot-write-file' );
		}
	}
	async copyFile( sourcePath, destinationPath, options )
	{
        var sPath = this.normalize( sourcePath );
        var dPath = this.normalize( destinationPath );
		try
		{
			return this.newAnswer( FS.copyFileSync( sPath, dPath, options ) );
		}
		catch
		{
			return this.newError( 'awi:cannot-copy-file', sourcePath );
		}
	}
	async readdir( path )
	{
        path = this.normalize( path );
		try
		{
			return this.newAnswer( FS.readdirSync( path ) );
		}
		catch( e )
		{
			return this.newError( 'awi:cannot-read-directory' );
		}
	}
	async unlink( path)
	{
        path = this.normalize( path );
		try
		{
			return this.newAnswer( FS.unlinkSync( path ) );
		}
		catch
		{
			return this.newError( 'awi:cannot-delete-file' );
		}
	}
	async rmdir( path, options )
	{
        path = this.normalize( path );
		try
		{
			return this.newAnswer( FS.rmdirSync( path, options ) );
		}
		catch
		{
			return this.newError( 'awi:cannot-delete-directory' );
		}
	}
	async stat( path )
	{
        path = this.normalize( path );
		try
		{
			return this.newAnswer( FS.statSync( path ) );
		}
		catch
		{
			return this.newError( 'awi:file-not-found' );
		}
	}
	async rename( path, newPath )
	{
        path = this.normalize( path );
        newPath = this.normalize( newPath );
		try
		{
			return this.newAnswer( FS.renameSync( path, newPath ) );
		}
		catch( e )
		{
			return this.newError( 'awi:cannot-rename-file' );
		}
	}
	getMimeType( extension )
	{
		return mime.lookup( extension );
	}
	exists( path )
	{
        path = this.normalize( path );
		if ( FS.existsSync( path ) )
			return this.newAnswer( true );
		return this.newError( 'awi:file-not-found', path );
	}
	basename( path, suffix )
	{
        path = this.normalize( path );
        return Path.basename( path, suffix );
	}
	extname( path )
    {
        path = this.normalize( path );
        return Path.extname( path );
	}
	dirname( path )
	{
        return this.denormalize( Path.dirname( this.normalize( path ) ) );
	}
	normalize( path )
	{
        return Path.normalize( path );
	}
	denormalize( path )
	{
        var position = path.indexOf( this.sep );
        while( position >= 0 )
        {
            path = path.substring( 0, position ) + '/' + path.substring( position + 1 );
            position = path.indexOf( this.sep, position + 1 );
        }
        return path;
	}
	parse( path )
	{
        return Path.parse( this.normalize( path ) );
	}
	format( pathObject )
	{
        return this.denormalize( Path.format( pathObject ) );
	}
    isAbsolute( path )
    {
        return Path.isAbsolute( this.normalize( path ) );
    }
    relative( pathFrom, pathTo )
    {
        return this.denormalize( Path.relative( this.normalize( pathFrom ), this.normalize( pathTo ) ) );
    }
    join( path1, path2, path3, path4, path5 )
    {
        if ( !path2 )
            return this.denormalize( Path.join( this.normalize( path1 ) ) );
        else if ( !path3 )
            return this.denormalize( Path.join( this.normalize( path1 ), this.normalize( path2 ) ) );
        else if ( !path4 )
            return this.denormalize( Path.join( this.normalize( path1 ), this.normalize( path2 ), this.normalize( path3 ) ) );
        else if ( !path5 )
            return this.denormalize( Path.join( this.normalize( path1 ), this.normalize( path2 ), this.normalize( path3 ), this.normalize( path4 ) ) );

        return this.denormalize( Path.join( this.normalize( path1 ), this.normalize( path2 ), this.normalize( path3 ), this.normalize( path4 ), this.normalize( path5 ) ) );
    }
    resolve( path1, path2, path3, path4, path5 )
    {
        if ( !path2 )
            return this.denormalize( Path.resolve( this.normalize( path1 ) ) );
        else if ( !path3 )
            return this.denormalize( Path.resolve( this.normalize( path1 ), this.normalize( path2 ) ) );
        else if ( !path4 )
            return this.denormalize( Path.resolve( this.normalize( path1 ), this.normalize( path2 ), this.normalize( path3 ) ) );
        else if ( !path5 )
            return this.denormalize( Path.resolve( this.normalize( path1 ), this.normalize( path2 ), this.normalize( path3 ), this.normalize( path4 ) ) );

        return this.denormalize( Path.resolve( this.normalize( path1 ), this.normalize( path2 ), this.normalize( path3 ), this.normalize( path4 ), this.normalize( path5 ) ) );
    }
	decodeText( text )
	{
		text = HE.decode( text );
		text = HE.unescape( text );
		return text;
	}
	checkPathFormat( path )
	{
		if ( this.getSystemInformation( 'platform' ) == 'linux' )
		{
			if ( path.charAt( 0 ) == '/' )
				return true;
		}
		else if ( this.getSystemInformation( 'platform' ) == 'win32' )
		{
			if ( path.charAt( 1 ) == ':' )
				return true;
		}
		return false;
	}
	getSystemInformation( type )
	{
		switch ( type )
		{
			case 'platform':
				return OS.platform();
			case 'userDir':
				return this.awi.utilities.denormalize( OS.homedir() );
			case 'userName':
				return OS.userInfo().username;
			case 'drives':
				var list = [];
				if ( OS.platform == 'win32' )
				{
					for ( var l = 0; l < 26; l++ )
					{
						var answer = this.exists( String.fromCharCode( 65 + l ) + ':' );
						if ( answer.isSuccess() )
							list.push( String.fromCharCode( 65 + l ) );
					}
				}
				return list;
		}
	}
	toSha1( object )
	{
		return Sha1( object );
	}
}
