# Build Requirements
In order to build [date.js][], you need to have the following:

* [CoffeeScript][] 1.2+
* [docco][] 0.3+
* [UglifyJS][] 1.2+
* [git][] 1.7+

*Earlier versions might work, but have not been tested.*

It is recommended to install all except [git][] using [npm][] along with [node.js][] as it really simplifies their installation as it also installs their dependencies.

# Building
Follow these steps to build [date.js][];

1. Clone a copy of the main [date.js git repository](https://github.com/neocotic/date.js) by running `git clone git://github.com/neocotic/date.js.git`
2. For the optimized file enter `cake build`
3. To update the documentation enter `cake docs`

[coffeescript]: http://coffeescript.org
[date.js]: http://neocotic.com/date.js
[docco]: http://jashkenas.github.com/docco
[git]: http://git-scm.com
[node.js]: http://nodejs.org
[npm]: http://npmjs.org
[uglifyjs]: https://github.com/mishoo/UglifyJS