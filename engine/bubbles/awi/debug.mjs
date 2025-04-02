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
* @file bubble-debug.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Debug command: manage debugging
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleDebug as Bubble }

class BubbleDebug extends BubbleBase
{
	constructor( awi, config )
	{
		super( awi, config,
        {
            name: 'Debug',
            token: 'debug',
            className: 'BubbleDebug',
            group: 'awi',
            version: '0.5',
            action: 'sets the level of debug of awi',
            inputs: [ { level: 'the level of debug, from 0 to 3', type: 'int', interval: { start: 0, end: 3 }, optional: true, default: -1 } ],
            outputs: [ { debug: 'the current debug level', type: 'number' } ],
            parser: { verb: [ 'debug' ], evaluation: [ 'numeric' ] },
            select: [],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );

        var oldDebug = this.awi.configuration.getDebug();
        if ( args.level.result == -1 )
            return { toPrint: 'awi:debug-set', result: oldDebug };
        var debug = Math.floor( args.level.result );
        if ( debug != oldDebug )
            this.awi.configuration.setDebug( debug );
		return this.newAnswer( debug, 'awi:debug-set' );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
