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
* @file branch.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short A tree of bubbles that works as a bubble: a branch.
*
*/
import BubbleBase from './bubble.mjs'

export default class BranchBase extends BubbleBase
{
	constructor( awi, config, data )
	{
		config.errorClass = typeof config.errorClass ? config.errorClass : 'bubbles';
		super( awi, config, data );

		this.bubbleMap = {};
		this.className = 'BranchBase';
        this.name = 'branch Base';
		this.currentBubble = '';
		this.initialized = false;
        this.tokenLists = { up: [], down: [] };
        this.tokenLast = { up: 0, down: 0 };
        this.tokenPosition = { up: 0, down: 0 };
        this.tokenLength = { up: 0, down: 0 };
	}
	reset()
	{
		super.reset();
        this.initTokenList( 'up' );
        this.initTokenList( 'down' );
        this.initialized = true;
	}
	async play( argsIn = [], basket = {}, control = {} )
	{
        var { command, args } = this.awi.getArgs( [ 'command', 'args' ], argsIn, basket, [ '', [] ] );
		if ( command == 'run' || !this.initialized )
			this.reset();
        return await this.run( { list: 'up', from: 'start', args: args }, basket, control );
	}
	async playback( args, basket, control )
	{
	}


    newBubble( command, options = {} )
	{
		var parent = command.parent ? command.parent : this.currentBubble;
		var parentClass = ( typeof command.parentClass == 'undefined' ? 'bubbles' : command.parentClass );
		var parameters = command.parameters ? command.parameters : {};
		parent = options.parent ? options.parent : parent;
		parentClass = ( typeof options.parentClass == 'undefined' ? parentClass : options.parentClass );
		parameters = ( typeof options.parameters == 'undefined' ? parameters : options.parameters );
		var group =  ( typeof command.group == 'undefined' ? 'awi' : command.group );
		var exits =  ( typeof command.exits == 'undefined' ? { success: 'end' } : command.exits );
		var key = ( command.key ? command.key : this.awi.utilities.getUniqueIdentifier( this.bubbleMap, group + '_' + command.token, this.keyCount++ ) );
		return new this.awi.classes[ parentClass ][ group ][ command.token ].Bubble( this.awi, { key: key, branch: this, parent: parent, exits: exits, config: command.config, parameters: parameters } );
	}
	addTokens( argsIn, basket, control = {} )
	{
        var { tokens, list, position } = this.awi.getArgs( [ 'tokens', 'list', 'position' ], argsIn, basket, [ '{}', 'up', 0 ] );
        this.initTokens( [ tokens, {} ], basket, control );
        this.tokenLast[ list ] = this.tokenLists[ list ].length;
        this.tokenLists[ list ] = this.tokenLists[ list ].concat( tokens );
        this.tokenLength[ list ] = this.tokenLists[ list ].length;
	}
	initTokens( argsIn, basket, control )
	{
        var { tokens, args } = this.awi.getArgs( [ 'tokens', 'args' ], argsIn, basket, [ 'root', {} ] );
        if ( typeof tokens == 'string' )
            tokens = this.tokenLists[ tokens ];
		for ( var n = 0; n < tokens.length; n++ )
		{
            var token = tokens[ n ];
            switch( token.type )
            {
                case 'bubble':
                    token.bubble = this.newBubble( token, { parent: token } );
                    for ( var p in token.parameters )
                        this.initTokens( [ token.parameters[ p ], args ], basket, control );
                    break;
                case 'open':
                    this.initTokens( [ token.tokens, args ], basket, control );
                    break;
                case 'int':
                case 'float':
                case 'number':
                case 'string':
                    token.value = token.default;
                    break;
                case 'object':
                    break;
            }
		}
        return this.newAnswer();
	}
    async runTokens( argsIn, basket, control )
    {
        var answer = await this.getExpression( argsIn, basket, control );
        if ( answer.isError() )
            control.editor.print( answer.getPrint(), { user: 'awi' } );
        else if ( control.promptOn > 0 )
        {
            var text = answer.getPrint();
            if ( text )
                control.editor.print( text, { user: 'awi' } );
        }            
        return answer;
    }
    async getExpression( argsIn, basket, control )
    {
        var self = this;
        var error;
        async function getValue( token )
        {
            switch( token.type )
            {
                case 'bubble':
                    var argsOut = {};
                    for ( var p in token.parameters )
                        argsOut[ p ] = await self.getExpression( [ token.parameters[ p ], '', args ], basket, control );
                    var answer = await token.bubble.play( argsOut, basket, control );
                    if ( answer.isError() )
                        return answer;
                    if ( token.bubble.properties.outputs.length > 0 ) 
                    {
                        var value = answer.getValue();
                        control.editor.print( [ "Bubble returned: " + value ], { user: 'bubble' } );
                        basket[ token.bubble.properties.outputs[ 0 ].name ] = value;
                        args[ token.bubble.properties.outputs[ 0 ].name ] = value;
                        return answer;
                    }
                case 'open':
                    return await self.getExpression( [ token.tokens, args ], basket, control );
                case 'int':
                case 'float':
                case 'string':
                case 'number':
                case 'object':
                    return self.newAnswer( token.value );
                case 'operator':
                    return self.newAnswer( token.value, '', 'operator' );

                default:
                    break;
            }
            return null;
        }

        var { tokens, args } = this.awi.getArgs( [ 'tokens', 'args' ], argsIn, basket, [ [], {} ] );
        var position = 0;
        var quit = false;
        var operand, operator;
        var result = { type: 'undefined', data: 0 };
        if ( position < tokens.length )
        {
            var result = await getValue( tokens[ position++ ] );
            if ( result.isError() )
                return result;
            while( position < tokens.length && !quit )
            {
                operator = await getValue( tokens[ position++ ] );
                if ( operator.type != 'operator' || operator.data == 'comma' )
                    break;
                if ( position >= tokens.length )
                    break;
                operand = await getValue( tokens[ position++ ] );
                if ( operand.type == 'error')
                    return operand;
                switch ( operator.result )        
                {
                    case 'plus':
                        result.data += operand.data;
                        if ( operand.type == 'string' )
                            result.type = 'string'
                        break;
                    case 'minus':
                        result.data -= operand.data;
                        break;
                    case 'mult':
                        result.data *= operand.data;
                        break;
                    case 'div':
                        result.data /= operand.data;
                        break;
                    default:
                        quit = true;
                        break;
                }
            } 
        }
        return result;
    }

