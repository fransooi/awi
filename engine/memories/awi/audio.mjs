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
* @file memory-audios.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Audio memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryAudio as Bubble }

class MemoryAudio extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'audio',
            className: 'MemoryAudio',
            group: 'awi',
            name: 'Audio',
            version: '0.5',
    
            action: 'stores information about audio files',
            inputs: [
                { prompt: 'what to find in the audio file', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to find', type: 'mediatype', optional: true, default: 'any' },
                { interval: 'interval of time when the audio file was recorded', type: 'interval', optional: false, default: 'any' },
            ],
            outputs: [ { audioFiles: 'found audio files', type: 'audioFile.object.array' } ],
            tags: [ 'memory', 'audio' ]
        } );
	}
	async play( args, basket, control )
	{
		if ( !basket.interval )
			basket.interval = 'any';
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
			control.editor.print( 'Audio file: ' + answer.basket.audioInfo.path, { user: 'memory2' } );
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
			control.editor.print( 'Audio file: ' + content.audioInfo.path, { user: 'memory2' } );
			control.editor.print( 'Recorded on the: ' + content.audioInfo.date.text, { user: 'memory2' } );
			control.editor.print( '', { user: 'memory2' } );
		}
		return answer;
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
}
