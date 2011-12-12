// [date.js](http://neocotic.com/date.js) 1.0.0  
// (c) 2011 Alasdair Mercer  
// Freely distributable under the MIT license.  
// For all details and documentation:  
// <http://neocotic.com/date.js>

(function () {

  // Private constants
  // -----------------

  var
    // Textual representations of days of the week.
    DAYS       = [
      /* Short */
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      /* Full  */
      'Sunday',  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
      'Saturday'
    ],
    // Format string for [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601).
    F_ISO_8601 = 'Y-m-d\\TH:i:sP',
    // Format string for [RFC 2822](http://www.faqs.org/rfcs/rfc2822.html).
    F_RFC_2822 = 'D, j M Y H:i:s O',
    // Textual representations of months.
    MONTHS     = [
      /* Short */
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
      'Nov', 'Dec',
      /* Full  */
      'January', 'February',  'March',   'April',    'May',     'June', 'July',
      'August',  'September', 'October', 'November', 'December'
    ],
    // Map of ordinals for *S*.
    ORDINALS   = ['th', 'st', 'nd', 'rd'],
    // Regular expression used to tokenise format strings.
    R_TOKEN    = /\\?[\\dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
    // Regular expression used to extract timezone identifiers.
    R_TIMEZONE = /([A-Z]+)(?=[\-\+]\d{4})/g;

  // Private functions
  // -----------------

  // Format the given `date` using the format string provided.
  function format(date, formatStr, params) {
    // Use `F_RFC_2822` if no format string was specified.
    if (typeof formatStr !== 'string') formatStr = F_RFC_2822;
    // Only populate `params` if it hasn't already been (for this call route).
    if (!params) {
      // Helper variables to be used when populating parameters.
      var
        j = date.getDate(),
        w = date.getDay(),
        z = date.getDayOfYear(),
        W = date.getWeekOfYear(),
        n = date.getMonth(),
        t = date.getDaysInMonth(),
        o = date.getYearOfWeek(),
        Y = date.getFullYear(),
        G = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds(),
        u = date.getMilliseconds(),
        e = date.toString().match(R_TIMEZONE),
        Z = date.getTimezoneOffset(),
        U = date.getTime();
      // Based on the parameters of
      // [PHP date](http://php.net/manual/en/function.date.php).
      params = {

        /* Day */

        // Day of the month, 2 digits with leading zeros.  
        // **Example**: `01` to `31`
        d: pad(j),
        // Textual representation of a day, three letters.  
        // **Example**: `Mon` to `Sun`
        D: DAYS[w],
        // Day of the month, without leading zeros.  
        // **Example**: `1` to `31`
        j: j,
        // Full textual representation of the day of the week.  
        // **Example**: 'Monday` to `Sunday`
        l: DAYS[w + 7],
        // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) numeric
        // representation of the day of the week.  
        // **Example**: `1` (for Monday) to `7` (for Sunday)
        N: w || 7,
        // English ordinal suffix for the day of the month, 2 characters.  
        // **Example**: `st`, `nd`, `rd` or `th` (works well with *j*)
        S: ORDINALS[(j % 10 > 3) ? 0 : (j % 100 - j % 10 !== 10) * j % 10],
        // Numeric representation of the day of the week.  
        // **Example**: `0` (for Sunday) to `6` (for Saturday)
        w: w,
        // Day of the year.  
        // **Example**: `0` to `365`
        z: z,

        /* Week */

        // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week number of
        // year, weeks starting on Monday.  
        // **Example**: `42` (the 42nd week in the year)
        W: W,

        /* Month */

        // Full textual representation of a month.  
        // **Example**: `January` to `December`
        F: MONTHS[n + 12],
        // Numeric representation of a month, with leading zeros.  
        // **Example**: `01` to `12`
        m: pad(n + 1),
        // Textual representation of a month, three letters.  
        // **Example**: `Jan` to `Dec`
        M: MONTHS[n],
        // Numeric representation of a month, without leading zeros.  
        // **Example**: `1` to `12`
        n: n + 1,
        // Number of days in the given month.  
        // **Example**: `28` to `31`
        t: t,

        /* Year */

        // Whether it's a leap year.  
        // **Example**: `0` (false) to `1` (true)
        L: date.isLeapYear() ? 1 : 0,
        // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) year number. This
        // has the same value as *Y*, except that if the ISO week number (*W*)
        // belongs to the previous or next year, that year is used instead.  
        // **Example**: `1999` or `2003`
        o: o,
        // Full numeric representation of a year, 4 digits.  
        // **Example**: `1999` or `2003`
        Y: Y,
        // Numeric representation of a year, 2 digits.  
        // **Example**: `99` or `03`
        y: String(Y).slice(2),

        /* Time */

        // Lowercase Ante meridiem and Post meridiem.  
        // **Example**: `am` or `pm`
        a: (G < 12) ? 'am' : 'pm',
        // Uppercase Ante meridiem and Post meridiem.  
        // **Example**: `AM` or `PM`
        A: (G < 12) ? 'AM' : 'PM',
        // Swatch Internet Time.  
        // **Example**: `000` to `999`
        B: getSwatchInternetTime(date),
        // 12-hour format of an hour, without leading zeros.  
        // **Example**: `1` to `12`
        g: G % 12 || 12,
        // 24-hour format of an hour, without leading zeros.  
        // **Example**: `0` to `23`
        G: G,
        // 12-hour format of an hour, with leading zeros.  
        // **Example**: `01` to `12`
        h: pad(G % 12 || 12),
        // 24-hour format of an hour, with leading zeros.  
        // **Example**: `00` to `23`
        H: pad(G),
        // Minutes, with leading zeros.  
        // **Example**: `00` to `59`
        i: pad(i),
        // Seconds, with leading zeros.  
        // **Example**: `00` to `59`
        s: pad(s),
        // Microseconds.  
        // **Example**: `654000`
        u: u * 1000,

        /* Timezone */

        // Timezone identifier.  
        // **Example**: `UTC` or `GMT`
        e: e ? e[0] : '', // TODO: Validate
        // Whether or not the date is in daylight saving time.  
        // **Example**: `0` (false) to `1` (true)
        I: isDaylightSavingTime(date) ? 1 : 0,
        // Difference to Greenwich time (GMT) in hours.  
        // **Example**: `+0200`
        O: parseTimezoneOffset(date),
        // Difference to Greenwich time (GMT), with colon between hours and
        // minutes.  
        // **Example**: `+02:00`
        P: parseTimezoneOffset(date, ':'),
        // Timezone abbreviation.  
        // **Example**: `EST` or `MDT`
        T: e ? e[0] : '', // TODO: Validate
        // Timezone offset in seconds. The offset for timezones west of UTC is
        // always negative, and for those east of UTC is always positive.  
        // **Example**: `-43200` to `50400`
        Z: Z * -60,

        /* Full Date/Time */

        // [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) formatted date.  
        // **Example**: `2004-02-12T15:19:21+00:00`
        c: '',
        // [RFC 2822](http://www.faqs.org/rfcs/rfc2822.html) formatted date.  
        // **Example**: `Thu, 21 Dec 2000 16:01:07 +0200`
        r: '',
        // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT).  
        // **Example**: `1323075181922`
        U: U

      };
      // Populate *c* and *r* while avoiding infinite circular calls to
      // `format`.
      params.c = format(date, F_ISO_8601, params);
      params.r = format(date, F_RFC_2822, params);
    }
    // Replace all parameters within format string while ignoring any escaped
    // by a backslash.
    return formatStr.replace(R_TOKEN, function (str) {
      if (str === '\\') return str;
      if (str.indexOf('\\') === 0) return str.substr(1);
      return params[str];
    });
  }

  // Determine the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week
  // information for the given `date`.
  function getISOWeek(date) {
    // Copy `date` and set to the nearest Thursday of the current ISO week.
    var copy = new Date(date);
    copy.setDate(copy.getDate() + 4 - (copy.getDay() || 7));
    var
      year  = copy.getFullYear(),
      // Get the 1st of January of the current year.
      start = new Date(year, 0, 1),
      // Determine number of weeks to the nearest Thursday.
      week  = Math.ceil((((copy - start) / (1000 * 60 * 60 * 24)) + 1) / 7);
    return [year, week];
  }

  // Calculate the
  // [Swatch Internet Time](http://en.wikipedia.org/wiki/Swatch_Internet_Time)
  // for the given `date`.
  function getSwatchInternetTime(date) {
    var time = ((date.getUTCHours() + 1) % 24) +
               (date.getUTCMinutes() / 60) +
               (date.getUTCSeconds() / (60 * 60));
    return Math.floor(time * 1000 / 24);
  }

  // Determine whether or not the given `date` is in daylight saving time.
  function isDaylightSavingTime(date) {
    var copy = new Date(date);
    copy.setMonth(0, 1);
    return copy.getTimezoneOffset() !== date.getTimezoneOffset();
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
    var
      offset = date.getTimezoneOffset(),
      parsed = String(pad(Math.floor(Math.abs(offset) / 60) * 100 +
                          Math.abs(offset) % 60, 4));
    if (separator) parsed = parsed.slice(0, 2) + separator + parsed.slice(2);
    return ((offset > 0) ? '-' : '+') + parsed;
  }

  // Public functions
  // ----------------

  // Format the current date using the format string provided.
  Date.prototype.format = function (formatStr) {
    return format(this, formatStr);
  };

  // Return the day of the year for the current date.
  Date.prototype.getDayOfYear = function () {
    var start = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - start) / 1000 / 60 / 60 / 24) - 1;
  };

  // Return the days in the month for the current date.
  Date.prototype.getDaysInMonth = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
  };

  // Return the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) week number
  // of the year for the current date.
  Date.prototype.getWeekOfYear = function () {
    return getISOWeek(this)[1];
  };

  // Return the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) year number.
  // This has the same value as `getFullYear`, except that if the ISO week
  // number (`getWeekOfYear`) belongs to the previous or next year, that year
  // is used instead.
  Date.prototype.getYearOfWeek = function () {  
    return getISOWeek(this)[0];
  };

  // Return whether or not the current date is in a leap year.
  Date.prototype.isLeapYear = function () {
    return new Date(this.getFullYear(), 1, 29).getMonth() === 1;
  };

}());