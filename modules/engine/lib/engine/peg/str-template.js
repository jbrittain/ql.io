module.exports = (function(){
    /*
     * Generated by PEG.js 0.7.0.
     *
     * http://pegjs.majda.cz/
     */

    function quote(s) {
        /*
         * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
         * string literal except for the closing quote character, backslash,
         * carriage return, line separator, paragraph separator, and line feed.
         * Any character may appear in the form of an escape sequence.
         *
         * For portability, we also escape escape all control and non-ASCII
         * characters. Note that "\0" and "\v" escape sequences are not used
         * because JSHint does not like the first and IE the second.
         */
        return '"' + s
            .replace(/\\/g, '\\\\')  // backslash
            .replace(/"/g, '\\"')    // closing quote character
            .replace(/\x08/g, '\\b') // backspace
            .replace(/\t/g, '\\t')   // horizontal tab
            .replace(/\n/g, '\\n')   // line feed
            .replace(/\f/g, '\\f')   // form feed
            .replace(/\r/g, '\\r')   // carriage return
            .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
            + '"';
    }

    var result = {
        /*
         * Parses the input with a generated parser. If the parsing is successfull,
         * returns a value explicitly or implicitly specified by the grammar from
         * which the parser was generated (see |PEG.buildParser|). If the parsing is
         * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
         */
        parse: function(input, startRule) {
            var parseFunctions = {
                "template": parse_template,
                "literal": parse_literal,
                "expression": parse_expression,
                "variable": parse_variable,
                "digits": parse_digits
            };

            if (startRule !== undefined) {
                if (parseFunctions[startRule] === undefined) {
                    throw new Error("Invalid rule name: " + quote(startRule) + ".");
                }
            } else {
                startRule = "template";
            }

            var pos = { offset: 0, line: 1, column: 1, seenCR: false };
            var reportFailures = 0;
            var rightmostFailuresPos = { offset: 0, line: 1, column: 1, seenCR: false };
            var rightmostFailuresExpected = [];

            function padLeft(input, padding, length) {
                var result = input;

                var padLength = length - input.length;
                for (var i = 0; i < padLength; i++) {
                    result = padding + result;
                }

                return result;
            }

            function escape(ch) {
                var charCode = ch.charCodeAt(0);
                var escapeChar;
                var length;

                if (charCode <= 0xFF) {
                    escapeChar = 'x';
                    length = 2;
                } else {
                    escapeChar = 'u';
                    length = 4;
                }

                return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
            }

            function clone(object) {
                var result = {};
                for (var key in object) {
                    result[key] = object[key];
                }
                return result;
            }

            function advance(pos, n) {
                var endOffset = pos.offset + n;

                for (var offset = pos.offset; offset < endOffset; offset++) {
                    var ch = input.charAt(offset);
                    if (ch === "\n") {
                        if (!pos.seenCR) { pos.line++; }
                        pos.column = 1;
                        pos.seenCR = false;
                    } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                        pos.line++;
                        pos.column = 1;
                        pos.seenCR = true;
                    } else {
                        pos.column++;
                        pos.seenCR = false;
                    }
                }

                pos.offset += n;
            }

            function matchFailed(failure) {
                if (pos.offset < rightmostFailuresPos.offset) {
                    return;
                }

                if (pos.offset > rightmostFailuresPos.offset) {
                    rightmostFailuresPos = clone(pos);
                    rightmostFailuresExpected = [];
                }

                rightmostFailuresExpected.push(failure);
            }

            function parse_template() {
                var result0, result1;
                var pos0;

                pos0 = clone(pos);
                result0 = [];
                result1 = parse_expression();
                if (result1 === null) {
                    result1 = parse_literal();
                }
                while (result1 !== null) {
                    result0.push(result1);
                    result1 = parse_expression();
                    if (result1 === null) {
                        result1 = parse_literal();
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset, line, column, c) {
                        var o = [];
                        o.push(c[0]);
                        var current = 0;
                        for(var i = 1; i < c.length; i++) {
                            if(typeof c[i] === 'string' && typeof o[current] === 'string') {
                                o[current] = o[current] + c[i];
                            }
                            else {
                                o.push(c[i]);
                                current++;
                            }
                        }
                        return {
                            format: function(bag, keep) {
                                return _format('', o, bag, keep);
                            },
                            stream: o
                        }
                    })(pos0.offset, pos0.line, pos0.column, result0);
                }
                if (result0 === null) {
                    pos = clone(pos0);
                }
                return result0;
            }

            function parse_literal() {
                var result0;

                if (/^[^`{}]/.test(input.charAt(pos.offset))) {
                    result0 = input.charAt(pos.offset);
                    advance(pos, 1);
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("[^`{}]");
                    }
                }
                if (result0 === null) {
                    if (input.charCodeAt(pos.offset) === 32) {
                        result0 = " ";
                        advance(pos, 1);
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\" \"");
                        }
                    }
                }
                if (result0 === null) {
                    result0 = parse_expression();
                }
                return result0;
            }

            function parse_expression() {
                var result0, result1, result2;
                var pos0, pos1;

                pos0 = clone(pos);
                pos1 = clone(pos);
                if (input.charCodeAt(pos.offset) === 123) {
                    result0 = "{";
                    advance(pos, 1);
                } else {
                    result0 = null;
                    if (reportFailures === 0) {
                        matchFailed("\"{\"");
                    }
                }
                if (result0 !== null) {
                    result1 = parse_variable();
                    if (result1 !== null) {
                        if (input.charCodeAt(pos.offset) === 125) {
                            result2 = "}";
                            advance(pos, 1);
                        } else {
                            result2 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"}\"");
                            }
                        }
                        if (result2 !== null) {
                            result0 = [result0, result1, result2];
                        } else {
                            result0 = null;
                            pos = clone(pos1);
                        }
                    } else {
                        result0 = null;
                        pos = clone(pos1);
                    }
                } else {
                    result0 = null;
                    pos = clone(pos1);
                }
                if (result0 !== null) {
                    result0 = (function(offset, line, column, v) {
                        var token = {
                            variable: v,
                            str: stringify(v)
                        };
                        return token;
                    })(pos0.offset, pos0.line, pos0.column, result0[1]);
                }
                if (result0 === null) {
                    pos = clone(pos0);
                }
                return result0;
            }

            function parse_variable() {
                var result0, result1;
                var pos0;

                pos0 = clone(pos);
                result0 = [];
                result1 = parse_literal();
                while (result1 !== null) {
                    result0.push(result1);
                    result1 = parse_literal();
                }
                if (result0 !== null) {
                    result0 = (function(offset, line, column, l) {
                        var o = [];
                        o.push(l[0]);
                        var current = 0;
                        for(var i = 1; i < l.length; i++) {
                            if(typeof l[i] === 'string' && typeof o[current] === 'string') {
                                o[current] = o[current] + l[i];
                            }
                            else {
                                o.push(l[i]);
                                current++;
                            }
                        }
                        return (o.length === 1) ? o[0] : o;
                    })(pos0.offset, pos0.line, pos0.column, result0);
                }
                if (result0 === null) {
                    pos = clone(pos0);
                }
                return result0;
            }

            function parse_digits() {
                var result0, result1;
                var pos0;

                pos0 = clone(pos);
                result0 = [];
                if (/^[0-9]/.test(input.charAt(pos.offset))) {
                    result1 = input.charAt(pos.offset);
                    advance(pos, 1);
                } else {
                    result1 = null;
                    if (reportFailures === 0) {
                        matchFailed("[0-9]");
                    }
                }
                while (result1 !== null) {
                    result0.push(result1);
                    if (/^[0-9]/.test(input.charAt(pos.offset))) {
                        result1 = input.charAt(pos.offset);
                        advance(pos, 1);
                    } else {
                        result1 = null;
                        if (reportFailures === 0) {
                            matchFailed("[0-9]");
                        }
                    }
                }
                if (result0 !== null) {
                    result0 = (function(offset, line, column, d) {
                        var str = '';
                        for(var i = 0; i < d.length; i++) {
                            str += d[i];
                        }
                        return str;
                    })(pos0.offset, pos0.line, pos0.column, result0);
                }
                if (result0 === null) {
                    pos = clone(pos0);
                }
                return result0;
            }


            function cleanupExpected(expected) {
                expected.sort();

                var lastExpected = null;
                var cleanExpected = [];
                for (var i = 0; i < expected.length; i++) {
                    if (expected[i] !== lastExpected) {
                        cleanExpected.push(expected[i]);
                        lastExpected = expected[i];
                    }
                }
                return cleanExpected;
            }



            function typeOf(value) {
                var s = typeof value;
                if(s === 'object') {
                    if(value) {
                        if(typeof value.length === 'number' &&
                            !(value.propertyIsEnumerable('length')) &&
                            typeof value.splice === 'function') {
                            s = 'array';
                        }
                    }
                    else {
                        s = 'null';
                    }
                }
                return s;
            }
            function select(path, obj) {
                var splits = !path ? [] : path.split('.');
                var curr = obj, ctype;
                for(var i = 0; i < splits.length; i++) {
                    if(curr[splits[i]]) {
                        curr = curr[splits[i]];
                    }
                    else {
                        return null;
                    }
                }
                var ctype = typeOf(curr);
                if(ctype === 'array' || ctype === 'object') curr = undefined;
                return curr;
            }
            function stringify(v) {
                var str  = '';
                var type = typeOf(v);
                if(type === 'array') {
                    for(var i = 0; i < v.length; i++) {
                        str = str + stringify(v[i]);
                    }
                }
                else if(type === 'object' && v.variable) {
                    str = str + '{' + stringify(v.variable) + '}';
                }
                else if(type === 'string') {
                    str = str + v;
                }
                return str;
            }
            function append(arr) {
                var str = '';
                for(var i = 0; i < arr.length; i++) {
                    if(typeOf(arr[i]) == 'array') {
                        str += append(arr[i]);
                    }
                    else if (typeof arr[i] === 'object') {
                        str += JSON.stringify(arr[i].object);
                    }
                    else {
                        str += arr[i];
                    }
                }
                return str;
            }
            function _format(str, stream, bag, keep) {
                bag = bag || {};
                var i, j, val, ele, str = '';
                for(i = 0; i < stream.length; i++) {
                    ele = stream[i];
                    if(ele.constructor === String) {
                        str = str + ele;
                    }
                    else {
                        if(ele.variable.constructor == Array) {
                            // Case of nested token - only single valued for now
                            key = _format('', ele.variable, bag, keep);
                            val = select(key, bag);
                            if(val) {
                                str = str + val;
                            }
                            else if(keep) {
                                str = str + '{' + ele.str + '}'
                            }
                        }
                        else {
                            val = select(ele.variable, bag);
                            if(val) {
                                str = str + val;
                            }
                            else if(keep) {
                                str = str + '{' + ele.str + '}'
                            }
                        }
                    }
                }
                return str;
            }


            var result = parseFunctions[startRule]();

            /*
             * The parser is now in one of the following three states:
             *
             * 1. The parser successfully parsed the whole input.
             *
             *    - |result !== null|
             *    - |pos.offset === input.length|
             *    - |rightmostFailuresExpected| may or may not contain something
             *
             * 2. The parser successfully parsed only a part of the input.
             *
             *    - |result !== null|
             *    - |pos.offset < input.length|
             *    - |rightmostFailuresExpected| may or may not contain something
             *
             * 3. The parser did not successfully parse any part of the input.
             *
             *   - |result === null|
             *   - |pos.offset === 0|
             *   - |rightmostFailuresExpected| contains at least one failure
             *
             * All code following this comment (including called functions) must
             * handle these states.
             */
            if (result === null || pos.offset !== input.length) {
                var offset = Math.max(pos.offset, rightmostFailuresPos.offset);
                var found = offset < input.length ? input.charAt(offset) : null;
                var errorPosition = pos.offset > rightmostFailuresPos.offset ? pos : rightmostFailuresPos;

                throw new this.SyntaxError(
                    cleanupExpected(rightmostFailuresExpected),
                    found,
                    offset,
                    errorPosition.line,
                    errorPosition.column
                );
            }

            return result;
        },

        /* Returns the parser source code. */
        toSource: function() { return this._source; }
    };

    /* Thrown when a parser encounters a syntax error. */

    result.SyntaxError = function(expected, found, offset, line, column) {
        function buildMessage(expected, found) {
            var expectedHumanized, foundHumanized;

            switch (expected.length) {
                case 0:
                    expectedHumanized = "end of input";
                    break;
                case 1:
                    expectedHumanized = expected[0];
                    break;
                default:
                    expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
                        + " or "
                        + expected[expected.length - 1];
            }

            foundHumanized = found ? quote(found) : "end of input";

            return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
        }

        this.name = "SyntaxError";
        this.expected = expected;
        this.found = found;
        this.message = buildMessage(expected, found);
        this.offset = offset;
        this.line = line;
        this.column = column;
    };

    result.SyntaxError.prototype = Error.prototype;

    return result;
})();