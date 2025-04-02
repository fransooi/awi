/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \      / ][   ]       Programmable
*     _/ /   \ \_\  \/ \/  / |  |        Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_]      link:
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file connector.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Connector base class
*
*/
import Base from './base.mjs'

export default class ConnectorBase extends Base
{
	constructor( awi, config = {}, data = {} )
	{
		super( awi, config, data );
		this.version = '0.5';
		this.className = 'ConnectorBase';
        this.name = 'Connector Base';
        this.group = 'awi:should_be_derived';
        this.token = 'awi:should_be_derived:iwa';
        this.priority = typeof config.priority == 'undefined' ? 50 : config.priority;
        this.connected = false;
	}
	async connect( /*options*/ )
	{
	}
    setConnected( yesNo = true )
    {        
		this.connectAnswer = this.newAnswer( {
			success: yesNo,
            name: this.name,
            token: this.token,
            className: this.className,
            group: this.group,
            prompt: this.name + ' connector version ' + this.version, version: this.version
		}, function( answer )
        {
            if ( answer.isSuccess() )
                return '(ok) ' + answer.data.group + '/' + answer.data.token + ': ' + answer.data.prompt;
            return '(error) ' + answer.data.group + '/' + answer.data.token + ': ' + answer.data.prompt;
        }, 'data' );
        this.connected = yesNo;
        if ( !yesNo )
            this.connectAnswer.setError( 'error' );
		return this.connectAnswer;
    }
    async quit( options )
    {

    }
}
