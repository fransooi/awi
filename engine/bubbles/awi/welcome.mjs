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
* @file bubble-welcome.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Welcome: displays welcome message, always called first. Can display nothing.
*        Can display animations, can depend on mood/news etc.
*/
import BubbleBase from '../../bubble.mjs'
export { BubbleWelcome as Bubble }

class BubbleWelcome extends BubbleBase
{
	constructor( awi, config = {} )
	{
		super( awi, config,
        {
            name: 'Welcome',
            token: 'welcome',
            className: 'BubbleWelcome',
            group: 'awi',
            version: '0.5',
    
            action: 'ask for user first and last names and creates a new configuration',
            inputs: [ { firstName: 'your first name', type: 'string', optional: false },
                      { lastName: 'your last name', type: 'string', optional: false  },
                      { userName: 'user name', type: 'string', optional: false  },                     ],
            outputs: [ { userName: 'user name', type: 'string' },
                    { firstName: 'first name', type: 'string' },
                    { lastName: 'last name', type: 'string' }   
             ]
        } );
	}
	async play( args, basket, control )
	{
		await super.play( args, basket, control );
		var config = this.awi.configuration.getNewUserConfig();
		config.firstName = args.firstName;
		config.lastName = args.lastName;
        config.fullName = args.firstName + ' ' + args.lastName;
        config.userName = args.userName;
        await this.awi.configuration.setNewUserConfig( config.userName.toLowerCase(), config );
        var answer = await this.awi.configuration.saveConfigs();
        if ( answer.isSuccess() )
        {
            return this.newAnswer( { 
                userName: config.userName,
                firstName: config.firstName,
                lastName: config.lastName,
                fullName: config.fullName,
                path: this.awi.configuration.getConfigurationPath()
            }, [ 'awi:config-changed', 'awi:please-now-type' ] );
        }
        control.editor.print( 'Sorry I need these information to run.', { user: 'awi' } );
        return this.newError( 'awi:config-not-set' );
	}
	async playback( args, basket, control )
	{
		return await super.playback( args, basket, control );
	}
}
