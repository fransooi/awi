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
* @file bubble.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Main bubble class from which all elements are derived.
*
*/
import Base from './base.mjs'

export default class BubbleBase extends Base
{
	constructor( awi, config, data )
	{
        super( awi, config, data );
		this.version = '0.5';
		this.className = 'BubbleBase';
        this.name = 'Bubble Base';
        this.group = 'awi:should_be_derived';
        this.token = 'awi:should_be_derived';
		this.key = config.key;
		this.parent = config.parent;
		this.branch = config.branch;
        this.useCount = 0;
        this.properties =
        {
            action: [],
            inputs: [],
            outputs: [],
            exits: { success: '', error: '' },
            parser: {},
            select: [],
            tags: []
        }

        if ( data )
        {
            this.name = data.name;
            this.group = data.group;
            this.token = data.token;
            this.version = data.version;
            this.className = data.className;
            this.properties.action = ( typeof data.actions != 'undefined' ? data.actions : this.properties.action );
            this.properties.inputs = ( typeof data.inputs != 'undefined' ? data.inputs : this.properties.inputs );
            this.properties.outputs = ( typeof data.outputs != 'undefined' ? data.outputs : this.properties.outputs );
            this.properties.parser = ( typeof data.parser != 'undefined' ? data.parser : this.properties.parser );
            this.properties.select = ( typeof data.select != 'undefined' ? data.select : this.properties.select );
            this.properties.tags = ( typeof data.tags != 'undefined' ? data.tags : this.properties.tags );
            this.properties.exits = ( typeof data.exits != 'undefined' ? data.exits : this.properties.exits );
            this.properties.inputs = awi.utilities.convertPropertiesToParams( this.properties.inputs );
            this.properties.outputs = awi.utilities.convertPropertiesToParams( this.properties.outputs );
            if ( typeof config.exits != 'undefined' )
            {
                for ( var e in config.exits )
                    this.properties.exits[ e ] = config.exits[ e ];
            }
        }
	}
	reset()
	{
		this.useCount = 0;
	}
	getEditable( name )
	{
		for ( var e = 0; e < this.properties.editables.length; e++ )
		{
			if ( this.properties.editables[ e ].name == name )
				return this.properties.editables[ e ];
		}
		return null;
	}
	async play( args = {}, basket, control )
	{        
		this.useCount++;

        var todo = [];
		for ( var p = 0; p < this.properties.inputs.length; p++ )
		{
			var parameter = this.properties.inputs[ p ];
            if ( typeof args[ parameter.name ] == 'undefined' )
            {
                if ( typeof basket[ parameter.name ] != 'undefined' )
                    args[ parameter.name ] = basket[ parameter.name ];
                else
                {
                    if ( typeof parameter.default != 'undefined' )
                        args[ parameter.name ] = { type: parameter.type, result: parameter.default };
                    if ( !parameter.optional )
                        todo.push( parameter );
                }
            }
		}
		control.editor.print( [ "Playing bubble " + this.name ], { user: 'bubble' } );
		if ( todo.length > 0 )
        {
			var answer = await this.awi.prompt.getParameters( { list: todo, args: {} }, basket, control );
            if ( answer.isSuccess() )
            {
                for ( var p in answer.data )
                    args[ p ] = answer.data[ p ];
            }
        }
        for ( var i = 0; i < this.properties.inputs.length; i++ )
        {
            var input = this.properties.inputs[ i ];
            control.editor.print( [ 'Parameter ' + input.name + ': ' + args[ input.name ].result ], { user: 'bubble' } );
        }
	}
	async playback( args, basket, control )
	{
	}
}
