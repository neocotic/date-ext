      __            __                             
     /\ \          /\ \__             __           
     \_\ \     __  \ \ ,_\    __     /\_\    ____  
     /'_` \  /'__`\ \ \ \/  /'__`\   \/\ \  /',__\ 
    /\ \L\ \/\ \L\.\_\ \ \_/\  __/ __ \ \ \/\__, `\
    \ \___,_\ \__/.\_\\ \__\ \____\\_\_\ \ \/\____/
     \/__,_ /\/__/\/_/ \/__/\/____//_/\ \_\ \/___/ 
                                     \ \____/      
                                      \/___/       

[date.js][] is a JavaScript library for extending `Date` objects with useful
everyday methods.

## Formatting

Formatting is now extremely simple and uses the same parameters as PHP's [date
function][] as well as the escape sequence (backslash).

``` javascript
new Date().format(formatStr)
```

## Miscellaneous

The library also comes packed with a few more simple - yet extremely useful -
everyday methods.

``` javascript
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

https://github.com/neocotic/date.js/issues

Developers should run all tests in `test/index.html` and ensure they pass before
submitting a pull request.

## Questions?

Take a look at `docs/date.html` to get a better understanding of what the code
is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/date.js

[@neocotic]: https://twitter.com/#!/neocotic
[date.js]: http://neocotic.com/date.js
[date function]: http://php.net/manual/en/function.date.php