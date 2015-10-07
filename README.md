# twoBirds v6.0a

Welcome Birdies ;-)

[twoBirds](https://github.com/FrankieTh-xx/twobirds) is a lightweight, component-based,
event-driven JavaScript framework that maps nested objects to DOM nodes. 

twoBirds strictly follows the KISS doctrine, it is the minimum possible solution for an application framework.

It consists of 3 parts:

1.) a simple client repository object structure + instanciation mechanism

demoapp/myClass.js
```
var demoapp = {};

demoapp.myClass = function(){
}

demoapp.myClass.prototype = {
}
```

index.html
```
<body data-tb="demoapp.myClass">
```

or, somewhere in your js code:
```
new tb(
	demoapp.myClass,
	{ ... config data ... },
	$('body')
);
```

2.) a selector to adress instances of these objects on the page

```
tb( 'body' )
```

3.) a trigger mechanism to communicate with the selected instance on the page

```
tb( 'body' ).trigger( 'myEventName', <eventData>, <bubble> );
```
hint: bubble = 'l' for local, 'd' for down, 'u' for up ('l' being default)

twoBirds allows for building of nested structures of instances of repository classes that all look the same codewise, but add up to complex functionality.

All instances of those classes are located in DOM nodes or other tB instances, and communicate with each other via a selector -- trigger mechanism:

twoBirds was created 2004 and saw its first commercial use in 2006.

twoBirds utilizes jQuery.

