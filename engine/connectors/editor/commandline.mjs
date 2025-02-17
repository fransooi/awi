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
* @file commandline.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Simple CLI Editor Connector
*
*/
import ConnectorBase from '../../connector.mjs'
import ReadLine from 'readline';
export { ConnectorCommandLine as Connector }

class ConnectorCommandLine extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Node Command-Line';
		this.token = 'editor';
		this.className = 'EditorNodeCommandLine';
        this.group = 'editor';
		this.version = '0.5';
		this.noInput = 0;
		this.editors = {};
        this.lastLine = '';
	}
	async connect( options )
	{
		super.connect( options );
		this.default = this.addEditor();
        this.connected = true;
        return this.setConnected( true );
	}
	addEditor()
	{
		var handle = this.awi.utilities.getUniqueIdentifier( this.editors, 'cmd', 0 );
		var editor = new EditorCommandLine( this.awi, { handle: handle } );
        this.editors[ handle ] = editor;
        this.current = editor;		
		return editor;
	}
	close( editor )
	{
        var newEditors = {};
        for ( var e in this.editors )
        {
            if ( this.editors[ e ] == editor )
                editor.close();
            else
                newEditors[ e ] = this.editors[ e ];
        }
        this.editors = newEditors
	}

    // Exposed functions
    async print( args, basket, control )
    {
        if ( !this.awi.utilities.isObject( args ) )
            this.current.print( args, control )
        else
            this.current.print( args.text, control )
    }
    async setUser( args, basket, control )
    {
        var { userName } = this.awi.getArgs( [ 'userName' ], args, basket, [ '' ] );
        var editor = typeof control.editor != 'undefined' ? control.editor : this.current;
        editor.setPrompt( '.(' + userName + ') ' );
        return this.newAnswer();
    }
}

class EditorCommandLine
{
	constructor( awi, config = {} )
	{
        this.awi = awi;
		this.className = 'EditorCmd';
		this.noInput = 0;
        this.lastLine = '';
        this.handle = config.handle;
        this.inputEnabled = true;
        this.reroute = undefined;
        this.basket = {};

		this.readLine = ReadLine.createInterface(
		{
			input: process.stdin,
			output: process.stdout,
		} );
		
		var self = this;
		this.readLine.on( 'line', async function( prompt )
		{
			if ( self.noInput == 0 )
			{
                // Remove start of line...
                for ( var p = 0; p < self.lastLine.length; p++ )
                {
                    var c = self.lastLine.charAt( p );
                    if ( prompt.charAt( 0 ) == c )
                        prompt = prompt.substring( 1 );
                }
                self.lastLine = '';
                self.lastPrompt = false;
                prompt = prompt.trim();
                var basket = self.awi.configuration.getBasket( 'user' );
                if ( !basket )
                    basket = self.basket;
                
                if ( prompt != '' )
                {
                    if ( this.reroute )
                        answer = await self.reroute( { prompt: prompt }, basket, { editor: self } );
                    else
                        answer = await self.awi.prompt.prompt( [ prompt ], basket, { editor: self } );
                    self.awi.configuration.setBasket( 'user', answer.getValue() );
                }
			}
		} );
        this.readLine.prompt( true );
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
        if ( this.prompt )
        {
            this.lastLine = this.prompt;
            this.lastPrompt = true;
            this.readLine.write( this.lastLine );
        }
	}
	saveInputs()
	{
		this.pushedInputs = this.inputDisabled;
		this.inputDisabled = 1;
	}
	restoreInputs()
	{
		this.inputDisabled = this.inputDisabled;
	}
	close()
	{
		if ( this.handleNoInput )
			clearInterval( this.handleNoInput );
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
			return;

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
            this.noInput++;
            if ( t == 0 && this.lastPrompt )
                this.lastLine = text[ t ] + ( t == text.length - 1 ? ( newLine ? '\n' : '' ) : '\n' );
            else
                this.lastLine = prompt + text[ t ] + ( t == text.length - 1 ? ( newLine ? '\n' : '' ) : '\n' );
            this.readLine.write( this.lastLine );
		}
        this.lastPrompt = false;
        if ( newLine )
        {
            this.noInput++;
            this.lastLine = '';
            if ( showPrompt )
            {
                this.lastLine = prompt;
                if ( typeof showPrompt == 'string' )
                    this.lastLine = showPrompt;                
                this.lastPrompt = true;
            }
            this.readLine.write( this.lastLine );
        }
        if ( options.space )
        {   
            this.lastLine += ' ';
            this.readLine.write( ' ' );
        }

        this.noInput = 0;
        return this.lastLine;
	}
}