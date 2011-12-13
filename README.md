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

``` javascript
new Date().format(formatStr)
```

Formatting is now extremely simple and uses the same parameters as PHP's [date
function][] as well as the escape sequence (backslash).

## Standard Usage

``` javascript
new Date().getDayOfYear()
new Date().getDaysInMonth()
new Date().getWeekOfYear()
new Date().getYearOfWeek()
new Date().isDaylightSavingTime()
new Date().isLeapYear()
```

## Issues

If you have any problems with this library or would like to see the changes
currently in development you can do so here;

https://github.com/neocotic/date.js/issues

## Further Information

Take a look at `docs/date.html` to get a better understanding of what the code
is doing.

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/date.js

[date.js]: http://neocotic.com/date.js
[date function]: http://php.net/manual/en/function.date.php