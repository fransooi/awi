/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     link:
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
export { SouvenirRoot as Bubble }

class SouvenirRoot extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirRoot',
            group: 'awi',
            token: 'root',
            name: 'Root',
            version: '0.5',
            
            action: "root of a branch of souvenirs",
            inputs: [
                { prompt: 'what to find in the chain', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' } ],
            outputs: [ { rootInfo: 'what was found', type: 'object.rootInfo' } ],
            tags: [ 'souvenir', 'root' ]
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
		control.editor.print(parent + '.', { user: 'memory3' } );
		control.editor.print( '---------------------------------------------', { user: 'memory3' } );
        return this.newAnswer( {
            senderName: this.parameters.senderName,
			receiverName: this.parameters.receiverName,
        }, 'data' );
	}
	async findSouvenirs( args, basket, control )
	{
		return this.newAnswer( {
            senderName: this.parameters.senderName,
            receiverName: this.parameters.receiverName,
        }, 'data' );
	}
}
