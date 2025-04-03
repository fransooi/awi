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
* @file deported.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Deported editor connector: makes the link with any editor
*
*/
import ConnectorBase from '../../connector.mjs'
import { Editor as EditorCommandLine } from './editorcommandline.mjs';
import { Editor as EditorWebSocket } from './editorwebsocket.mjs';
export { ConnectorEditor as Connector }

class ConnectorEditor extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Editor';
		this.token = 'editor';
		this.className = 'ConnectorEditor';
        this.group = 'editor';
		this.version = '0.5';
		this.editors = {};
        this.current = null;    
	}
	async connect( options )
	{
		super.connect( options );
        if ( options.default )
            this.addEditor( options.default, options.config );
        return this.setConnected( true );
	}
	addEditor( editor, config = {} )
	{
        var handleName = 'editor';
        if ( typeof editor == 'string' )
        {
            handleName = editor;
            config.parent = this;
            editor = editor.toLowerCase();
            if ( editor == 'commandline' )
                editor = new EditorCommandLine( this.awi, config );
            else if ( editor == 'websocket' )
                editor = new EditorWebSocket( this.awi, config );
        }
        if ( !editor )
            return;
    
        var handle = this.awi.utilities.getUniqueIdentifier( this.editors, handleName, 0 );
        editor.handle = handle;
        this.editors[ handle ] = editor;
        this.current = editor;		
        if ( config.connect )
            editor.connect(config.connectConfig || {});
		return this.newAnswer( { editor: editor, handle: handle } );
	}
    getEditor( handle )
    {
        return this.editors[ handle ];
    }
	close( editor )
	{
        if ( typeof editor == 'string' )
            editor = this.editors[ editor ];
        if ( !editor )
            return;

        editor.close();
        var newEditors = {};
        for ( var e in this.editors )
        {
            if ( this.editors[ e ] != editor )
                newEditors[ e ] = this.editors[ e ];
        }
        this.editors = newEditors;
        if ( this.current == editor )
            this.current = null;
	}

    // Exposed functions
    async print( args, control )
    {
        var text = this.awi.utilities.isObject( args ) ? args.text : args;
        if ( this.current )
            await this.current.print( text, control );
        else
            console.error( 'No current editor to print: ' + text );
    }
    async setUser( args, basket, control )
    {
        var { userName } = this.awi.getArgs( [ 'userName' ], args, basket, [ '' ] );
        var editor = typeof control.editor != 'undefined' ? control.editor : this.current;
        editor.setPrompt( '.(' + userName + ') ' );
        return this.newAnswer();
    }
    setPrompt( prompt )
    {
        if ( this.current )
            this.current.setPrompt( prompt );
        else
            console.error( 'No current editor to set prompt: ' + prompt );
    }
    rerouteInput( route )
    {
        if ( this.current )
            this.current.rerouteInput( route );
        else
            console.error( 'No current editor to reroute input: ' + route );
    }
    saveInputs()
    {}
    restoreInputs()
    {}
    disableInput( )
    {
        if ( this.current )
            this.current.disableInput();
        else
            console.error( 'No current editor to disable input' );
    }
    saveInputs()
    {
        if ( this.current && this.current.saveInputs)
            this.current.saveInputs();
        else
            console.error( 'No current editor to save inputs' );
    }
    restoreInputs( editor )
    {
        if ( this.current && this.current.restoreInputs)
            this.current.restoreInputs( editor );
        else
            console.error( 'No current editor to restore inputs' );
    }
    waitForInput( options = {} )
    {
        if ( this.current )
            this.current.waitForInput( options );
        else
            console.error( 'No current editor to wait for input' );
    }
}
