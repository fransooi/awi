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
* @file javascript.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Time Gregorian calendar utilities.
*
*/
import ConnectorBase from '../../connector.mjs'
export { ConnectorJavascript as Connector }

class ConnectorJavascript extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Javascript';
		this.token = 'language';
		this.className = 'ConnectorJavascript';
        this.group = 'language';
		this.version = '0.5';
	}
	async connect( options )
	{
		super.connect( options );
        return this.setConnected( true );
	}
    async tokenisePrompt( args, basket, control )
    {
        var { prompt, tokens } = this.awi.getArgs( [ 'prompt', 'tokens' ], args, basket, [ '', [] ] );        
        if ( prompt )
            return this.tokeniseExpression( { prompt: prompt, tokens: tokens, position: 0 } );
        return this.newError( 'awi:nothing-to-prompt' );
    }
    tokeniseExpression( info )
    {
        var skip = false;
        var testPosition;
        var description = '';
        while( !info.eol )
        {
            this.awi.utilities.skipSpaces( info );
            var start = info.position;
            this.awi.utilities.extractNextParameter( info, [ '(', ')', '.', '+', '-', '*', '/' ] );
            if ( info.eol )
                break;
            if ( info.type == 'word' && info.delimiter == '.' )
            {
                skip = true;
                testPosition = info.position;
                var group = info.value;
                this.awi.utilities.extractNextParameter( info, [ '(' ] );
                if ( info.eol )
                    break;
                if ( this.awi.bubbleGroups[ group ] && info.delimiter == '(' )
                {
                    var bubble = this.awi.bubbleGroups[ group ][ info.value ];
                    if ( bubble )
                    {
                        skip = true;
                        var token = {
                            type: 'bubble',
                            token: info.value,
                            group: group,
                            config: {},
                            parameters: {}
                        }
                        var count = 1;
                        var param = 0;
                        var inputs = bubble.properties.inputs;
                        do
                        {
                            var infoBracket = this.awi.utilities.copyObject( info );
                            this.awi.utilities.extractNextParameter( infoBracket, [ '(', ')', ',' ] );
                            while( !infoBracket.eol )
                            {
                                if ( infoBracket.delimiter == '(' )
                                    count++;
                                else if ( infoBracket.delimiter == ')' )
                                {
                                    count--;
                                    if ( count == 0 )
                                        break;
                                }
                                else if ( infoBracket.delimiter == ',' )
                                    break;
                                this.awi.utilities.extractNextParameter( infoBracket, [ '(', ')', ',' ] );
                            }
                            if ( !infoBracket.eol )
                            {
                                var tokens = [];
                                this.tokeniseExpression( { prompt: info.prompt.substring( info.position, infoBracket.position ), position: 0, tokens: tokens, bracketCount: 1 } );
                                if ( param < inputs.length && tokens.length > 0 )
                                {
                                    command.parameters[ inputs[ param ].name ] = tokens;
                                    param++;
                                }
                                info.position = infoBracket.position;
                            }
                            if ( count == 0 )
                                break;
                        } while( !info.eol )
                        info.tokens.push( token );
                        info.prompt = info.prompt.substring( 0, start ) + info.prompt.substring( info.position );
                        info.position = start;
                    }
                }
            }
            if ( skip )
            {
                skip = false;
                info.position = testPosition;
                continue;
            }
            var toCut = -1;
            if ( info.type == 'int' || info.type == 'float' || info.type == 'string' )
            {
                info.tokens.push( { type: info.type, default: info.value } );
                toCut = info.position;
            }
            if ( info.type == 'word' && info.bracketCount > 0 )
            {
                if ( info.tokens.length > 0 && info.tokens[ info.tokens.length - 1 ].type == 'string' )
                    info.tokens[ info.tokens.length - 1 ].value += ( info.value + ' ' );
                else
                    info.tokens.push( { type: 'string', value: info.value + ' ' } );
                toCut = info.position;
            }
            switch ( info.delimiter )
            {
                case '(':
                    var count = 1;
                    var start = info.position;
                    this.awi.utilities.extractNextParameter( info, [ '(', ')' ] );
                    while( !info.eol )
                    {
                        if ( info.delimiter == '(' )
                            count++;
                        else if ( info.delimiter == ')' )
                        {
                            count--;
                            if ( count == 0 )
                                break;
                        }
                        this.awi.utilities.extractNextParameter( info, [ '(', ')' ] );
                    }
                    var tokens = [];
                    var text = info.prompt.substring( start, info.position );
                    info.tokens.push( { type: 'open', tokens: tokens } );
                    this.tokeniseExpression( { prompt: text, position: 0, tokens: tokens } );
                    toCut = info.position;
                    break;
                case '+':
                    info.tokens.push( { type: 'plus' } );
                    toCut = info.position;
                    break;
                case '-':
                    info.tokens.push( { type: 'minus' } );
                    toCut = info.position;
                    break;
                case '*':
                    info.tokens.push( { type: 'mult' } );
                    toCut = info.position;
                    break;
                case '/':
                    info.tokens.push( { type: 'div' } );
                    toCut = info.position;
                    break;
                case '=':
                    info.tokens.push( { type: 'equal' } );
                    toCut = info.position;
                    break;
                case ')':
                    info.bracketCount--;
                    toCut = info.position;
                    if ( info.bracketCount == 0 )
                    { 
                        info.eol = true;
                        break;
                    }
                    error = 'syntax';
                    break;
                default:
                    break;
            }
            if ( toCut >= 0 )
            {
                info.prompt = info.prompt.substring( 0, start ) + info.prompt.substring( toCut );
                info.position = start;
                toCut = -1;
            }
        }
        // Remainder of the prompt as Chat bubble
        if ( info.prompt.length > 0 )
        {
            info.tokens.push( {
                type: 'bubble',
                token: 'chat',
                group: 'awi',
                config: {},
                parameters: {
                    'question': [ { 
                        type: 'string', default: info.prompt 
                    } ]
                }
            } );
        }
        return this.newAnswer( {
            prompt: info.prompt, tokens: info.tokens }, 
            'object', 
            'awi:answer' );
    }
}
