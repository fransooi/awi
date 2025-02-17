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
* @file memory-error.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Memory error branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryError as Bubble }

class MemoryError extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'error',
            className: 'MemoryError',
            group: 'awi',
            name: 'Error',
            version: '0.5',
    
            action: "handle Alzheinmer?",
            inputs: [ ],
            outputs: [ ],
            tags: [ 'memory', 'error' ]
        } );
	}
	async extractContent( args, basket, control )
	{
	}
	async getContent( args, basket, control )
	{
	}
	async findSouvenirs( args, basket, control )
	{
	}
	async play( args, parameter, control )
	{
	}
	async playback( args, basket, control )
	{
	}
}
