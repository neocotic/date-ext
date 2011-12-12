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
  // TODO: Unit tests
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
  // TODO: Unit tests
});

test('getYearOfWeek', function () {
  // TODO: Unit tests
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