* [Tech demo](http://demo.two-birds.selfhost.eu/) Desktop only. Code is included in this repo.
* [API documentation](doc/README.md) only this so far, but it will get you going. 

Comparision: twoBirds can be compared to Flight, Polymer / Web Components and most of all react.js. 
Unlike these frameworks it allows for complete separation of code and design. As mentioned it aims at making nesting of loose coupled objects into complex structures easier and more transparent. 
Requirement loading is an inherent part of the system.

## Description

### General

As seen from a twoBirds perspective, a website / webapp consists of the HTML DOM and twoBirds JS objects attached to DOM nodes. Not every DOM node necessarily has a tB object attached to it, usually the tB objects reflect the higher order elements of a site, like "header", "login", "footer".

Also, twoBirds objects can be nested into each other, like in this structural example:
```
myWindow contains
    a system window to display contents, which contains
        a scollBar to scroll the window contents
```
Each of the nested instances may or may not add additional HTML / DOM nodes to the element, but together they form a logical unit. As shown later in the examples, you can find and address all these objects on the current page displayed, and trigger events on each element.

### Repository

In twoBirds, on the client side you have a repository of plain JS classes. 
These are used to create instances. 
The instances are saved in the DOM nodes or in other tB instances.

### Instances

There are 3 property names in twoBirds objects that are reserved:

* *target*: ... is the DOM node the tB instance is attached to. In nested objects it is inherited from the parent, but AT RUNTIME can be set to another DOM node as well if necessary. You cannot set this property in a repo object, since it would make no sense.

* *namespace*: ... is the namespace of the repo object, and should be set accordingly, since both the regEx selector tb(/.../) as well as the .instanceOf("namespace") method checks against the "name" property.

* *handlers*: ... is a plain object, where { key: value } is { eventName: function( params ){ /\*...\*/ } }. If for some reasons you need more than one handler for an eventName, eventName also can be an array of callback functions. Internally they are converted to array anyway.

As for handlers, there currently is 1 event name that is reserved:

* *init*: function(){ /* all requirement loading for all nestings is done, now construct the object as necessary */ }

This event will be sent to every newly created instance, when all required files have been loaded.

There is a special convention inside twoBirds instances:

* If a property name contains a dot ("."), it is treated as a namepace which should contain a JS object or function. twoBirds will check whether this namespace already exists, then ...

IF NOT: twoBirds will convert the property name to a subdir string like so

"tb.ui.scroll" ==> "/tb/ui/scroll.js"

...and starts loading the file.

IF IT EXISTS OR WHEN ITS LOADED:

twoBirds will check whether the namespace points to a function or a plain object.

If it is a function, it will be executed in the context of the current instance (this), and given the property value as a single parameter.

If it is a plain object, the property value will be replaced with it, and when "tb.init" fires the handler will receive the previous contents of the property as a single parameter.

Now lets see all of this in context:

demoapp/body.js 
```js
tb.namespace('demoapp', true).body = (function(){

	function onInit(){
		
		var that = this;

		new tb(
			'tb.ui.panel',
			{
				title: '-no title-',
				css: {
					width: '100%'
				}
			},
			$( '<div />' ).appendTo( that.target )
		);

	}

	function body(){
		
		var that = this;

		that.handlers = {
			'init': onInit
		};

	}

	body.prototype = {

		namespace: 'demoapp.body',

		'tb.require': [
			'/demoapp/body.css'
		]

	};

	return body;

})();
```

The function will execute, starting the requirement loading. Further execution is halted until all required files have loaded. The "init" event will fire then.

* HINT: Properties that contain a dot (.) are said to be misleading because they look like a namespace. In twoBirds, what looks like a namespace IS a namespace - and will be treated as such.

#### ON EVENT / AT RUNTIME:

You can also insert a twoBirds instance into an already existing instance at runtime, in this case inside some event handler you add this code ( the scroller is yet converted from V5 to V6, I will add it later):
```
this.scroll = new tb(
	tb.ui.scroll,
	{
		content: this.content[0],
		direction: 'y',
		bubbleUp: true,
		pixelsPerSecond: 2000,
		attachDelay: 2000,
		easing: 'swing'
	}
);
```

## API / Examples

### ON BOOT:

```html
<html>
	<head>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="http://<yourPathTo>/tb.js"></script>
	</head>
    <body data-tb="demoapp.body">
    </body>
</html>
```
By default upon startup twoBirds will lookup DOM nodes containing a "data-tb" attribute, 
and treats them as a tB class: and instance of the class is created and attached to the DOM node. 
If the corresponding repo object doesnt exist, on-demand loading is performed recursively. 

### tb() Selector and inner structure example

```js 
// tb() selector always returns a jQuery-like result set

// PARAMETER TYPES

// STRING: jQuery select DOM node and return tB object(s)

// get the $('body') DOM node, 
// retrieve its tB toplevel object
tb('body')
// string selectors will be treated as jQuery DOM selectors, 
// but only select DOM nodes that have twoBirds objects attached to them

// OBJECT: instances of a repo object inside page structure

// find all demoapp.body sub-instances ( only one )
tb( demoapp.body )

// find all tb.ui.scroll sub-instances ( may return many )
tb( tb.ui.scroll )

// REGEXP: as object, but matching to instance 'namespace' property 

// always returns the root object

tb( /app.bod/ ) // returns the demoapp.body object, its 'namespace' matches

// OTHER:

// both of the following return all toplevel objects in the current DOM, as expected.

tb( /./ ) 
tb( '*' )

// THIS:

this // in handler code, this always points to the current instance

// CHAINING:

// currently these chained selectors exist,
// and can be used to get other page objects,
// positioned relatively to a selector result or 'this'

tb('body').children('div') // all children of body tB object that reside inside a div HTML element
tb('body').descendants() // all descendants of body tB object
tb( ... ).parent() // closest parent, in this case body tb object
tb( ... ).parents() // array of all parent tB objects, nearest first
tb( ... ).prev() // the previous tb instance in this.parent().children()
tb( ... ).next() // the next tb instance in this.parent().children()
tb( ... ).first() // the previous tb instance in this.parent().children()
tb( ... ).last() // the next tb instance in this.parent().children()

// CHAINED SELECTOR RETURNS ARE ALWAYS UNIQUE
```

### tb(selector).trigger(event, data, bubble)
- communication between object instances on the page

some trigger snippets from other projects:
```js 
// get the $('body') DOM node, 
// retrieve its tB toplevel object, 
// and trigger '<myevent>' on it
tb('body').trigger('<myevent>' [, data] [, bubble])

// find all demoapp.body instances (only one), 
// trigger <myevent> bubbling down locally.
tb( demoapp.body ).trigger('<myevent>' ,null ,'ld' )	

// find all tb.ui.scroll instances, 
// and trigger 'scroll.update' on it, meaning its a local event that doesnt bubble. 
tb( tb.ui.scroll ).trigger('scroll.update' );			

```

## Installation

copy twoBirds.js from this and insert into your project. Have fun!

## Use case 
- component style web programming
- distributed programming
- any size from embedded small functionality to enterprise apps

# Features
- async on demand loading, recursive inside tb objects
- effective multiple inheritance
- web-components-like programming, defining repository objects
- instances of top level tB objects live in a DOM node or other tB instances
- own chained selector for tl tB objects
- own async trigger mechanism on app level

# Status:
- preliminary stable
- will be updated w/ new functionality as needed

# History
twoBirds was created 2004 to be able to build a complex web application for an insurance company.
It was first made public as V2 in 2006 ( [Ajaxian](http://ajaxian.com/archives/twobirds-lib-20-released) ).
It was constantly under development. 

In case of questions contact [me](mailTo:frank_thuerigen@yahoo.de).
