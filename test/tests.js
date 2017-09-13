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

(function() {
  'use strict';

  // Test setup
  // ----------

  // ISO 8601 string for the default date under test.
  var ISO_8601 = '2011-01-01T13:01:01+00:00';
  // RFC 2822 string for the default date under test.
  var RFC_2822 = 'Sat, 1 Jan 2011 13:01:01 +0000';

  // Default date under test. Create a copy for each test to preserve it.
  // `Sat Jan 01 2011 13:01:01 GMT+0000 (GMT Standard Time)`
  var date;

  QUnit.module('Date', {
    beforeEach: function() {
      // Reset the date being tested.
      date = new Date(2011, 0, 1, 13, 1, 1, 0);
    }
  });

  // Add/subtract tests
  // ------------------

  QUnit.test('addDays', function(assert) {
    assert.expect(5);

    assert.equal(date.addDays(2).getDate(), 3, 'January 1st plus 2 days is January 3rd');
    assert.equal(date.addDays(0).getDate(), 3, 'January 3rd plus 0 days is January 3rd');
    assert.equal(date.addDays(-1).getDate(), 2, 'January 3rd minus 1 day is January 2nd');

    date.addDays(-2);

    assert.deepEqual([ date.getDate(), date.getMonth(), date.getFullYear() ], [ 31, 11, 2010 ],
      'January 1st 2011 minus 2 days is December 31st 2010');

    date.addDays(32);

    assert.deepEqual([ date.getDate(), date.getMonth(), date.getFullYear() ], [ 1, 1, 2011 ],
      'December 31st 2010 plus 32 days is February 1st 2011');
  });

  QUnit.test('addHours', function(assert) {
    assert.expect(5);

    assert.equal(date.addHours(2).getHours(), 15, 'Saturday 13:01 plus 2 hours is Saturday 15:01');
    assert.equal(date.addHours(0).getHours(), 15, 'Saturday 15:01 plus 0 hours is Saturday 15:01');
    assert.equal(date.addHours(-1).getHours(), 14, 'Saturday 15:01 minus 1 hour is Saturday 14:01');

    date.addHours(-15);

    assert.deepEqual([ date.getHours(), date.getDay() ], [ 23, 5 ], 'Saturday 14:01 minus 15 hours is Friday 23:01');

    date.addHours(25);

    assert.deepEqual([ date.getHours(), date.getDay() ], [ 0, 0 ], 'Friday 23:01 plus 25 hours is Sunday 00:01');
  });

  QUnit.test('addMilliseconds', function(assert) {
    assert.expect(5);

    assert.equal(date.addMilliseconds(750).getMilliseconds(), 750,
      '13:01:01.000 plus 750 milliseconds is 13:01:01.750');
    assert.equal(date.addMilliseconds(0).getMilliseconds(), 750, '13:01:01.750 plus 0 milliseconds is 13:01:01.750');
    assert.equal(date.addMilliseconds(-500).getMilliseconds(), 250,
      '13:01:01.750 minus 500 milliseconds is 13:01:01.250');

    date.addMilliseconds(-1500);

    assert.deepEqual([ date.getMilliseconds(), date.getSeconds(), date.getMinutes() ], [ 750, 59, 0 ],
      '13:01:01.250 minus 1500 milliseconds is 13:00:59.750');

    date.addMilliseconds(63750);

    assert.deepEqual([ date.getMilliseconds(), date.getSeconds(), date.getMinutes() ], [ 500, 3, 2 ],
      '13:00:59.750 plus 63750 milliseconds is 13:02:03.500');
  });

  QUnit.test('addMinutes', function(assert) {
    assert.expect(5);

    assert.equal(date.addMinutes(2).getMinutes(), 3, '13:01 plus 2 minutes is 13:03');
    assert.equal(date.addMinutes(0).getMinutes(), 3, '13:03 plus 0 minutes is 13:03');
    assert.equal(date.addMinutes(-1).getMinutes(), 2, '13:03 minus 1 minute is 13:02');

    date.addMinutes(-3);

    assert.deepEqual([ date.getMinutes(), date.getHours() ], [ 59, 12 ], '13:02 minus 3 minutes is 12:59');

    date.addMinutes(62);

    assert.deepEqual([ date.getMinutes(), date.getHours() ], [ 1, 14 ], '12:59 plus 62 minutes is 14:01');
  });

  QUnit.test('addMonths', function(assert) {
    assert.expect(5);

    assert.equal(date.addMonths(2).getMonth(), 2, 'January 2011 plus 2 months is March 2011');
    assert.equal(date.addMonths(0).getMonth(), 2, 'March 2011 plus 0 months is March 2011');
    assert.equal(date.addMonths(-1).getMonth(), 1, 'March 2011 minus 1 month is February 2011');

    date.addMonths(-3);

    assert.deepEqual([ date.getMonth(), date.getFullYear() ], [ 10, 2010 ],
      'February 2011 minus 3 months is November 2010');

    date.addMonths(14);

    assert.deepEqual([ date.getMonth(), date.getFullYear() ], [ 0, 2012 ],
      'November 2010 plus 14 months is January 2012');
  });

  QUnit.test('addSeconds', function(assert) {
    assert.expect(5);

    assert.equal(date.addSeconds(2).getSeconds(), 3, '13:01:01 plus 2 seconds is 13:01:03');
    assert.equal(date.addSeconds(0).getSeconds(), 3, '13:01:03 plus 0 seconds is 13:01:03');
    assert.equal(date.addSeconds(-1).getSeconds(), 2, '13:01:03 minus 1 second is 13:01:02');

    date.addSeconds(-63);

    assert.deepEqual([ date.getSeconds(), date.getMinutes(), date.getHours() ], [ 59, 59, 12 ],
      '13:01:02 minus 63 seconds is 12:59:59');

    date.addSeconds(3601);

    assert.deepEqual([ date.getSeconds(), date.getMinutes(), date.getHours() ], [ 0, 0, 14 ],
      '12:59:59 plus 3601 seconds is 14:00:00');
  });

  QUnit.test('addYears', function(assert) {
    assert.expect(3);

    assert.equal(date.addYears(2).getFullYear(), 2013, '2011 plus 2 years is 2013');
    assert.equal(date.addYears(0).getFullYear(), 2013, '2013 plus 0 years is 2013');
    assert.equal(date.addYears(-1).getFullYear(), 2012, '2013 minus 1 year is 2012');
  });

  // `clear` tests
  // -------------

  QUnit.test('clear', function(assert) {
    assert.expect(7);

    date.clear();

    assert.equal(date.getFullYear(), 0, 'Year is cleared');
    assert.equal(date.getMonth(), 0, 'Month is cleared');
    assert.equal(date.getDate(), 1, 'Date is cleared');
    assert.equal(date.getHours(), 0, 'Hours are cleared');
    assert.equal(date.getMinutes(), 0, 'Minutes are cleared');
    assert.equal(date.getSeconds(), 0, 'Seconds are cleared');
    assert.equal(date.getMilliseconds(), 0, 'Milliseconds are cleared');
  });

  // `clearDate` tests
  // -------------

  QUnit.test('clearDate', function(assert) {
    assert.expect(7);

    date.setMonth(2, 2);
    date.setMilliseconds(1);
    date.clearDate();

    assert.equal(date.getFullYear(), 0, 'Year is cleared');
    assert.equal(date.getMonth(), 0, 'Month is cleared');
    assert.equal(date.getDate(), 1, 'Date is cleared');
    assert.equal(date.getHours(), 13, 'Hours are preserved');
    assert.equal(date.getMinutes(), 1, 'Minutes are preserved');
    assert.equal(date.getSeconds(), 1, 'Seconds are preserved');
    assert.equal(date.getMilliseconds(), 1, 'Milliseconds are preserved');
  });

  // `clearTime` tests
  // -------------

  QUnit.test('clearTime', function(assert) {
    assert.expect(7);

    date.setMonth(2, 2);
    date.setMilliseconds(1);
    date.clearTime();

    assert.equal(date.getFullYear(), 2011, 'Year is preserved');
    assert.equal(date.getMonth(), 2, 'Month is preserved');
    assert.equal(date.getDate(), 2, 'Date is preserved');
    assert.equal(date.getHours(), 0, 'Hours are cleared');
    assert.equal(date.getMinutes(), 0, 'Minutes are cleared');
    assert.equal(date.getSeconds(), 0, 'Seconds are cleared');
    assert.equal(date.getMilliseconds(), 0, 'Milliseconds are cleared');
  });

  // `format` tests
  // --------------

  QUnit.test('format - default format', function(assert) {
    assert.expect(1);

    assert.equal(date.format(), RFC_2822, 'RFC 2822 format is used if none is defined');
  });

  QUnit.test('format - escape sequence', function(assert) {
    assert.expect(6);

    assert.equal(date.format('\\'), '\\', 'Single escape character outputs correctly');
    assert.equal(date.format('\\\\'), '\\', 'Escape character escapes itself');
    assert.equal(date.format('\\j\\D'), 'jD', 'Special characters are escaped by preceding escape character');
    assert.equal(date.format('\\Q'), '\\Q', 'Ignore escape character if followed by non-special character');
    assert.equal(date.format('\\\\j\\\\D'), '\\1\\Sat', 'Escaped escape characters are ignored');
    assert.equal(date.format('\\Qj'), '\\Q1',
      'Escape characters must immediately precede special character to escape it');
  });

  QUnit.test('format - day tokens', function(assert) {
    var expected = [
      '01 Sat 1st Saturday 6 6 0',
      '02 Sun 2nd Sunday 7 0 1',
      '03 Mon 3rd Monday 1 1 2',
      '04 Tue 4th Tuesday 2 2 3',
      '05 Wed 5th Wednesday 3 3 4',
      '06 Thu 6th Thursday 4 4 5',
      '07 Fri 7th Friday 5 5 6'
    ];

    assert.expect(expected.length + 2);

    for (var i = 0; i < expected.length; i++) {
      date.setDate(i + 1);

      assert.equal(date.format('d D jS l N w z'), expected[i],
        '"d", "D", "j", "S", "l", "N", "w", and "z" tokens are correct for ' + date.toLocaleDateString());
    }

    date.setMonth(11, 31);

    assert.equal(date.format('z'), '364', '"z" token is correct on 31st of December');

    date.setFullYear(2008);

    assert.equal(date.format('z'), '365', '"z" token is correct on 31st of December in a leap year');
  });

  QUnit.test('format - week tokens', function(assert) {
    assert.expect(2);

    assert.equal(date.format('W'), '52', '"W" token is correct');

    date.setDate(3);

    assert.equal(date.format('W'), '1', '"W" token is correct for ' + date.toLocaleDateString());
  });

  QUnit.test('format - month tokens', function(assert) {
    var expected = [
      'January 01 Jan 1 31',
      'February 02 Feb 2 28',
      'March 03 Mar 3 31',
      'April 04 Apr 4 30',
      'May 05 May 5 31',
      'June 06 Jun 6 30',
      'July 07 Jul 7 31',
      'August 08 Aug 8 31',
      'September 09 Sep 9 30',
      'October 10 Oct 10 31',
      'November 11 Nov 11 30',
      'December 12 Dec 12 31'
    ];

    assert.expect(expected.length + 1);

    for (var i = 0; i < expected.length; i++) {
      date.setMonth(i);

      assert.equal(date.format('F m M n t'), expected[i], '"F", "m", "M", "n", and "t" tokens are correct for ' +
        date.toLocaleDateString());
    }

    date.setFullYear(2008, 1);

    assert.equal(date.format('t'), '29', '"t" token is correct in February of a leap year');
  });

  QUnit.test('format - year tokens', function(assert) {
    assert.expect(4);

    assert.equal(date.format('L o Y y'), '0 2010 2011 11', '"L", "o", "Y", and "y" tokens are correct for ' +
      date.toLocaleDateString());

    date.setDate(3);

    assert.equal(date.format('L o Y y'), '0 2011 2011 11', '"L", "o", "Y", and "y" tokens are correct for ' +
      date.toLocaleDateString());

    date.setFullYear(2012, 0, 1);

    assert.equal(date.format('L o Y y'), '1 2011 2012 12', '"L", "o", "Y", and "y" tokens are correct for ' +
      date.toLocaleDateString());

    date.setDate(2);

    assert.equal(date.format('L o Y y'), '1 2012 2012 12', '"L", "o", "Y", and "y" tokens are correct for ' +
      date.toLocaleDateString());
  });

  QUnit.test('format - time tokens', function(assert) {
    assert.expect(2);

    assert.equal(date.format('a A B g G h H i s u'), 'pm PM 584 1 13 01 13 01 01 000000',
      '"a", "A", "B", "g", "G", "h", "H", "i", "s", and "u" tokens are correct for ' + date.toLocaleTimeString());

    date.setHours(0, 59, 59, 999);

    assert.equal(date.format('a A B g G h H i s u'), 'am AM 83 12 0 12 00 59 59 999000',
      '"a", "A", "B", "g", "G", "h", "H", "i", "s", and "u" tokens are correct for ' + date.toLocaleTimeString());
  });

  QUnit.test('format - timezone tokens', function(assert) {
    assert.expect(2);

    assert.equal(date.format('e I O P T Z'), 'GMT 0 +0000 +00:00 GMT 0',
      '"e", "I", "O", "P", "T", and "Z" tokens are correct for ' + date.toLocaleTimeString());

    date.setMonth(3);

    assert.equal(date.format('I'), '1', '"I" token is correct in April during dalight saving time');
  });

  QUnit.test('format - full date/time tokens', function(assert) {
    assert.expect(4);

    assert.equal(date.format('c'), ISO_8601, 'ISO 8601 format is "Y-m-d\\TH:i:sP"');
    assert.equal(date.format('r'), RFC_2822, 'RFC 2822 format is "D, j M Y H:i:s O"');
    assert.equal(date.format('U'), '1293886861', '1293886861 seconds since Unix Epoch');

    date.setTime(0);

    assert.equal(date.format('U'), '0', '"U" token is correct at Unix Epoch');
  });

  // `getDayOfYear` tests
  // --------------------

  QUnit.test('getDayOfYear', function(assert) {
    assert.expect(3);

    assert.equal(date.getDayOfYear(), 0, 'First day of the year is zero');

    date.setMonth(11, 31);

    assert.equal(date.getDayOfYear(), 364, 'Last day of the year is 364');

    date.setFullYear(2008);

    assert.equal(date.getDayOfYear(), 365, 'Last day of a leap year is 365');
  });

  // `getDaysInMonth` tests
  // ----------------------

  QUnit.test('getDaysInMonth', function(assert) {
    var days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    assert.expect(days.length + 1);

    for (var i = 0; i < days.length; i++) {
      date.setMonth(i);

      assert.equal(date.getDaysInMonth(), days[i], 'Month[' + i + '] has ' + days[i] + ' days in it');
    }

    date.setFullYear(2008, 1);

    assert.equal(date.getDaysInMonth(), 29, 'February has 29 days in a leap year');
  });

  // `getWeekOfYear` tests
  // ---------------------

  QUnit.test('getWeekOfYear', function(assert) {
    assert.expect(4);

    date.setDate(2);

    assert.equal(date.getWeekOfYear(), 52, 'January 2nd 2011 is in 52nd week');

    date.setDate(3);

    assert.equal(date.getWeekOfYear(), 1, 'January 3rd 2011 is in 1st week');

    date.setFullYear(2012, 0, 1);

    assert.equal(date.getWeekOfYear(), 52, 'January 1st 2012 is in 52nd week');

    date.setDate(2);

    assert.equal(date.getWeekOfYear(), 1, 'January 2nd 2012 is in 1st week');
  });

  // `getYearOfWeek` tests
  // ---------------------

  QUnit.test('getYearOfWeek', function(assert) {
    assert.expect(4);

    date.setDate(2);

    assert.equal(date.getYearOfWeek(), 2010, 'January 2nd 2011 is in 2010, honest');

    date.setDate(3);

    assert.equal(date.getYearOfWeek(), 2011, 'January 3rd 2011 is in 2011');

    date.setFullYear(2012, 0, 1);

    assert.equal(date.getYearOfWeek(), 2011, 'January 1st 2012 is in 2011');

    date.setDate(2);

    assert.equal(date.getYearOfWeek(), 2012, 'January 2nd 2012 is in 2012');
  });

  // `isDaylightSavingTime` tests
  // ----------------------------

  QUnit.test('isDaylightSavingTime', function(assert) {
    assert.expect(2);

    assert.ok(!date.isDaylightSavingTime(), 'January is not in daylight saving time');

    date.setMonth(3);

    assert.ok(date.isDaylightSavingTime(), 'April is in daylight saving time');
  });

  // `isLeapYear` tests
  // ------------------

  QUnit.test('isLeapYear', function(assert) {
    assert.expect(4);

    assert.ok(!date.isLeapYear(), '2011 is not a leap year');

    date.setFullYear(2008);

    assert.ok(date.isLeapYear(), '2008 is a leap year');

    date.setFullYear(2000);

    assert.ok(date.isLeapYear(), '2000 is a leap year');

    date.setFullYear(1900);

    assert.ok(!date.isLeapYear(), '1900 is not a leap year');
  });

  // `schedule` tests
  // ----------------

  QUnit.test('schedule - argument handling and date interpretation', function(assert) {
    assert.expect(3);

    var ctx = { foo: 'bar' };
    var scheduleId = date.schedule();

    assert.equal(scheduleId, null, 'Nothing is scheduled if no callback was provided');

    scheduleId = Date.schedule(null, function() {
      assert.equal(this, ctx, 'Context is applied to callback when called');
    }, ctx);

    assert.equal(scheduleId, null, 'Nothing is scheduled if date is not in the future');
  });

  QUnit.test('schedule - asynchronous scheduling', function(assert) {
    assert.expect(2);
    assert.timeout(200);

    var done = assert.async();

    var start = new Date();
    var scheduleId = new Date().addMilliseconds(100).schedule(function() {
      assert.ok(Date.now() - start >= 100, 'Callback is called after sheduled time');
      done();
    });

    assert.notEqual(scheduleId, null, 'Callback is scheduled');
  });

  // `unschedule` tests
  // ------------------

  QUnit.test('unschedule', function(assert) {
    assert.expect(1);
    assert.timeout(300);

    var done = assert.async();

    date = new Date().addMilliseconds(100);

    var scheduleId = date.schedule(function() {
      // This should never be reached
      assert.ok(false, 'Callback is not called after being unscheduled');
      done();
    });

    assert.ok(date.unschedule(scheduleId), 'Callback is no longer scheduled');

    setTimeout(done, 200);
  });

  QUnit.test('unschedule - argument handling and date interpretation', function(assert) {
    assert.expect(1);

    assert.ok(!Date.unschedule(), 'Nothing is unscheduled if no schedule identifier is provided');
  });
}());
