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
* @file commandline.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Command line editor interface
*
*/
import EditorBase from './editorbase.mjs';
import ReadLine from 'readline';
export { EditorCommandLine as Editor }

class EditorCommandLine extends EditorBase
{
	constructor( awi, config = {} )
	{
        super( awi, config );
		this.className = 'EditorCmd';
		this.noInput = 0;
        this.lastLine = '';
        this.inputEnabled = true;
        this.reroute = undefined;
        this.basket = {};

		this.readLine = ReadLine.createInterface(
		{
			input: process.stdin,
			output: process.stdout,
		} );
		
		var self = this;
		this.readLine.on( 'line', async function( prompt )
		{
			if ( self.noInput == 0 )
			{
                // Remove start of line...
                for ( var p = 0; p < self.lastLine.length; p++ )
                {
                    var c = self.lastLine.charAt( p );
                    if ( prompt.charAt( 0 ) == c )
                        prompt = prompt.substring( 1 );
                }
                self.lastLine = '';
                self.lastPrompt = false;
                prompt = prompt.trim();
                var basket = self.awi.configuration.getBasket( 'user' );
                if ( !basket )
                    basket = self.basket;
                
                if ( prompt != '' )
                {
                    var answer;
                    if ( self.reroute )
                        answer = await self.reroute( { prompt: prompt }, basket, { editor: self } );
                    else
                        answer = await self.awi.prompt.prompt( [ prompt ], basket, { editor: self } );
                    self.awi.configuration.setBasket( 'user', answer.getValue() );
                }
			}
		} );
        this.readLine.prompt( true );
	}
	waitForInput(  options = {} )
	{
        super.waitForInput( options );
        if ( this.prompt )
        {
            this.lastLine = this.prompt;
            this.lastPrompt = true;
            this.readLine.write( this.lastLine );
        }
	}
	close()
	{
		this.readLine.close();
	}
	print( text, options = {} )
	{
        if ( !super.print( text, options ) )
            return false;

        this.noInput++;
		for ( var l = 0; l < this.toPrint.length; l++ )
            this.readLine.write( this.toPrint[ l ] );
        this.noInput--;
        this.toPrint = [];
        this.toPrintClean = [];        
        return true;
	}
    saveInputs()
    {}
    restoreInputs()
    {}
}
