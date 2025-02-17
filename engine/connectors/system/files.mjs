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
* @file files.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Filesystem functions
*/
import ConnectorBase from '../../connector.mjs'
export { ConnectorFiles as Connector }

class ConnectorFiles extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Files';
		this.token = 'files';
		this.className = 'ConnectorFiles';
        this.group = 'system';
		this.version = '0.5';
	}
	async connect( options )
	{
		super.connect( options, true );
        return this.setConnected( true );
	}
	async getPaths( file )
	{
		if ( this.awi.configuration.getConfig( 'user' ).paths[ this.awi.configuration.platform ] )
			return this.awi.configuration.getConfig( 'user' ).paths[ this.awi.configuration.platform ][ file.names[ 0 ] ];
		return [];
	}
	getFileType( path )
	{
		if ( path.indexOf( '/' ) >= 0 || path.indexOf( ':' ) >= 0 )
			return 'any';

		var ext = this.awi.system.extname( path ).toLowerCase();
		if ( !ext )
			return 'any';

		var paths = this.awi.configuration.system.paths;
		for ( var t in paths )
		{
			var typeInfo = paths[ t ];
			for ( var f = 0; f < typeInfo.filters.length; f++ )
			{
				var filter = typeInfo.filters[ f ].toLowerCase();
				if ( filter.indexOf( ext ) >= 0 )
				{
					return t;
				}
			}
		}
		return 'any';
	}
	getFileFilters( type )
	{
		var paths = this.awi.configuration.system.paths;
		if ( paths[ type ] )
			return paths[ type ].filters;
		return paths[ 'any' ].extensions;
	}
	isFileOfType( path, type )
	{
		return type = this.getFileType( path );
	}
	async getTempPath( base, extension )
	{
		for ( var n = 0; n < 10; n++ )
		{
			var name = base + '_' + Math.floor( Math.random() * 100000 ) + '.' + extension;
			var path = this.tempDirectoryPath + '/' + name;
			var answer = await this.awi.system.exists( path );
			if ( !answer.isSuccess() )
				return this.newAnswer( path, 'string' );
		}
        return this.newError( 'awi:file-error' );
	}
	async loadIfExist( path, options )
	{
        var self = this;
		var answer = await this.awi.system.exists( path );
		if ( answer.isSuccess() )
		{
			if ( options.encoding == 'utf8' )
			{
				try
				{
					return await this.awi.system.readFile( path, { encoding: 'utf8' } );
				}
				catch( err )
				{
					return self.newError(  err  );
				}
			}
			else if ( options.encoding == 'arraybuffer' )
			{
				try
				{
					return await this.awi.system.readFile( path );
				}
				catch( err )
				{
					return self.newError( err );
				}
			}
		}
		return this.newError( 'awi:file-not-found' );
	}

	async loadFile( path, options )
	{
		return await this.loadIfExist( path, options );
	}

	getFilenameAndExtension( path )
	{
		return this.awi.system.basename( path );
	}

	async getDirectory( path, options )
	{
		var self = this;
		async function getDir( path, options, parent )
		{
			var result = [];
			var answer = await self.awi.system.readdir( path + '/' );
			if ( answer.isError() )
				return null;
			var files = answer.getValue();
			if ( files )
			{
				for ( var f = 0; f < files.length; f++ )
				{
					var sPath = path + '/' + files[ f ];
					var answer2 = await self.awi.system.stat( sPath );
					if ( answer2.isSuccess() )
					{
						var stats = answer2.getValue();
						if ( !stats.isDirectory() )
						{
							if ( !options.excludes || ( options.excludes && !self.filterFilename( sPath, options.excludes ) ) )
							{
								if ( !options.filters || ( options.filters && self.filterFilename( sPath, options.filters ) ) )
								{
									result.push(
									{
										name: files[ f ],
										path: sPath,
										isDirectory: false,
										size: stats.size,
										stats: stats,
										parent: parent
									} );
								}
							}
						}
						else
						{
							if ( options.recursive )
							{
								var newFile =
								{
									name: files[ f ],
									path: sPath,
									isDirectory: true,
									files: null,
									parent: parent
								};
								var newResult = await getDir( sPath, options, newFile );
								if ( !options.onlyFiles )
								{
									newFile.files = newResult;
									result.push( newFile );
								}
								else if ( newResult.length > 0 )
									result.push( newResult );
							}
							else
							{
								if ( !options.onlyFiles )
								{
									result.push(
									{
										name: files[ f ],
										path: sPath,
										isDirectory: true,
										files: [],
										parent: parent
									} );
								}
							}
						}
					}
				}
			}
			return result;
		}
		var tree = await getDir( path, options );
		if ( tree  )
        {
            var list = [];
            if ( tree.length > 0 && options.listFiles || options.listDirectories )
            {
                if ( options.listDirectories )
                    list = this.getDirectoryArrayFromTree( tree, { sorted: options.sorted } );
                if ( options.listFiles )
                    list = list.concat( this.getFileArrayFromTree( tree, { sorted: options.sorted } ) );
                return this.newAnswer( list, 'array' );
            }
            return this.newAnswer( tree, 'array' );
        }
		return this.newError( 'awi:directory-not-found' );
	}
	filterFilename( name, wildcards )
	{
		name = name.toLowerCase();
		if ( typeof wildcards == 'string' )
			wildcards = [ wildcards ];

		for ( var w = 0; w < wildcards.length; w++ )
		{
			var wildcard = wildcards[ w ].toLowerCase();

			// Look for *[ and ]*
			var start;
			if ( ( start = wildcard.indexOf( '*[' ) ) >= 0 )
			{
				var end = wildcard.indexOf( ']*', start );
				if ( end >= start )
				{
					start += 2;
					var filter = wildcard.substring( start, end );
					if ( name.indexOf( filter ) >= 0 )
						return true;
					if ( start - 2 == 0 && end + 2 == wildcard.length )
						continue;
					var newFilter = '';
					for ( var f = 0; f < end - start; f++ )
						newFilter += '?';
					wildcard = wildcard.substring( 0, start - 2 ) + newFilter + wildcard.substring( end + 2 );
				}
			}

			name = this.awi.system.basename( name );
			var pName = 0;
			var pWild = 0;
			var afterDot = false;
			var bad = false;
			do
			{
				var cName = name.charAt( pName );
				var cWild = wildcard.charAt( pWild );
				switch ( cWild )
				{
					case '*':
						if ( afterDot )
							return true;
						pName = name.lastIndexOf( '.' );
						pWild = wildcard.indexOf( '.' );
						if ( pName < 0 && pWild < 0 )
							return true;
						afterDot = true;
						break;
					case '.':
						afterDot = true;
						if ( cName != '.' )
							bad = true;
						break;
					case '?':
						break;
					default:
						if ( cName != cWild )
							bad = true;
						break;
				}
				pName++;
				pWild++;
			} while( !bad && pName < name.length && pName < name.length )
			if( !bad && pWild < wildcard.length )
				bad = true;
			if ( !bad )
				return true;
		}
		return false;
	}

	async getFileInfo( path )
	{
		var result = undefined;
		var answer = await this.statsIfExists( path );
		if ( answer.isSuccess() )
		{
			stats = answer.getValue();
			if ( data.isDirectory() )
			{
				result =
				{
					name: this.getFilenameAndExtension( path ),
					path: path,
					isDirectory: true,
					size: 0,
					stats: stats
				};
			}
			else
			{
				result =
				{
					name: this.getFilenameAndExtension( path ),
					path: path,
					isDirectory: false,
					size: stats.size,
					stats: stats
				};
			}
		}
		return result;
	}
	async deleteDirectory( destinationPath, options, tree, count )
	{
        debugger;
		try
		{
			if ( !tree )
			{
				var answer = await this.awi.system.exists( destinationPath );
				if ( answer.isSuccess() )
				{
					answer = await this.getDirectory( destinationPath, options );
                    if ( answer.isSuccess() )
                        tree = answer.getValue();
					else
						return this.newError( 'awi:directory-not-found' );
				}
				count = 0;
			}
			for ( var f in tree )
			{
				var file = tree[ f ];
				if ( !file.isDirectory )
					await this.awi.system.unlink( file.path );
				else
				{
					if ( options.recursive )
					{
						count++;
						await this.deleteDirectory( file.path, options, file.files, count );
						count--;
					}
				}
			}
			if ( count > 0 || !options.keepRoot )
				await this.awi.system.rmdir( destinationPath );
			return this.newAnswer();
		}
		catch( error )
		{
		}
		return this.newError( 'awi:cannot-delete-directory' );
	}
	getFilesFromTree( tree = [], result = [] )
	{
		for ( var d = 0; d < tree.length; d++ )
		{
			var entry = tree[ d ];
            if ( !entry.isDirectory )
                result.push( entry );
            else if ( entry.files )
				this.getFilesFromTree( entry.files, result );
		}
		return result;
	}
	getDirectoriesFromTree( tree = {}, result = [] )
	{
		for ( var d = 0; d < tree.length; d++ )
		{
			var entry = tree[ d ];
			if ( entry.isDirectory )
			{
				result.push( entry );
				if ( entry.files )
					this.getDirectoriesFromTree( entry.files, result );
			}
		}
		return result;
	}
	getDirectoryArrayFromTree( tree = {}, options = {} )
	{
		var result = [];
		this.getDirectoriesFromTree( tree, result );

		if ( options.sorted )
		{
			result.sort( function( a, b )
			{
				if ( a.path == b.path )
					return 0;
				if ( a.path.indexOf( b.path ) == 0 )
					return a.path.length < b.path.length ? -1 : 1;
				if ( b.path.indexOf( a.path ) == 0 )
					return b.path.length < a.path.length ? -1 : 1;
				return 0;
			} );
		}
		return result;
	}
	getFileArrayFromTree( tree = {}, options = {} )
	{
        var result = [];
		this.getFilesFromTree( tree, result );

		if ( options.sorted )
		{
			result.sort( function( a, b )
			{
				if ( a.path == b.path )
					return 0;
				if ( a.path < b.path )
					return -1;
				if ( a.path > b.path )
					return 1;
				return 0;
			} );
		}
		return result;
	}
	async statsIfExists( path )
	{
		var answer = await this.awi.system.exists( path );
		if ( answer.isSuccess() )
			return await this.awi.system.stat( path );
		return this.newError( 'awi:file-not-found' );
	}
	async loadHJSON( path )
	{
		try
		{
			var answer = await this.loadFile( path, { encoding: 'utf8' } );
			if ( !answer.isSuccess() )
				return answer;
			return this.awi.utilities.HJSONParse( answer.data );
		}
		catch( e )
		{
		}
		return this.newError( 'awi:illegal-hjson' );
	}
	async saveHJSON( path, data )
	{
		var answer = this.awi.utilities.HJSONStringify( data );
		if ( !answer.isSuccess() )
			return answer;
		return await this.awi.system.writeFile( path, answer.data, { encoding: 'utf8' } );
	}
	async loadJSON( path )
	{
		try
		{
			var answer = await this.loadFile( path, { encoding: 'utf8' } );
			if ( answer.isSuccess() )
				return this.newAnswer( JSON.parse( answer.data ), 'object' );
			return answer;
		}
		catch( e )
		{
		}
		return this.newError( 'awi:illegal-json' );
	}
	async saveJSON( path, data )
	{
		var json = JSON.stringify( data );
		return await this.awi.system.writeFile( path, json, { encoding: 'utf8' } );
	}
	removeBasePath( path, directories )
	{
		for ( var d = 0; d < directories.length; d++ )
		{
			var startPath = directories[ d ];
			if ( path.indexOf( startPath ) == 0 )
			{
				path = path.substring( startPath.length + 1 );
				break;
			}
		}
		return path;
	}
	removeDuplicatesFromFiles( sourceFiles )
	{
		var newArray = [];
		for ( var s = 0; s < sourceFiles.length; s++ )
		{
			var file = sourceFiles[ s ];
			var found = newArray.find(
				function( element )
				{
					return file.name == element.name;
				} );
			if ( !found )
				newArray.push( file )
		}
		return newArray;
	}
	isPath( text )
	{
		var result = false;
		if ( typeof text != 'undefined' )
		{
			for ( var p = 0; p < text.length; p++ )
			{
				var c = text.charAt( p );
				if ( c == '/' || c == '\\' || c == '*' || c == '.' || c == '?' )
					result = true;
			}
			if ( result )
			{
				try
				{
					this.parse( text );
				} catch ( e )
				{
					return false;
				}
			}
		}
		return result;
	}
}
