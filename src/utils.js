/**
 * Utility to iterate over radio/checkbox/selection options.
 * it accept three formats: array of values, map, array of 1-element maps
 *
 * @param options {object|array}
 * @param tpl {callable} (takes key and text)
 */
function iterateOptions(options, tpl) {
    if (options) {
        if ($.isArray(options)) {
            options.forEach(function(entry, index) {
                // array of one-element maps
                if ($.isPlainObject(entry)) {
                    $.each(entry, function(key, val) {
                        tpl(key, val);
                        return false; // break after first entry
                    });
                }
                // array of values
                else {
                    tpl(index, entry);
                }
            });
        }
        // unordered map
        else {
            $.each(options, function(key, val) {
                tpl(key, val);
            });
        }
    }
}

/**
 * Replaces {0}, {1}, ... in a string
 * @param str {string}
 * @param args,... {string|int|float}
 * @return {string}
 */
function fmt(str, args) {
    args = Array.prototype.slice.call(arguments);

    return str.replace(/{([0-9]+)}/g, function(m, i) {
        return args[parseInt(i)+1];
    });
}

/**
 * Output internal error with jQuery.error
 * @see fmt
 */
function error() {
    $.error(fmt.apply(null, arguments));
}

/**
 * Change type of a value to int or float
 * @param value {mixed}
 * @param type {string} 'integer', 'double' or anything else
 * @param boolAsInt {boolean} return 0 or 1 for booleans
 * @return {mixed}
 */
function changeType(value, type, boolAsInt) {
    switch (type) {
        case 'integer': return parseInt(value);
        case 'double': return parseFloat(value);
        case 'boolean':
            var bool = value.trim().toLowerCase() === "true" || value.trim() === '1' || value === 1;
            return  boolAsInt ? (bool ? 1 : 0) : bool;
        default: return value;
    }
}

/**
 * Escape string like mysql_real_escape_string
 * @param value {string}
 * @return {string}
 */
function escapeString(value) {
    if (typeof value !== 'string') {
        return value;
    }

    return value
      .replace(/[\0\n\r\b\\\'\"]/g, function(s) {
          switch(s) {
              case '\0': return '\\0';
              case '\n': return '\\n';
              case '\r': return '\\r';
              case '\b': return '\\b';
              default:   return '\\' + s;
          }
      })
      // uglify compliant
      .replace(/\t/g, '\\t')
      .replace(/\x1a/g, '\\Z');
}

/**
 * Escape value for use in regex
 * @param value {string}
 * @return {string}
 */
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}