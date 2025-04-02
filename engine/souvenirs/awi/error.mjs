/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
*
* ----------------------------------------------------------------------------
* @file souvenir-error.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Souvenir error bubble
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirError as Bubble }

class SouvenirError extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirError',
            token: 'error',
            name: 'Error',
            group: 'awi',
            version: '0.5',
            
            action: "handle errors in souvenir chains",
            inputs: [
                { prompt: 'what the user wanted to find', type: 'string', optional: true },
                { from: 'the kind+ of things he was looking for', type: 'string', optional: true, default: 'any' } ],
            outputs: [ { errorInfo: 'what to do next', type: 'object.errorInfo' } ],
            tags: [ 'souvenir', 'error' ],
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return await this[ control.memory.command ]( args, basket, control );
	}
	async extractContent( args, basket, control )
	{
		return this.newError( 'awi:not-found' );
	}
	async getContent( args, basket, control )
	{
		control.editor.print( 'Error souvernir!', { user: 'memory3' } );
		control.editor.print( '---------------------------------------------', { user: 'memory3' } );
		return this.newAnswer ( {
            prompt: basket.prompt,
            from: basket.from,
            control: control
        } );
	}
	async findSouvenirs( args, basket, control )
	{
		return this.newError( 'awi:not-found' );
	}
}
