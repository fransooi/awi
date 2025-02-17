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
* @file bubble-root.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Error management bubble
* 
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleRoot as Bubble }

export default class BubbleRoot extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Root',
            token: 'root',
            className: 'BubbleRoot',
            group: 'awi',
            version: '0.5',
    
            action: 'root of a branch of bubbles'
        } );
	}
	async play( args, basket, control )
	{
		return await super.play( args, basket, control );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
