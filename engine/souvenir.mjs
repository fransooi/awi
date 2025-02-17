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
* @file souvenir.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Souvenir bubbles: stores and recall informations
*
*/
import BubbleBase from './bubble.mjs'

export default class SouvenirBase extends BubbleBase
{
	constructor( awi, config, data )
	{
		super( awi, config, data );

		this.version = '0.5';
		this.className = 'MemoryBase';
        this.name = 'Memory Base';
        this.group = 'awi:should_be_derived';
        this.token = 'awi:should_be_derived';
		this.senderName = typeof data.senderName == 'undefined' ? '' : data.senderName;
		this.receiverName = typeof data.receiverName == 'undefined' ? '' : data.receiverName;
		this.properties.topic = typeof data.topic == 'undefined' ? '' : data.topic;
		this.properties.subTopics = typeof data.subTopic == 'undefined' ? '' : data.subTopic;
		this.properties.interval = typeof data.interval == 'undefined' ? { start: 0, end : 0 } : data.interval;
	}
	async extractContent( args, basket, control )
	{
	}
	async getContent( args, basket, control )
	{
	}
	async findSouvenirs( args, basket, control )
	{
	}
	async play( prompt, parameter, control )
	{
		super.play( prompt, parameter, control );
	}
	async playback( args, basket, control )
	{
		super.playback( args, basket, control );
	}
}
