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
* @file utilities.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short Various utilities.
*
*/
import ConnectorBase from './../../connector.mjs'
import HJSON from 'hjson'
export { ConnectorUtilities as Connector }

class ConnectorUtilities extends ConnectorBase
{
	constructor( awi, config = {} )
	{
		super( awi, config );
		this.name = 'Utilities';
		this.token = 'utilities';
		this.className = 'ConnectorUtilities';
        this.group = 'awi';
        this.version = '0.5';   
    }
	async connect( options )
	{
		super.connect( options );
        this.setConnected( true );
		return this.connectAnswer;
	}
	capitalize( text )
	{
		return text.charAt( 0 ).toUpperCase() + text.substring( 1 );
	}
	replaceStringInText( text, mark, replacement )
	{
		var pos = text.indexOf( mark );
		while( pos >= 0 )
		{
			text = text.substring( 0, pos ) + replacement + text.substring( pos + mark.length );
			pos = text.indexOf( mark );
		}
		return text;
	}
	copyObject( obj )
	{
		var ret = null;
		if (obj !== Object(obj)) { // primitive types
			return obj;
		}
		if (obj instanceof String || obj instanceof Number || obj instanceof Boolean) { // string objecs
			ret = obj; // for ex: obj = new String("Spidergap")
		} else if (obj instanceof Date) { // date
			ret = new obj.constructor();
		} else
			ret = Object.create(obj.constructor.prototype);

		var prop = null;
		var allProps = Object.getOwnPropertyNames(obj); //gets non enumerables also


		var props = {};
		for (var i in allProps) {
			prop = allProps[i];
			props[prop] = false;
		}

		for (i in obj) {
			props[i] = i;
		}

		//now props contain both enums and non enums
		var propDescriptor = null;
		var newPropVal = null; // value of the property in new object
		for (i in props) {
			prop = obj[i];
			propDescriptor = Object.getOwnPropertyDescriptor(obj, i);

			if (Array.isArray(prop)) { //not backward compatible
				prop = prop.slice(); // to copy the array
			} else
			if (prop instanceof Date == true) {
				prop = new prop.constructor();
			} else
			if (prop instanceof Object == true) {
				if (prop instanceof Function == true) { // function
					if (!Function.prototype.clone) {
						Function.prototype.clone = function() {
							var that = this;
							var temp = function tmp() {
								return that.apply(this, arguments);
							};
							for (var ky in this) {
								temp[ky] = this[ky];
							}
							return temp;
						}
					}
					prop = prop.clone();

				} else // normal object
				{
					prop = this.copyObject(prop);
				}

			}

			newPropVal = {
				value: prop
			};
			if (propDescriptor) {
				/*
					* If property descriptors are there, they must be copied
					*/
				newPropVal.enumerable = propDescriptor.enumerable;
				newPropVal.writable = propDescriptor.writable;

			}
			if (!ret.hasOwnProperty(i)) // when String or other predefined objects
				Object.defineProperty(ret, i, newPropVal); // non enumerable

		}
		return ret;
	}
	copyArray( arr, arrDest )
	{
		arrDest = typeof arrDest == 'undefined' ? [] : arrDest;
		for ( var p = 0; p < arr.length; p++ )
		{
			var prop = arr[ p ];
			if ( this.isArray( prop ) )
				prop = this.copyArray( prop, [] );
            else if ( this.isObject( prop ) )
                prop = this.copyObject( prop );
			arrDest.push( prop );
		}
		return arrDest;
	}
	isNumber( item )
	{
		return typeof item == 'number';
	};
	isString( item )
	{
		return typeof item == 'string';
	};
	isFunction( functionToCheck )
	{
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}
	isObject( item )
	{
		return typeof item != 'undefined' ? (typeof item === "object" && !Array.isArray( item ) && item !== null) : false;
	};
	isObjectEmpty( obj )
	{
		return Object.keys( obj ).length === 0 && obj.constructor === Object;
	}
	isArray( item )
	{
		return typeof item != 'undefined' ? Array.isArray( item ) : false;
	};
	countElements( obj, options = { all: true } )
	{
		var count = 0;
		for ( var p in obj )
		{
			if ( obj[ p ] === null )
				continue;
			if ( this.isObject( p ) )
			{
				if ( options.objects || options.all )
				{
					if ( obj[ p ] )
						count++;
				}
			}
			else if ( this.isArray( p ) )
			{
				if ( options.arrays || options.all )
				{
					if ( obj[ p ] )
						count++;
				}
			}
			else if ( this.isFunction( p ) )
			{
				if ( options.functions || options.all )
				{
					if ( obj[ p ] )
						count++;
				}
			}
			else
			{
				count++;
			}
		}
		return count;
	}
	getCharacterType( c )
	{
		var type;
		if ( c >= '0' && c <= '9' )
			type = 'number';
		else if ( c == ' ' || c == "\t" )
			type = 'space';
		else if ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' )
			type = 'letter';
		else if ( c == '"'  || c == '“' || c == "'" )
			type = 'quote';
		else if ( c == "'" )
			type = 'remark';
		else if ( c == ':' )
			type = 'column';
		else if ( c == ';' )
			type = 'semicolumn';
		else if ( c == '-' || c == '–' )
			type = 'minus';
		else if ( c == '(' || c == ')' )
			type = 'bracket';
		else if ( c == '{' || c == '}' )
			type = 'accolade';
		else
			type = 'other';
		return type;
	}
	isTag( text, tags )
	{
		var pos;
		tags = !this.isArray( tags ) ? [ tags ] : tags;
		text = text.toLowerCase();
		for ( var t = 0; t < tags.length; t++ )
		{
			if ( ( pos = text.indexOf( '#' + tags[ t ] ) ) >= 0 )
			{
				pos += tags[ t ].length + 1;
				if ( pos >= text.length || this.getCharacterType( pos ) != 'letter' )
					return true;
			}
		}
		return false;
	}
	convertStringToArrayBuffer( str )
	{
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var lookup = new Uint8Array(256);
		for ( var i = 0; i < chars.length; i++ )
		{
			lookup[ chars.charCodeAt( i ) ] = i;
		}

		var bufferLength = str.length * 0.75, len = str.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
		if ( str[ str.length - 1 ] === "=")
		{
			bufferLength--;
			if ( str[ str.length - 2 ] === "=")
			{
				bufferLength--;
			}
		}

		var arraybuffer = new ArrayBuffer( bufferLength ),
		bytes = new Uint8Array( arraybuffer );

		for ( i = 0; i < len; i += 4 )
		{
			encoded1 = lookup[str.charCodeAt(i)];
			encoded2 = lookup[str.charCodeAt(i+1)];
			encoded3 = lookup[str.charCodeAt(i+2)];
			encoded4 = lookup[str.charCodeAt(i+3)];

			bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
			bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
			bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
		}
		return arraybuffer;
	}
	convertArrayBufferToString( arrayBuffer )
	{
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var bytes = new Uint8Array( arrayBuffer ), i, len = bytes.length, base64 = "";

		for (i = 0; i < len; i+=3)
		{
			base64 += chars[bytes[i] >> 2];
			base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
			base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
			base64 += chars[bytes[i + 2] & 63];
		}

		if ((len % 3) === 2)
		{
			base64 = base64.substring(0, base64.length - 1) + "=";
		}
		else if (len % 3 === 1)
		{
			base64 = base64.substring(0, base64.length - 2) + "==";
		}
		return base64;
	};
	checkUndefined( value, defaultValue )
	{
		if ( typeof value == 'undefined' )
			value = defaultValue;
		return value;
	}
	copyData( destination, source, options = {} )
	{
		if ( !options.recursive )
		{
			for ( var d in source )
				destination[ d ] = source[ d ];
			return destination;
		}
		for ( var d in source )
		{
			var prop = source[ d ];
			if ( this.isObject( prop ) )
				destination[ d ] = this.copyData( {}, prop );
			else if ( this.isArray( prop ) )
				destination[ d ] = this.copyArray( prop );
			else
				destination[ d ] = prop;
		}
		return destination;
	}
	justifyText( text, maxWidth )
	{
        if ( !this.isArray( text ) )
            text = [ text ];

        var count = 0;
        var empty = true;
        var newText = [];
        newText[ count ] = '';
        for ( var l = 0; l < text.length; l++ )
        {
            var line = text[ l ];
            var words = line.split( ' ' );
            for ( var w = 0; w < words.length; w++ )
            {
                if ( newText[ count ].length >= maxWidth )
                {
                    newText[ count ] = newText[ count ].trim();
                    newText[ ++count ] = words[ w ] + ' ';
                    empty = false;
                }
                else
                {
                    newText[ count ] += words[ w ] + ' ';
                    empty = false;
                }
            }
            newText.push( '' );
            empty = true;
            count++;
        }
        if ( empty )
            newText.pop();
        for ( var t = 0; t < newText.length; t++ )
            newText[ t ] = newText[ t ].trim();
		return newText;
	}
    isEmpty( text )
    {
        if ( text )
        {
            for ( var p = 0; p < text.length; p++ )
            {
                if ( this.getCharacterType( text.charAt( p ) != 'space' ) )
                    return false;
            }
        }
        return true;
    }
    skipSpaces( info )
    {
        while( info.position < info.prompt.length && ( info.prompt.charAt( info.position ) == ' ' || info.prompt.charAt( info.position ) == '\t' ) )
            info.position++;
        if ( info.position >= info.prompt.length )
            info.eol = true;
        return info;
    }
	skipString( info )
	{
        if ( info.position >= info.prompt.length )
            info.eol = true;
        else
        {
            var end, endCut;
            var start = info.position;
            var quote = info.prompt.charAt( start );
            if ( quote == '"' || quote == "'" || quote == "`" )
            {
                start++;
                endCut = start;
                while ( info.prompt.charAt( endCut ) != quote && endCut < info.prompt.length )
                    endCut++;
                end = Math.min( info.prompt.length, endCut + 1 )
            }
            else
            {
                endCut = info.prompt.indexOf( ' ', start );
                if ( endCut < 0 )
                    endCut = info.prompt.length;
                end = endCut;
            }
            info.position = end;
        }
        return info;
	}
	extractString( info )
	{
        if ( info.position >= info.prompt.length )
            info.eol = true;
        else
        {
            var end, endCut;
            var start = info.position;
            var quote = info.prompt.charAt( start );
            if ( quote == '"' || quote == "'" || quote == "`" )
            {
                start++;
                endCut = start;
                while ( info.prompt.charAt( endCut ) != quote && endCut < info.prompt.length )
                    endCut++;
                end = Math.min( info.prompt.length, endCut + 1 )
                info.type = 'string';
            }
            else
            {
                endCut = info.prompt.indexOf( ' ', start );
                if ( endCut < 0 )
                    endCut = info.prompt.length;
                end = endCut;
                info.type = 'word';
            }
            info.value = info.prompt.substring( start, endCut );
            info.position = end;
        }
		return info;
	}
    extractNextParameter( info, delimiters )
    {
        info.value = undefined;
        info.type = '';   
        this.skipSpaces( info );
        if ( !info.eol )
        {
            if ( this.getCharacterType( info.prompt.charAt( info.position ) ) == 'quote' )
            {
                this.extractString( info );
            }
            else
            {
                var delimited = '';
                var end = 1000000;
                var start = info.position;
                for ( var d = 0; d < delimiters.length; d++ )
                {
                    var delimiter = delimiters[ d ];
                    var e = info.prompt.indexOf( delimiter, info.position );
                    if ( e >= 0 && e < end )
                    {
                        end = e;
                        delimited = delimiter;
                    }
                }
                var text;
                if ( end >= info.prompt.length )
                {
                    end = info.prompt.length;
                    text = info.prompt.substring( start, end );
                    info.position = end;
                }
                else
                {
                    text = info.prompt.substring( start, end );
                    info.position = ++end ;
                }
                info.delimiter = delimited;

                // Number or string or word?
                var t = this.getCharacterType( text.charAt( 0 ) );
                if ( t == 'number' || t == 'minus' )
                {
                    info.type = 'int';
                    info.value = parseInt( text );
                    var valueFloat = parseFloat( text );
                    if ( valueFloat != info.value )
                    {
                        info.value = valueFloat;
                        info.type = 'float';
                    }
                }
                else if ( text )
                {
                    info.value = text;
                    info.type = 'word';
                }
            }
            return info;
        }
    }
	extractLinks( prompt, position )
	{
		var result = { videos: [], images: [], photos: [], links: [], audios: [], found: false }
		var start;
		if ( ( start = prompt.indexOf( '<a ', position ) ) >= 0 )
		{
			var end = prompt.indexOf( '>' );
			if ( end >= 0 )
			{
				var pos = prompt.indexOf( 'href=', start );
				result.links.push( this.extractString( prompt, pos ) );
				result.found = true;
				prompt = prompt.substring( 0, start ) + prompt.substring( end + 1 );
			}
		}
		if ( ( start = prompt.indexOf( '<video ', position ) ) >= 0 )
		{
			var end = prompt.indexOf( '>' );
			if ( end >= 0 )
			{
				var pos = prompt.indexOf( 'src=', start );
				result.videos.push( this.extractString( prompt, pos ) );
				result.found = true;
				prompt = prompt.substring( 0, start ) + prompt.substring( end + 1 );
			}
		}
		if ( ( start = prompt.indexOf( '<audio ', position ) ) >= 0 )
		{
			var end = prompt.indexOf( '>' );
			if ( end >= 0 )
			{
				var pos = prompt.indexOf( 'src=', start );
				result.audios.push( this.extractString( prompt, pos ) );
				result.found = true;
				prompt = prompt.substring( 0, start ) + prompt.substring( end + 1 );
			}
		}
		if ( ( start = prompt.indexOf( '<img ', position ) ) >= 0 )
		{
			var end = prompt.indexOf( '>' );
			if ( end >= 0 )
			{
				var pos = prompt.indexOf( 'src=', start );
				result.images.push( this.extractString( prompt, pos ) );
				result.found = true;
				prompt = prompt.substring( 0, start ) + prompt.substring( end + 1 );
			}
		}
		if ( ( start = prompt.indexOf( '<', position ) ) >= 0 )
		{
			var end = prompt.indexOf( '>' );
			if ( end >= 0 )
			{
				var pos = prompt.indexOf( 'src=', start );
				result.images.push( this.extractString( prompt, pos ) );
				result.found = true;
				prompt = prompt.substring( 0, start ) + prompt.substring( end + 1 );
			}
		}
		result.prompt = prompt;
		return result;
	}
	cleanLinks( prompt )
	{
		var start = prompt.indexOf( '<' );
		while( start >= 0 )
		{
			var end = prompt.indexOf( '>', start );
			prompt = prompt.substring( 0, start ) + prompt.substring( end + 1 );
			start = prompt.indexOf( '<' );
		}
		return prompt.trim();
	}
	getFinalHtmlData( structure )
	{
		function getIt( parent, pile )
		{
			for ( var s = 0; s < parent.length; s++ )
			{
				var struct = parent[ s ];
				if ( struct.children.length == 0 )
				{
					pile.push( struct.text );
				}
				else
				{
					pile.push( ...getIt( struct.children, [] ) )
				}
			}
			return pile;
		}
		return getIt( structure, [] );
	}
	explodeHtml( name, html, options )
	{
		function explode( name, html, options, pile )
		{
			var start = 0;
			var end = start;
			do
			{
				var startText;
				var start1 = html.indexOf( '<' + name + ' ', end );
				var start2 =  html.indexOf( '<' + name + '>', end );
				start1 = ( start1 < 0 ? html.length : start1 );
				start2 = ( start2 < 0 ? html.length : start2 );
				if ( start1 >= html.length && start2 >= html.length )
					break;

				if ( start1 < start2 )
					startText = html.indexOf( '>', start1 + 1 ) + 1;
				else
					startText = start2 + name.length + 2;
				start = Math.min( start1, start2 );

				var count = 1;
				end = startText;
				do
				{
					var next1 = html.indexOf( '<' + name + ' ', end );
					var next2 = html.indexOf( '<' + name + '>', end );
					var next3 = html.indexOf( '</' + name + '>', end );
					if ( next1 >= 0 )
						next1 = html.indexOf( '>', next1 );
					next1 = ( next1 < 0 ? html.length : next1 );
					next2 = ( next2 < 0 ? html.length : next2 );
					next3 = ( next3 < 0 ? html.length : next3 );
					var next = Math.min( next1, Math.min( next2, next3 ) );
					if ( next == html.length )
						return null;
					if ( next == next3 )
					{
						count--;
						if ( count == 0 )
						{
							end = next3;
							break;
						}
					}
					else
					{
						count++;
					}
					end = next + 1;
				} while( true );
				if ( end > start )
				{
					var basket =
					{
						type: name,
						start: start,
						end: end + name.length + 3,
						startText: startText,
						endText: end,
						children: []
					};
					basket.text = html.substring( basket.startText, basket.endText );
					if ( basket.text != '' )
					{
						pile.push( basket );
						if ( options.recursive )
							basket.children = explode( name, basket.text, options, [] );
					}
					end = basket.end;
				}
			} while( true )
			return pile;
		}
		var structure = explode( name, html, options, [] );
		return structure;
	}
	convertPropertiesToParams( properties )
	{
        function convert( props )
        {
            if ( props[ 'name' ] )
                return props;

            var params = {};
            var count = 0;
            for ( var p in props )
            {
                // First one is name
                if ( count == 0 )
                {
                    params[ 'name' ] = p;
                    params[ 'description' ] = props[ p ];
                }
                else
                {
                    params[ p ] = props[ p ];
                }
                count++;
            }
            return params;
        }
        if ( this.isArray( properties ) )
        {
            for ( var p = 0; p < properties.length; p++  )
                properties[ p ] = convert( properties[ p ] );
        }
        else
        {
            properties = convert( properties );
        }
        return properties;
	}
	getUniqueIdentifier( toCheck = {}, root = '', count = 0, timeString = '', nNumbers = 3, nLetters = 3 )
	{
		var id;
		do
		{
			id = root + ( root ? '_' : '' ) + count;
			if ( timeString )
			{
				var currentdate = new Date();
				var time = this.format( timeString,
				{
					day: currentdate.getDate(),
					month: currentdate.getMonth(),
					year:  currentdate.getFullYear(),
					hour:  currentdate.getHours(),
					minute:  currentdate.getMinutes(),
					second: currentdate.getSeconds(),
					milli: currentdate.getMilliseconds(),
				} );
				if ( time )
					id += '_' + time;
			}
			var numbers = '';
			for ( var n = 0; n < nNumbers; n++ )
				numbers += String.fromCharCode( 48 + Math.floor( Math.random() * 10 ) );
			id += '_' + numbers;
			var letters = '';
			for ( var n = 0; n < nLetters; n++ )
				letters += String.fromCharCode( 65 + Math.floor( Math.random() * 26 ) );
			id += letters;
		} while( toCheck[ id ] );
		return id;
	}
	matchRegex( text, regex )
	{
		if ( !this.isArray( regex ) )
			regex = [ regex ];
		for ( var r = 0; r < regex.length; r++ )
		{
			var matches = text.match( regex[ r ] );
			if ( matches )
				return matches;
		}
		return null;
	}
	fillString( text, chr, len, position = 'start' )
	{
		if ( position == 'start' )
		{
			while( text.length < len )
				text = chr + text;
		}
		else if ( position == 'end' )
		{
			while( text.length < len )
				text += chr;
		}
		else
		{
			position = Math.min( Math.max( position, 0 ), text.length );
			while( text.length < len )
				text = text.substring( 0, position ) + chr + text.substring( position );
		}
		return text;
	}
	getNumericValue( text )
	{
		var numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
						'ten', 'eleven', 'twelve', 'forteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
						'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine',
						'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine',
						'fourty', 'fourty-one', 'fourty-two', 'fourty-three', 'fourty-four', 'fourty-five', 'fourty-six', 'fourty-seven', 'fourty-eight', 'fourty-nine',
						'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine',
						'sixty', 'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine',
						'seventy', 'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five', 'seventy-six', 'seventy-seven', 'seventy-eight', 'seventy-nine',
						'eighty', 'eighty-one', 'eighty-two', 'eighty-three', 'eighty-four', 'eighty-five', 'eighty-six', 'eighty-seven', 'eighty-eight', 'eighty-nine',
						'ninety', 'ninety-one', 'ninety-two', 'ninety-three', 'ninety-four', 'ninety-five', 'ninety-six', 'ninety-seven', 'ninety-eight', 'ninety-nine',
						]
		text = text.trim().toLowerCase().split( ' ' ).join( '-' );
		if ( this.getCharacterType( text.charAt( 0 ) ) == 'number' )
		{
			var value = parseInt( text );
			if ( !isNaN( value ) )
				return value;
			return -1;
		}
		var index = numbers.findIndex(
			function( element )
			{
				return element == text;
			}
		)
		return index;
	}
	isFilter( name )
	{
		for ( var c = 0; c < name.length; c++ )
		{
			if ( info.name.charAt( c ) == '*' || info.name.charAt( c ) == '?' )
				return true;
		}
		return false;
	}
	removeDuplicatedPrompts( text )
	{
		var lines = text.split( '\n' );
		for ( var l1 = 0; l1 < lines.length; l1++ )
		{
			var l3 = l1 + 1;
			var line1 = lines[ l1 ];
			for ( var l2 = l3; l2 < lines.length; l2++ )
			{
				if ( lines[ l2 ].length > 0 && lines[ l2 ] != line1 )
					lines[ l3++ ] = lines[ l2 ];
			}
			lines.length = l3;
		}
		return lines.join( '\n' );
	}
	isLowerCase( c )
	{
		return c >= 'a' && c <= 'z';
	}
	isUpperCase( c )
	{
		return c >= 'A' && c <= 'Z';
	}
	getMimeType( path )
	{
		var ext = this.awi.system.extname( path ).toLowerCase();
		return this.awi.system.getMimeType( ext );
	}
	serializeIn( map, root )
	{
		var self = this;
		var lastBranch = 'root';
		function createObjects( o, map )
		{
			if ( o.oClass )
			{
				// create the object
				var oo;
				if ( o.oClass != 'prompt' )
				{
					oo = new self.awi[ o.basket.parentClass ][ o.basket.group ][ o.basket.token ]( self.awi, { key: o.basket.key, branch: lastBranch, parent: o.basket.parent, exits: o.basket.exits, parameters: o.basket.parameters } );
					if ( o.basket.parentClass == 'newMemories' )
						lastBranch = oo;
				}
				else
				{
					oo = self.awi.prompt;
					lastBranch = oo;
				}
				switch ( o.oClass )
				{
					case 'bubble':
						break;
					case 'branch':
						break;
					case 'memory':
						oo.currentBubble = o.basket.currentBubble;
						oo.parameters = o.basket.parameters;
						oo.properties.exits = o.basket.exits;
						oo.parent = o.basket.parent;
						for ( var p in o.basket.bubbleMap )
						{
							oo.bubbleMap[ p ] = createObjects( o.basket.bubbleMap[ p ], {} );
						}
						break;
					case 'souvenir':
						oo.parameters = o.basket.parameters;
						oo.options = o.basket.options;
						oo.parent = o.basket.parent;
						oo.properties.exits = o.basket.exits;
						break;
					case 'prompt':
						oo.currentBubble = o.basket.currentBubble;
						oo.parameters = o.basket.parameters;
						oo.datas = o.basket.datas;
						oo.options = o.basket.options;
						oo.properties.exits = o.basket.exits;
						oo.parent = o.basket.parent;
						oo.options = o.basket.options;
						for ( var p in o.basket.bubbleMap )
							oo.bubbleMap[ p ] = createObjects( o.basket.bubbleMap[ p ], {} );
						oo.pathway = o.basket.pathway;
						oo.keyCount = o.basket.keyCount;
						oo.questionCount = o.basket.questionCount;
						oo.properties.exits = o.basket.exits;
						oo.firstRun = false;
						break
				}
				return oo;
			}
			else
			{
				for ( var p in o )
				{
					var oo = o[ p ];
					if ( oo.oClass )
					{
						o[ p ] = createObjects( oo, map );
					}
				}
				return o;
			}
		}
		return createObjects( map, root );
	}
	serializeOut( root )
	{
		var self = this;
		var count = 0;
		function isAwi( o )
		{
			return typeof o.token != 'undefined';
		}
		function toJSON( basket )
		{
			var json;
			try
			{
				json = JSON.stringify( basket );
			}
			catch( e )
			{}
			if ( json )
				return json;
			return '""';
		}
		function savePrompt( o )
		{
			var map = '';
			map += '\t'.repeat( count ) + 'group:"' + o.group + '",\n';
			map += '\t'.repeat( count ) + 'currentBubble:"' + ( typeof o.currentBubble != 'undefined' ? ( typeof o.currentBubble == 'string' ? o.currentBubble : o.currentBubble.key ) : '' ) + '",\n';
			map += '\t'.repeat( count ) + 'key:"' + o.key + '",\n';
			map += '\t'.repeat( count ) + 'token:"' + o.token + '",\n';
			map += '\t'.repeat( count ) + 'options:' + toJSON( o.options ) + ',\n';
			map += '\t'.repeat( count ) + 'parameters:' + toJSON( o.parameters ) + ',\n';
			map += '\t'.repeat( count ) + 'datas:' + toJSON( o.datas ) + ',\n';
			map += '\t'.repeat( count ) + 'options:' + toJSON( o.options ) + ',\n';
			map += '\t'.repeat( count ) + 'pathway:"' + o.pathway + '",\n';
			map += '\t'.repeat( count ) + 'pathways:' + toJSON( o.pathways ) + ',\n';
			map += '\t'.repeat( count ) + 'keyCount:' + o.keyCount + ',\n';
			map += '\t'.repeat( count ) + 'questionCount:' + o.questionCount + ',\n';
			map += '\t'.repeat( count ) + 'parent:"' + ( self.isObject( o.parent ) ? o.parent.key : ( typeof o.parent == 'undefined' ? '' : o.parent ) ) + '",\n';
			map += '\t'.repeat( count ) + 'previous:"' + ( self.isObject( o.previous ) ? o.previous.key : ( typeof o.previous == 'undefined' ? '' : o.previous ) ) + '",\n';
			map += '\t'.repeat( count ) + 'exits:\n'
			map += '\t'.repeat( count ) + '{\n';
			for ( var p in o.properties.exits )
				map += '\t'.repeat( count + 1 ) + p + ':"' + o.properties.exits[ p ] + '",\n';
			map += '\t'.repeat( count ) + '},\n';
			map += '\t'.repeat( count ) + 'bubbleMap:\n'
			map += '\t'.repeat( count ) + '{\n';
			for ( var p in o.bubbleMap )
			{
				var oo = o.bubbleMap[ p ];
				map += '\t'.repeat( count + 1 ) + p + ':{oClass:"' + oo.oClass + '",basket:{\n';
				count += 2;
				map += saveMap[ oo.oClass ]( oo )
				count -= 2;
				map += '\t'.repeat( count + 1 ) + '}},\n';
			}
			map += '\t'.repeat( count ) + '},\n'
			return map;
		}
		function saveMemory( o )
		{
			var map = '';
			map += '\t'.repeat( count ) + 'group:"' + o.group + '",\n';
			map += '\t'.repeat( count ) + 'parentClass:"newMemories",\n';
			map += '\t'.repeat( count ) + 'currentBubble:"' + ( typeof o.currentBubble != 'undefined' ? ( typeof o.currentBubble == 'string' ? o.currentBubble : o.currentBubble.key ) : '' ) + '",\n';
			map += '\t'.repeat( count ) + 'key:"' + o.key + '",\n';
			map += '\t'.repeat( count ) + 'token:"' + o.token + '",\n';
			map += '\t'.repeat( count ) + 'options:' + toJSON( o.options ) + ',\n';
			map += '\t'.repeat( count ) + 'parameters:' + toJSON( o.parameters ) + ',\n';
			map += '\t'.repeat( count ) + 'pathway:"' + o.pathway + '",\n';
			map += '\t'.repeat( count ) + 'pathways:' + toJSON( o.pathways ) + ',\n';
			map += '\t'.repeat( count ) + 'parent:"' + ( self.isObject( o.parent ) ? o.parent.key : ( typeof o.parent == 'undefined' ? '' : o.parent ) ) + '",\n';
			map += '\t'.repeat( count ) + 'previous:"' + ( self.isObject( o.previous ) ? o.previous.key : ( typeof o.previous == 'undefined' ? '' : o.previous ) ) + '",\n';
			map += '\t'.repeat( count ) + 'exits:\n'
			map += '\t'.repeat( count ) + '{\n';
			for ( var p in o.properties.exits )
				map += '\t'.repeat( count + 1 ) + p + ':"' + o.properties.exits[ p ] + '",\n';
			map += '\t'.repeat( count ) + '},\n';
			map += '\t'.repeat( count ) + 'bubbleMap:\n'
			map += '\t'.repeat( count ) + '{\n';
			for ( var p in o.bubbleMap )
			{
				var oo = o.bubbleMap[ p ];
				map += '\t'.repeat( count + 1 ) + p + ':{oClass:"' + oo.oClass + '",basket:{\n';
				count += 2;
				map += saveMap[ oo.oClass ]( oo );
				count -= 2;
				map += '\t'.repeat( count + 1 ) + '}},\n';
			}
			map += '\t'.repeat( count ) + '},\n'
			return map;
		}
		function saveSouvenir( o )
		{
			var map = '';
			map += '\t'.repeat( count ) + 'group:"' + o.group + '",\n';
			map += '\t'.repeat( count ) + 'parentClass:"newSouvenirs",\n';
			map += '\t'.repeat( count ) + 'key:"' + o.key + '",\n';
			map += '\t'.repeat( count ) + 'token:"' + o.token + '",\n';
			map += '\t'.repeat( count ) + 'parameters:' + toJSON( o.parameters ) + ',\n';
			map += '\t'.repeat( count ) + 'options:' + toJSON( o.options ) + ',\n';
			map += '\t'.repeat( count ) + 'parent:"' + ( self.isObject( o.parent ) ? o.parent.key : ( typeof o.parent == 'undefined' ? '' : o.parent ) ) + '",\n';
			map += '\t'.repeat( count ) + 'previous:"' + ( self.isObject( o.previous ) ? o.previous.key : ( typeof o.previous == 'undefined' ? '' : o.previous ) ) + '",\n';
			map += '\t'.repeat( count ) + 'exits:\n'
			map += '\t'.repeat( count ) + '{\n';
			for ( var p in o.properties.exits )
				map += '\t'.repeat( count + 1 ) + p + ':"' + o.properties.exits[ p ] + '",\n';
			map += '\t'.repeat( count ) + '},\n';
			return map;
		}
		function saveBranch( o )
		{
			var map = '';
			return map;
		}
		function saveBubble( o )
		{
			var map = '';
			map += '\t'.repeat( count ) + 'group:"' + o.group + '",\n';
			map += '\t'.repeat( count ) + 'parentClass:"bubbles",\n';
			map += '\t'.repeat( count ) + 'token:"' + o.token + '",\n';
			map += '\t'.repeat( count ) + 'key:"' + o.key + '",\n';
			map += '\t'.repeat( count ) + 'basket:' + toJSON( o.basket ) + ',\n';
			map += '\t'.repeat( count ) + 'parameters:' + toJSON( o.parameters ) + ',\n';
			map += '\t'.repeat( count ) + 'options:' + toJSON( o.options ) + ',\n';
			map += '\t'.repeat( count ) + 'parent:"' + ( self.isObject( o.parent ) ? o.parent.key : ( typeof o.parent == 'undefined' ? '' : o.parent ) ) + '",\n';
			map += '\t'.repeat( count ) + 'previous:"' + ( self.isObject( o.previous ) ? o.previous.key : ( typeof o.previous == 'undefined' ? '' : o.previous ) ) + '",\n';
			map += '\t'.repeat( count ) + 'exits:\n'
			map += '\t'.repeat( count ) + '{\n';
			for ( var p in o.properties.exits )
				map += '\t'.repeat( count + 1 ) + p + ':"' + o.properties.exits[ p ] + '",\n';
			map += '\t'.repeat( count ) + '},\n';
			return map;
		}
		var saveMap =
		{
			'awi': function( o ) { return '\t'.repeat( count - 1 ) + ':{oClass:"awi","basket":{""},\n'; },
			'config': function( o ) { return '\t'.repeat( count - 1 ) + ':{oClass:"config","basket":{""},\n'; },
			'bubble': saveBubble,
			'branch': saveBranch,
			'memory': saveMemory,
			'souvenir': saveSouvenir,
			'prompt': savePrompt
		}

		function createMap( o, map )
		{
			count++;
			if ( o.oClass )
			{
				map += '\t'.repeat( count - 1 ) + 'root:{oClass:"' + o.oClass + '",basket:{\n';
				map += saveMap[ o.oClass ]( o );
				map += '\t'.repeat( count - 1 ) + '}},\n';
			}
			else
			{
				for ( var p in o )
				{
					var oo = o[ p ];
					if ( self.isObject( oo ) )
					{
						if ( oo.oClass )
						{
							map += '\t'.repeat( count - 1 ) + p + ':{oClass:"' + oo.oClass + '",basket:{\n';
							map += saveMap[ oo.oClass ]( oo );
							map += '\t'.repeat( count - 1 ) + '}},\n';
						}
						else
						{
							for ( var pp in oo )
							{
								var ooo = oo[ pp ];
								if ( self.isObject( ooo ) )
								{
									if ( ooo.oClass )
									{
										map += '\t'.repeat( count - 1 ) + pp + ':{oClass:"' + ooo.oClass + '",basket:{\n';
										map += saveMap[ ooo.oClass ]( ooo );
										map += '\t'.repeat( count - 1 ) + '}},\n';
									}
								}
							}
						}
					}
				}
			}
			count--;
			return map;
		}
		count++;
		return 'return {\n'+ createMap( root, '' ) + '}\n';
	}
	objectHash( objct )
	{
		return this.awi.system.toSha1( objct );
	}
	compareTwoStrings( first, second, control = {} )
	{
		if ( control.caseInsensitive )
		{
			first = first.toLowerCase();
			second = second.toLowerCase();
		}
		first = first.replace( /\s+/g, '' );
		second = second.replace( /\s+/g, '' );

		if ( first === second ) return 1; // identical or empty
		if ( first.length < 2 || second.length < 2 ) return 0; // if either is a 0-letter or 1-letter string

		let firstBigrams = new Map();
		for ( let i = 0; i < first.length - 1; i++ )
		{
			const bigram = first.substring( i, i + 2 );
			const count = firstBigrams.has( bigram )
				? firstBigrams.get( bigram ) + 1
				: 1;

			firstBigrams.set( bigram, count );
		};

		let intersectionSize = 0;
		for ( let i = 0; i < second.length - 1; i++ )
		{
			const bigram = second.substring( i, i + 2 );
			const count = firstBigrams.has( bigram )
				? firstBigrams.get( bigram )
				: 0;

			if ( count > 0 )
			{
				firstBigrams.set( bigram, count - 1 );
				intersectionSize++;
			}
		}
		return { result: ( 2.0 * intersectionSize ) / ( first.length + second.length - 2 ) };
	}
	findBestMatch( mainString, targetStrings )
	{
		const ratings = [];
		let bestMatchIndex = 0;
		for ( let i = 0; i < targetStrings.length; i++ )
		{
			const currentTargetString = targetStrings[ i ];
			const currentRating = this.compareTwoStrings( mainString, currentTargetString );
			ratings.push( { target: currentTargetString, rating: currentRating } );
			if ( currentRating > ratings[ bestMatchIndex ].rating )
			{
				bestMatchIndex = i
			}
		}
		return { ratings: ratings, bestMatch: ratings[ bestMatchIndex ], bestMatchIndex: bestMatchIndex };
	}
	matchTwoStrings( string1, string2, options = {} )
	{
		if ( this.isArray( string1 ) )
			string1 = string1.join( ' ' );
		if ( this.isArray( string2 ) )
			string2 = string2.join( ' ' );
		string1 = string1.split( '\n' ).join( ' ' );
		string2 = string2.split( '\n' ).join( ' ' );
		if ( options.caseInsensitive )
		{
			string1 = string1.toLowerCase();
			string2 = string2.toLowerCase();
		}
		var words1 = string1.split( ' ' );
		var words2 = string2.split( ' ' );
		if ( words1.length == 0 )
			return { result: 0, count: 0 };
		var positions = [];
		for ( var w1 = 0; w1 < words1.length; w1++ )
		{
			var word1 = words1[ w1 ];
			for ( var w2 = 0; w2 < words2.length; w2++ )
			{
				var position = word1.indexOf( words2[ w2 ] );
				if ( position >= 0 )
				{
					positions.push( position )
				}
			}
		}
		var count = positions.length;
		return { result: count / words1.length, score: count / words2.length, count: count, positions: positions };
	}
	async loadJavascript( path, options = {} )
	{
		var answer = await this.awi.system.readFile( path, { encoding: 'utf8' } );
		if ( answer.isSuccess() )
		{
			var source = answer.data;
			answer.data = {};
			try
			{
				if ( !options.eval )
				{
					var f = Function( source + '' );
					f.window = {};
					answer.result = f();
				}
				else
				{
					var window = {};
					eval( source + '' );
				}
				answer.window = window;
			} catch( e ) {
				answer = this.newError( 'awi:invalid-javascript' );
			}
		}
		return answer;
	}
	removePunctuation( text )
	{
		var result = '';
		for ( var p = 0; p < text.length; p++ )
		{
			var c = text.charAt( p );
			if ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == ' ' || c == '_' )
				result += c;
		}
		return result;
	}
    findBubbleFromGroup( group, previousBubble )
    {
        var start = previousBubble ? previousBubble.listIndex : 0;
        for ( var b = start ; b < this.awi.bubbleList.length; b++ )
        {
            if ( this.awi.bubbles[ b ].group == group )
                return this.awi.bubbles[ b ];     
        }
        return undefined;
    }
    findBubbleFromGroupToken( group, token )
    {
        return this.awi.bubble.find( 
            function( element )
            {
               return ( bubble.group == group && bubble.token == token ); 
            } );
    }
	HJSONParse( hjsonString )
	{
		try
		{
			return this.newAnswer( HJSON.parse( hjsonString ) );
		}
		catch
		{
			return this.newError( 'awi:illegal-hjson' );
		}
	}
	HJSONStringify( obj )
	{
		try
		{
			return this.newAnswer( HJSON.stringify( obj ) );
		}
		catch
		{
			return this.newError( 'awi:illegal-hjson' );
		}
	}
	JSONParse( jsonString )
	{
		try
		{
			return this.newAnswer( JSON.parse( jsonString ) );
		}
		catch
		{
			return this.newError( 'awi:illegal-json' );
		}
	}
	JSONStringify( obj )
	{
		try
		{
			return this.newAnswer( JSON.stringify( obj ) );
		}
		catch
		{
			return this.newError( 'awi:illegal-json' );
		}
	}
	degreeToRadian( angle )
	{
		if ( this.awi.configuration.getConfig( 'user' ).isDegree )
			return angle * ( Math.PI / 180.0 );
		return angle;
	}
	radianToDegree( angle )
	{
		if ( this.awi.configuration.getConfig( 'user' ).isDegree )
			return angle * ( 180.0 / Math.PI );
		return angle;
	}
	floatToString( value, fix )
	{
		if ( value === false || value === true )
			return value;

        if ( typeof fix == 'undefined' )
		    fix = this.awi.configuration.getConfig( 'user' ).fix;
        fix = typeof fix == 'undefined' ? 2 : fix;

		var decimalPart = value - Math.floor( value );
		var result;
		fix = typeof fix == 'undefined' ? this.fix : fix;
		if ( fix == 16 || decimalPart == 0 )
			result = '' + value;
		else if ( fix >= 0 )
			result = value.toFixed( fix );
		else
			result = value.toExponential( -fix );

		// Fix -0.00 problem...
		if ( result.substring( 0, 3 ) == '-0.' )
		{
			var onlyZeros = true;
			for ( var p = 0; p < result.length; p++ )
			{
				var c = result.charAt( p );
				if ( c >= '1' && c <= '9' )
				{
					onlyZeros = false;
					break;
				}
			}
			if ( onlyZeros )
				result = result.substring( 1 );
		}
		// Only 0 after dot?
		var dot = result.indexOf( '.' );
		if ( dot >= 0 )
		{
			dot++;
			var nul = true;
			while( dot < result.length )
			{
				if ( result.charAt( dot ) != '0' )
				{
					nul = false;
					break;
				}
				dot++;
			}
			if ( nul )
				result = result.substring( 0, dot );
		}
		return result;
	}
}
