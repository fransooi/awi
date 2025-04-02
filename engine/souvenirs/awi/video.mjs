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
* @file souvenir-video.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Video souvenir
*
*/
import SouvenirBase from '../../souvenir.mjs'
export { SouvenirVideo as Bubble }

class SouvenirVideo extends SouvenirBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            className: 'SouvenirVideo',
            token: 'souvenir',
            group: 'awi',
            name: 'Souvenir',
            version: '0.5',
            
            action: "remembers one photo and it's content",
            inputs: [
                { prompt: 'what to find in the video', type: 'string', optional: false, default: '' },
                { from: 'the kind of things to find', type: 'string', optional: true, default: 'any' } ],
            tags: [ 'souvenir', 'image' ]
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
			var content = await this.getContent( parameters, basket, control );
			return { success: 'found', basket: { result: info.result, match: info, content: content.basket.videoInfo } };
		}
		return this.newError( 'awi:not-found' );
	}
	async getContent( args, basket, control )
	{
		control.editor.print( 'Start: ' + this.parameters.start.text + ', end: ' + this.parameters.end.text, { user: 'memory3' } );
		control.editor.print( '------------------------------------------------------------', { user: 'memory3' } );
		return this.newAnswer( this.parameters );
	}
	async findSouvenirs( args, basket, control )
	{
		var info = this.awi.utilities.matchTwoStrings( this.parameters.text, prompt, control );
		if ( info.result > 0 )
			return await this.getContent( args, basket, control );
		return this.newError( 'awi:not-found' );
	}
}
