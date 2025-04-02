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
* @file souvenir-message.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Message souvenir
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirMessage as Bubble }

class SouvenirMessage extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirMessage',
            group: 'awi',
            token: 'message',
            name: 'Message',
            version: '0.5',
            
            action: 'remembers one conversation exchange',
            inputs: [
                { prompt: 'the topics to remember', type: 'string', optional: false, default: '' },
                { from: 'the kind of topic to remember, example audio, video etc.', type: 'string', optional: true, default: '' } ],
            outputs: [ { messageInfo: 'what was found', type: 'object.messageInfo', default: false } ],
            tags: [ 'souvenir', 'messenger', 'message' ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return await this[ control.memory.command ]( args, basket, control );
	}
	async extractContent( args, basket, control )
	{
		var content = await this.getContent( args, basket, control );
		var info = this.awi.utilities.matchTwoStrings( content, prompt, control );
		if ( info.result > 0 )
		{
			return this.newAnswer( { result: info.result, match: info, content: content } );
		}
		return this.newError( 'awi:not-found' );
	}
	async getContent( args, basket, control )
	{
		var texts = [];
		for ( var c = 0; c < this.parameters.conversation.length; c++ )
		{
			var message = this.parameters.conversation[ c ];
			var text = '';
			if ( message.name == this.parameters.senderName )
				text += 's:';
			else 
				text += 'r:';
			text += message.content;
			texts.push( text );
		}
		return texts;
	}
	async findIndirectSouvenirs( args, basket, control )
	{
		var content = await this.getContent( args, basket, control );
		var foundContent = [];
		for ( var c = 0; c < content.length; c++ )
		{
			var found = this.awi.utilities.matchTwoStrings( content[ c ].substring( 2 ), prompt, { caseInsensitive: true } );
			if ( found.result > 0 )
			{
				foundContent.push( content[ c ].substring( 2 ) );
			}	
		}
        if ( foundContent.length > 0 )
		    return this.newAnswer( foundContent );
        return this.newError( 'awi:not-found' );
	}
}
