[![build status](https://secure.travis-ci.org/neocotic/date-ext.png)](http://travis-ci.org/neocotic/date-ext)
      __            __                                 __      
     /\ \          /\ \__                             /\ \__   
     \_\ \     __  \ \ ,_\    __             __  __  _\ \ ,_\  
     /'_` \  /'__`\ \ \ \/  /'__`\ _______ /'__`\\ \/'\\ \ \/  
    /\ \L\ \/\ \L\.\_\ \ \_/\  __//\______\\  __//>  </ \ \ \_ 
    \ \___,_\ \__/.\_\\ \__\ \____\/______/ \____\\_/\_\ \ \__\
     \/__,_ /\/__/\/_/ \/__/\/____/        \/____///\/_/  \/__/

[date-ext][] is a JavaScript library for extending `Date` objects with useful
everyday methods.

## Installation

Install from [npm][]:

``` bash
$ npm install date-ext
```

## Formatting

Formatting is now extremely simple and uses the same parameters as PHP's [date
function][] as well as the escape sequence (backslash).

``` javascript
Date.format(date, formatStr)
new Date().format(formatStr)
```

## Scheduling

Want to schedule a function to be called at a certain time? Well, it couldn't
be any easier.

``` javascript
Date.schedule(date, callback[, context])
new Date().schedule(callback[, context])
```

If the date is *now* or in the past it will simply be called immediately. Also,
if you change your mind you can just prevent it from being called.

``` javascript
Date.unschedule(scheduleId)
new Date().unschedule(scheduleId)
```

The `scheduleId` is returned by the call to `schedule` and will be unique for
every call. However, This will be `undefined` in cases where the function was
called immediately.

## Miscellaneous

The library also comes packed with a few more simple - yet extremely useful -
everyday methods.

``` javascript
new Date().addDays(days)
new Date().addHours(hours)
new Date().addMilliseconds(milliseconds)
new Date().addMinutes(minutes)
new Date().addMonths(months)
new Date().addSeconds(seconds)
new Date().addYears(years)
new Date().clear()
new Date().clearDate()
new Date().clearTime()
new Date().getDayOfYear()
new Date().getDaysInMonth()
new Date().getWeekOfYear()
new Date().getYearOfWeek()
new Date().isDaylightSavingTime()
new Date().isLeapYear()
```

## Bugs

If you have any problems with this library or would like to see the changes
currently in development you can do so here;

https://github.com/neocotic/date-ext/issues

Developers should run all tests in `test/index.html` and ensure they pass
before submitting a pull request.

## Questions?

Take a look at `docs/date-ext.html` to get a better understanding of what the code
is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/date-ext

[@neocotic]: https://twitter.com/#!/neocotic
[date-ext]: http://neocotic.com/date-ext
[date function]: http://php.net/manual/en/function.date.php
[npm]: http://npmjs.org