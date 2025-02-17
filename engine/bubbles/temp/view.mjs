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
* @file bubble-view.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short View command: view a media file in the current editor
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleView as Bubble }

class BubbleView extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'View',
            token: 'view',
            className: 'BubbleView',
            group: 'awi',
            version: '0.5',
    
            action: 'display the content of a file',
            inputs: [
                { file: 'the file to view', type: 'string' },
                { date: 'the date when the file was created', type: 'string', optional: true },
                { time: 'the time when the file was created', type: 'string', optional: true },
                { input: 'description of the content to search for', type: 'string', optional: true } ],
            outputs: [ { files: 'the last list of files', type: 'file.array' },
                       { fileViewed: 'the last file viewed', type: 'file' } ],
            parser: {
                verb: [ 'view', 'display', 'show' ],
                file: [], date: [], time: [], input: [] },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		var self = this;
		async function playIt( file, files )
		{
			var play = await self.awi.system.playFile( file, 'view', control );
			return this.newAnswer( { files: files, fileViewed: file }, 'object' );;
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
			return this.newError( 'awi:not-found' } );

		if ( answer.isSuccess() )
			return await playIt( answer.fileList[ 0 ], answer.fileList );

		var result = [];
		control.editor.print( [ 'You can view these files: ' ], { user: 'information' } );
		for ( var f = 0; f < answer.fileList.length; f++ )
			result.push( ( f + 1 ) + '. ' + answer.fileList[ f ].path );
		control.editor.print( result, { user: 'information' } );
		var param = await this.awi.prompt.getParameters( [
			{ choice: 'Please enter a number between 1 and ' + answer.filelist.length, type: 'number', interval: [ 1, answer.fileList.length ], optional: false, default: 0 },
			], control );
		if ( param.isSuccess() )
			return await playIt( answer.fileList[ param.choice - 1 ], answer.fileList );
		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
