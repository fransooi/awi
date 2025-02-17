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
* @file awi.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Main class
*/
import Base from './base.mjs'

export default class Awi extends Base
{
	constructor( parent, config )
	{
        super( null, config );

		this.className = 'Awi';
		this.version = '0.5';

		this.host = config.host;
		this.user = config.user;
		this.connectors = {};
		this.bubbles = {};
		this.souvenirs = {};
		this.memories = {};
        
        this.classes =
        {
            connectors: {},
            bubbles: {},
            souvenirs: {},
            memories: {}
        }
		this.directRemembering = [];
		this.indirectRemembering = [];
	}
	async connect( options = {} )
	{
		var self = this;
		var idCheck = {};
        var count = 0;

        async function createElements( type, group,  name, config = {}, options = {} )
        {
            if ( type == 'connectors' )
                await createConnector( group, name, config, options );
            else
                await createBubbles( type, group, name, config, options );
        }
		async function createBubbles( type, group, name, config = {}, options = {} )
		{
            if ( !self[ type ][ group ] )
            {
                self.classes[ type ][ group ] = {};
                //await createBubble( type, group, 'error', element.config, element.options );
                //await createBubble( type, group, 'root', element.config, element.options );
            }

            // A filter?
            if ( name.indexOf( '*' ) >= 0 || name.indexOf( '?' ) >= 0 )
            {
                var path = self.system.getEnginePath() + '/' + type + '/' + group;
                var answer = await self.files.getDirectory( path, { filters: name + '.mjs', listFiles: true, recursive: false, sorted: true } );
                if ( answer.isSuccess() )
                {
                    var fileList = answer.getValue();
                    for ( var f = 0; f < fileList.length; f++ )
                    {
                        await createBubble( type, group, self.system.basename( fileList[ f ].name, '.mjs' ), element.config, element.options );
                    }
                }
            }
            else
            {
                await createBubble( type, group, name, element.config, element.options );
            }
        }
		async function createBubble( type, group, name, config = {}, options = {} )
		{
			config.key = self.utilities.getUniqueIdentifier( idCheck, group + '_' + name, count++ );
            idCheck[ config.key ] = true;

            var text = type + '-' + group + '-' + name;
            console.log( 'Loading ' + text );
			var exports = await import( './' + type + '/' + group + '/' + name + '.mjs' );
			var newClass = new exports.Bubble( self, config );
            if ( newClass )
            {
                self.classes[ type ][ group ][ name ] = exports;
                self[ type ][ config.key ] = newClass;
                if ( newClass.connect )                
                    await newClass.connect( self, options );
            }
		}
		async function createConnector( group, name, config = {}, options = {} )
		{
            var text = type + '-' + group + '-' + name;
            console.log( 'Loading ' + text );
			var exports = await import( './connectors/' + group + '/' + name + '.mjs' );
            var newClass = new exports.Connector( self, config );
            if ( newClass )
            {
                self.connectors[ group + '-' + newClass.token ] = newClass;
                self.classes.connectors[ group ] = self.classes.connectors[ group ] ? self.classes.connectors[ group ] : {};
                self.classes.connectors[ group ][ name ] = exports;
                self[ newClass.token ] = newClass;
                await newClass.connect( options );
             }
        }

        // Create the elements
		for ( var c = 0; c < this.config.elements.length; c++ )
		{
			var element = this.config.elements[ c ];
            var words = element.name.split( '/' );
            var type = words[ 0 ];
            var group = words[ 1 ];
            var name = words[ 2 ];
            await createElements( type, group, name, element.config, element.options );
		}

        // Make the sorted list of connectors
        this.connectorList = [];
        for ( var c in this.connectors )
            this.connectorList.push( this.connectors[ c ] );
        this.connectorList.sort( function( connector1, connector2 )
            {
                if ( connector1.priority == connector2.priority )                
                    return 0;
                if ( connector1.priority > connector2.priority )                
                    return -1;
                return 1;
            } );

        // Make list of bubbles
        this.bubbleList = [];
        this.bubbleGroups = {};
        for ( var b in this.bubbles )
        {
            var bubble = this.bubbles[ b ];
            bubble.listIndex = this.bubbleList.length;
            this.bubbleList.push( this.bubbles[ b ] );
            if ( !this.bubbleGroups[ bubble.group ] )
                this.bubbleGroups[ bubble.group ] = {};
            this.bubbleGroups[ bubble.group ][ bubble.token ] = bubble;
        }
            
		// Is everyone connected?
		var answer;
		var prompt = []
        var text = [];
        prompt.push( '<BR>' );
        prompt.push( 'The Awi-Engine version ' + this.version );
		prompt.push( 'By Francois Lionet (c) 2024' );
		prompt.push( 'Open-source, please read the licence.' );
        prompt.push( '<BR>' );
		this.connected = true;
		for ( var d = 0; d < this.connectorList.length; d++ )
		{
            var connectAnswer = this.connectorList[ d ].connectAnswer;
            if ( connectAnswer.isError() )
            {
                if ( !connectAnswer.nonFatal )
                    this.connected = false;
            }
            text.push( connectAnswer.getPrint() );
		}
        prompt.push( ...text );
        prompt.push( '' );
		if ( this.connected )
        {
			prompt.push( '<BR>Ready.<BR>' );
			answer = this.newAnswer( prompt, 'array' ); 
        }
        else
        {
            prompt.push( 'Cannot connect!' );
			answer = this.newError( 'awi:cannot-initialize' )
        }
		if ( this.editor.connected && !options.fromAwi )
			this.editor.current.print( prompt, { user: 'awi', newLine: true, prompt: false } );
		return answer;
	}
    getArgs( names = [], args = [], basket = {}, defaults = [] )
    {
        var result = {};
        var argsObject = {};
        if ( typeof names == 'string' )
            names = [ names ];
        if ( this.utilities.isObject( args ) )
            argsObject = args;
        for ( var n = 0; n < names.length; n++ )
        {
            var name = names[ n ];
            var value = defaults[ n ];
            if ( args.length > n )
                value = args[ n ];
            else if ( typeof basket[ name ] != 'undefined' )
                value = basket[ name ];
            else if ( typeof argsObject[ name ] != 'undefined' )
                value = argsObject[ name ];
            result[ name ] = value;
        }
        return result;
    }
    async callConnectors( argsIn = {}, basket = {}, control )
    {
        var errors = [], error, answer = {};
        var { token, group, args } = this.getArgs( [ 'token', 'group', 'args' ], argsIn, basket, [ '*', '' , {} ] );
        for ( var c = 0; c < this.connectorList.length; c++ )
        {
            var connector = this.connectorList[ c ];
            if ( ( group == '*' || connector.group == group ) )
            {
                if ( connector[ token ] )
                {
                    var connectorAnswer = await connector[ token ]( args, basket, control );
                    if ( connectorAnswer.isError() )
                    {
                        errors.push( { connector: connector, error: answer.error } );
                        error = 'awi:connector-error';
                    }
                    else
                    {
                        var data = connectorAnswer.getValue();
                        for ( var p in data )
                        {
                            args[ p ] = data[ p ];
                            answer[ p ] = data[ p ];
                            basket[ p ] = data[ p ];
                        }
                    }
                }
            }
        }
        return this.newAnswer( answer, 'data' );
    }
    async callBubbles( argsIn, basket = {}, control )
    {
        var errors = [];
        var { group, action, args } = this.getArgs( [ 'action', 'group', 'args' ], argsIn, basket, [ '*', '', [] ] );
        for ( var c = 0; c < this.bubbleList.length; c++ )
        {
            var bubble = this.bubbleList[ c ];
            if ( group == '*' || group == bubble.group )
            {
                if ( bubble[ action ] )
                {
                    var answer = await bubble[ action ]( args, basket, control );
                    if ( !answer.isError() )
                        errors.push( { bubble: bubble[ action ], error: answer.error } );
                }
            }
        }
        if ( errors.length > 0 )
            return this.newError( 'awi:bubble-error' );
        return this.newAnswer( basket, 'data' )
    }
    async executeCommands( args, basket, control )
    {
        var tokenStart = '<';
        var tokenEnd = '>';
        var toClean = [];
        var errors = [];
        var { prompt, group } = this.getArgs( [ 'prompt', 'group' ], args, basket, [ '', '*' ] );
        var info = { position: 0, prompt: prompt };

        // Scan the prompt for commands
        this.utilities.skipSpaces( info );
        while( !info.eol )
        {
            var c = info.prompt.charAt( info.position );
            if ( this.utilities.getCharacterType( c ) == 'quote' )
                this.utilities.skipString( info );
            else
            {
                var start = info.position;
                this.utilities.extractNextParameter( info, [ ' ', '(', '\t', tokenEnd ] );
                if ( info.type == 'word' && info.value.charAt( 0 ) == tokenStart )
                {
                    var token = info.value.substring( 1 );
                    while ( !info.eol && info.delimiter != tokenEnd )
                    {
                        this.utilities.extractNextParameter( info, [ ',', tokenEnd ] );
                        args.push( info.value );
                    }
                    var errors = await this.callConnectors( [ group, token, {} ], basket, control );
                    if ( errors )
                        errors.push( { token: token, errors: errors } );
                    toClean.push( { start: start, end: info.position } );
                }
            }
        }

        // Remove commands from prompt
        args[ 0 ] = prompt;
        if ( toClean.length > 0 )
        {
            var position = 0;
            var cleanPrompt = '';
            for ( var t = 0; t < toClean.length; t++ )
            {
                cleanPrompt += prompt.substring( position, toClean[ t ].start );
                position = toClean[ t ].end;
            }
            cleanPrompt += prompt.substring( position );
            args[ 0 ] = cleanPrompt;
        }
        if ( errors.length > 0 )
            return this.newError( 'awi:connector-error', errors, 'object' );
        return this.newAnswer( args, 'data' );
    }
	alert( message, options )
	{
		console.error( message );
	}
	systemWarning( message )
	{
		console.warn( message );
		if ( this.editor && this.editor.connected )
			this.editor.print( this, message.split( '\n' ), { user: 'systemwarning' } );
	}
	async prompt( prompt, basket, control )
	{
		var callback = control.callback;
		var extra = control.extra;
		control.callback = null;
		control.extra = null;
		var answer = await this.prompt.prompt( prompt, basket, control );
		if ( callback )
			callback( true, answer, extra );
		return answer;
	}
	initMemory( memory )
	{
		//memory.bubbleHash = {};
		//for ( var key in memory.bubbleMap )
		//	memory.bubbleHash[ memory.bubbleMap[ key ] ] = key;
		return memory;
	}
	async save( user )
	{
		user = typeof user == 'undefined' ? this.config.user : user;
		var answer = await this.persona.saveMemories( 'any' );
		//if ( !answer.isSuccess )
			return answer;

		//var conversations = this.utilities.serializeOut( this.prompt, '' );
		//var path = this.config.getConfigurationPath() + '/' + user + '-';
		//return await this.system.writeFile( path + 'conversations.js', conversations, { encoding: 'utf8' } );
	}
}
