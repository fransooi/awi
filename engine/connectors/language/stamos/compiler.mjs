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
* @file compiler.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short STAMOS Compiler 
*
*/
import Utilities from './utilities.mjs'
import Libraries from './libraries.mjs'

export { StamosCompiler as Compiler }

class StamosCompiler
{
	constructor( awi, config = {} )
	{
		this.config = config;
        this.utilities = new Utilities( awi, config );
        this.libraries = new Libraries( awi, config );
        this.tokens = [];
        this.tokensInclude = [];
	}
    async tokenise( sources, options )
    {
        if ( !this.awi.utilities.isArray( sources ) )
            sources = [ sources ];
        try
        {
            for ( var s = 0; s < sources.length; s++ )
            {
                var source = await this.utilities.loadSource( sources[ s ], options );
                if ( !source )
                    break;
                this.tokens.push( this.compileSource( source, [], options ) );
            }   
        }
        catch( error )
        {

        }
    }
    async compileSource( source, tokenList = [], options = {} )
    {
        do
        {
            var word = this.utilities.nextWord( source );
            while( word.value != 'eol' )
            {
                var isStart = true;
                var newInstruction = 1;
                while ( word.type != 'eol' )
                {
                    if ( isStart )
                    {
                        if ( word.type == 'number' )
                            tokenList.push( { name: '' + word.value, type: 'label', value: 0 } );
                        else
                        {
                            var nextWord = this.utilities.peekWord( source );
                            if ( nextWord.value == ':' )
                            {
                                tokenList.push( { name: nextWord.value, type: 'label', value: 0 } );                            
                                this.utilities.skipWord( source );
                            }
                        }
        
                    }
                    else if ( word.value == '?' )
                    {
                        var token = this.libraries.findToken( 'print' );
                        this.addInstruction( tokenList, token );
                    }
                    else if ( word.type == 'tag' )
                    {
                        var token = this.libraries.findTag( word.value );
                        if ( !token )
                        {
                            tokenList.push( { name: 'syntax', type: 'error', value: { path: source.path, position: source.lastPosition } } );
                            break;
                        }
                        this.addTag( tokenList, token );
                    }
                    else if ( word.value == 'include' )
                    {
                        var nextWord = this.utilities.nextWord( source );
                        if ( nextWord.type != 'string' )
                        {
                            tokenList.push( { name: 'syntax', type: 'error', value: { path: source.path, position: source.lastPosition } } );
                            break;
                        }
                        var include = this.includes[ nextWord.value ];
                        if ( !include )
                        {
                            include = this.utilities.loadSource( nextWord.value, options );
                            if ( !include )
                            {
                                tokenList.push( { name: 'cannot_find_source', type: 'error', value: { path: source.path, position: source.lastPosition } } );
                                break;
                            }
                            this.tokensInclude[ include.path ] = await this.tokenise( include, [], options );
                        }
                        break;
                    }
                    else if ( word.value == '//' )
                        break;
                    else if ( word.value == '/*' )
                    {
                        var nextWord = this.utilities.nextWord( source );
                        while ( nextWord.value != '*/' && nextWord.type != 'eol' )
                        {
                            nextWord = this.utilities.nextWord( source );
                            if ( nextWord.type == 'eol' )
                            {
                                if ( this.utilities.nextLine() == null )
                                {
                                    this.tokens.push( { name: 'remark_not_closed', type: 'error',value: { path: source.path, position: source.lastPosition } } );
                                    return tokenList;
                                }
                            }
                        }
                    }
                    else if ( word.type == 'letter' )
                    {
                        if ( word.value.toLowerCase() == 'rem' )
                            break;                        
                        var token = this.libraries.findToken( word.value );
                        if ( token )
                            this.tokens.push( token );
                        else
                        {
                            var nextWord = this.utilities.nextWord( source );
                            if ( nextWord.value == '.')
                            {
                                var words = [ word ];
                                do
                                {
                                    nextWord = this.utilities.nextWord( source );
                                    if ( nextWord.type != 'letter' )
                                    {
                                        this.tokens.push( { name: 'syntax', type: 'error', value: { path: source.path, position: source.lastPosition } } );
                                        break;
                                    }
                                    words.push( word );
                                    nextWord = this.utilities.nextWord( source );
                                } while ( nextWord.value == '.' )
                                word = words[ 0 ];
                                for ( var w = 1; w < words.length; w++ )
                                    word += '.' + words[ w ].value;
                            }
                            else if ( nextWord.value == '=' )
                            {
                                if ( newInstruction == 1 )
                                    this.tokens.push( { name: 'let', type: 'instruction', value: 0 } );
                                else
                                    this.tokens.push( { name: 'syntax', type: 'error', value: { path: source.path, position: source.lastPosition } } );
                            }
                            var type = 'any';
                            if ( word.charAt( word.length - 1 ) == '$' )
                                type = 'string';
                            else if ( word.charAt( word.length - 1 ) == '#' )
                                type = 'float';
                            this.tokens.push( { name: word, type: 'variable', value: type } );
                        }
                    }
                    else if ( word.type == 'operator' || word.type == 'bracket' )
                    {
                        this.tokens.push( { name: word.value, type: word.type, value: 0 } );
                    }
                    else if ( word.value == ':' )
                    {
                        this.tokens.push( { name: ':', type: 'instruction', value: 0 } );
                        newInstruction = 0;
                    }
                    else
                    {
                        this.tokens.push( { name: 'syntax', type: 'error', value: { path: source.path, position: source.lastPosition } } );
                        break;
                    }
                    isStart = false;
                    newInstruction++;
                    ( { type, word } = this.utilities.nextWord( source ) );
                }
            }
        } while( this.utilities.nextLine() != null )
        return tokenList;
    }
}
