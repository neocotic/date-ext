// [date.js](http://neocotic.com/date.js) 1.0.1  
// (c) 2012 Alasdair Mercer  
// Freely distributable under the MIT license.  
// For all details and documentation:  
// <http://neocotic.com/date.js>

(function() {

  // Private constants
  // -----------------

      // Textual representations of days of the week.
  var DAYS = [
          /* Short */
          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
          /* Full */
        , 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
        , 'Saturday'
      ]
      // Format string for [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601).
    , F_ISO_8601 = 'Y-m-d\\TH:i:sP'
      // Format string for [RFC 2822](http://www.faqs.org/rfcs/rfc2822.html).
    , F_RFC_2822 = 'D, j M Y H:i:s O'
    // Textual representations of months.
    , MONTHS = [
          /* Short */
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'
        , 'Nov', 'Dec'
          /* Full  */
        , 'January', 'February', 'March', 'April', 'May', 'June', 'July'
        , 'August', 'September', 'October', 'November', 'December'
      ]
    // List of ordinals for *S*.
    , ORDINALS = ['th', 'st', 'nd', 'rd']
    // Regular expression used to tokenise format strings.
    , R_TOKEN = /\\?[\\dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g
    // Regular expression used to extract timezone identifiers.
    , R_TIMEZONE = /([A-Z]+)(?=[\-\+]\d{4})/g;

  // Private variables
  // -----------------

  // List of every `scheduleId` that is currently active.
  var tasks = [];

  // Private functions
  // -----------------

  // Add/subtract the `value` from the specified `field` of the given `date`.
  function addToField(date, field, value) {
    if (value) date['set' + field](date['get' + field]() + value);
    return date;
  }

  // Format the given `date` using the format string provided.
  function format(date, formatStr, params) {
    // Use `F_RFC_2822` if no format string was specified.
    if ('string' !== typeof formatStr) formatStr = F_RFC_2822;
    // Only populate `params` if it hasn't already been (for this call route).
    if (!params) {
      // Helper variables to be used when populating parameters.
      var iso = getISODate(date)
        , j = date.getDate()
        , w = date.getDay()
        , n = date.getMonth()
        , Y = date.getFullYear()
        , G = date.getHours()
        , e = date.toString().match(R_TIMEZONE);
      // Based on the parameters of
      // [PHP date](http://php.net/manual/en/function.date.php).
      params = {
          /* Day */
          // Day of the month, 2 digits with leading zeros.  
          // **Example**: `01` to `31`
          d: pad(j)
          // Textual representation of a day, three letters.  
          // **Example**: `Mon` to `Sun`
        , D: DAYS[w]
          // Day of the month, without leading zeros.  
          // **Example**: `1` to `31`
        , j: j
          // Full textual representation of the day of the week.  
          // **Example**: 'Monday` to `Sunday`
        , l: DAYS[w + 7]
          // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) numeric
          // representation of the day of the week.  
          // **Example**: `1` (for Monday) to `7` (for Sunday)
        , N: w || 7
          // English ordinal suffix for the day of the month, 2 characters.  
          // **Example**: `st`, `nd`, `rd` or `th` (works well with *j*)
        , S: ORDINALS[(j % 10 > 3) ? 0 : (j % 100 - j % 10 !== 10) * j % 10]
          // Numeric representation of the day of the week.  
          // **Example**: `0` (for Sunday) to `6` (for Saturday)
        , w: w
          // Day of the year.  
          // **Example**: `0` to `365`
        , z: date.getDayOfYear()
          /* Week */
          // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week number of
          // year, weeks starting on Monday.  
          // **Example**: `42` (the 42nd week in the year)
        , W: iso.week
          /* Month */
          // Full textual representation of a month.  
          // **Example**: `January` to `December`
        , F: MONTHS[n + 12]
          // Numeric representation of a month, with leading zeros.  
          // **Example**: `01` to `12`
        , m: pad(n + 1)
          // Textual representation of a month, three letters.  
          // **Example**: `Jan` to `Dec`
        , M: MONTHS[n]
          // Numeric representation of a month, without leading zeros.  
          // **Example**: `1` to `12`
        , n: n + 1
          // Number of days in the given month.  
          // **Example**: `28` to `31`
        , t: date.getDaysInMonth()
          /* Year */
          // Whether it's a leap year.  
          // **Example**: `0` (false) to `1` (true)
        , L: date.isLeapYear() ? 1 : 0
          // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) year number.
          // This has the same value as *Y*, except that if the ISO week number
          // (*W*) belongs to the previous or next year, that year is used
          // instead.  
          // **Example**: `1999` or `2003`
        , o: iso.year
          // Full numeric representation of a year, 4 digits.  
          // **Example**: `1999` or `2003`
        , Y: Y
          // Numeric representation of a year, 2 digits.  
          // **Example**: `99` or `03`
        , y: String(Y).slice(2)
          /* Time */
          // Lowercase Ante meridiem and Post meridiem.  
          // **Example**: `am` or `pm`
        , a: (G < 12) ? 'am' : 'pm'
          // Uppercase Ante meridiem and Post meridiem.  
          // **Example**: `AM` or `PM`
        , A: (G < 12) ? 'AM' : 'PM'
          // [Swatch Internet
          // Time](http://en.wikipedia.org/wiki/Swatch_Internet_Time).  
          // **Example**: `000` to `999`
        , B: getSwatchInternetTime(date)
          // 12-hour format of an hour, without leading zeros.  
          // **Example**: `1` to `12`
        , g: G % 12 || 12
          // 24-hour format of an hour, without leading zeros.  
          // **Example**: `0` to `23`
        , G: G
          // 12-hour format of an hour, with leading zeros.  
          // **Example**: `01` to `12`
        , h: pad(G % 12 || 12)
          // 24-hour format of an hour, with leading zeros.  
          // **Example**: `00` to `23`
        , H: pad(G)
          // Minutes, with leading zeros.  
          // **Example**: `00` to `59`
        , i: pad(date.getMinutes())
          // Seconds, with leading zeros.  
          // **Example**: `00` to `59`
        , s: pad(date.getSeconds())
          // Microseconds.  
          // **Example**: `654000`
        , u: pad(date.getMilliseconds() * 1000, 6)
          /* Timezone */
          // Timezone identifier.  
          // Unfortunately, it doesn't seem possible to replicate the same
          // behaviour as [PHP
          // date](http://php.net/manual/en/function.date.php) here, so this
          // currently duplicates *T*.  
          // **Example**: `UTC` or `GMT`
        , e: e ? e[0] : ''
          // Whether or not the date is in daylight saving time.  
          // **Example**: `0` (false) to `1` (true)
        , I: date.isDaylightSavingTime() ? 1 : 0
          // Difference to Greenwich time (GMT) in hours.  
          // **Example**: `+0200`
        , O: parseTimezoneOffset(date)
          // Difference to Greenwich time (GMT), with colon between hours and
          // minutes.  
          // **Example**: `+02:00`
        , P: parseTimezoneOffset(date, ':')
          // Timezone abbreviation.  
          // **Example**: `UTC` or `GMT`
        , T: e ? e[0] : ''
          // Timezone offset in seconds. The offset for timezones west of UTC
          // is always negative, and for those east of UTC is always
          // positive.  
          // **Example**: `-43200` to `50400`
        , Z: date.getTimezoneOffset() * -60
          /* Full Date/Time */
          // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted
          // date.  
          // **Example**: `2004-02-12T15:19:21+00:00`
        , c: ''
          // [RFC 2822](http://www.faqs.org/rfcs/rfc2822.html) formatted
          // date.  
          // **Example**: `Thu, 21 Dec 2000 16:01:07 +0200`
        , r: ''
          // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT).  
          // **Example**: `1293886861`
        , U: Math.round(date.getTime() / 1000)
      };
      // Populate *c* and *r* while avoiding infinite circular calls to
      // `format`.
      params.c = format(date, F_ISO_8601, params);
      params.r = format(date, F_RFC_2822, params);
    }
    // Replace all parameters within format string while ignoring any escaped
    // by a backslash.
    return formatStr.replace(R_TOKEN, function(str) {
      if ('\\' === str) return str;
      if (0 === str.indexOf('\\')) return str.substr(1);
      return params[str];
    });
  }

  // Determine the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601)
  // information for the given `date`.
  function getISODate(date) {
    // Using UTC is much faster.
    var copy = new Date(Date.UTC(date.getFullYear(), date.getMonth()
        , date.getDate()))
      , day = copy.getUTCDay();
    // Determine the nearest Thursday.
    copy.setUTCDate(copy.getUTCDate() - (day + 6) % 7 + 3);
    var start = copy.getTime();
    // 4th of January is 1st week in [ISO
    // 8601](http://en.wikipedia.org/wiki/ISO_8601).
    copy.setUTCMonth(0, 4);
    var week = Math.round((start - copy) / (7 * (1000 * 60 * 60 * 24))) + 1;
    return {
        day: day || 7
      , week: week
      , year: copy.getUTCFullYear()
    };
  }

  // Calculate the [Swatch Internet
  // Time](http://en.wikipedia.org/wiki/Swatch_Internet_Time) for the given
  // `date`.
  function getSwatchInternetTime(date) {
    var time = ((date.getUTCHours() + 1) % 24) + (date.getUTCMinutes() / 60)
          + (date.getUTCSeconds() / (60 * 60));
    return Math.floor(time * 1000 / 24);
  }

  // Apply left padding of zero characters to the given `value` to ensure
  // consistent sizes.
  function pad(value, size) {
    size  = size || 2;
    value = String(value);
    while (value.length < size) value = '0' + value;
    return value;
  }

  // Parse the timezone offset to appear consistently and with the correct
  // prefix (plus/minus).
  function parseTimezoneOffset(date, separator) {
    var offset = date.getTimezoneOffset()
      , parsed = String(pad(Math.floor(Math.abs(offset) / 60) * 100
          + Math.abs(offset) % 60, 4));
    if (separator) parsed = parsed.slice(0, 2) + separator + parsed.slice(2);
    return ((offset > 0) ? '-' : '+') + parsed;
  }

  // Public functions
  // ----------------

  // Add/subtract the specified number of `days` from the current date.
  Date.prototype.addDays = function(days) {
    return addToField(this, 'Date', days);
  };

  // Add/subtract the specified number of `hours` from the current date.
  Date.prototype.addHours = function(hours) {
    return addToField(this, 'Hours', hours);
  };

  // Add/subtract the specified number of `milliseconds` from the current date.
  Date.prototype.addMilliseconds = function(milliseconds) {
    return addToField(this, 'Milliseconds', milliseconds);
  };

  // Add/subtract the specified number of `minutes` from the current date.
  Date.prototype.addMinutes = function(minutes) {
    return addToField(this, 'Minutes', minutes);
  };

  // Add/subtract the specified number of `months` from the current date.
  Date.prototype.addMonths = function(months) {
    return addToField(this, 'Month', months);
  };

  // Add/subtract the specified number of `seconds` from the current date.
  Date.prototype.addSeconds = function(seconds) {
    return addToField(this, 'Seconds', seconds);
  };

  // Add/subtract the specified number of `years` from the current date.
  Date.prototype.addYears = function(years) {
    return addToField(this, 'FullYear', years);
  };

  // Clear the date and time fields for the current date.
  Date.prototype.clear = function() {
    this.clearDate();
    this.clearTime();
    return this;
  };

  // Clear the date fields for the current date.
  Date.prototype.clearDate = function() {
    this.setFullYear(0, 0, 1);
    return this;
  };

  // Clear the time fields for the current date.
  Date.prototype.clearTime = function() {
    this.setHours(0, 0, 0, 0);
    return this;
  };

  // Format the current date using the format string provided.
  Date.prototype.format = function(formatStr) {
    return format(this, formatStr);
  };

  // Return the day of the year for the current date.
  Date.prototype.getDayOfYear = function() {
    var start = new Date(this.getFullYear(), 0, 1);
    return Math.floor((this - start) / 1000 / 60 / 60 / 24);
  };

  // Return the days in the month for the current date.
  Date.prototype.getDaysInMonth = function() {
    return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
  };

  // Return the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week number
  // of the year for the current date.
  Date.prototype.getWeekOfYear = function() {
    return getISODate(this).week;
  };

  // Return the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) year number.
  // This has the same value as `getFullYear`, except that if the ISO week
  // number (`getWeekOfYear`) belongs to the previous or next year, that year
  // is used instead.
  Date.prototype.getYearOfWeek = function() {  
    return getISODate(this).year;
  };

  // Return whether or not the current date is in daylight saving time.
  Date.prototype.isDaylightSavingTime = function() {
    var start = new Date(this);
    start.setMonth(0, 1);
    return start.getTimezoneOffset() !== this.getTimezoneOffset();
  };

  // Return whether or not the current date is in a leap year.
  Date.prototype.isLeapYear = function() {
    return 1 === (new Date(this.getFullYear(), 1, 29)).getMonth();
  };

  // Schedule the function provided to be called when `date` is reached.  
  // `callback` will be called immediately if `date` is *now* or in the past.  
  // Return a `scheduleId` for possible use with `unschedule`.
  Date.schedule = function(date, callback, context) {
    // Handle optional arguments accordingly.
    if ('string' === typeof callback) {
      context = callback;
      callback = null;
    }
    if ('function' === typeof date) {
      callback = date;
      date = null;
    }
    if (date == null) date = new Date();
    var scheduleId
      , time = date - new Date();
    // Simple wrapper function to clear out used tasks before calling the
    // scheduled function.
    function wrapper() {
      var idx = tasks.indexOf(scheduleId);
      if (idx > -1) {
        tasks.splice(idx, 1);
        callback.call(context);
      }
    }
    // Check that `callback` is indeed a function and then either call it
    // immediately or schedule it.
    if ('function' === typeof callback) {
      if (time <= 0) {
        callback.call(context);
      } else {
        tasks.push(scheduleId = setTimeout(wrapper, time));
      }
    }
    return scheduleId;
  };

  // Schedule the function provided to be called when the current date is
  // reached.  
  // `callback` will be called immediately if current date is *now* or in the
  // past.  
  // Return a `scheduleId` for possible use with `unschedule`.
  Date.prototype.schedule = function(callback, context) {
    return Date.schedule(this, callback, context);
  };

  // Prevent a scheduled function from being called.
  Date.unschedule = Date.prototype.unschedule = function(scheduleId) {
    var idx = tasks.indexOf(scheduleId);
    if (idx > -1) {
      clearTimeout(scheduleId);
      tasks.splice(idx, 1);
      return true;
    }
    return false;
  };

}());