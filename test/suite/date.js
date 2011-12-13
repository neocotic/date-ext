(function () {

  // Test setup
  // ----------

  var
    // Default date under test. Create a copy for each test to preserve it.  
    // `Sat Jan 01 2011 13:01:01 GMT+0000 (GMT Standard Time)`
    date,
    // ISO 8601 string for the default date under test.
    iso8601 = '2011-01-01T13:01:01+00:00',
    // RFC 2822 string for the default date under test.
    rfc2822 = 'Sat, 1 Jan 2011 13:01:01 +0000';

  module('Date', {
    setup: function () {
      // Reset the local date being tested.
      date = new Date(2011, 0, 1, 13, 1, 1, 0);
    }
  });

  // `format` tests
  // --------------

  test('format - default format', function () {
    equal(date.format(), rfc2822,
        'RFC 2822 format is used if none is defined');
  });

  test('format - escape sequence', function () {
    equal(date.format('\\'), '\\',
        'Single escape character outputs corectly');
    equal(date.format('\\\\'), '\\', 'Escape character escapes itself');
    equal(date.format('\\j'), 'j',
        'Special characters are escaped by preceding escape character');
    equal(date.format('\\Q'), '\\Q',
        'Ignore escape character if followed by non-special character');
    equal(date.format('\\\\j'), '\\1',
        'Escaped escape characters are ignored');
    equal(date.format('\\Qj'), '\\Q1', 'Escape characters must ' +
        'immediately precede special character to escape it');
  });

  test('format - day parameters', function () {
    var results = [
      ['01', 'Sat', '1', 'Saturday',  '6', 'st', '6', '0'],
      ['02', 'Sun', '2', 'Sunday',    '7', 'nd', '0', '1'],
      ['03', 'Mon', '3', 'Monday',    '1', 'rd', '1', '2'],
      ['04', 'Tue', '4', 'Tuesday',   '2', 'th', '2', '3'],
      ['05', 'Wed', '5', 'Wednesday', '3', 'th', '3', '4'],
      ['06', 'Thu', '6', 'Thursday',  '4', 'th', '4', '5'],
      ['07', 'Fri', '7', 'Friday',    '5', 'th', '5', '6']
    ];
    for (var i = 0; i < results.length; i++) {
      date.setDate(i + 1);
      deepEqual(date.format('d D j l N S w z').split(' '), results[i],
          '"d", "D", "j", "l", "N", "S", "w", and "z" parameters are ' +
          'correct for ' + date.toLocaleDateString());
    }
    date.setMonth(11, 31);
    equal(date.format('z'), '364', '"z" parameter is correct on 31st of ' +
        'December');
    date.setFullYear(2008);
    equal(date.format('z'), '365', '"z" parameter is correct on 31st of ' +
        'December in a leap year');
  });

  test('format - week parameters', function () {
    equal(date.format('W'), '52', '"W" parameter is correct');
    date.setDate(3);
    equal(date.format('W'), '1', '"W" parameter is correct for ' +
        date.toLocaleDateString());
  });

  test('format - month parameters', function () {
    var results = [
      ['January',   '01', 'Jan', '1',  '31'],
      ['February',  '02', 'Feb', '2',  '28'],
      ['March',     '03', 'Mar', '3',  '31'],
      ['April',     '04', 'Apr', '4',  '30'],
      ['May',       '05', 'May', '5',  '31'],
      ['June',      '06', 'Jun', '6',  '30'],
      ['July',      '07', 'Jul', '7',  '31'],
      ['August',    '08', 'Aug', '8',  '31'],
      ['September', '09', 'Sep', '9',  '30'],
      ['October',   '10', 'Oct', '10', '31'],
      ['November',  '11', 'Nov', '11', '30'],
      ['December',  '12', 'Dec', '12', '31']
    ];
    for (var i = 0; i < results.length; i++) {
      date.setMonth(i);
      deepEqual(date.format('F m M n t').split(' '), results[i],
          '"F", "m", "M", "n", and "t" parameters are correct for ' +
          date.toLocaleDateString());
    }
    date.setFullYear(2008, 1);
    equal(date.format('t'), '29', '"t" parameter is correct in February of ' +
        'a leap year');
  });

  test('format - year parameters', function () {
    deepEqual(date.format('L o Y y').split(' '),
        ['0', '2010', '2011', '11'],
        '"L", "o", "Y", and "y" parameters are correct for ' +
        date.toLocaleDateString());
    date.setDate(3);
    deepEqual(date.format('L o Y y').split(' '),
        ['0', '2011', '2011', '11'],
        '"L", "o", "Y", and "y" parameters are correct for ' +
        date.toLocaleDateString());
    date.setFullYear(2012, 0, 1);
    deepEqual(date.format('L o Y y').split(' '),
        ['1', '2011', '2012', '12'],
        '"L", "o", "Y", and "y" parameters are correct for ' +
        date.toLocaleDateString());
    date.setDate(2);
    deepEqual(date.format('L o Y y').split(' '),
        ['1', '2012', '2012', '12'],
        '"L", "o", "Y", and "y" parameters are correct for ' +
        date.toLocaleDateString());
  });

  test('format - time parameters', function () {
    deepEqual(date.format('a A B g G h H i s u').split(' '),
        ['pm', 'PM', '584', '1',  '13', '01', '13', '01', '01', '000000'],
        '"a", "A", "B", "g", "G", "h", "H", "i", "s", and "u" parameters ' +
        'are correct for ' + date.toLocaleTimeString());
    date.setHours(0, 59, 59, 999);
    deepEqual(date.format('a A B g G h H i s u').split(' '),
        ['am', 'AM', '83',  '12', '0',  '12', '00', '59', '59', '999000'],
        '"a", "A", "B", "g", "G", "h", "H", "i", "s", and "u" parameters ' +
        'are correct for ' + date.toLocaleTimeString());
  });

  test('format - timezone parameters', function () {
    equal(date.format('e'), 'GMT', '"e" parameter is correct');
    equal(date.format('I'), '0', '"I" parameter is correct');
    equal(date.format('O'), '+0000', '"O" parameter is correct');
    equal(date.format('P'), '+00:00', '"P" parameter is correct');
    equal(date.format('T'), 'GMT', '"T" parameter is correct');
    equal(date.format('Z'), '0', '"Z" parameter is correct');
    date.setMonth(3);
    equal(date.format('I'), '1', '"I" parameter is correct in April during ' +
        'dalight saving time');
  });

  test('format - full date/time parameters', function () {
    equal(date.format('c'), iso8601, 'ISO 8601 format is "Y-m-d\\TH:i:sP"');
    equal(date.format('r'), rfc2822, 'RFC 2822 format is "D, j M Y H:i:s O"');
    equal(date.format('U'), '1293886861',
        '1293886861 seconds since Unix Epoch');
    date.setTime(0);
    equal(date.format('U'), '0', 'Now zero seconds since Unix Epoch');
  });

  // `getDayOfYear` tests
  // --------------------

  test('getDayOfYear', function () {
    equal(date.getDayOfYear(), 0, 'First day of the year is zero');
    date.setMonth(11, 31);
    equal(date.getDayOfYear(), 364, 'Last day of the year is 364');
    date.setFullYear(2008);
    equal(date.getDayOfYear(), 365, 'Last day of a leap year is 365');
  });

  // `getDaysInMonth` tests
  // ----------------------

  test('getDaysInMonth', function () {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0; i < days.length; i++) {
      date.setMonth(i);
      equal(date.getDaysInMonth(), days[i], 'Month[' + i + '] has ' +
          days[i] + ' days in it');
    }
    date.setFullYear(2008, 1);
    equal(date.getDaysInMonth(), 29, 'February has 29 days in a leap year');
  });

  // `getWeekOfYear` tests
  // ---------------------

  test('getWeekOfYear', function () {
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

  test('getYearOfWeek', function () {
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

  test('isDaylightSavingTime', function () {
    ok(!date.isDaylightSavingTime(), 'January is not in daylight saving time');
    date.setMonth(3);
    ok(date.isDaylightSavingTime(), 'April is in daylight saving time');
  });

  // `isLeapYear` tests
  // ------------------

  test('isLeapYear', function () {
    ok(!date.isLeapYear(), '2011 is not a leap year');
    date.setFullYear(2008);
    ok(date.isLeapYear(), '2008 is a leap year');
    date.setFullYear(2000);
    ok(date.isLeapYear(), '2000 is a leap year');
    date.setFullYear(1900);
    ok(!date.isLeapYear(), '1900 is not a leap year');
  });

}());