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
* @file base.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Root class of Connectors, Bubbles, Branches, Memories and Souvenirs.
*
*/
import Answer from './answer.mjs'
export default class Base
{
	constructor( awi, config, data )
	{
		this.awi = awi;
		this.config = config;
		this.version = '***UNDEFINED***';
		this.className = '***UNDEFINED***';
        this.group = '***UNDEFINED***';
	}
    newAnswer( value = 0, type, toPrint )
    {
        return new Answer( this, value, type, toPrint );
    }
    newError( error = 'awi:error', value, type )
    {
        var answer = new Answer( this, value, type, 'awi:error-base' );
        answer.setError( error );
        return answer;
    }
}
