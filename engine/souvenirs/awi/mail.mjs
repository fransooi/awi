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
* @file souvenir-mail.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Mail souvenir
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirMail as Bubble }

class SouvenirMail extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirMail',
            group: 'awi',
            token: 'mail',
            name: 'Mail',
            version: '0.5',
            
            action: "remembers one mail exchange and it's content",
            inputs: [
                { prompt: 'what to find in the mail', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to look for', type: 'string', optional: true, default: 'any' } ],
            outputs: [ { mailInfo: 'what was found', type: 'object.mailInfo' } ],
            subTopics: [ 'souvenir', 'mail' ],
            tags: [ 'souvenir', 'mail' ],
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
			return this.newAnswer( { result: info.result, match: info, content: content.basket.mailInfo }, 'data' );
		}
		return this.newError( 'awi:not-found' );
	}
	async getContent( args, basket, control )
	{
		control.editor.print( this.parameters.text, { user: 'memory3' } );
		control.editor.print( '---------------------------', { user: 'memory3' } );
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
			return await this.getContent( args, basket, control );
		return this.newError( 'awi:not-found' );
	}
}
