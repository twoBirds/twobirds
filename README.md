twoBirds 5.0

- project started 2005
- first published 2007 tB v2 ( on ajaxian.com )
- submerged shortly afterwards
- stayed hidden during v3 & v4
- resurfaced oct 2014 with a pale but happy skipper ;-)

USE CASE & TARGET AUDIENCE: 
- web components now ( with a twist )
- hands-on JS programmers who distrust monster libs ...
- ...but want to be able to implement the same features quality assured

FEATURES:
- async on demand loading, recursive inside tb objects
- effective multiple inheritance
- web components like programming
- own chained selector for tB objects
- own async trigger mechanism on app level

STATUS:
- preliminary
- will be updated w/ new functionality (chained) as needed

FIRST PEEK:
- http://dev.two-birds.selfhost.eu
- on one of my home computers
- cursed by ongoing development: if you are lucky it works
- may be online/offline depending on my power bills status ;-)
- contact skype: frank.thuerigen if you want it stable for a while

QUICKSTART:
- read twobirds.5.0.pdf
- copy demoapp code to a web server
- open index.html in browser
- have a look

TRY on your site:
- add lib file twobirds.js to your html head
- add data-tb="myapp/body.js" to your html body tag
- reload and see what happens (you should get an error message in the network tab)
- ok, add the file missing like so:

myapp/body.js:

tb.nameSpace('myapp', true).body={ // ,true creates the namespace if it is not there

  name: 'myapp.body'    // so you can find it using the selector, and easily identify it when debugging
  
}

- reload
- go to console
- type:
tb('body')
- inspect object
- rinse and repeat

- revisit demo project, look at code

in case of questions:
- contact skype:frank.thuerigen
