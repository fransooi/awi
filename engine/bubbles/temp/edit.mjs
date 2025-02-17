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
* @file bubble-edit.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Edit command: edit a file
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleEdit as Bubble }

class BubbleEdit extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Edit',
            token: 'edit',
            className: 'BubbleEdit',
            group: 'awi',
            version: '0.5',
    
            action: 'edit a file',
            inputs: [
                { file: 'the file to edit', type: 'string' },
                { date: 'the date when the file was created', type: 'string', optional: true },
                { time: 'the time when the file was created', type: 'string', optional: true },
                { input: 'description of the content to search for', type: 'string', optional: true },
                ],
            outputs: [ { files: 'the last list of files', type: 'path.string.array' },
                       { fileEdited: 'the last file to be ran', type: 'path' } ],
            parser: {
                verb: [ 'edit', 'modify', 'change', 'correct' ],
                file: [], date: [], time: [], input: [] },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		var self = this;
		async function playIt( file, files )
		{
			var play = await self.awi.system.playFile( file, 'edit', control );
			if ( play.isSuccess() )
			{
				if ( typeof files != 'undefined' )
					return this.newAnswer( { files: files, fileEdited: file }, 'object' );
				return this.newAnswer( file, 'array' );
			}
		}

		await super.play( args, basket, control );
		if ( /^\d+$/.test( prompt ) )
		{
			var files = this.branch.getLastData( this, 'files' );
			if ( files && files.length > 0 )
			{
				var number = parseInt( prompt ) - 1;
				if ( number >= 0 && number < files.length )
					return await playIt( files[ number ] );
				return { success: false, error: 'not-found' };
			}
		}
		var answer = await this.awi.system.findFiles( args, basket, control );
		if ( !answer.isSuccess() )
			return this.newError( 'awi:not-found' );

		if ( answer.isSuccess() )
			return await playIt( answer.fileList[ 0 ], answer.fileList );

		var result = [];
		control.editor.print( [ 'You can edit these files: ' ], { user: 'information' } );
		for ( var f = 0; f < answer.fileList.length; f++ )
			result.push( ( f + 1 ) + '. ' + answer.fileList[ f ].path );
		control.editor.print('information' } );
		var param = await this.awi.prompt.getParameters( [
			{ choice: 'Please enter a number between 1 and ' + answer.fileList.length, type: 'number', interval: [ 1, answer.fileList.length ], optional: false, default: 0 },
			], control );
		if ( param.isSuccess() )
			return await playIt( answer.fileList[ param.fileList.choice - 1 ], answer.filelist );
		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
