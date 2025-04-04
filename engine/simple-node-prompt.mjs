/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal
* (_)|____| |____|\__/\__/ [_| |_] \     Assistant
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
*
* ----------------------------------------------------------------------------
* @file simple-node-prompt.js
* @author FL (Francois Lionet)
* @date first pushed on 10/11/2019
* @version 0.5
*
* @short Starts Awi as simple command line prompt
*
*/
import Awi from './awi.mjs';

async function startAwi( prompt, config )
{
	var basket = {};
	var awi = new Awi( null, config );
    var answer = await awi.connect( {} );
	if ( answer.isSuccess() )
	{
        if ( prompt )
        {
		    await awi.prompt.prompt( { prompt: prompt }, basket, { editor: awi.editor } );            
        }
	}
    else
    {
        console.log( error );
    }
}

function getArguments()
{
	var answer =
	{
		prompt: 'fran',
        elements:
        [
            { name: 'connectors/system/node', config: { priority: 100 }, options: {} },
            { name: 'connectors/system/files', config: { priority: 100 }, options: {} },
            { name: 'connectors/awi/messages', config: { priority: 99 }, options: {} },
            { name: 'connectors/awi/utilities', config: { priority: 99 }, options: {} },
            { name: 'connectors/awi/configuration', config: { priority: 99 }, options: {} },
            { name: 'connectors/awi/time', config: { priority: 99  }, options: {} },
            { name: 'connectors/editor/editor', config: { priority: 99 }, options: { default: 'commandline', config: {} } },
            { name: 'connectors/network/websocketserver', config: { priority: 99 }, options: {} },
            { name: 'bubbles/awi/*', config: {}, options: {} },
            { name: 'souvenirs/awi/*', config: {}, options: {} },
            { name: 'memories/awi/*', config: {}, options: {} },
            { name: 'connectors/language/javascript', config: { priority: 98 }, options: {} },
            { name: 'connectors/awi/parser', config: { priority: 97 }, options: {} },
            { name: 'connectors/awi/persona', config: { priority: 96 }, options: {} },
            { name: 'connectors/awi/prompt', config: { priority: 95 }, options: {} },
            { name: 'connectors/edenai/chat', config: { priority: 94, key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmZjYzY2YzMtOTNmZi00YjYyLWIxNDgtY2FhZWJkNjhkZjIxIiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.Y73ATnBg_mMIZVj78A1Jf5RH-eCXfVPrihgqxSRT0R0'}, options: {} },
        ]
	};

	var error = false;
	var quit = false;
	for ( var a = 2; ( a < process.argv.length ) && !quit && !error; a++ )
	{
		var command = process.argv[ a ].toLowerCase();

		var pos;
		if( ( pos = command.indexOf( '--configurations=' ) ) >= 0 )
		{
			answer.config.configurations = command.substring( pos, command.length );
		}
		else if( ( pos = command.indexOf( '--engine=' ) ) >= 0 )
		{
			answer.config.engine = command.substring( pos, command.length );
		}
		else if( ( pos = command.indexOf( '--data=' ) ) >= 0 )
		{
			answer.config.data = command.substring( pos, command.length );
		}
		else if ( !error )
		{
			if ( answer.prompt.length > 0 )
				answer.prompt += ' ';
			answer.prompt += command;
		}
	}
	return { success: !error, data: answer };
};

var answer = getArguments();
if ( answer.success )
{
	startAwi( answer.data.prompt, answer.data );
}
