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
* @file editorbase.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Root class of Editors
*
*/
import Base from '../../base.mjs';
export default class EditorBase extends Base
{
	constructor( awi, config )
	{
        super( awi, config );
		this.version = '0.5';
		this.className = 'EditorBase';
        this.group = 'editor';
        this.inputEnabled = 0;
        this.lastLine = '';
        this.lastPrompt = false;
        this.prompt = '';
		this.toPrint = [];
		this.toPrintClean = [];
		this.toReply = {};
	}
    replyError( error, message )
    {
        if ( message )
            this.reply( { error: error.getPrint() }, message );
        return error;
    }
    replySuccess( answer, message )
    {
        if ( message )
            this.reply( answer.data, message );
        return answer;
    }
    connect( options = {} )
	{
	}
	rerouteInput( route )
	{
		this.reroute = route;
	}
	disableInput()
	{
		this.inputEnabled = false;
	}
	setPrompt( prompt )
	{
        this.prompt = prompt;
	}
	waitForInput(  options = {} )
	{
		this.inputEnabled = true;
	}
	close()
	{
	}
	wait( onOff, options = {} )
	{
		this.waitingOn = onOff;
	}
	print( text, options = {} )
	{
		options.user = typeof options.user == 'undefined' ? 'awi' : options.user;
		var prompt = this.awi.configuration.getPrompt( options.user );
		if ( !prompt )
			return false;

        var pos;
        var lines = text;
        if ( typeof lines == 'string' )            
            lines = text.split( '\n' );
        text = [];
		for ( var l = 0; l < lines.length; l++ )
        {
            if ( lines[ l ] )
            {
                if ( ( pos = lines[ l ].indexOf( 'awi:' ) ) >= 0 )
                {
                    while( pos >= 0 )
                    {
                        var iwa = lines[ l ].indexOf( ':iwa', pos );
                        if ( iwa < 0 )
                            iwa = lines[ l ].length;
                        lines[ l ] = lines [ l ].substring( 0, pos ) + this.awi.messages.getMessage( lines[ l ].substring( pos, iwa ), options ) + lines[ l ].substring( iwa + 4 );
                        pos = lines[ l ].indexOf( 'awi:' );
                    }
                }

                if ( ( pos = lines[ l ].indexOf( '<BR>' ) ) >= 0 )
                {
                    while( pos >= 0 )
                    {
                        text.push( lines[ l ].substring( 0, pos ) );
                        if ( pos > 0 )
                            lines[ l ] = lines[ l ].substring( pos );
                        else
                            lines[ l ] = lines[ l ].substring( pos + 4 );
                        pos = lines[ l ].indexOf( '<BR>' );
                    }
                }
                else
                {
                    text.push( lines[ l ] );
                }
            }
        }
        var justify = this.awi.configuration.getConfigValue( 'user', 'justify', 80 );
        if ( justify >= 0 )
            text = this.awi.utilities.justifyText( text, 80 );

        var newLine = typeof options.newLine == 'undefined' ? true : options.newLine;        
        var showPrompt = typeof options.prompt == 'undefined' ? false : options.prompt;        
		for ( var t = 0; t < text.length; t++ )
		{
            if ( t == 0 && this.lastPrompt )
                this.lastLine = text[ t ] + ( t == text.length - 1 ? ( newLine ? '\n' : '' ) : '\n' );
            else
                this.lastLine = prompt + text[ t ] + ( t == text.length - 1 ? ( newLine ? '\n' : '' ) : '\n' );
            this.toPrint.push( this.lastLine );
            this.toPrintClean.push( text[ t ] );            
		}
        this.lastPrompt = false;
        if ( newLine )
        {
            this.lastLine = '';
            if ( showPrompt )
            {
                this.lastLine = prompt;
                if ( typeof showPrompt == 'string' )
                    this.lastLine = showPrompt;                
                this.lastPrompt = true;
            }
			if ( options.space )
				this.lastLine += ' ';
			this.toPrint.push( this.lastLine );
        }
		else {
            if ( options.space )
                this.lastLine += ' ';
        }
        return true;
	}

}
