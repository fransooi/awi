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
* @file chat.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Chat connector, handle a conversation
*
*/
import ConnectorBase from '../../connector.mjs'
import axios from 'axios'
export { ConnectorChat as Connector }

class ConnectorChat extends ConnectorBase
{
	constructor( awi, options = {} )
	{
		super( awi, options );
		this.name = 'Chat';
		this.token = 'chat';
        this.group = 'edenai';
		this.classname = 'ConnectorChat';
		this.version = '0.5';

		this.cancelled = false;
		this.messageCount = 0;
        this.user = '';
        this.configuration = null;
	}
	async connect( options )
	{
		super.connect( options );
		return this.setConnected( true );
	}
	async send( args, basket, control )
	{
		if ( !this.configuration )
            return this.newError('awi:user-not-connected' );

        var { prompt } = this.awi.getArgs( 'prompt', args, basket, [ '' ] );
        prompt = prompt.trim();
        var data =
        {
            response_as_dict: true,
            attributes_as_list: false,
            show_base_64: false,
            show_original_response: false,
            temperature: this.configuration.temperature,
            max_tokens: this.configuration.max_tokens,
            tool_choice: 'auto',
            providers: this.configuration.providers,
            text: prompt,
            chatbot_global_action: basket.globalAction,
            previous_history: basket.history
        };
        var debug = this.awi.messages.format( `prompt: ~{text}~
model: ~{providers}~
temperature: ~{temperature}~
max_tokens: ~{max_tokens}~`, data );
        control.editor.print( debug.split( '\n' ), { user: 'completion' } );

		if ( !this.configuration )
            return this.newError( 'awi:configuration_not_found' );

        var answer;
        var self = this;
        var options = {
            method: 'POST',
            url: 'https://api.edenai.run/v2/text/chat',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',                    
                authorization: 'Bearer ' + this.configuration.key
            },
            data: data
        };            

        axios.request( options )
            .then( function( response )  
            {
                answer = self.newAnswer( response.data[ data.providers ].generated_text, 'awi:chat-answer' );
            } )
            .catch( function( err ) 
            {                    
                answer = self.newError( err );
            } );

        while( !answer )
            await new Promise( resolve => setTimeout( resolve, 1 ) );
		return answer;
	}

    // Exposed functions
    async setUser( args, basket, control )
    {
        var { userName } = this.awi.getArgs( [ 'userName' ], args, basket, [ '' ] );
        if ( !this.user || userName != this.user )
        {
            var configAnswer = await this.awi.configuration.getToolConfiguration( 'edenai', 'chat' );
            if ( configAnswer.isError() )
            {
                var key = this.config.key;
                key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZjYzY2YzMtOTNmZi00YjYyLWIxNDgtY2FhZWJkNjhkZjIxIiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.Y73ATnBg_mMIZVj78A1Jf5RH-eCXfVPrihgqxSRT0R0';
                if ( !key )
                    return this.newAnswer( 'awi: configuration_not_found' );
                configAnswer = await this.awi.configuration.createToolConfiguration( 'edenai', 'chat', 
                {
                    group: 'edenai',
                    name: 'chat',
                    key: this.config.key, 
                    providers: 'openai/gpt-4o',
                    fallback: '',
                    model: '',
                    temperature: 0.5,
                    max_tokens: 150                                            
                } );
            }
            if ( configAnswer.isError() )
                return configAnswer;

            this.user = userName;
            this.configuration = configAnswer.getValue();
        }
        return this.newAnswer( { chat: { config: this.configuration } } );
    }
}
