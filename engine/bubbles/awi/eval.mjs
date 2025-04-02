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
* @file bubble-eval.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Eval command: perform a calculation
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleEval as Bubble }

class BubbleEval extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Eval',
            token: 'eval',
            className: 'BubbleEval',
            group: 'awi',
            version: '0.5',
    
            action: 'evaluates a string containing an expression',
            inputs: [ { expression: 'the expression to convert', type: 'string', optional: false } ],
            outputs: [ { value: 'the last evaluated expression', type: 'number' } ],
            parser: {
                verb: [ 'eval', 'evaluate', 'calculate', 'calc' ],
                evaluation: [ 'numeric' ] },
            select: [ [ 'verb' ] ]
       } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return this.newAnswer( args.expression.result, 'awi:the-result-is' );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
