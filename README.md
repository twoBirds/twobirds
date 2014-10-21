twoBirds 5.0

- a web component project started in 2005 (!)
- first published 2007 tB v2 ( on ajaxian.com http://ajaxian.com/archives/twobirds-lib-20-released )
- submerged shortly afterwards
- stayed hidden during v3 & v4
- resurfaced oct 2014 with a pale but happy skipper ;-)

USE CASE: 
- component style web programming
- distributed programming
- any size from embedded small functionality to enterprise apps

TARGET AUDIENCE: 
- hands-on JS programmers who distrust monster libs ...
- ...but want to be able to implement the same features quality assured

FEATURES:
- async on demand loading, recursive inside tb objects
- effective multiple inheritance
- web components like programming, defining repository objects
- instances of top level tB objects live in a DOM node
- own chained selector for tl tB objects
- own async trigger mechanism on app level

STATUS:
- preliminary
- will be updated w/ new functionality (chained) as needed

FIRST PEEK:
- http://dev.two-birds.selfhost.eu
- browser maximized or full-screen please, only desktop css
- => demo for a non-native scroll widget implementation
- BEWARE:
- resides on one of my home computers
- riddled by ongoing development: if you are lucky it works
- may be online/offline depending on my power bill status ;-)
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
