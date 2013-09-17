WH-WebApp
=========

Application layer for web front end


About the frontend development environment (still a bit of a work in progress):

I borrowed heavily from Akikoo's Grunt Front-end workflow and Team Sass's style prototype to come up with a solution
that would be highly modular, and would automate watching, testing, and build while supporting a multipage backbone
architecture that employs the latest best practices in designing in browser.

 Common automated tasks include:

 - Compile modular html patterns,
 - Compile AMD based modules using RequireJS,
 - Watch/compile Sass/Compass modules into CSS,
 - Watch/lint CSS/JS code,
 - Optimize images,
 - Generate sharp vector icons to all devices,
 - Generate dynamic build headers
 - Generate YUIdoc documentation, and
 - Run unit tests in different browsers using karma and jasmine.


Environment Setup:

Make sure to have the following installed (in order):

Ruby (comes default on mac)

To install Bundler:

$ gem install bundler

To install node (along with np):

http://nodejs.org/

To install grunt and bower:

$ npm install -g grunt-cli bower

To generate dependencies run in root of file:

npm install

bower install

bundle install

To start development environment run:

grunt

To build run:

grunt dist
