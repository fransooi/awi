/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     link:
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
*
* ----------------------------------------------------------------------------
* @file memory-photos.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Photo memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryPhoto as Bubble }

class MemoryPhoto extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'photo',
            className: 'MemoryPhoto',
            group: 'awi',
            name: 'Photo',
            version: '0.5',
    
            action: 'stores a list of photos',
            inputs: [
                { prompt: 'what to find in the photos', type: 'string', optional: false, default: '' },
                { from: 'what kind of content to find', type: 'string', optional: true, default: 'any' },
                { interval: 'interval of time when the photo was taken', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [ { photoInfos: 'the photos found', type: 'photoInfo.object.array' } ],
            tags: [ 'memory', 'photos' ]
        } );
	}
	async play( args, basket, control )
	{
		return await this[ control.memory.command ]( args, basket, control );
	}
	async extractContent( args, basket, control )
	{
		return await super.extractContent( args, basket, control );
	}
	async getContent( args, basket, control )
	{
		var souvenir = this.getBubble( this.getBubble( 'root' ).properties.exits[ 'success' ] );
		if ( souvenir )
		{
			control.editor.print( 'Photo file: ' + souvenir.path, { user: 'memory2' } );
			control.editor.print({ user: 'memory2' } );
		}
		return await super.getContent( args, basket, control );
	}
	async findSouvenirs( args, basket, control )
	{
		return await super.findSouvenirs( args, basket, control );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
