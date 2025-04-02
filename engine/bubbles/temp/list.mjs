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
* @file bubble-generic-list.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Find command: find files in the registered users directories
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleList as Bubble }

class BubbleList extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'List',
            token: 'list',
            className: 'BubbleList',
            group: 'awi',
            version: '0.5',
    
            action: 'list files in the registered user directories or any directory',
            inputs: [
                { file: 'the file(s) to find', type: 'string' },
                { date: 'the date when the file was created', type: 'string', optional: true },
                { time: 'the time when the file was created', type: 'string', optional: true },
                { input: 'description of the content to search for', type: 'string', optional: true },
                ],
            outputs: [ { files: 'the last list of files', type: 'file.array' } ],
            parser: { verb: [ 'list' ], file: [],	date: [], time: [], input: [] },
            select: [ [ 'verb' ] ],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		var answer = await this.awi.system.findFiles( args, basket, control );
		if ( !answer.isSuccess() )
			return answer;

		var files = answer.fileList;
		var result = [];
		for ( var f = 0; f < answer.filelist.length; f++ )
			result.push( ( f + 1 ) + '. ' + answer.fileList[ f ].path );
		control.editor.print( result, { user: 'information' } );
		return this.newAnswer( files, 'awi:file-list' );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
