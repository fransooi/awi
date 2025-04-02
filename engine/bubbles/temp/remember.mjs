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
* @file bubble-remember.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Remember command: dig a specific topic out of the memory
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleRemember as Bubble }

class BubbleRemember extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Remember',
            token: 'remember',
            className: 'BubbleRemember',
            group: 'awi',
            version: '0.5',
    
            action: 'recall all memories about a subject',
            inputs: [
                { what: 'the subject to remember', type: 'string', default: 'any' },
                { person: 'the name of someone to remember', type: 'string', optional: true, default: 'any' },
                { date: 'interval of time to consider', type: 'string', optional: true, default: 'any' },
                { scanLevel: 'depth of the search, 1: direct souvenirs only, 2: indirect souvenirs, 3: deep search', type: 'number', interval: { start: 1, end: 3 }, optional: true, default: '2', clear: true }	],
            outputs: [
                { directSouvenirs: 'the direct souvenirs found', type: 'souvenirInfo.object.array' },
                { indirectSouvenirs: 'the indirect souvenirs found', type: 'souvenirInfo.object.array' } ],
            parser: {
                verb: [ 'remember', 'recall', 'think about' ],
                what: [ 'audio', 'video', 'messenger' ],
                person: [], date: [], value: [ 'level' ] },
            select: [ [ 'verb' ] ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		control.memory = {
			scanLevel: basket.scanLevel
		};
		basket.senderName = typeof basket.senderName == 'undefined' ? this.awi.configuration.getConfig( 'user' ).fullName : basket.senderName;
		if ( basket.person.length > 0 )
			prompt += basket.person[ 0 ];

		var answer = await this.awi.persona.remember( args, basket, control );
		if ( answer.isSuccess() )
		{
			if ( answer.direct.souvenirs.length > 0 )
				control.editor.print( 'Found ' + answer.direct.souvenirs.length + ' direct souvenir(s).', { user: 'information' } );
			else
				control.editor.print( 'No direct souvenir found.', { user: 'information' } );

			if ( /*basket.scanLevel > 1 &&*/ answer.indirect.souvenirs.length > 0 )
				control.editor.print( 'Found ' + answer.indirect.souvenirs.length + ' indirect souvenir(s).', { user: 'information' } );
			else
				control.editor.print( 'No indirect souvenir found.', { user: 'information' } );

			this.awi.remember( prompt, answer.direct, answer.indirect );
			return this.newAnswer( { directSouvenir: answer.direct, indirectSouvenirs: answer.indirect } );
		}
		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
