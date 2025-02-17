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
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file structures.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short STAMOS Structure instructions
*
*/

export { StamosStructures as Structures }

class StamosStructures
{
	constructor( awi, config = {} )
	{
        this.awi = awi;
		this.config = config;
        this.tokens = [];
	}

    _for( source )
    {
        var self = this;
        function pass1()
        {
            this.compiler.addInstruction( source, { name: 'V0' } )
        }
        function pass2()
        {

        }
        this.tokens.push( { name: 'for', pass1: pass1, pass2: pass2, parameters: [ 'V0' ] } )
    }
}