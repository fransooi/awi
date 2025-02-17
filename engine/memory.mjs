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
* @file memory.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Memory branch
*
*/
import BranchBase from './branch.mjs'

export default class MemoryBase extends BranchBase
{
	constructor( awi, config, data )
	{
		config.parentClass = 'newMemories';
		config.errorClass = 'newSouvenirs';
		
        super( awi, config, data );
		this.version = '0.5';
		this.className = 'MemoryBase';
        this.name = 'Memory Base';
        this.group = 'awi:should_be_derived';
        this.token = 'awi:should_be_derived';
		this.senderName = typeof data.senderName == 'undefined' ? '' : data.senderName;
		this.receiverName = typeof data.receiverName == 'undefined' ? '' : data.receiverName;
		this.bubbleHash = {};
	}
	async play( args, control, nested )
	{
		return this.awi.NO_ERROR;
	}
	async playback( args, basket, control )
	{
		return this.awi.NO_ERROR;
	}
	async getContent( args, basket, control )
	{
        var error = this.awi.NO_ERROR;
		basket.content = typeof basket.content == 'undefined' ? [] : basket.content;
		var souvenir = this.getBubble( this.getBubble( 'root' ).properties.exits[ 'success' ] );
		while ( souvenir )
		{
			error = await souvenir.extractContent( args, basket, control );
			if ( error )
                break;
			souvenir = this.getBubble( souvenir.properties.exits[ 'success' ] );
		}
		return error;
	}
	async findSouvenirs( args, basket, control )
	{
		var directSouvenirs = [];
		var indirectSouvenirs = [];
		var souvenir = this.getBubble( this.getBubble( 'root' ).properties.exits[ 'success' ] );
		while( souvenir )
		{
			var info1 = this.awi.utilities.matchTwoStrings( souvenir.receiverName, basket.prompt, { caseInsensitive: true } );
			if ( info1.result == 1 )
			{
				directSouvenirs.push( souvenir );
			}
			else
			{
				var answer = await souvenir.findIndirectSouvenirs( args, basket, control );
				if ( answer.isSuccess() )
					indirectSouvenirs.push( souvenir );	
			}
			souvenir = this.getBubble( souvenir.properties.exits[ 'success' ] );
		} while ( souvenir );
		var directContent = [];
		var indirectContent = [];
		for ( var s = 0; s < directSouvenirs.length; s++ )
		{
			var content = await directSouvenirs[ s ].getContent( args, basket, control );
			directContent.push( content );
		}
		for ( var s = 0; s < indirectSouvenirs.length; s++ )
		{
			var content = await indirectSouvenirs[ s ].getContent( args, basket, control );
			indirectContent.push( content );
		}
        basket.directSouvenirs = directSouvenirs;
        basket.inDirectSouvenirs = inDirectSouvenirs;

	}
	addMemory( memory, control = {} )
	{
		return super.addBubble( memory, control );
	}
	addMemories( memories, basket = {}, control = {} )
	{
		return super.addBubble( memories, basket, control );
	}
	addSouvenir( souvenir, control = {} )
	{
		return super.addBubble( souvenir, control );
	}
	addSouvenirs( commandList, basket = {}, control = {} )
	{
		return super.addBubble( commandList, basket, control );
	}
}
