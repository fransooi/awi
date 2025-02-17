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
* @file bubble-hex.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Hex command: convert to hexadecimal
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleHex as Bubble }

class BubbleHex extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Hex',
            token: 'hex',
            className: 'BubbleHex',
            group: 'awi',
            version: '0.5',
    
            action: 'converts an expression to a hexadecimal number',
            inputs: [ { expression: 'the expression to convert to hexadecimal', type: 'int' } ],
            outputs: [ { hex: 'a string containing a hexadecimal number', type: 'string' } ],
            parser: {
                verb: [ 'convert', 'transform', 'calculate' ],
                adjective: [ 'hexadecimal', 'hexa' ],
                questionWord: [ 'what' ],
                evaluation: [ 'numeric' ] },
            select: [ [ 'verb', 'adjective' ], [ 'questionWord', 'adjective' ] ],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return this.newAnswer( args.expression.result, 'number', 'awi:the-hexadecimal-value-is' );
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
}
