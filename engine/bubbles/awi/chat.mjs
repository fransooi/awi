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
* @file bubble-chat.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Chat bubble
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleChat as Bubble }

class BubbleChat extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config, 
        {
            name: 'Chat',
            token: 'chat',
            className: 'BubbleChat',
            group: 'awi',
            version: '0.5',
            action: 'answers to generic questions',
            inputs: [ { question: 'the question', type: 'string' } ],
            outputs: [ { answer: 'the answer to the question', type: 'string' } ],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );

        var { question } = this.awi.getArgs( [ 'question' ], args, basket, control );
        if ( question )            
            return await this.awi.chat.send( [ question.getValue() ], basket, control );
 		return this.newError( 'awi:nothing-to-ask');
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
