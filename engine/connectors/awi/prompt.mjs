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
*
* ----------------------------------------------------------------------------
* @file prompt.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Handle a prompt in the current editor
*
*/
import ConnectorBase from '../../connector.mjs'
import Branch from '../../branch.mjs'
export { ConnectorPrompt as Connector }

class ConnectorPrompt extends ConnectorBase
{
	constructor( awi, config )
	{
		super( awi, config );
		this.name = 'Prompt';
		this.token = 'prompt';
		this.className = 'ConnectorPrompt';
        this.group = 'awi';
		this.version = '0.5';

		this.playing = false;
		this.viewing = false;
		this.lineActivated = false;
		this.promptOn = false;
		this.noCommand = false;
		this.waitingOn = false;
		this.waitingBubble = false;
		this.animationsOn = false;
		this.connected = false;
		this.datas = { };
		this.options = { awi: {}, bubble: {} };
		this.promptThis = this;
		this.questionCount = 1;
        this.promptOn = 0;
        this.basket = {};
		this.branch = new Branch( this.awi, { parent: 'prompt' } )
	}
    async connect( options )
    {
        super.connect( options );
        return this.setConnected( true );
    }
	async play( promtp, basket, control )
	{
		super.play( prompt, basket, control );
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
	async prompt( args, basket, control )
	{
        control.promptOn = ( typeof control.promptOn == 'undefined' ? 0 : control.promptOn );
		if ( control.promptOn )
            return this.awi.BUSY;
        control.promptOn++;

        var { prompt } = this.awi.getArgs( [ 'prompt' ], args, basket, [ '' ] );
		if ( !this.awi.configuration.isUserLogged() )
		{
			var logged = false;

			// Is it the name of a user?
			var maybe = -1;
			for ( var start = 0; start < prompt.length; start++ )
			{
				if ( this.awi.utilities.getCharacterType( prompt.charAt( start ) ) == 'letter' )
				{
					maybe = start;
					break;
				}
			}
			if ( maybe >= 0 )
			{
				var userName = prompt.substring( maybe ).split( '\n' )[ 0 ].trim();
				if ( userName.toLowerCase() == 'newuser' )
				{
					logged = true;
					prompt = 'awi.welcome()';
				}
				else if ( this.awi.configuration.checkUserConfig( userName ) != null )
				{
					var answer = await this.awi.callConnectors( [ 'setUser', '*', { userName: prompt } ], basket, control );
					if ( answer.isSuccess() )
					{
                        await this.awi.configuration.saveConfigs();
                        control.editor.print( [
                            '<BR>', 
                            'awi:user-changed:iwa', 
                            '------------------------------------------------------------------' ],
                            { user: 'information', userName: basket.configuration.name, newLine: true, prompt: false } );
                        prompt = 'Hello Awi... Could you first say hello to the user ' + userName + ' then invent a funny joke about programming chores?';
                        logged = true;
					}
					if ( !logged )
						control.editor.print( 'Cannot change user to ' + userName + '\n', { user: 'error' } );
				}
			}
			if ( !logged )
			{
				var list = this.awi.configuration.getUserList();
				if ( list.length == 0 )
				{
					prompt = 'awi.welcome()';
				}
				else
				{
					control.editor.print( 'List of registered users on this machine...', { user: 'information' } );
					for ( var l = 0; l < list.length; l++ )
						control.editor.print( '    ' + list[ l ].fullName, { user: 'information' } );
					control.editor.print( 'Please enter the first name of a user, or "newuser"...', { user: 'information' } );
					return this.newAnswer();
				}
			}
		}

        var answer = await this.awi.callConnectors( [ 'preparePrompt', '*', { prompt: prompt } ], basket, control );
        if ( answer.isSuccess() )
        {
            this.branch.addTokens( { command: answer.data.tokens, list: 'up' }, basket, control );
            answer = await this.branch.runTokens( { list: 'up', from: 'last', args: {} }, basket, control );                    
            if ( answer.isSuccess() )            
            {
                answer = await this.awi.callConnectors( [ 'computeResponse', '*', { response: answer.response } ], basket, control );
                if ( answer.isSuccess() )
                {
                    var response = answer.data.response;
					if ( response )
                    	control.editor.print( answer.response.split( '\n' ), { user: 'awi', newLine: true, prompt: false } );
                }
            }    
		}
        control.editor.waitForInput( );
        control.promptOn--;
        return answer;
	}
	async getParameters( argsIn, basket = {}, control = {} )
	{
        var { list, args } = this.awi.getArgs( [ 'list', 'args' ], argsIn, basket, [ [], {} ] );
		control.editor.saveInputs();
        for ( var i = 0; i < list.length; i++ )
        {
            list[ i ] = {
                type: 'bubble',
                group: 'awi',
                token: 'input',
                config: {},
                parameters: { inputInfo: [ { type: 'object', name: 'inputInfo', value: this.awi.utilities.convertPropertiesToParams( list[ i ] ) } ] }
            }
        }
        var data = {};
        var answer = this.branch.initTokenList( [ list, {} ], basket, control );
        if ( answer.isSuccess() )
            answer = await this.branch.run( { list: list, from: 'start', args: {} }, data, control );
		control.editor.restoreInputs();
        return answer;
	}
	escape( force )
	{
		if ( !force )
		{
			if ( this.working )
				return;
		}
		if ( this.chain.getLength() > 0 )
		{
			// Prevent re-interpretation of the last command
			var self = this;
			if ( this.handleNoCommand )
			{
				clearInterval( self.handleNoCommand );
				this.handleNoCommand = null;
			}
			this.noCommand = true;
			this.handleNoCommand = setTimeout( function()
			{
				self.noCommand = false;
				self.handleNoCommand = null;
			}, 500 );

			// Revert to checkpoint
			var bubble = this.chain.pop();
			if ( this.chain.length == 0 )
			{
				this.promptOn = false;
			}
		}
	}
	destroy()
	{
		this.destroyEventHandlers( this );
	}
};
