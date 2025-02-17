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
* @file bubble-generic-quit.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Quit: save conversations and memories and quits Awi.
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleQuit as Bubble }

class BubbleQuit extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Quit',
            token: 'quit',
            className: 'BubbleQuit',
            group: 'awi',
            version: '0.5',
    
            action: 'save conversations and memories and quits Awi',
            inputs: [ ],
            outputs: [ ],
            parser: { verb: [ 'quit', 'leave', 'exit' ] },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		await this.awi.configuration.saveConfigs( this.awi.configuration.user );
		var answer = await this.awi.save( this.awi.configuration.user );
		if ( answer.isSuccess() )
			this.awi.system.quit();
		control.editor.print( 'Cannot save memories and conversations. Please check your setup.' );
		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
