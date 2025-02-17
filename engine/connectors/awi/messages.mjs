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
* @file messages.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Load and return system messages
*
*/
import ConnectorBase from '../../connector.mjs'
export { ConnectorMessages as Connector }

class ConnectorMessages extends ConnectorBase
{
	constructor( awi, config )
	{
		super( awi, config );

		this.name = 'Messages';
		this.token = 'messages';
		this.className = 'ConnectorMessages';
        this.group = 'awi';
		this.version = '0.5';
        this.language = typeof config.language == 'undefined' ? 'en' : config.language;

        // Paths
        var self = this;
        if ( typeof config.messagesPath == 'undefined' )
            this.getMessagesPath = function(){ return awi.system.getEnginePath() + '/messages/' + self.language };
        else if ( typeof config.messagesPath == 'string' )
        {
            config.messagesPath = this.awi.system.denormalize( config.messagesPath );
			this.getMessagesPath = function(){ return config.messagesPath + '/' + self.language };
        }
		else
        {
        	this.getMessagesPath = config.messagePath;
        }
	}
	async connect( options )
	{
		super.connect( options );

		// Load texts
		var path = this.getMessagesPath() + '.txt';
		var answer = await this.awi.system.readFile( path, { encoding: 'utf8' } );
        if ( answer.isSuccess() )
        {
            this.messages = answer.data.split( '\r\n' ).join( '\n' );
            this.setConnected( true );
        }
		return this.connectAnswer;
	}
	getMessage( id, variables = null )
	{
        var notFound = false;
        if ( id.indexOf( 'awi:' ) < 0 )
            return this.format( id, variables );

		var start = this.messages.indexOf( id );
        if ( start < 0 )
        {
            notFound = true;
            variables.id = id;
            start = this.messages.indexOf( 'awi:message-not-found' );
        }

        var self = this;
        function getIt( start, end )
        {
            var text = self.messages.substring( start, end - 1 );
            if ( notFound )
                return self.format( text, { message: id } );
            if ( variables )
                return self.format( text, variables );
            return text;
        }
		while ( this.messages.charCodeAt( start ) > 32 )
			start++;
		while ( this.messages.charCodeAt( start ) <= 32 )
			start++;

        var endAwi = this.messages.indexOf( 'awi:', start );
		var endIwa = this.messages.indexOf( ':iwa', start );
        if ( endAwi >= 0 && endIwa >= 0 )
        {
            if ( endAwi< endIwa )
                return getIt( start, endAwi );
            else
                return getIt( start, endIwa );
        }
        else if ( endAwi >= 0 )
            return getIt( start, endAwi - 1 );
        else if ( endIwa >= 0 )
            return getIt( start, endIwa - 1 );

        return getIt( start , this.messages.length );
	}
	format( prompt, variables )
	{
        if ( !variables )
            return prompt;

        var count = 0;
        var start = prompt.lastIndexOf( '~{' );
        while( start >= 0 )
        {
            var end = prompt.indexOf( '}~', start );
            if ( end >= start )
            {
                var key = prompt.substring( start + 2, end );
                var current = variables;
                var dot = key.indexOf( '.' );
                while ( dot >= 0 )
                {
                    var left = key.substring( 0, dot );
                    var key = key.substring( dot + 1 );
                    current = current[ left ];
                    if ( typeof current == 'undefined' )
                        break;
                }
                if ( current && typeof current[ key ] != 'undefined' )
                    prompt = prompt.substring( 0, start ) + variables[ key ] + prompt.substring( end + 2 );
                else
                    prompt = prompt.substring( 0, start ) + 'ERROR! missing: ' + key + '!' + prompt.substring( end + 2 );
            }
            start = prompt.lastIndexOf( '~{' );
            count++;
            if ( count > 100 )
            {
                prompt = 'ERROR! bad format: ' + prompt + '!';
                break;
            }
        }
		return prompt;
	}
    formatBin( number, digits )
    {
        var result = Math.floor( number ).toString( 2 );
        for ( var l = result.length; l < digits; l++ )
            result = '0' + result;
        return result;
    }
    formatHex( number, digits )
    {
        var result = Math.floor( number ).toString( 16 );
        for ( var l = result.length; l < digits; l++ )
            result = '0' + result;
        return result;
    }
    formatFloat( number, fix )
    {
        return this.awi.utilities.floatToString( number, fix );
    }
    formatNumber( number, fix )
    {
        if ( number - Math.floor( number ) != 0 )
            return this.awi.utilities.floatToString( value, fix );
        return '' + number;
    }

    // Exposed functions
	async computeResponse( args, basket, control )
	{
		// Get rid of empty lines.
        var { response } = this.awi.getArgs( [ 'response' ], args, basket, [ '' ] );
		var lines = response.trim().split( '\n' );
		var newResponse = '';
		for ( var l = 0; l < lines.length; l++ )
		{
			lines[ l ] = lines[ l ].trim();
			if ( lines[ l ] )
				newResponse += lines[ l ] + '\n';
		}
		response = newResponse;

		// Remove names at start of prompt.
		var pos;
		var persona = this.awi.configuration.getPersona( 'user' );
		var user = this.awi.configuration.getConfig( 'user' );
		while ( ( pos = response.indexOf( persona.name + ':' ) ) >= 0 )
			response = response.substring( 0, pos ) + response.substring( pos + persona.name.length + 1 ).trim();
		while ( ( response.indexOf( user.name + ':' ) >= 0 ) )
			response = response.substring( 0, pos ) + response.substring( pos + user.name.length + 1 ).trim();

        return this.newAnswer( response );
/*
        // Replace tokens with messages
        var start = text.indexOf( '<awi>' );
        while( start >= 0 )
        {
            var end = text.indexOf( '</awi>', start + 5 );
            if ( end >= 0 )
            {
                var token = text.substring( start + 5, end - ( start + 5 ) );
                var message = this.getMessage( token, basket.variables );
                text = text.substring( 0, start ) + message + text.substring( end + 6 );
            }
        }

        // Replace variables
        text = this.format( text, control.variables );
        text = this.format( text, basket.variables );
*/        
    }
}
