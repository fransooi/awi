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
* @file bubble-write.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Write command: create code in the current language connector
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleWrite as Bubble }

class BubbleWrite extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Write',
            token: 'write',
            className: 'BubbleWrite',
            group: 'awi',
            version: '0.5',
    
            action: 'write a text, code, resume, synthesis',
            inputs: [ { noun: 'what to write', type: 'string' },
                      { person: 'the person to write to', type: 'string', optional: true } ],
            outputs: [],
            parser: {
                verb: [ 'write' ],
                noun: [ 'mail', 'document', 'presentation', 'text' ],
                person: [] },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		return await super.play( args, basket, control );
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
}
