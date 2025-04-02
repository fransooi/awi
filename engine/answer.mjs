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
* @file basket.js
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Multipurpose Stackable Values
*
*/
export default class Answer
{
	constructor( parent, data, type, toPrint )
	{
        this.parent = parent;
		this.awi = parent.awi;
        this.error = null;
        this.setValue(data, type);
        this.toPrint = toPrint;
	}
    setError( error, errorData )
    {
        this.error = error;
        if ( typeof errorData != 'undefined' )
            this.setValue( errorData );
    }
	reset()
	{
		this.data = 0;
        this.type = 'int';
        this.error = null;
	}
    isSuccess()
    {
        if (this.error)
            return false;
        return true;        
    }
    isError()
    {
        return this.error !== null;        
    }
    isNumber()
    {
        return this.type =='int' || this.type == 'float' || this.type == 'number' || this.type == 'hex' || this.type == 'bin';
    }
    isString()
    {
        return this.type == 'string';
    }
    setValue( value = 0, type )
    {
        if ( typeof type == 'undefined' )
        {
            if (Array.isArray( value ))
                type = 'array';
            else if (typeof value === "object" && !Array.isArray( value ) && value !== null)
                type = 'object';
            else if (typeof value == 'string')
                type = 'string';
            else if (typeof value == 'number')
                type = 'number';
            else if ( {}.toString.call(value) === '[object Function]')
                type = 'function';
            else
                type = 'int';
        }
        this.type = type;
        this.data = value;
    }
    setToPrint( toPrint )
    {
        this.toPrint = toPrint;
    }
	getString( format )
	{
        switch ( this.type )
        {
            case 'boolean':
                return ( this.data ? 'true' : 'false' );
            case 'int':
                return '' + this.data;
            case 'float':
                return this.awi.messages.formatFloat( this.data, format );
            case 'number':
                return this.awi.messages.formatNumber( this.data, format );
            case 'bin':
                return '%' + this.awi.messages.formatBin( this.data, format );
            case 'hex':
                return '$' + this.awi.messages.formatHex( this.data, format );
            case 'string':
                return this.data;
            case 'data':
            case 'array':   
            case 'object':
            case 'function':
            default:
                return this.data.toString();
        }
	}
	getValue( outType )
	{
        if ( !outType || outType == this.type )
            return this.data;
        return 'TO CONVERT' + this.data;
	}
    getPrint( format )
    {
        if ( this.error )
            return this.awi.messages.getMessage( this.error, { value: this.getString( format ) } );
        
        var toPrint = this.toPrint;
        if ( toPrint == '' )
            return '';
        if ( !toPrint)
            toPrint = '~{value}~'
        else if ( typeof toPrint == 'function' )
            return toPrint( this, format );
        var value;
        if ( this.type == 'object' )
            value = this.data;
        else
            value = { value: this.getString( format ) };
        var text = '';
        if ( typeof toPrint == 'string' )
            text = this.awi.messages.getMessage( toPrint, value );
        else
        {
            for ( var t = 0; t < toPrint.length; t++ )
            {
                if ( t > 0 )
                    text += '\n';
                text += this.awi.messages.getMessage( toPrint[ t ], value );
            }
        }
        return text;
    }
}
