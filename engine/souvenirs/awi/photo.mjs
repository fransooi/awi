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
* @file souvenir-photo.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Photo souvenir
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirPhoto as Bubble }

class SouvenirPhoto extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirPhoto',
            group: 'awi',
            token: 'photo',
            name: 'Photo',
            version: '0.5',
            
            action: 'remembers one photo',
            inputs: [
                { prompt: 'what to find in the photo', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' } ],
            outputs: [ { photoInfo: 'what was found', type: 'object.photoInfo', default: false } ],
            tags: [ 'souvenir', 'photo' ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return await this[ control.memory.command ]( args, basket, control );
	}
	async extractContent( args, basket, control )
	{
		var info = this.awi.utilities.compareTwoStrings( this.parameters.text, prompt, control );
		if ( info.result > 0 )
		{
			var content = await this.getContent( args, basket, control );
			return this.newAnswer( { result: info.result, match: info, content: content.basket.photoInfo } );
		}
		return this.newError( 'awi:not-found' );
	}
	async getContent( args, basket, control )
	{
		control.editor.print( this.parameters.text, { user: 'memory3' } );
		control.editor.print( this.parameters.text, { user: 'memory3' } );
		return this.newAnswer( {
            receiverName: this.parameters.receiverName,
            path: path,
            text: text,
            date: this.awi.utilities.getTimestampFromStats( stats )
        } );
	}
	async findSouvenirs( args, basket, control )
	{
		var info = this.awi.utilities.matchTwoStrings( this.parameters.text, prompt, control );
		if ( info.result > 0 )
			return await this.getContent( args, basket, control );
		return this.newError( 'awi:not-found' );
	}
}
