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
* @file bubble-verbose.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Bin command: convert to binary
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleVerbose as Bubble }

class BubbleVerbose extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'verbose',
            token: 'verbose',
            className: 'BubbleVerbose',
            group: 'awi',
            version: '0.5',
    
            action: 'sets the level of verbosity of awi',
            inputs: [ { level: 'the level of verbosity, from 1 to 3', type: 'number', interval: { start: 1, end: 3 }, optional: true, default: -1 } ],
            outputs: [ { verbose: 'the level of verbosity', type: 'int' } ],
            parser: {
                verb: [ 'verbose' ],
                evaluation: [ 'numeric' ]
            },
            select: [ [ 'verb' ] ],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );

        var oldVerbose = this.awi.configuration.getConfig( 'user' ).verbose;
        var answer = this.geAnswer( oldVerbose, 'int', 'awi:verbose-set' );
        if ( args.level.result == -1 )
            return answer;
        
        var verbose = Math.floor( args.level.result );
        answer.setValue( verbose );
        this.awi.configuration.setVerbose( verbose );
        if ( verbose < oldVerbose )
            answer.setPrint( 'awi:i-will-talk-less' ); 
        else if ( verbose > oldVerbose )
            answer.setPrint( 'awi:i-will-talk-more' ); 
        else 
            answer.setPrint( 'awi:verbose-set' ); 

		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
