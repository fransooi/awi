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
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file bubble-bin.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Bin command: convert to binary
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleBin as Bubble }

class BubbleBin extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config, 
        {
            name: 'Bin',
            token: 'bin',
            className: 'BubbleBin',
            group: 'awi',
            version: '0.5',
            action: 'converts an expression to a binary number',
            inputs: [ { expression: 'the number to convert to binary', type: 'int' } ],
            outputs: [ { bin: 'the expression converted to binary', type: 'string' } ],
            parser: {
                verb: [ 'convert', 'transform', 'calculate' ],
                adjective: [ 'binary' ],
                questionWord: [ 'what' ],
                evaluation: [ 'numeric' ] },
            select: [ [ 'verb', 'adjective' ], [ 'questionWord', 'adjective' ] ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return this.newAnswer( args.expression.result, 'bin', 'awi:the-binary-value-is' );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
