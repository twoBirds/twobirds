# Repo has moved to [twobirds-core](https://github.com/FrankieTh-xx/twobirds-core)

- this repo is here for historical reasons
- this twobirds-core above repo is mirrored from [gitlab twobirds-core](https://gitlab.com/twoBirds/twobirds-core)

# twoBirds v7.0a

Welcome Birdies ;-)


[I dont want to read a lot - give me a kick-start](https://github.com/FrankieTh-xx/twobirds/blob/master/README.md#i-dont-want-to-read-a-lot---give-me-a-kick-start)


## Intro

[twoBirds](https://github.com/FrankieTh-xx/twobirds) is a lightweight, component-based,
event-driven JavaScript framework that maps nested objects to DOM nodes. 

twoBirds strictly follows the KISS doctrine, it is the minimum possible solution for an application framework.

It consists of 3 parts:

#### 1.) a simple client repository object structure + instanciation mechanism

demoapp/myClass.js
```
var demoapp = demoapp || {};


demoapp.myClass = function(){
	handlers: {
		myEventName: function( e ){
			console.log( 'myEventName handler', e.data );
		}
	}
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
	document.body
);
```

#### 2.) a selector to adress instances of these objects on the page

```
tb( document.body )    // will return any tb instances that are contained in document.body
```

#### 3.) a trigger mechanism to communicate with the selected instance on the page

```
tb( 'body' ).trigger( 'myEventName', <eventData>, <bubble> );
```
hint: bubble = 'l' for local, 'd' for down, 'u' for up ('l' being default)

twoBirds allows for building of nested structures of instances of repository classes that all look the same codewise, but add up to complex functionality.

All instances of these classes are stored in DOM nodes or other tB instances.

twoBirds was created 2004 and saw its first commercial use in 2006.

twoBirds has a selector ot its own, but can work with any selector lib that returns array-like objects.

Comparision: twoBirds can be compared to Flight, Polymer, React and backbone JS.
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

* *handlers*: ... is a plain object, where { key: value } is { eventName: function myHandler( pEvent ){ /\*...\*/ } }. If for some reasons you need more than one handler for an eventName, eventName also can be an array of callback functions. Internally they are converted to array anyway.

As for handlers, there currently is 1 event name that is reserved:

* *init*: function(){ /* all requirement loading for all nestings is done, now construct the object as necessary */ }

This event will be sent to every newly created instance, when all required files have been loaded.

There is a special convention inside twoBirds instances:

* If a property name contains a dot ("."), it is treated as a namepace which should contain a JS object or function. twoBirds will check whether this namespace already exists, then ...

IF NOT: twoBirds will convert the property name to a subdir string like so

"demoapp.Body" ==> "/demoapp/Body.js"

...and starts loading the file.

IF IT EXISTS OR WHEN ITS LOADED:

twoBirds will check whether the namespace points to a function or a plain object.

If it is a function, it will be executed in the context of the current instance (this), and given the property value as a single parameter.

If it is a plain object, the property value will be replaced with it, and when "tb.init" fires the handler will receive the previous contents of the property as a single parameter.

Now lets see all of this in context:

demoapp/Body.js 
```js
tb.namespace('demoapp', true).Body = (function(){

	// Constructor
	function Body(){
		
		var that = this;

		that.handlers = {
			init
		};

	}

	Body.prototype = {

		namespace: 'demoapp.Body',

		'tb.require': [
			'/demoapp/body.css'
		]

	};

	return Body;

	// Private Functions
	function init(){
		
		var that = this;

		// ...

	}

})();
```

The function will execute, starting the requirement loading. Further execution is halted until all required files have loaded. The "init" event will fire then.

* HINT: Properties that contain a dot (.) are said to be misleading because they look like a namespace. In twoBirds, what looks like a namespace IS a namespace - and will be treated as such.

#### ON EVENT / AT RUNTIME:

You can also insert a twoBirds instance into an already existing instance at runtime, in this case inside some event handler you add this code ( the scroller is nott yet converted from V5 to V6, I will refactor the old demoapp later):
```
this.tbElement = new tb(
	'demoapp.someElement'
);
```

## API / Examples

### ON BOOT:

```html
<html>
	<head>
		<script src="http://<yourPathTo>/tb.js"></script>
	</head>
    <body data-tb="demoapp.Body">
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

// find all demoapp.Body sub-instances ( only one )
tb( demoapp.Body )

// find all demoapp.someElement sub-instances ( may return many )
tb( demoapp.someElement )

// REGEXP: as object, but matching to instance 'namespace' property 

// always returns the root object

tb( /app.Bod/ ) // returns the demoapp.body object, its 'namespace' matches the regEx

// OTHER:

// both of the following return all toplevel objects in the current DOM, as expected.

tb( /./ ) 
tb( '*' ) // invoking document.querySelectorAll()

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

// @todo: complete list

// CHAINED SELECTOR RETURNS ARE ALWAYS UNIQUE
```

### Adding or removing event handler functions
... roughly resembles jQuery: 

```js 
function myHandler( e ){
	// do whatever
};

// add handlers (one = only one execution, delete handler afterwards)
tb('body').on('myevent', myHandler);
or
tb('body').one('myevent', myHandler);

// remove handler
tb('body').off('myevent', myHandler);

```

### tb(selector).trigger(event, data, bubble)
- communication between object instances on the page

some trigger snippets:
```js 
// get the $('body') DOM node, 
// retrieve its tB toplevel object, 
// and trigger '<myevent>' on it
tb('body').trigger('<myevent>' [, data] [, bubble])

// find all demoapp.body instances (only one), 
// trigger <myevent> bubbling down locally.
tb( demoapp.Body ).trigger('<myevent>' ,null ,'ld' )	

// find all tb.ui.scroll instances, 
// and trigger 'scroll.update' on it, meaning its a local event that doesnt bubble. 
tb( demoapp.SomeElement ).trigger('scroll.update' );			

```

## Installation

copy tb.js from this and insert into your project. Have fun!

## Use case 
- easily adding JS functionality to server side rendered HTML
- migrating from an existing server side rendered website to a single page application
- any size from embedded small functionality to enterprise apps

# Features
- component style web programming
- distributed programming
- async on demand loading, recursive
- effective multiple inheritance
- web-component programming, defining repository objects

# Status:
- core API stable, optimization and cleanup on the way
- what is not documented here is preliminary code
- will be updated w/ new functionality as needed

# History
twoBirds was created 2004 to be able to build a complex web application for an insurance company.
It was first made public as V2 in 2006 ( [Ajaxian](http://ajaxian.com/archives/twobirds-lib-20-released) ).
It was constantly under development. 

# I dont want to read a lot - give me a kick-start

###On console do...

git clone this repository

goto /httpdocs

php -S 0.0.0.0:3000 &


###Open browser, adress:


####(Example one)


localhost:3000/tb.html

####Open dev tools, e.g. firebug

- inspect DOM to see how twoBirds instances reside in DOM structure, on HTML tab right-click on a div and select 'inspect in DOM' 
- right-click on an "app.child" div, select 'inspect in DOM' to see how twoBirds instances can also reside inside each other
- view 'tb.html' file to see the app code


####(Example two)


localhost:3000/index.html


####Open dev tools, e.g. firebug

- inspect DOM to see the structure
- go to the 'network' tab and reload to see the sequence of requirement loading
- view 'index.html' file to see the app code
- view js files in /httpdocs/demoapp/ to see the app code for those objects that are lazy loaded

In case of questions contact [me](mailTo:frank_thuerigen@yahoo.de).
