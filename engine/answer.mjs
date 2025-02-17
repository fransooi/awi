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
        this.type = type;
		this.data = data;
        this.toPrint = toPrint;
	}
	reset()
	{
		this.data = 0;
        this.type = 'int';
	}
    isSuccess()
    {
        return true;        
    }
    isError()
    {
        return false;        
    }
    isNumber()
    {
        return this.type =='int' || this.type == 'float' || this.type == 'number' || this.type == 'hex' || this.type == 'bin';
    }
    isString()
    {
        return this.type == 'string';
    }
    setValue( value = 0, type = 'int' )
    {
        this.type = type;
        this.data = value;
    }
    setData( data )
    {
        this.data = data;
        this.type = 'data';
    }
    setToPrint( toPrint )
    {
        this.toPrint = toPrint;
    }
    getData()
    {
        return this.data;
    }
    getType()
    {
        return this.type;
    }
	getString( format )
	{
        function getStr( type, data )
        {
            switch ( type )
            {
                case 'boolean':
                    return ( data ? 'true' : 'false' );
                case 'int':
                    return '' + data;
                case 'float':
                    return this.awi.messages.formatFloat( data, format );
                case 'number':
                    return this.awi.messages.formatNumber( data, format );
                case 'bin':
                    return '%' + this.awi.messages.formatBin( data, format );
                case 'hex':
                    return '$' + this.awi.messages.formatHex( data, format );
                case 'string':
                    return data;
                case 'data':
                case 'array':
                case 'object':
                case 'function':
                    return data.toString();
                default:
                    break;
            }
            return '***ERROR***';
        }
    
        if ( this.type == 'answer' )
            return this.data.getString( format );
        else if ( this.type == 'result' )
            return getStr( this.data.type, this.data.data );
        return getStr( this.type, this.data );
	}
	getValue( outType )
	{
        if ( !outType || outType == this.type )
            return this.data;
        return 'TO CONVERT' + this.data;
	}
    getPrint( format )
    {
        var toPrint = this.toPrint;
        if ( !toPrint )
            toPrint = '~{value}~'
        else if ( typeof toPrint == 'function' )
            return toPrint( this, format );

        return this.awi.messages.getMessage( toPrint, { value: this.getString( format ) } );
    }
}
