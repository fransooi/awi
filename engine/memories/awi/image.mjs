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
* @file memory-image.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Image Memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryImage as Bubble }

class MemoryImage extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'image',
            className: 'MemoryImage',
            group: 'awi',
            name: 'Image',
            version: '0.5',
    
            action: 'stores a list of images',
            inputs: [
                { prompt: 'what to find in the images', type: 'string' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' },
                { interval: 'when the image was created', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [ { imageInfos: 'list of images found', type: 'imageInfo.souvenir.array' } ],
            tags: [ 'memory', 'images' ]
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
		var souvenir = this.getBubble( this.getBubble( 'root' ).properties.exits[ 'success' ] );
		if ( souvenir )
		{
			control.editor.print( 'Image file: ' + souvenir.path, { user: 'memory2' } );
		}
		return await super.getContent( args, basket, control );
	}
	async findSouvenirs( args, basket, control )
	{
		return await super.findSouvenirs( args, basket, control );
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
}
