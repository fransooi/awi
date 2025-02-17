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
* @file memory-conversations.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Conversation Memory branch
*
*/
import MemoryBase from '../../memory.mjs'
export { MemoryConversation as Bubble }

class MemoryConversation extends MemoryBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            token: 'conversation',
            className: 'MemoryConversation',
            group: 'awi',
            name: 'Conversation',
            version: '0.5',
    
            action: 'stores a thread of messages with one person',
            inputs: [
                { prompt: 'what to find in the messages', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' },
                { interval: 'when the things were said', type: 'string', optional: true, default: 'any' },
            ],
            outputs: [ { messageInfos: 'found messages', type: 'messageInfo.object.array' } ],
            tags: [ 'memory', 'conversation' ]
        } );
	}
	async play( args, basket, control )
	{
		if ( !basket.interval )
			basket.interval = 'any';
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
			control.editor.print(ir.senderName + ' and ' + souvenir.receiverName + ',', { user: 'memory2' } );
			control.editor.print( 'On the : ' + souvenir.date + '.', { user: 'memory2' } );
		}
		return await super.getContent( args, basket, control );
	}
	async findSouvenirs( args, basket, control )
	{
		return await super.findSouvenirs( args, basket, control );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
