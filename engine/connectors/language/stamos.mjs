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
* @file stamos.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short STAMOS Compiler / Code generator
*
*/
import ConnectorBase from '../../connector.mjs'
import Compiler from './stamos/compiler.mjs'
export { ConnectorStamos as Connector }

class ConnectorStamos extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Stamos';
		this.token = 'language';
		this.className = 'ConnectorStamos';
        this.group = 'language';
		this.version = '0.5';
	}
	async connect( options )
	{
		super.connect( options );
        this.compiler = new Compiler( awi, this.config );
        return this.setConnected( true );
	}
    async tokenisePrompt( args, basket, control )
    {
        var { prompt, list } = this.awi.getArgs( [ 'prompt', 'list' ], args, basket, [ '', [] ] );
        var answer = { prompt: prompt, list: list };
        if ( prompt )
        {
            var expression = await this.getExpression( { prompt: prompt, position: 0, tokens: list } );
            if ( expression.isSuccess() )
                return this.newAnswer( { prompt: info.prompt, list: info.tokens } );
        }
        return this.newError( 'awi:nothing-to-prompt');
    }
    async compile( args, basket, control )
    {
        var { sources, options } = this.awi.getArgs( [ 'sources', 'options' ], args, basket, [ [], {} ] );
        var result = await this.compiler.compile( sources, options );
        return this.newAnswer( result );
    }
}
