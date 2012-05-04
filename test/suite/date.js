(function() {

  // Test setup
  // ----------

      // Default date under test. Create a copy for each test to preserve it.  
      // `Sat Jan 01 2011 13:01:01 GMT+0000 (GMT Standard Time)`
  var date
      // ISO 8601 string for the default date under test.
    , iso8601 = '2011-01-01T13:01:01+00:00'
      // RFC 2822 string for the default date under test.
    , rfc2822 = 'Sat, 1 Jan 2011 13:01:01 +0000';

  module('Date', {
    setup: function() {
      // Reset the local date being tested.
      date = new Date(2011, 0, 1, 13, 1, 1, 0);
    }
  });

  // Add/subtract tests
  // ------------------

  test('addDays', function() {
    equal(date.addDays(2).getDate(), 3
        , 'January 1st plus 2 days is January 3rd');
    equal(date.addDays(0).getDate(), 3
        , 'January 3rd plus 0 days is January 3rd');
    equal(date.addDays(-1).getDate(), 2
        , 'January 3rd minus 1 day is January 2nd');
    date.addDays(-2);
    deepEqual([date.getDate(), date.getMonth(), date.getFullYear()]
        , [31, 11, 2010]
        , 'January 1st 2011 minus 2 days is December 31st 2010');
    date.addDays(32);
    deepEqual([date.getDate(), date.getMonth(), date.getFullYear()]
        , [1, 1, 2011]
        , 'December 31st 2010 plus 32 days is February 1st 2011');
  });

  test('addHours', function() {
    equal(date.addHours(2).getHours(), 15
        , 'Saturday 13:01 plus 2 hours is Saturday 15:01');
    equal(date.addHours(0).getHours(), 15
        , 'Saturday 15:01 plus 0 hours is Saturday 15:01');
    equal(date.addHours(-1).getHours(), 14
        , 'Saturday 15:01 minus 1 hour is Saturday 14:01');
    date.addHours(-15);
    deepEqual([date.getHours(), date.getDay()], [23, 5]
        , 'Saturday 14:01 minus 15 hours is Friday 23:01');
    date.addHours(25);
    deepEqual([date.getHours(), date.getDay()], [0, 0]
        , 'Friday 23:01 plus 25 hours is Sunday 00:01');
  });

  test('addMilliseconds', function() {
    equal(date.addMilliseconds(750).getMilliseconds(), 750
        , '13:01:01.000 plus 750 milliseconds is 13:01:01.750');
    equal(date.addMilliseconds(0).getMilliseconds(), 750
        , '13:01:01.750 plus 0 milliseconds is 13:01:01.750');
    equal(date.addMilliseconds(-500).getMilliseconds(), 250
        , '13:01:01.750 minus 500 milliseconds is 13:01:01.250');
    date.addMilliseconds(-1500);
    deepEqual([date.getMilliseconds(), date.getSeconds(), date.getMinutes()]
        , [750, 59, 0]
        , '13:01:01.250 minus 1500 milliseconds is 13:00:59.750');
    date.addMilliseconds(63750);
    deepEqual([date.getMilliseconds(), date.getSeconds(), date.getMinutes()]
        , [500, 3, 2]
        , '13:00:59.750 plus 63750 milliseconds is 13:02:03.500');
  });

  test('addMinutes', function() {
    equal(date.addMinutes(2).getMinutes(), 3, '13:01 plus 2 minutes is 13:03');
    equal(date.addMinutes(0).getMinutes(), 3, '13:03 plus 0 minutes is 13:03');
    equal(date.addMinutes(-1).getMinutes(), 2
        , '13:03 minus 1 minute is 13:02');
    date.addMinutes(-3);
    deepEqual([date.getMinutes(), date.getHours()], [59, 12]
        , '13:02 minus 3 minutes is 12:59');
    date.addMinutes(62);
    deepEqual([date.getMinutes(), date.getHours()], [1, 14]
        , '12:59 plus 62 minutes is 14:01');
  });

  test('addMonths', function() {
    equal(date.addMonths(2).getMonth(), 2
        , 'January 2011 plus 2 months is March 2011');
    equal(date.addMonths(0).getMonth(), 2
        , 'March 2011 plus 0 months is March 2011');
    equal(date.addMonths(-1).getMonth(), 1
        , 'March 2011 minus 1 month is February 2011');
    date.addMonths(-3);
    deepEqual([date.getMonth(), date.getFullYear()], [10, 2010]
        , 'February 2011 minus 3 months is November 2010');
    date.addMonths(14);
    deepEqual([date.getMonth(), date.getFullYear()], [0, 2012]
        , 'November 2010 plus 14 months is January 2012');
  });

  test('addSeconds', function() {
    equal(date.addSeconds(2).getSeconds(), 3
        , '13:01:01 plus 2 seconds is 13:01:03');
    equal(date.addSeconds(0).getSeconds(), 3
        , '13:01:03 plus 0 seconds is 13:01:03');
    equal(date.addSeconds(-1).getSeconds(), 2
        , '13:01:03 minus 1 second is 13:01:02');
    date.addSeconds(-63);
    deepEqual([date.getSeconds(), date.getMinutes(), date.getHours()]
        , [59, 59, 12]
        , '13:01:02 minus 63 seconds is 12:59:59');
    date.addSeconds(3601);
    deepEqual([date.getSeconds(), date.getMinutes(), date.getHours()]
        , [0, 0, 14]
        , '12:59:59 plus 3601 seconds is 14:00:00');
  });

  test('addYears', function() {
    equal(date.addYears(2).getFullYear(), 2013, '2011 plus 2 years is 2013');
    equal(date.addYears(0).getFullYear(), 2013, '2013 plus 0 years is 2013');
    equal(date.addYears(-1).getFullYear(), 2012, '2013 minus 1 year is 2012');
  });

  // `clear` tests
  // -------------

  test('clear', function() {
    date.clear();
    equal(date.getFullYear(), 0, 'Year is cleared');
    equal(date.getMonth(), 0, 'Month is cleared');
    equal(date.getDate(), 1, 'Date is cleared');
    equal(date.getHours(), 0, 'Hours are cleared');
    equal(date.getMinutes(), 0, 'Minutes are cleared');
    equal(date.getSeconds(), 0, 'Seconds are cleared');
    equal(date.getMilliseconds(), 0, 'Milliseconds are cleared');
  });

  // `clearDate` tests
  // -------------

  test('clearDate', function() {
    date.setMonth(2, 2);
    date.setMilliseconds(1);
    date.clearDate();
    equal(date.getFullYear(), 0, 'Year is cleared');
    equal(date.getMonth(), 0, 'Month is cleared');
    equal(date.getDate(), 1, 'Date is cleared');
    equal(date.getHours(), 13, 'Hours are preserved');
    equal(date.getMinutes(), 1, 'Minutes are preserved');
    equal(date.getSeconds(), 1, 'Seconds are preserved');
    equal(date.getMilliseconds(), 1, 'Milliseconds are preserved');
  });

  // `clearTime` tests
  // -------------

  test('clearTime', function() {
    date.setMonth(2, 2);
    date.setMilliseconds(1);
    date.clearTime();
    equal(date.getFullYear(), 2011, 'Year is preserved');
    equal(date.getMonth(), 2, 'Month is preserved');
    equal(date.getDate(), 2, 'Date is preserved');
    equal(date.getHours(), 0, 'Hours are cleared');
    equal(date.getMinutes(), 0, 'Minutes are cleared');
    equal(date.getSeconds(), 0, 'Seconds are cleared');
    equal(date.getMilliseconds(), 0, 'Milliseconds are cleared');
  });

  // `format` tests
  // --------------

  test('format - default format', function() {
    equal(date.format(), rfc2822
        , 'RFC 2822 format is used if none is defined');
  });

  test('format - escape sequence', function() {
    equal(date.format('\\'), '\\'
        , 'Single escape character outputs correctly');
    equal(date.format('\\\\'), '\\', 'Escape character escapes itself');
    equal(date.format('\\j'), 'j'
        , 'Special characters are escaped by preceding escape character');
    equal(date.format('\\Q'), '\\Q'
        , 'Ignore escape character if followed by non-special character');
    equal(date.format('\\\\j'), '\\1'
        , 'Escaped escape characters are ignored');
    equal(date.format('\\Qj'), '\\Q1', 'Escape characters must immediately '
        + 'precede special character to escape it');
  });

  test('format - day parameters', function() {
    var results = [
        ['01', 'Sat', '1', 'Saturday', '6', 'st', '6', '0']
      , ['02', 'Sun', '2', 'Sunday', '7', 'nd', '0', '1']
      , ['03', 'Mon', '3', 'Monday', '1', 'rd', '1', '2']
      , ['04', 'Tue', '4', 'Tuesday', '2', 'th', '2', '3']
      , ['05', 'Wed', '5', 'Wednesday', '3', 'th', '3', '4']
      , ['06', 'Thu', '6', 'Thursday', '4', 'th', '4', '5']
      , ['07', 'Fri', '7', 'Friday', '5', 'th', '5', '6']
    ];
    for (var i = 0; i < results.length; i++) {
      date.setDate(i + 1);
      deepEqual(date.format('d D j l N S w z').split(' '), results[i]
          , '"d", "D", "j", "l", "N", "S", "w", and "z" parameters are '
          + 'correct for ' + date.toLocaleDateString());
    }
    date.setMonth(11, 31);
    equal(date.format('z'), '364'
        , '"z" parameter is correct on 31st of December');
    date.setFullYear(2008);
    equal(date.format('z'), '365'
        , '"z" parameter is correct on 31st of December in a leap year');
  });

  test('format - week parameters', function() {
    equal(date.format('W'), '52', '"W" parameter is correct');
    date.setDate(3);
    equal(date.format('W'), '1', '"W" parameter is correct for '
        + date.toLocaleDateString());
  });

  test('format - month parameters', function() {
    var results = [
        ['January', '01', 'Jan', '1', '31']
      , ['February', '02', 'Feb', '2', '28']
      , ['March', '03', 'Mar', '3', '31']
      , ['April', '04', 'Apr', '4', '30']
      , ['May', '05', 'May', '5', '31']
      , ['June', '06', 'Jun', '6', '30']
      , ['July', '07', 'Jul', '7', '31']
      , ['August', '08', 'Aug', '8', '31']
      , ['September', '09', 'Sep', '9', '30']
      , ['October', '10', 'Oct', '10', '31']
      , ['November', '11', 'Nov', '11', '30']
      , ['December', '12', 'Dec', '12', '31']
    ];
    for (var i = 0; i < results.length; i++) {
      date.setMonth(i);
      deepEqual(date.format('F m M n t').split(' '), results[i]
          , '"F", "m", "M", "n", and "t" parameters are correct for '
          + date.toLocaleDateString());
    }
    date.setFullYear(2008, 1);
    equal(date.format('t'), '29'
        , '"t" parameter is correct in February of a leap year');
  });

  test('format - year parameters', function() {
    deepEqual(date.format('L o Y y').split(' '), ['0', '2010', '2011', '11']
        , '"L", "o", "Y", and "y" parameters are correct for '
        + date.toLocaleDateString());
    date.setDate(3);
    deepEqual(date.format('L o Y y').split(' '), ['0', '2011', '2011', '11']
        , '"L", "o", "Y", and "y" parameters are correct for '
        + date.toLocaleDateString());
    date.setFullYear(2012, 0, 1);
    deepEqual(date.format('L o Y y').split(' '), ['1', '2011', '2012', '12']
        , '"L", "o", "Y", and "y" parameters are correct for '
        + date.toLocaleDateString());
    date.setDate(2);
    deepEqual(date.format('L o Y y').split(' '), ['1', '2012', '2012', '12']
        , '"L", "o", "Y", and "y" parameters are correct for '
        + date.toLocaleDateString());
  });

  test('format - time parameters', function() {
    deepEqual(date.format('a A B g G h H i s u').split(' ')
        , ['pm', 'PM', '584', '1',  '13', '01', '13', '01', '01', '000000']
        , '"a", "A", "B", "g", "G", "h", "H", "i", "s", and "u" parameters '
        + 'are correct for ' + date.toLocaleTimeString());
    date.setHours(0, 59, 59, 999);
    deepEqual(date.format('a A B g G h H i s u').split(' ')
        , ['am', 'AM', '83',  '12', '0',  '12', '00', '59', '59', '999000']
        , '"a", "A", "B", "g", "G", "h", "H", "i", "s", and "u" parameters '
        + 'are correct for ' + date.toLocaleTimeString());
  });

  test('format - timezone parameters', function() {
    equal(date.format('e'), 'GMT', '"e" parameter is correct');
    equal(date.format('I'), '0', '"I" parameter is correct');
    equal(date.format('O'), '+0000', '"O" parameter is correct');
    equal(date.format('P'), '+00:00', '"P" parameter is correct');
    equal(date.format('T'), 'GMT', '"T" parameter is correct');
    equal(date.format('Z'), '0', '"Z" parameter is correct');
    date.setMonth(3);
    equal(date.format('I'), '1'
        , '"I" parameter is correct in April during dalight saving time');
  });

  test('format - full date/time parameters', function() {
    equal(date.format('c'), iso8601, 'ISO 8601 format is "Y-m-d\\TH:i:sP"');
    equal(date.format('r'), rfc2822, 'RFC 2822 format is "D, j M Y H:i:s O"');
    equal(date.format('U'), '1293886861'
        , '1293886861 seconds since Unix Epoch');
    date.setTime(0);
    equal(date.format('U'), '0', 'Now zero seconds since Unix Epoch');
  });

  // `getDayOfYear` tests
  // --------------------

  test('getDayOfYear', function() {
    equal(date.getDayOfYear(), 0, 'First day of the year is zero');
    date.setMonth(11, 31);
    equal(date.getDayOfYear(), 364, 'Last day of the year is 364');
    date.setFullYear(2008);
    equal(date.getDayOfYear(), 365, 'Last day of a leap year is 365');
  });

  // `getDaysInMonth` tests
  // ----------------------

  test('getDaysInMonth', function() {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0; i < days.length; i++) {
      date.setMonth(i);
      equal(date.getDaysInMonth(), days[i], 'Month[' + i + '] has ' + days[i]
          + ' days in it');
    }
    date.setFullYear(2008, 1);
    equal(date.getDaysInMonth(), 29, 'February has 29 days in a leap year');
  });

  // `getWeekOfYear` tests
  // ---------------------

  test('getWeekOfYear', function() {
    date.setDate(2);
    equal(date.getWeekOfYear(), 52, 'January 2nd 2011 is in 52nd week');
    date.setDate(3);
    equal(date.getWeekOfYear(), 1, 'January 3rd 2011 is in 1st week');
    date.setFullYear(2012, 0, 1);
    equal(date.getWeekOfYear(), 52, 'January 1st 2012 is in 52nd week');
    date.setDate(2);
    equal(date.getWeekOfYear(), 1, 'January 2nd 2012 is in 1st week');
  });

  // `getYearOfWeek` tests
  // ---------------------

  test('getYearOfWeek', function() {
    date.setDate(2);
    equal(date.getYearOfWeek(), 2010, 'January 2nd 2011 is in 2010, honest');
    date.setDate(3);
    equal(date.getYearOfWeek(), 2011, 'January 3rd 2011 is in 2011');
    date.setFullYear(2012, 0, 1);
    equal(date.getYearOfWeek(), 2011, 'January 1st 2012 is in 2011');
    date.setDate(2);
    equal(date.getYearOfWeek(), 2012, 'January 2nd 2012 is in 2012');
  });

  // `isDaylightSavingTime` tests
  // ----------------------------

  test('isDaylightSavingTime', function() {
    ok(!date.isDaylightSavingTime(), 'January is not in daylight saving time');
    date.setMonth(3);
    ok(date.isDaylightSavingTime(), 'April is in daylight saving time');
  });

  // `isLeapYear` tests
  // ------------------

  test('isLeapYear', function() {
    ok(!date.isLeapYear(), '2011 is not a leap year');
    date.setFullYear(2008);
    ok(date.isLeapYear(), '2008 is a leap year');
    date.setFullYear(2000);
    ok(date.isLeapYear(), '2000 is a leap year');
    date.setFullYear(1900);
    ok(!date.isLeapYear(), '1900 is not a leap year');
  });

  // `schedule` tests
  // ----------------

  test('schedule - argument handling and date interpretation', 3, function() {
    var ctx = { foo: 'bar' }
      , scheduleId = date.schedule();
    equal(scheduleId, null
        , 'Nothing is scheduled if no callback was provided');
    scheduleId = Date.schedule(null, function() {
      equal(this, ctx, 'Context is applied to callback when called');
    }, ctx);
    equal(scheduleId, null
        , 'Nothing is scheduled if date is not in the future');
  });

  asyncTest('schedule - asynchronous scheduling', 2, function() {
    date = new Date();
    var scheduleId = (new Date()).addMilliseconds(100).schedule(function() {
      ok(new Date() - date >= 100, 'Callback is called after sheduled time');
      start();
    });
    notEqual(scheduleId, null, 'Callback is scheduled');
  });

  // `unschedule` tests
  // ------------------

  test('unschedule', 2, function() {
    ok(!Date.unschedule()
        , 'Nothing is unscheduled if no schedule identifier is provided');
    date = (new Date()).addMilliseconds(100);
    QUnit.stop();
    var scheduleId = date.schedule(function() {
      // This should never be reached
      ok(false, 'Callback is not called after being unscheduled');
      start();
    });
    ok(date.unschedule(scheduleId), 'Callback is no longer scheduled');
    setTimeout(function() {
      start();
    }, 200);
  });

}());