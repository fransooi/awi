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
* @file bubble-import.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Import command: import a file in the current project through the current editor connector
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleImport as Bubble }

class BubbleImport extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Import',
            token: 'import',
            className: 'BubbleImport',
            group: 'awi',
            version: '0.5',
    
            action: 'import assets in the designated folder of the application',
            outputs: [ { imported: 'the path to the imported assets', type: 'array.path' } ],
            inputs: [
                { file: 'the path of the file to import', type: 'path' },
                { date: 'the date when the file was created', type: 'date', optional: true },
                { time: 'the time when the file was created', type: 'time', optional: true },
                { type: 'description of the content to search for', type: 'mediatype', optional: true },
                ],
            parser: {
                verb: [ 'import' ], file: [], date: [], time: [], type: [] },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		var self = this;
		async function importFile( path )
		{
			var answer = await self.awi.language.import( path );
			if ( answer.isSuccess() )
				self.awi.editor.print( this, [ 'File successfully imported to: ' + path ], { user: 'information' } );
			else
				self.awi.editor.print( this, [ 'Cannot import file : ' + path ], { user: 'error' } );
			return answer;
		}
		if ( /^\d+$/.test( basket.prompt ) )
		{
			var fileList = this.branch.getLastData( this, 'fileList' );
			if ( fileList && fileList.length > 0 )
			{
				var number = parseInt( basket.prompt ) - 1;
				if ( number >= 0 && number < fileList.length )
				{
					var path = fileList[ number ].path;
					return await importFile( path );
				}
                return this.newError( 'awi:cancelled' );
			}
			return this.newError( 'awi:no-file-list-found' );
		}
		var answer = await this.awi.language.getImportPaths();
		var importPaths = answer.paths;
		answer = await this.awi.system.findFile( importPaths.toScan, basket.file, { filters: [ '*.*' ] } );
		var files = this.awi.utilities.removeDuplicatesFromFiles( answer.fileList );
		if ( files.length == 0 )
		{
			control.editor.print( [ 'No asset found with that name...' ], { user: 'information' } );
			return this.newError( 'awi:no-file-list-found' );
		}
		if ( files.length == 1 )
			return await importFile( files[ 0 ].path );
		var result = [];
		control.editor.print( [ 'I have found these assets:' ], { user: 'information' } );
		for ( var l = 0; l < files.length; l++ )
			result.push( ( l + 1 ) + '. ' + files[ l ].name );
		control.editor.print( result, { user: 'information' } );
		var param = await this.awi.prompt.getParameters( [ {
			token: 'input',
			group: 'awi',
			parameters: [ { name: 'choice',	description: 'Please enter a number between 1 and ' + files.length, type: 'number',	interval: [ 1, files.length ] } ],
			options: { }
		} ], control );
		if ( param.isSuccess() )
			return await importFile( files[ param.choice - 1 ].path );
		return this.newError( 'awi:cancelled' );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
