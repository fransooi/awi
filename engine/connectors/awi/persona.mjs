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
* @file persona.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Handle various personalities / create adapted prompts
*
*/
import ConnectorBase from '../../connector.mjs'
export { ConnectorPersona as Connector }

export default class ConnectorPersona extends ConnectorBase
{
	constructor( awi, config )
	{
		super( awi, config );
		this.name = 'Persona';
		this.token = 'persona';
		this.className = 'ConnectorPersona';
        this.group = 'awi';
		this.version = '0.5';

		this.currentPrompt = 'awi';
		this.memories = {};
		this.prompts =
		{
            'awi': '~{prompt}~'
        }
    }
    connect( options )
    {
        super.connect( options );
        this.memories[ 'audios' ] = new this.awi.classes.memories.awi.audio.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awi_audio', 0 ), parent: '' } );
        this.memories[ 'conversations' ] = new this.awi.classes.memories.awi.conversation.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awi_conversations', 1 ), parent: '' } );
        this.memories[ 'documents' ] = new this.awi.classes.memories.awi.document.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awidocuments', 2 ), parent: '' } );
        this.memories[ 'images' ] = new this.awi.classes.memories.awi.image.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awi_image', 3 ), parent: '' } );
        this.memories[ 'mails' ] = new this.awi.classes.memories.awi.mail.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awi_mail', 4 ), parent: '' } );
        this.memories[ 'messenger' ] = new this.awi.classes.memories.awi.messenger.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awi_messenger', 5 ), parent: '' } );
        this.memories[ 'photos' ] = new this.awi.classes.memories.awi.photo.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_awi_photo', 6 ), parent: '' } );
        this.memories[ 'videos' ] = new this.awi.classes.memories.awi.video.Bubble( this.awi, { key: this.awi.utilities.getUniqueIdentifier( {}, 'memory_generic_video', 7 ), parent: '' } );
        return this.setConnected( true );
    }
	setPrompt( prompt )
	{
		if ( this.prompts[ prompt ] || this.prompts[ prompt + '#1' ] )
		{
			this.currentPrompt = prompt;
			return true;
		}
		return false;
	}
	setTemperature( temperature )
	{
		if ( temperature < 0 )
			this.temperature = this.awi.getPersona().temperature;
		else
			this.temperature = temperature;
		return true;
	}
	async remember( args, basket, control )
	{
		var result = {
			direct: { souvenirs: [], content: [] },
			indirect: { souvenirs: [], content: [] }
		};
		if ( basket.what == 'any' )
		{
			for ( var k in this.memories )
			{
				var answer = await this.memories[ k ].findSouvenirs( args, basket, control );
				if ( answer.answer.isSuccess() )
				{
					result.direct.souvenirs.push( ...answer.direct.souvenirs );
					result.direct.content.push( ...answer.direct.content );
					result.indirect.souvenirs.push( ...answer.souvenirs );
					result.indirect.content.push( ...answer.indirect.content );
				}
			}
		}
		else
		{
			for ( var w = 0; w < basket.what.length; w++ )
			{
				var memory = this.memories[ basket.what[ w ] ];
				memory = ( typeof memory == 'undefined' ? this.memories[ basket.what[ w ] + 's' ] : this.memories[ basket.what[ w ] ] );
				if ( memory )
				{
					var answer = await memory.findSouvenirs( basket, basket, control );
					if ( answer.answer.isSuccess() )
					{
						result.direct.souvenirs.push( ...answer.direct.souvenirs );
						result.direct.content.push( ...answer.direct.content );
						result.indirect.souvenirs.push( ...answer.indirect.souvenirs );
						result.indirect.content.push( ...answer.indirect.content );
					}
				}
			}
		}
		if ( result.direct.souvenirs.length + result.indirect.souvenirs.length > 0 )
			return this.newAnswer( result, 'object' );
		return this.newError( 'awi:notfound' );        
	}
    getPrompt( token, basket, control )
    {
        if ( token == 'current' )
			token = this.currentPrompt;
		var prompt = this.prompts[ token ];
		if ( prompt )
			prompt = this.awi.messages.format( prompt, basket, control );
        return prompt;
    }
   	getMemoryPrompt( memoryList, user, contact, maxCount = 5 )
	{
		var count = maxCount;
		var conversation = '';
		if ( user )
			user += ' said:'
		if ( contact )
			contact += ' said:'
		for ( var m = 0; m < memoryList.length && count > 0; m++, count-- )
		{
			var memory = memoryList[ m ];
			conversation += '- ' + user + '"' + memory.userText + '"\n';
			conversation += '- ' + contact + '"' + memory.receiverText + '"\n';
		}
		return conversation;
	}
	async loadMemories( type = 'any')
	{
		var self = this;
		async function loadMemory( type )
		{
			var path = self.awi.configuration.getConfigurationPath() + '/' + self.name.toLowerCase() + '-' + type + '-';
			var memory;
			var answer = self.awi.system.exists( path + 'memory.mjs' );
			if ( answer.isSuccess() )
			{
				answer = await self.awi.system.readFile( path + 'memory.mjs', { encoding: 'utf8' } );
				if ( answer.isSuccess() )
				{
					memory = answer.getValue();
					try
					{
						memory = Function( memory );
						memory = memory();
						memory = self.awi.utilities.serializeIn( memory.root, {} );
						return this.newAnswer( memory, 'object' );
					}
					catch( e )
					{
						return this.newError( 'cannot-load-memory' );
					}
				}
				return this.newError( 'cannot-load-memory' );
			}
			return this.newAnswer();
		}
		var answer;
		if ( type == 'any' )
		{
			for ( var type in this.memories )
			{
				answer = await loadMemory( type );
				if ( answer.isError() )
					break;
				this.memories[ type ] = this.awi.initMemory( answer.memory );
			}
		}
		else
		{
			answer = await loadMemory( type );
			if ( answer.isSuccess() )
				this.memories[ type ] = this.awi.initMemory( answer.memory );
		}
		return answer;
	}
	async saveMemories( type = 'any' )
	{
		var self = this;
		async function saveMemory( type )
		{
			if ( self.memories[ type ] )
			{
				var memories = self.awi.utilities.serializeOut( self.memories[ type ], '' );
				var path = self.awi.configuration.getConfigurationPath() + '/' + self.name.toLowerCase() + '-' + type + '-';
				return await self.awi.system.writeFile( path + 'memory.mjs', memories, { encoding: 'utf8' } );
			}
			return this.newError( 'no-memory-of-type' );
		}
		var answer;
		if ( type == 'any' )
		{
			for ( var type in this.memories )
			{
				answer = await saveMemory( type );
				if ( answer.isError() )
					break;
			}
		}
		else
			answer = await saveMemory( type );
		return answer;
	}

    // Exposed functions
    async setUser( args, basket, control )
    {
        var { userName } = this.awi.getArgs( 'userName', args, basket, [ '' ] );
        if ( !userName )
            return this.newAnswer( this.awi.USER_NOT_FOUND );
        this.persona = this.awi.configuration.getPersona( userName );
        return this.newAnswer();
    }
    async preparePrompt( args, basket, control )
    {
        var { prompt } = this.awi.getArgs( [ 'prompt' ], args, basket, [ '' ] );
        return this.newAnswer( { prompt: prompt }, 'object' );
    }
    async computeResponse( args, basket, control )
    {
        var { response } = this.awi.getArgs( [ 'response' ], args, basket, [ '' ] );
        return this.newAnswer( { response: response }, 'object' );
    }
}
