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
* @file root.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Memory root branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryRoot as Bubble }

class MemoryRoot extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'root',
            className: 'MemoryRoot',
            group: 'awi',
            name: 'Root',
            version: '0.5',
    
            action: "",
            inputs: [ ],
            outputs: [ ],
            tags: [ 'memory', 'root' ]
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
	async play( prompt, parameter, control )
	{
	}
	async playback( args, basket, control )
	{
	}
}