    // Bubble tree handling
    findBubbleFromToken( token )
    {
        for ( var b in this.bubbleMap )
        {
            if ( this.bubbleMap[ b ].token == token )
                return this.bubbleMap[ b ];
        }
    }
	getBubble( key )
	{
		return this.bubbleMap[ key ];
	}
	getNumberOfBubbles()
	{
		var count = 0;
		for ( var b in this.bubbleMap )
			count++;
		return count - 1;
	}
	getLastBubble( exit )
	{
		exit = ( typeof exit == 'undefined' ? 'success' : exit );

		var found;
		var bubble = this.getBubbleFromToken( 'root' );
		while ( bubble )
		{
			found = bubble;
			bubble = this.getBubble( bubble.properties.exits[ exit ] );
		}
		return found;
	}
	deleteBubble( key )
	{
		if ( this.bubbleMap[ key ] )
		{
			var newBubbleMap = {};
			for ( var b in this.bubbleMap )
			{
				if ( b != key) 
					newBubbleMap[ b ] = this.bubbleMap[ b ];
			}
			this.bubbleMap = newBubbleMap;
			return;
		}
		this.awi.systemWarning( 'Bubble not found!' )
	}
	findBubble( callback )
	{
		for ( var key in this.bubbleMap )
		{
			if ( callback( this.bubbleMap[ key ] ) )
			{
				return this.bubbleMap[ key ];
			}
		}
		return null;
	}
	getBubbleChain( whereFrom, distance, howMany, exit )
	{
		exit = ( typeof exit == 'undefined' ? 'success' : exit );

		var bubble;
		var result = [];
		if ( whereFrom == 'end' )
		{
			bubble = this.getLastBubble( exit );
			while( bubble && distance > 0 )
			{
				bubble = this.getBubble( bubble.parent );
				distance--;
			}
			while( bubble && howMany > 0 )
			{
				result.push( bubble );
				bubble = this.getBubble( bubble.parent );
				howMany--;
			}
		}
		else
		{
			bubble = this.getBubble( 'root' );
			while( bubble && distance > 0 )
			{
				bubble = this.getBubble( bubble.properties.exits[ exit ] );
				distance--;
			}
			while( bubble && howMany > 0 )
			{
				result.push( bubble );
				bubble = this.getBubble( bubble.properties.exits[ exit ] );
				howMany--;
			}
		}
		return result;
	}
}
