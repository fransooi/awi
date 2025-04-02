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
* @file bubble-run.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Run command: run an executable in the current system connector
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleRun as Bubble }

class BubbleRun extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Run',
            token: 'run',
            className: 'BubbleRun',
            group: 'awi',
            version: '0.5',
    
            action: 'launch an application',
            inputs: [
                { file: 'the name of the application to run', type: 'string' },
                { noun: 'if an accessory', type: 'string', optional: true },
                { input: 'eventual parameters', type: 'string', optional: true, default: '' } ],
            outputs: [ { files: 'the last list of files', type: 'path.string.array' },
                       { fileRan: 'the last file to be ran', type: 'path' } ],
            parser: {
                verb: [ 'run', 'launch' ],
                noun: [ 'accessory' ],
                file: [ 'application' ],
                input: []
            },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		var self = this;
		async function playIt( file, files )
		{
			var play = await self.awi.system.playFile( file, 'run', control );
			return this.newAnswer( { files: files, fileRan: file } );
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
				return this.newError( 'awi:not-found' );
			}
		}
		var answer = await this.awi.system.findFiles( args, basket, control );
		if ( !answer.isSuccess() )
			return this.newError( 'awi:not-found' );

		if ( answer.isSuccess() === '1' )
			return await playIt( answer.fileList[ 0 ], answer.filesList );

		var result = [];
		control.editor.print( [ 'You can edit these files: ' ], { user: 'information' } );
		for ( var f = 0; f < answer.fileList.length; f++ )
			result.push( ( f + 1 ) + '. ' + answer.fileList[ f ].path );
		control.editor.print( result, { user: 'information' } );
		var param = await this.awi.prompt.getParameters( [
			{ choice: 'Please enter a number between 1 and ' + answer.fileList.length, type: 'number', interval: [ 1, answer.fileList.length ], optional: false, default: 0 },
			], control );
		if ( param.isSuccess() )
			return await playIt( answer.fileList[ param.choice - 1 ], answer.filelist );
		return this.newAnswer( { files: files, fileRan: '' } );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
