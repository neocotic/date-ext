# Build Requirements
In order to build [date.js][], you need to have the following install [git][] 1.7+ and the latest version of [node.js][] 0.6+ (which includes [npm][]).

# Building
Follow these steps to build [date.js][];

1. Clone a copy of the main [date.js git repository](https://github.com/neocotic/date.js) by running `git clone git://github.com/neocotic/date.js.git`
2. `cd` to the repository directory
3. Ensure you have all of the dependencies by entering `npm install`
4. For the optimized version enter `cake build`
5. To update the documentation enter `cake docs`
   * Not currently working on Windows as it uses linux shell commands

[date.js]: http://neocotic.com/date.js
[git]: http://git-scm.com
[node.js]: http://nodejs.org
[npm]: http://npmjs.org