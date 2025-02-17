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
* @file memory-mails.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Mail Memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryMail as Bubble }

class MemoryMail extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'mail',
            className: 'MemoryMail',
            group: 'awi',
            name: 'Mail',
            version: '0.5',
    
            action: 'stores a list of mails',
            inputs: [
                { prompt: 'what to find in the mail', type: 'string' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' },
                { interval: 'when the mail was sent', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [ { mailInfos: 'list of mails found', type: 'mailInfo.object.array' } ],
            tags: [ 'memory', 'mails' ]
        } );
	}
	async play( args, control, nested )
	{
		return await this[ control.memory.command ]( args, basket, control );
	}
	async extractContent( args, basket, control )
	{
		return await super.extractContent( args, basket, control );
	}
	async getContent( args, basket, control )
	{
		var souvenir = this.getBubble( this.getBubble( 'root' ).properties.exits[ 'success' ] );
		if ( souvenir )
		{
			control.editor.print( 'Mail between: ' + souvenir.senderName + ' and ' + souvenir.receiverName, { user: 'memory2' } );
			control.editor.print( 'On the ' + souvenir.date, { user: 'memory2' } );
		}
		return await super.getContent( args, basket, control );
	}
	async findSouvenirs( args, basket, control )
	{
		return await super.findSouvenirs( args, basket, control );
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
}
