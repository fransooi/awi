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
* @file bubble-stop.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Stop command: stop a media playing in the current editor
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleStop as Bubble }

class BubbleStop extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Stop',
            token: 'stop',
            className: 'BubbleStop',
            group: 'awi',
            version: '0.5',
    
            action: 'stop a media playing',
            inputs: [ { noun: 'the name of the item to stop', type: 'string' } ],
            outputs: [ { stopAction: 'the name of the item that was stopped', type: 'string' } ],
            parser: {
                verb: [ 'stop', 'halt' ],
                noun: [ 'mimetypes' ]
            },
            select: [ [ 'verb' ] ],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return await control.editor.stop( basket.noun );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
