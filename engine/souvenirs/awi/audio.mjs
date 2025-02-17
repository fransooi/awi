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
* @file souvenir-audio.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Audio souvenir
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirAudio as Bubble }

class SouvenirAudio extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirAudio',
            token: 'audio',
            group: 'awi',
            name: 'Audio',
            version: '0.5',
            
            action: "remembers one audio file and it's content",
            inputs: [
                { prompt: 'what to find in the audio', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to look for', type: 'string', optional: true, default: 'any' } ],
            outputs: [ { audioInfo: 'information about the audio file', type: 'object.audioInfo' } ],
            tags: [ 'souvenir', 'audio' ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		return await this[ control.memory.command ]( args, basket, control );
	}
	async getContent( args, basket, control )
	{
		control.editor.print( 'Text: ' + this.text, { user: 'memory3' } );
		control.editor.print( 'Start: ' + this.start.text + ', end: ' + this.end.text, { user: 'memory3' } );
		control.editor.print( '---------------------------------------------', { user: 'memory3' } );
		return this.newAnswer( this.parameters, 'data' );
	}
	async extractContent( args, basket, control )
	{
		var info = this.awi.utilities.compareTwoStrings( this.parameters.text, prompt, control );
		if ( info.result > 0 )
		{
			var content = await this.getContent( args, basket, control );
			return this.newAnswer( { result: info.result, match: info, content: content.basket.audioInfo }, 'data' );
		}
		return this.newError( 'awi:not-found' );
	}
	async findSouvenirs( args, basket, control )
	{
		var info = this.awi.utilities.matchTwoStrings( this.parameters.text, prompt, control );
		if ( info.result > 0 )
			return await this.getContent( args, basket, control );
		return this.newError( 'awi:not-found' );
	}
}
