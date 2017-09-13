         888          888                                     888
         888          888                                     888
         888          888                                     888
     .d88888  8888b.  888888 .d88b.          .d88b.  888  888 888888
    d88" 888     "88b 888   d8P  Y8b        d8P  Y8b `Y8bd8P' 888
    888  888 .d888888 888   88888888 888888 88888888   X88K   888
    Y88b 888 888  888 Y88b. Y8b.            Y8b.     .d8""8b. Y88b.
     "Y88888 "Y888888  "Y888 "Y8888          "Y8888  888  888  "Y888

[date-ext](https://github.com/neocotic/date-ext) is a JavaScript library for extending `Date` objects with useful
everyday methods.

[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg?style=flat-square)](https://codepen.io/neocotic/full/oGNOOM/)
[![Build Status](https://img.shields.io/travis/neocotic/date-ext/develop.svg?style=flat-square)](https://travis-ci.org/neocotic/date-ext)
[![Dev Dependency Status](https://img.shields.io/david/dev/neocotic/date-ext.svg?style=flat-square)](https://david-dm.org/neocotic/date-ext?type=dev)
[![License](https://img.shields.io/npm/l/date-ext.svg?style=flat-square)](https://github.com/neocotic/date-ext/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/date-ext.svg?style=flat-square)](https://www.npmjs.com/package/date-ext)

* [Install](#install)
* [API](#api)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

Install using the package manager for your desired environment(s):

``` bash
$ npm install --save date-ext
# OR:
$ bower install --save date-ext
```

If you want to simply download the file to be used in the browser you can find them below:

* [Development Version](https://cdn.rawgit.com/neocotic/date-ext/master/lib/date-ext.js) (21kb)
* [Production Version](https://cdn.rawgit.com/neocotic/date-ext/master/dist/date-ext.min.js) (5.3kb - [Source Map](https://cdn.rawgit.com/neocotic/date-ext/master/dist/date-ext.min.map))

## API

### Formatting

Formatting is now extremely simple and uses the same parameters as
[PHP's date function](http://php.net/manual/en/function.date.php) as well as the escape sequence (backslash).

``` javascript
Date.format(date, formatStr)
new Date().format(formatStr)
```

### Scheduling

Want to schedule a function to be called at a certain time? Well, it couldn't be any easier.

``` javascript
Date.schedule(date, callback[, context])
new Date().schedule(callback[, context])
```

If the date is *now* or in the past it will simply be called immediately. Also, if you change your mind you can just
prevent it from being called.

``` javascript
Date.unschedule(scheduleId)
new Date().unschedule(scheduleId)
```

The `scheduleId` is returned by the call to `schedule` and will be unique for every call. However, This will be
`undefined` in cases where the function was called immediately.

### Miscellaneous

The library also comes packed with a few more simple - yet extremely useful - everyday methods.

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
new Date().getTimezone()
new Date().getWeekOfYear()
new Date().getYearOfWeek()
new Date().isDaylightSavingTime()
new Date().isLeapYear()
```

## Bugs

If you have any problems with date-ext or would like to see changes currently in development you can do so
[here](https://github.com/neocotic/date-ext/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/neocotic/date-ext/blob/master/CONTRIBUTING.md). We want your suggestions and pull
requests!

A list of date-ext contributors can be found in
[AUTHORS.md](https://github.com/neocotic/date-ext/blob/master/AUTHORS.md).

## License

Copyright © 2017 Alasdair Mercer

See [LICENSE.md](https://github.com/neocotic/date-ext/blob/master/LICENSE.md) for more information on our MIT license.
