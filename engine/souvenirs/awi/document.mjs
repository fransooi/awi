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
* @file souvenir-document.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Document souvenir
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirDocument as Bubble }

class SouvenirDocument extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config, 
        {
            className: 'SouvenirDocument',
            token: 'document',
            name: 'Document',
            group: 'awi',
            version: '0.5',
            
            action: "remembers one document file and it's content",
            inputs: [
                { prompt: 'what to find in the document', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to look for', type: 'string', optional: true, default: 'any' } ],
            outputs: [ { documentInfo: 'what was found', type: 'object.documentInfo' } ],
            tags: [ 'souvenir', 'document' ]
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
			return await this.getContent( args, basket, control );
		return this.newError( 'awi:not-found' );
	}
	async getContent( args, basket, control )
	{
		control.editor.print(text, { user: 'memory3' } );
		control.editor.print( '----------------------------', { user: 'memory3' } );
		return this.newAnswer( {
                receiverName: this.parameters.receiverName,
                path: path,
                text: text,
                date: this.awi.utilities.getTimestampFromStats( stats )
            }, 'data' );
	}
	async findSouvenirs( args, basket, control )
	{
		var info = this.awi.utilities.matchTwoStrings( this.parameters.text, prompt, control );
		if ( info.result > 0 )
		{
			var content = await this.getContent( args, basket, control );
			return this.newAnswer( { result: info.result, match: info, content: content.basket.documentInfo }, 'data' );
		}
		return this.newError( 'awi:not-found' );
	}
}
