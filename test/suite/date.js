// Default values being tested.
var
  T_YEAR        = 2011,
  T_MONTH       = 0,
  T_DAY         = 1,
  T_HOUR        = 13,
  T_MINUTE      = 1,
  T_SECOND      = 1,
  T_MILLISECOND = 1,
  // Default data under test. Create a copy for each test to preserve it.
  T_DATE        = new Date(T_YEAR, T_MONTH, T_DAY, T_HOUR, T_MINUTE, T_SECOND,
                           T_MILLISECOND);

module('Date');

test('format', function () {
  // TODO: Unit tests
});

test('getDayOfYear', function () {
  var date = new Date(T_DATE.getTime());
  equals(date.getDayOfYear(), 0, 'First day of the year is zero');
  date.setMonth(11, 31);
  equals(date.getDayOfYear(), 364, 'Last day of the year is 364');
  date.setFullYear(2008);
  equals(date.getDayOfYear(), 365, 'Last day of a leap year is 365');
});

test('getDaysInMonth', function () {
  var
    date = new Date(T_DATE.getTime()),
    days = [31, 28, 31, 30, 31, 30, 31, 31, 30,31, 30, 31];
  // Test days in every month in a non-leap year.
  for (var i = 0; i < days.length; i++) {
    date.setMonth(i);
    equals(date.getDaysInMonth(), days[i], 'Month[' + i + '] has ' + days[i] +
    ' days in it');
  }
  // Test February in leap year.
  date.setFullYear(2008, 1);
  equals(date.getDaysInMonth(), 29, 'February has 29 days in a leap year');
});

test('getWeekOfYear', function () {
  var date = new Date(T_DATE.getTime());
  date.setDate(2);
  equals(date.getWeekOfYear(), 53, 'January 2nd 2011 is in 53rd week');
  date.setDate(3);
  equals(date.getWeekOfYear(), 1, 'January 3rd 2011 is in 1st week');
  date.setFullYear(2012, 0, 1);
  equals(date.getWeekOfYear(), 52, 'January 1st 2012 is in 52nd week');
  date.setDate(2);
  equals(date.getWeekOfYear(), 1, 'January 2nd 2012 is in 1st week');
});

test('getYearOfWeek', function () {
  var date = new Date(T_DATE.getTime());
  date.setDate(2);
  equals(date.getYearOfWeek(), 2010, 'January 2nd 2011 is in 2010, honest');
  date.setDate(3);
  equals(date.getYearOfWeek(), 2011, 'January 3rd 2011 is in 2011');
  date.setFullYear(2012, 0, 1);
  equals(date.getYearOfWeek(), 2011, 'January 1st 2012 is in 2011');
  date.setDate(2);
  equals(date.getYearOfWeek(), 2012, 'January 2nd 2012 is in 2012');
});

test('isLeapYear', function () {
  var date = new Date(T_DATE.getTime());
  ok(!date.isLeapYear(), '2011 is not a leap year');
  date.setFullYear(2008);
  ok(date.isLeapYear(), '2008 is a leap year');
  date.setFullYear(2000);
  ok(date.isLeapYear(), '2000 is a leap year');
  date.setFullYear(1900);
  ok(!date.isLeapYear(), '1900 is not a leap year');
});