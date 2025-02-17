/** --------------------------------------------------------------------------
*
*            / \
*          / _ \              (°°)       Intelligent
*        / ___ \ [ \ [ \ [  ][   ]       Programmable
*     _/ /   \ \_\ \/\ \/ /  |  | \      Personal Assistant
* (_)|____| |____|\__/\__/ [_| |_] \     link:
*
* This file is open-source under the conditions contained in the
* license file located at the root of this project.
* Please support the project: https://patreon.com/francoislionet
*
* ----------------------------------------------------------------------------
* @file stamos-utilities.mjs
* @author FL (Francois Lionet)
* @version 0.5
*
* @short STAMOS Utilities
*
*/
export { StamosUtilities as Utilities }
class StamosUtilities
{
	constructor( awi, config = {} )
	{
        this.awi = awi;
		this.config = config;
        this.sources = [];
    };

    async loadSource( path, options )
    {
        var source = 
        {
            text: '',
            path: path,
            line: 0,
            column: 0,
            position: 0,
            lines: [],
            includes: []
        }
        source.text = await this.awi.files.loadFile( sourcePath, { encoding: 'utf8' } );
        if ( !source.text )
            return null;
        this.sources.push( source );    
        source.lines = this.scanSource( source.text );
        return source;
    };    
    scanSource( source )
    {
        var lines = [];
        var start = 0;
        var delta = 0;
        var number = 0;
        var text = '';
        var end = source.indexOf( '\n', start );
        while ( end >= 0 )
        {
            var line = { start: 0, end: 0, number: 0, sublines: [] };

            delta = 0;
            if ( end - start > 0 && source.charAt( end - 1 ) == '\r' )			// Compensates CR/LF
                delta = 1;
            text += source.substring( start, end ).trim();
            if ( text.charAt( text.length - 1 ) == '\\' )
            {
                text = text.substring( 0, text.length - 1 ).trim();
                line.sublines.push( end + delta + 1 );
                end = source.indexOf( '\n', end + delta + 1 );
                number++;
                continue;                
            }
            line.start = start;
            line.end = end;
            line.text = text;
            lines.push( line );

            start = end + delta + 1;
            number++;
            text = '';
            end = source.indexOf( '\n', start );
        };
        return lines;
    };
    nextWord( source )
    {
        if ( source.position >= line.end )
            return { type: 'eol', word: '' };

        var word = '';
        var type = 'unknown';
        var line = source.lines[ source.currentLine ];
        source.lastPosition = source.currentPosition;
        while ( source.currentPosition < line.end )
        {
            var c = source.text.charAt( source.currentPosition++ );
            var newType = 'symbol';
            if ( c == ' ' || c == '\t' )
                newType = 'space';
            else if ( c >= '0' && c <= '9' )
                newType = 'number';
            else if ( c == '"' || c == "'" )
                newType = 'string';
            else if (c == '#' )
                newType = 'tag';
            else if ( ( c >='a' && c <= 'z' ) || ( c >= 'A' && c <= 'Z' ) || c == '_' )
                newType = 'letter'; 
            else if ( c == '.' || c == ',' || c == ':' )
                newType = 'punctuation';
            else if ( c == '(' || c == ')' || c == '{' || c == '}' || c == '[' || c == ']' )        
                newType = 'bracket';
            else if ( c == '+' || c == '-' || c == '*' || c == '/' || c == '<' || c == '>' || '^' || c == '=' || c == '|' || c == '~' )
                newType = 'operator';
            if ( newType == 'string' )
            {
                word += c;
                while( source.currentPosition < line.end && source.text.charAt( source.currentPosition ) != c )
                    word += source.text.charAt( source.currentPosition++ );
                source.currentPosition++;
                type = newType;
                break;
            }
            if ( type == 'unknown' )
            {
                type = newType;
                word += c;
                if ( type == 'bracket' )
                    break;
            }
            else if ( type == newType )                
                word += c;
            else if ( type == 'letter' && newType == 'number' )
                word += c;
            else if ( type == 'letter' && ( c == '$' || c == '#' || c == '@' ) )
                word += c;
            else if ( type == 'number' && ( c == '.' || c == 'e' || c == 'E' ) )
                word += c;
            else if ( type == 'number' && ( c == '-' || c == '+' ) && ( word.charAt( word.length - 1 ) == 'e' || word.charAt( word.length - 1 ) == 'E' ) ) 
                word += c;
            else if ( type == 'tag' && newType == 'letter' ) 
                word += c;
            else 
                break;
        }
        while( source.currentPosition < line.end && ( source.text.charAt( source.currentPosition ) == ' ' || source.text.charAt( source.currentPosition ) == '\t' ) )
            source.currentPosition++;
        if ( type == 'number' )
        {
            if ( word.indexOf( '.' ) >= 0 && word.indexOf( 'e' ) < 0 && word.indexOf( 'E' ) < 0 )
            {
                type = 'float';
                word = parseFloat( word );
            }
            else
            {
                type = 'integer';
                word = parseInt( word );
            }
        }
        return { type: type, value: word };
    }
    nextLine( source )
    {
        if ( source.currentLine >= source.lines.length )
            return null;
        source.currentLine++;   
        return source.lines[ source.currentLine ];
    }
}
