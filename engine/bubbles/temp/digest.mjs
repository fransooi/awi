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
* @file bubble-digest.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Digest command: digest the content of the toDigest directory
*
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleDigest as Bubble }

class BubbleDigest extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Digest',
            token: 'digest',
            className: 'BubbleDigest',
            group: 'awi',
            version: '0.5',
    
            action: 'read the files in the data folder and memorize them',
            inputs: [ { noun: 'the topic of data to process, example "Friend Name"', type: 'string', optional: true, default: '' } ],
            outputs: [ { receiverName: 'the name of the receiver', type: 'string'  },
                       { souvenirs: 'list of souvenirs associated to the receiver', type: 'array.string.souvenir' } ],
            parser: { 
                noun: [ 'audio', 'sound', 'video', 'document', 'facebook', 'image', 'photo' ],
                verb: [ 'digest' ] },
            select: [ [ 'verb' ] ]
        } );
	}
	async facebook( path, args, control )
	{
		var result= 
		{
			valid: [],
			invalid: []
		}
		path = path + '/messages';
		var exist = this.awi.system.exists( path );
		if ( exist.isSuccess() )
		{
			var info = await this.messenger( path, basket, control );
			result.valid.push( ...info.valid );
			result.invalid.push( ...info.invalid );
		}
		return result;
	}
	async messenger( path, parameters, control )
	{
		var self = this;

		// Import one message listdigest
		async function importMessages( todo, control )
		{
			if ( self.awi.messengerImporter )
            {
                control.from = todo.from;
                var answer = await self.awi.messengerImporter.import( todo.path, parameters.senderName, todo.receiverNameCompressed, control );
                if ( answer.isSuccess() )
                {
                    todo.done = true;
                    todo.error = false;
                    todo.souvenirs = answer.souvenirs;
                    todo.receiverName = answer.receiverName;
                    return todo;
                }
            }
            todo.error = true;
			return todo;
		}

		var todo = [];
		var directoriesToScan =
		[
			'inbox',
			'archived_threads',
			'filtered_threads'
		];
		for ( var d = 0; d < directoriesToScan.length; d++ )
		{
			var dirPath = path + '/' + directoriesToScan[ d ];
			var answer = await this.awi.system.getDirectory( dirPath, { recursive: false, listFiles: true, sorted: true } );
			if ( answer.isSuccess() )
			{
				var files = answer.fileTree;
				if ( !parameters.receiverName )
				{
					for ( var f = 0; f < files.length; f++ )
					{
						var dirContact = files[ f ];
						if ( dirContact.isDirectory )
						{
							var pos = dirContact.name.indexOf( '_' );
							if ( pos >= 0 )
							{
								var receiverNameCompressed = dirContact.name.substring( 0, pos );
								todo.push(
								{
									senderName: parameters.senderName,
									receiverNameCompressed: receiverNameCompressed,
									receiverName: '',
									path: dirContact.path,
									done: false
								} );
							}
						}
					}
				}
				else
				{
					var receiverNameCompressed = parameters.receiverName.split( ' ' ).join( '' ).toLowerCase();
					for ( var f = 0; f < files.length; f++ )
					{
						var dirContact = files[ f ];
						if ( dirContact.isDirectory && dirContact.name.indexOf( receiverNameCompressed ) == 0 )
						{
							todo.push(
							{
								senderName: parameters.senderName,
								receiverNameCompressed: receiverNameCompressed,
								receiverName: '',
								path: dirContact.path,
								done: false
							} );
						}
					}
				}
			}
		}

		var invalid = [];
		var valid = [];
		if ( control.store )
		{
			for ( var td = 0; td < todo.length; td++ )
			{
				var tobedone = await importMessages( todo[ td ], control );
				if ( !tobedone.error )
				{
					if ( tobedone.souvenirs.length > 0 )
					{
						for ( var s = 0; s < tobedone.souvenirs.length; s++ )
						{
							if ( this.awi.persona.memories.messenger.addSouvenir( tobedone.souvenirs[ s ], control ) )
								valid.push( tobedone.souvenirs[ s ] );
						}
					}
				}
				else
				{
					invalid.push( tobedone.dirPath );
				}
			}
		}
		control.store = false;
		return {
			invalid: invalid,
			valid: valid
		}
	}
	async videos( path, parameters, control )
	{
		var invalid = [];
		var valid = [];
		if ( this.awi.importerVideo )
        {
            var answer = await this.awi.files.getDirectory( this.awi.configuration.getDataPath() + '/todigest/videos', { recursive: true, filters: [ '*.mp4', '*.ogg' ] }, listFiles, true );
            if ( answer.isSuccess() )
            {
                var files = answer.fileList;
                for ( var f = 0; f < files.length; f++ )
                {
                    var file = files[ f ];
                    control.type = 'videos';
                    answer = await this.awi.importerVideo.import( file.path, parameters.senderName, control );
                    if ( answer.isSuccess() )
                    {
                        valid.push( ...answer.souvenirs );
                    }
                    else
                    {
                        invalid.push( file.path );
                    }
                }
            }
            if ( control.store && valid.length > 0 )
            {
                var newValid = [];
                for ( var v = 0; v < valid.length; v++ )
                {
                    if ( this.awi.persona.memories.videos.addSouvenir( valid[ v ], control ) )
                        newValid.push( valid[ v ] );
                }
                valid = newValid;
            }
            control.store = false;
        }
		return {
			invalid: invalid,
			valid: valid
		}
	}
	async audios( path, parameters, control )
	{
		var invalid = [];
		var valid = [];
		if ( this.awi.importerAudio )
        {
            var answer = await this.awi.system.getDirectory( this.awi.configuration.getDataPath() + '/todigest/audios', { recursive: true, filters: [ '*.wav', '*.mp3', '*.ogg' ], listFiles: true } );
            if ( answer.isSuccess() )
            {
                var files = answer.fileList;
                for ( var f = 0; f < files.length; f++ )
                {
                    var file = files[ f ];
                    answer = await importer.import( file.path, parameters.senderName, control );
                    if ( answer.isSuccess() )
                    {
                        valid.push( ...answer.souvenirs );
                    }
                    else
                    {
                        invalid.push( file.path );
                    }
                }
            }
            if ( control.store && valid.length > 0 )
            {
                var newValid = [];
                for ( var v = 0; v < valid.length; v++ )
                {
                    if ( this.awi.persona.memories.audios.addSouvenir( valid[ v ], control ) )
                        newValid.push( valid[ v ] );
                }
                valid = newValid;
            }
            control.store = false;
        }
		return {
			invalid: invalid,
			valid: valid
		}
	}

	async play( args, basket, control )
	{
		if ( typeof basket.senderName == 'undefined' )
			basket.senderName = this.awi.getConfig( 'user' ).fullName;

		var answer = await super.play( args, basket, control );
		if ( answer.isSuccess() )
		{
			var result =
			{
				valid: [],
				invalid: []
			};
			var type = basket.noun;
			if ( type )
			{
				var path = this.awi.configuration.getDataPath() + '/todigest/' + type;
				var exist = this.awi.system.exists( path );
				if ( !exist.isSuccess() )
				{
					type += 's';
					path = this.awi.configuration.getDataPath() + '/todigest/' + type;
					exist = this.awi.system.exists( path );
				}
				if ( !exist.isSuccess() )
				{
					control.editor.print( 'Cannot import files of type "' + type + '".', { user: 'error' } );
					control.editor.print( 'Supported import types: audio, video, messenger, and more to come!', { user: 'awi' } );
					return this.newError( 'awi:cannot-import' );
				}
				if ( this[ type ] )
				{
					control.store = true;
					var info = await this[ type ]( path, basket, control );
					result.valid.push( ...info.valid );
					result.invalid.push( ...info.invalid );
				}
			}
			else
			{
				var path = this.awi.configuration.getDataPath() + '/todigest';
				var answer = await this.awi.system.getDirectory( path, { recursive: false, listFiles: true } );
				if ( answer.isSuccess() )
				{
					var files = answer.fileList;
					for ( var d = 0; d < files.length; d++ )
					{
						var file = files[ d ];
						if ( file.isDirectory )
						{
							if ( this[ file.name ] )
							{
								control.store = true;
								var info = await this[ file.name ]( file.path, basket, control );
								result.valid.push( ...info.valid );
								result.invalid.push( ...info.invalid );
							}
						}
					}
				}
			}
			control.editor.print( result.valid.length +' souvenirs added.', { user: 'information' } );
			if ( result.invalid.length > 0 )
			{
				control.editor.print( 'These items could not be imported...', { user: 'warning' } );
				for ( var i = 0; i < result.invalid.length; i++ )
					control.editor.print(invalid[ i ], { user: 'warning' } );
			}
			return this.newAnswer( { success: true, receiverName: basket.receiverName, souvenirs: result.valid }, 'awi:import-completed' );
		}
		return answer;
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
