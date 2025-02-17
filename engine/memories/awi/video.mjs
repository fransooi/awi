/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
*
* ----------------------------------------------------------------------------
* @file memory-video.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Video memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryVideo as Bubble }

class MemoryVideo extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'video',
            className: 'MemoryVideo',
            group: 'awi',
            name: 'Video',
            version: '0.5',
    
            action: 'stores information about one videos',
            inputs: [
                { prompt: 'what to find in the video', type: 'string', optional: false, default: '' },
                { type: 'what type of content to find', type: 'string', optional: true, default: 'any' },
                { interval: 'interval of time when the video was taken', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [	{ videoInfos: 'the list of videos found', type: 'videoInfo.object.array' } ],
            tags: [ 'memory', 'videos' ]
        } );
	}
	async play( args, control, nested )
	{
		return await this[ control.memory.command ]( args, basket, control );
	}
	async extractContent( args, basket, control )
	{
		return await super.extractContent( args, basket, control );
	}
	async getContent( args, basket, control )
	{
		var answer = await super.getContent( args, basket, control );
		if ( answer.isSuccess() )
		{
			control.editor.print( 'Video file: ' + answer.basket.audioInfo.path, { user: 'memory2' } );
			control.editor.print( 'Recorded on the: ' + answer.basket.audioInfo.date, { user: 'memory2' } );
			control.editor.print( '', { user: 'memory2' } );
		}
	}
	async findSouvenirs( args, basket, control )
	{
		var answer = await super.findSouvenirs( args, basket, control );
		if ( answer.isSuccess() )
		{
			var content = ( typeof answer.basket.direct.content[ 0 ] == 'undefined' ? answer.basket.indirect.content[ 0 ] : answer.basket.direct.content[ 0 ] );
			control.editor.print( 'Video file: ' + content.videoInfo.path, { user: 'memory2' } );
			control.editor.print( 'Recorded on the: ' + content.videoInfo.date.text, { user: 'memory2' } );
			control.editor.print( '', { user: 'memory2' } );
		}
		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
