// Copyright (C) 2017 Alasdair Mercer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    factory();
  }
}(this, function() {
  'use strict';

  // Private constants
  // -----------------

  // Short textual representations of days of the week.
  var DAYS_SHORT = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
  // Long textual representations of days of the week.
  var DAYS_LONG = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  // Format string for [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601).
  var F_ISO_8601 = 'Y-m-d\\TH:i:sP';
  // Format string for [RFC 2822](http://www.faqs.org/rfcs/rfc2822.html).
  var F_RFC_2822 = 'D, j M Y H:i:s O';
  // Short textual representations of months.
  var MONTHS_SHORT = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
  // Long textual representations of months.
  var MONTHS_LONG = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December' ];
  // List of ordinals.
  var ORDINALS = [ 'th', 'st', 'nd', 'rd' ];
  // Regular expression for replacing non uppercase letters.
  var R_NON_UPPERCASE_LETTERS = /[^A-Z]/g;
  // Regular expression used to tokenize format strings.
  var R_TOKEN = /\\?[\\dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g;
  // Regular expression used to extract timezone identifiers.
  var R_TIMEZONE = /\([a-zA-Z ]+\)|:[0-9]{2} [A-Z]{3} /g;
  // Map of tokens that can used to format format a string representation of a date using a `Tokenizer`. The tokens
  // supported are based on those used by [PHP date](http://php.net/manual/en/function.date.php).
  var TOKENS = {
    /* Day */
    // Day of the month, 2 digits with leading zeros.
    // **Example**: `01` to `31`
    d: function(date, tokenizer) {
      return pad(tokenizer.get('j'));
    },
    // Textual representation of a day, three letters.
    // **Example**: `Mon` to `Sun`
    D: function(date, tokenizer) {
      return DAYS_SHORT[tokenizer.get('w')];
    },
    // Day of the month, without leading zeros.
    // **Example**: `1` to `31`
    j: function(date) {
      return date.getDate();
    },
    // Full textual representation of the day of the week.
    // **Example**: 'Monday` to `Sunday`
    l: function(date, tokenizer) {
      return DAYS_LONG[tokenizer.get('w')];
    },
    // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) numeric representation of the day of the week.
    // **Example**: `1` (for Monday) to `7` (for Sunday)
    N: function(date, tokenizer) {
      return tokenizer.get('w') || 7;
    },
    // English ordinal suffix for the day of the month, 2 characters.
    // **Example**: `st`, `nd`, `rd` or `th` (works well with *j*)
    S: function(date, tokenizer) {
      return getOrdinal(tokenizer.get('j'));
    },
    // Numeric representation of the day of the week.
    // **Example**: `0` (for Sunday) to `6` (for Saturday)
    w: function(date) {
      return date.getDay();
    },
    // Day of the year.
    // **Example**: `0` to `365`
    z: function(date) {
      return getDayOfYear(date);
    },
    /* Week */
    // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week number of year, weeks starting on Monday.
    // **Example**: `42` (the 42nd week in the year)
    W: function(date, tokenizer) {
      var iso = tokenizer.getCacheable('iso', function() {
        return getISODate(date);
      });

      return iso.week;
    },
    /* Month */
    // Full textual representation of a month.
    // **Example**: `January` to `December`
    F: function(date, tokenizer) {
      return MONTHS_LONG[tokenizer.get('n') - 1];
    },
    // Numeric representation of a month, with leading zeros.
    // **Example**: `01` to `12`
    m: function(date, tokenizer) {
      return pad(tokenizer.get('n'));
    },
    // Textual representation of a month, three letters.
    // **Example**: `Jan` to `Dec`
    M: function(date, tokenizer) {
      return MONTHS_SHORT[tokenizer.get('n') - 1];
    },
    // Numeric representation of a month, without leading zeros.
    // **Example**: `1` to `12`
    n: function(date) {
      return date.getMonth() + 1;
    },
    // Number of days in the given month.
    // **Example**: `28` to `31`
    t: function(date) {
      return getDaysInMonth(date);
    },
    /* Year */
    // Whether it's a leap year.
    // **Example**: `0` (false) to `1` (true)
    L: function(date) {
      return isLeapYear(date) ? 1 : 0;
    },
    // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) year number. This has the same value as *Y*, except that if
    // the ISO week number (*W*) belongs to the previous or next year, that year is used instead.
    // **Example**: `1999` or `2003`
    o: function(date, tokenizer) {
      var iso = tokenizer.getCacheable('iso', function() {
        return getISODate(date);
      });

      return iso.year;
    },
    // Full numeric representation of a year, 4 digits.
    // **Example**: `1999` or `2003`
    Y: function(date) {
      return date.getFullYear();
    },
    // Numeric representation of a year, 2 digits.
    // **Example**: `99` or `03`
    y: function(date, tokenizer) {
      return String(tokenizer.get('Y')).slice(2);
    },
    /* Time */
    // Lowercase Ante meridiem and Post meridiem.
    // **Example**: `am` or `pm`
    a: function(date, tokenizer) {
      return tokenizer.get('G') < 12 ? 'am' : 'pm';
    },
    // Uppercase Ante meridiem and Post meridiem.
    // **Example**: `AM` or `PM`
    A: function(date, tokenizer) {
      return tokenizer.get('G') < 12 ? 'AM' : 'PM';
    },
    // [Swatch Internet Time](http://en.wikipedia.org/wiki/Swatch_Internet_Time).
    // **Example**: `000` to `999`
    B: function(date) {
      return getSwatchInternetTime(date);
    },
    // 12-hour format of an hour, without leading zeros.
    // **Example**: `1` to `12`
    g: function(date, tokenizer) {
      return tokenizer.get('G') % 12 || 12;
    },
    // 24-hour format of an hour, without leading zeros.
    // **Example**: `0` to `23`
    G: function(date) {
      return date.getHours();
    },
    // 12-hour format of an hour, with leading zeros.
    // **Example**: `01` to `12`
    h: function(date, tokenizer) {
      return pad(tokenizer.get('g'));
    },
    // 24-hour format of an hour, with leading zeros.
    // **Example**: `00` to `23`
    H: function(date, tokenizer) {
      return pad(tokenizer.get('G'));
    },
    // Minutes, with leading zeros.
    // **Example**: `00` to `59`
    i: function(date) {
      return pad(date.getMinutes());
    },
    // Seconds, with leading zeros.
    // **Example**: `00` to `59`
    s: function(date) {
      return pad(date.getSeconds());
    },
    // Microseconds.
    // **Example**: `654000`
    u: function(date) {
      return pad(date.getMilliseconds() * 1000, 6);
    },
    /* Timezone */
    // Timezone identifier. Unfortunately, it doesn't seem possible to replicate the same behaviour as
    // [PHP date](http://php.net/manual/en/function.date.php) here, so this currently duplicates *T*.
    // **Example**: `UTC` or `GMT`
    e: function(date, tokenizer) {
      return tokenizer.get('T');
    },
    // Whether or not the date is in daylight saving time.
    // **Example**: `0` (false) to `1` (true)
    I: function(date) {
      return isDaylightSavingTime(date) ? 1 : 0;
    },
    // Difference to Greenwich time (GMT) in hours.
    // **Example**: `+0200`
    O: function(date) {
      return parseTimezoneOffset(date);
    },
    // Difference to Greenwich time (GMT), with colon between hours and minutes.
    // **Example**: `+02:00`
    P: function(date) {
      return parseTimezoneOffset(date, ':');
    },
    // Timezone abbreviation.
    // **Example**: `UTC` or `GMT`
    T: function(date) {
      return getTimezone(date);
    },
    // Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC
    // is always positive.
    // **Example**: `-43200` to `50400`
    Z: function(date) {
      return date.getTimezoneOffset() * -60;
    },
    /* Full Date/Time */
    // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted date.
    // **Example**: `2004-02-12T15:19:21+00:00`
    c: function(date, tokenizer) {
      return format(date, F_ISO_8601, tokenizer);
    },
    // [RFC 2822](http://www.faqs.org/rfcs/rfc2822.html) formatted date.
    // **Example**: `Thu, 21 Dec 2000 16:01:07 +0200`
    r: function(date, tokenizer) {
      return format(date, F_RFC_2822, tokenizer);
    },
    // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT).
    // **Example**: `1293886861`
    U: function(date) {
      return Math.round(date.getTime() / 1000);
    }
  };

  // Private variables
  // -----------------

  // List of every `scheduleId` that is currently active.
  var tasks = [];

  // Private constructors
  // --------------------

  // Create an instance of `Tokenizer` for `date`.
  function Tokenizer(date) {
    this._date = date;
    this._cache = {};
  }

  // Return the value of `token`. The value will be cached for the lifetime of this `Tokenizer` as to avoid subsequent
  // computations.
  Tokenizer.prototype.get = function(token) {
    var self = this;

    return self.getCacheable('token:' + token, function() {
      return TOKENS[token](self._date, self);
    });
  };

  // Return the value provided by `supplier`. If a value has already been cached against `id`, that value will is to be
  // returned instead of calling `supplier`.
  Tokenizer.prototype.getCacheable = function(id, supplier) {
    var cache = this._cache;

    if (Object.prototype.hasOwnProperty.call(cache, id)) {
      return cache[id];
    }

    var value = supplier();
    cache[id] = value;

    return value;
  };

  // Replace all tokens within `formatStr` while ignoring any escaped by a backslash.
  Tokenizer.prototype.replaceAll = function(formatStr) {
    var self = this;

    return formatStr.replace(R_TOKEN, function(str) {
      if (str === '\\') {
        return str;
      }
      if (str.indexOf('\\') === 0) {
        return str.substr(1);
      }

      return self.get(str);
    });
  };

  // Private functions
  // -----------------

  // Add/subtract the `value` from the specified `field` of the given `date`.
  function addToField(date, field, value) {
    if (value) {
      date['set' + field](date['get' + field]() + value);
    }

    return date;
  }

  // Extend the `Date` object with the new function.
  function extend(name, proto, func) {
    if (proto) {
      if (typeof Date.prototype[name] !== 'function') {
        Date.prototype[name] = func;
      }
    } else if (typeof Date[name] !== 'function') {
      Date[name] = func;
    }
  }

  // Format the given `date` using the format string provided.
  function format(date, formatStr, tokenizer) {
    if (date == null) {
      return '';
    }
    // Use `F_RFC_2822` if no format string was specified.
    if (typeof formatStr !== 'string') {
      formatStr = F_RFC_2822;
    }

    // Only create `tokenizer` if one hasn't already been created (for this call route).
    if (!tokenizer) {
      tokenizer = new Tokenizer(date);
    }

    return tokenizer.replaceAll(formatStr);
  }

  // Return the day of the year for `date`.
  function getDayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 1);

    return Math.floor((date - start) / 1000 / 60 / 60 / 24);
  }

  // Return the days in the month for `date`.
  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  // Determine the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) information for the given `date`.
  function getISODate(date) {
    // Using UTC is much faster.
    var copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var day = copy.getUTCDay();

    // Determine the nearest Thursday.
    copy.setUTCDate(copy.getUTCDate() - ((day + 6) % 7) + 3);

    var start = copy.getTime();

    // 4th of January is 1st week in [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601).
    copy.setUTCMonth(0, 4);

    var week = Math.round((start - copy) / (7 * (1000 * 60 * 60 * 24))) + 1;

    return {
      day: day || 7,
      week: week,
      year: copy.getUTCFullYear()
    };
  }

  // Return ordinal for `value`.
  function getOrdinal(value) {
    return ORDINALS[value % 10 > 3 ? 0 : ((value % 100) - (value % 10) !== 10) * value % 10];
  }

  // Calculate the [Swatch Internet Time](http://en.wikipedia.org/wiki/Swatch_Internet_Time) for the given `date`.
  function getSwatchInternetTime(date) {
    var time = ((date.getUTCHours() + 1) % 24) + (date.getUTCMinutes() / 60) + (date.getUTCSeconds() / (60 * 60));

    return Math.floor(time * 1000 / 24);
  }

  // Return timezone for `date`. Not best implementation but it is the simplest.
  function getTimezone(date) {
    var timezone = (date.toString().match(R_TIMEZONE) || [ '' ])[0];

    return timezone.replace(R_NON_UPPERCASE_LETTERS, '');
  }

  // Return whether or not `date` is in daylight saving time.
  function isDaylightSavingTime(date) {
    var start = new Date(date);
    start.setMonth(0, 1);

    return start.getTimezoneOffset() !== date.getTimezoneOffset();
  }

  // Return whether or not `date` is in a leap year.
  function isLeapYear(date) {
    return (new Date(date.getFullYear(), 1, 29)).getMonth() === 1;
  }

  // Apply left padding of zero characters to the given `value` to ensure consistent sizes.
  function pad(value, size) {
    value = String(value);
    if (!size) {
      size = 2;
    }

    while (value.length < size) {
      value = '0' + value;
    }

    return value;
  }

  // Parse the timezone offset to appear consistently and with the correct prefix (plus/minus).
  function parseTimezoneOffset(date, separator) {
    var offset = date.getTimezoneOffset();
    var parsed = String(pad(Math.floor((Math.abs(offset) / 60) * 100) + (Math.abs(offset) % 60), 4));
    if (separator) {
      parsed = parsed.slice(0, 2) + separator + parsed.slice(2);
    }

    return (offset > 0 ? '-' : '+') + parsed;
  }

  // Schedule the function provided to be called when `date` is reached. `callback` will be called immediately if `date`
  // is *now* or in the past. Return a `scheduleId` for possible use with `unschedule`.
  function schedule(date, callback, context) {
    // Handle optional arguments accordingly.
    if (typeof callback !== 'function') {
      context = callback;
      callback = null;
    }
    if (typeof date === 'function') {
      callback = date;
      date = null;
    }

    var now = new Date();

    if (date == null) {
      date = now;
    }

    var scheduleId;
    var time = date - now;

    // Simple wrapper function to clear out used tasks before calling the scheduled function.
    function wrapper() {
      var index = tasks.indexOf(scheduleId);
      if (index > -1) {
        tasks.splice(index, 1);
        callback.call(context);
      }
    }

    // Check that `callback` is indeed a function and then either call it immediately or schedule it.
    if (typeof callback === 'function') {
      if (time <= 0) {
        callback.call(context);
      } else {
        scheduleId = setTimeout(wrapper, time);
        tasks.push(scheduleId);
      }
    }

    return scheduleId;
  }

  // Prevent a scheduled function from being called.
  function unschedule(scheduleId) {
    var index = tasks.indexOf(scheduleId);
    if (index >= 0) {
      clearTimeout(scheduleId);
      tasks.splice(index, 1);

      return true;
    }

    return false;
  }

  // Public functions
  // ----------------

  // Add/subtract the specified number of `days` from the current date.
  extend('addDays', true, function(days) {
    return addToField(this, 'Date', days);
  });

  // Add/subtract the specified number of `hours` from the current date.
  extend('addHours', true, function(hours) {
    return addToField(this, 'Hours', hours);
  });

  // Add/subtract the specified number of `milliseconds` from the current date.
  extend('addMilliseconds', true, function(milliseconds) {
    return addToField(this, 'Milliseconds', milliseconds);
  });

  // Add/subtract the specified number of `minutes` from the current date.
  extend('addMinutes', true, function(minutes) {
    return addToField(this, 'Minutes', minutes);
  });

  // Add/subtract the specified number of `months` from the current date.
  extend('addMonths', true, function(months) {
    return addToField(this, 'Month', months);
  });

  // Add/subtract the specified number of `seconds` from the current date.
  extend('addSeconds', true, function(seconds) {
    return addToField(this, 'Seconds', seconds);
  });

  // Add/subtract the specified number of `years` from the current date.
  extend('addYears', true, function(years) {
    return addToField(this, 'FullYear', years);
  });

  // Clear the date and time fields for the current date.
  extend('clear', true, function() {
    this.clearDate();
    this.clearTime();

    return this;
  });

  // Clear the date fields for the current date.
  extend('clearDate', true, function() {
    this.setFullYear(0, 0, 1);

    return this;
  });

  // Clear the time fields for the current date.
  extend('clearTime', true, function() {
    this.setHours(0, 0, 0, 0);

    return this;
  });

  // Format `date` using the format string provided.
  extend('format', false, function(date, formatStr) {
    return format(date, formatStr);
  });

  // Format the current date using the format string provided.
  extend('format', true, function(formatStr) {
    return format(this, formatStr);
  });

  // Return the day of the year for the current date.
  extend('getDayOfYear', true, function() {
    return getDayOfYear(this);
  });

  // Return the days in the month for the current date.
  extend('getDaysInMonth', true, function() {
    return getDaysInMonth(this);
  });

  // Return timezone for the current date.
  extend('getTimezone', true, function() {
    return getTimezone(this);
  });

  // Return the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week number of the year for the current date.
  extend('getWeekOfYear', true, function() {
    return getISODate(this).week;
  });

  // Return the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) year number. This has the same value as `getFullYear`,
  // except that if the ISO week number (`getWeekOfYear`) belongs to the previous or next year, that year is used
  // instead.
  extend('getYearOfWeek', true, function() {
    return getISODate(this).year;
  });

  // Return whether or not the current date is in daylight saving time.
  extend('isDaylightSavingTime', true, function() {
    return isDaylightSavingTime(this);
  });

  // Return whether or not the current date is in a leap year.
  extend('isLeapYear', true, function() {
    return isLeapYear(this);
  });

  // Schedule the function provided to be called when `date` is reached. `callback` will be called immediately if `date`
  // is *now* or in the past. Return a `scheduleId` for possible use with `unschedule`.
  extend('schedule', false, function(date, callback, context) {
    return schedule(date, callback, context);
  });

  // Schedule the function provided to be called when the current date is reached. `callback` will be called immediately
  // if current date is *now* or in the past. Return a `scheduleId` for possible use with `unschedule`.
  extend('schedule', true, function(callback, context) {
    return schedule(this, callback, context);
  });

  // Prevent a scheduled function from being called.
  extend('unschedule', false, unschedule);
  extend('unschedule', true, unschedule);
}));
