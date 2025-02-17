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
* @file memory-messenger.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Messenger memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryMessenger as Bubble }

class MemoryMessenger extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'messenger',
            className: 'MemoryMessenger',
            group: 'awi',
            name: 'Messenger',
            version: '0.5',
    
            action: 'stores a thread of messages with one person',
            inputs: [
                { prompt: 'what to find in the messages', type: 'string', optional: false, default: '' },
                { from: 'what kind of content to remember', type: 'string', optional: true, default: 'any' },
                { interval: 'interval of time when the message was written', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [ { messageInfos: 'list of messages found', type: 'messageInfo.object.array' } ],
            tags: [ 'memory', 'messages' ]
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
			control.editor.print( 'Conversation between ' + souvenir.senderName + ' and ' + souvenir.receiverName + ',', { user: 'memory2' } );
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
