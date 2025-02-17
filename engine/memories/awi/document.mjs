/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][    ]      Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
*
* ----------------------------------------------------------------------------
* @file memory-documents.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Document Memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryDocument as Bubble }

class MemoryDocument extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'document',
            className: 'MemoryDocument',
            group: 'awi',
            name: 'Document',
            version: '0.5',
    
            action: 'stores the content documents',
            inputs: [
                { prompt: 'what to find in the documents', type: 'string' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' },
                { interval: 'when the document was created', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [ { documentInfos: 'list of documents found', type: 'documentInfo.souvenir.array' } ],
            tags: [ 'memory', 'document' ]
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
		var souvenir = this.getBubble( this.getBubble( 'root' ).properties.exits[ 'success' ] );
		if ( souvenir )
		{
			control.editor.print( '' + souvenir.path, { user: 'memory2' } );
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
