# twoBirds v5.0

[twoBirds](https://github.com/FrankieTh-xx/twobirds) is a lightweight, component-based,
event-driven JavaScript framework that maps nested objects to DOM nodes. 

twoBirds strictly follows the KISS doctrine, it is the minimum possible solution for an application framework.

It consists of only 3 parts:
- a simple client repository object structure + instanciation mechanism
- a selector to adress instances of these objects on the page
- a trigger to communicate with the selected instance on the page

twoBirds builds nested structures of instances of repo objects that all look the same codewise, but add up to complex functionality like in this structural example:

```
myWindow contains
    a system window to display contents, which contains
        a scollBar to scroll the window contents
```

All instances inside this example are loose coupled by the selector-trigger mechanism.

twoBirds was created 2006 by the [repo owner](http://frank.thuerigen.two-birds.ch).

twoBirds utilizes jQuery.

* [Tech demo](http://demo.two-birds.ch/) Desktop only. Code is included in this repo.
* [API documentation](doc/README.md) only this so far, but it will get you going. 

Comparision: twoBirds can be compared to twitters Flight and googles Polymer / Web Components. Like Flight it is Javascript centric, as opposed to Web Components. Unlike both of these it allows for complete separation of code and design. As mentioned it aims at making nesting of loose coupled objects into complex structures easier and more transparent. Unlike Flight requirement loading is inherent part of the system.

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

In twoBirds, on the client side you have a repository of plain JS objects. These are the copy sources of the instances you later create on DOM nodes. In general this follows a mixin pattern.

### Repository Objects

There are 3 property names in repository objects that are reserved:

* *target*: ... is the DOM node the tB instance is attached to. In nested objects it is inherited from the parent, but can be set to another DOM node as well if necessary. You cannot set this property in a repo object, since it would make no sense.

* *name*: ... is the namespace of the repo object, and should be set accordingly, since both the regEx selector tb(/.../) is checked against the name, as well as the .instanceOf("namespace") method checks against the "name" property.

* *handlers*: ... is a plain object, where { key: value } is { eventName: function( params ){ /\*...\*/ } }. If for some reasons you need more than one handler for an eventName, eventName also can be an array of callback functions.

As for handlers, there currently is 1 event name that is reserved:

* *tb.init*: function(){ /* all requirement loading for all nestings is done, now construct the object as necessary */ }

This event bubbles down the nested structure, when all required files have been loaded, hereby initializing the object.

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
tb.nameSpace( 'demoapp', true ).body = {

	name: 'demoapp.body',

	handlers: {
		'tb.init': function body_init(ev){
			$(this.target).html( tb.loader.get('demoapp/body.html') );

			// ... 

			this.initChildren();
		}
	},

	'tb.require': [
		'demoapp/props/icomoon/style.css',
		'demoapp/body.html',
		'demoapp/body.css'
	]

}
```
* "tb.require" is a dotted property
* also it is a function
The function will execute, starting the requirement loading. Further execution is halted until all required files have loaded. "tb.init" will fire then.

### Nesting instances

There are 2 ways of nesting subinstances into another instance:

#### ON LOAD / WHEN INSTANCIATING:

demoapp/globalSpinner.js 
```js 
tb.nameSpace( 'demoapp', true ).globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: {

		'tb.init': function globalSpinner_tb_init(){
			var that = this['tb.ui.spinner'];

			// observe loading status and trigger spinner accordingly
			tb.loader.loading.observe( function globalSpinner_setSpinner( pBool ){ 
				if ( pBool ){
					that.trigger(':tb.ui.spinner.on:');
				} else {
					that.trigger(':tb.ui.spinner.off:');
				}
			});

		}

	}

}
```
* "tb.ui.spinner" is a dotted property
* it doesnt exist in the namespace when the instanciation of "demoapp.gloabalSpinner" is done
* instanciation halts until "tb/ui/spinner.js" is loaded (and also all nested requirements)
* when  its loaded, twoBirds detects that tb.ui.spinner is a plain object
* the object is then inserted into the "tb.ui.spinner" property
* "tb.init" is fired, with the empty object {} as a single parameter

#### ON EVENT:

You can also insert a twoBirds instance into an already existing instance at runtime, in this case inside some event handler you add this code (example taken from demoapp/sys/window.js ):
```
// if scrollBar attach it
			if ( this.config.scrollBar === true ) {
				// SPECIAL CASE: 
				// no requirement loading necessary, 
				// since parent() already has a scroll!
				this['tb.ui.scroll'] = {
					content: this.content[0],
					direction: 'y',
			        bubbleUp: true,
			        pixelsPerSecond: 2000,
			        attachDelay: 2000,
			        easing: 'swing'
    			};

    			this.inject( 'tb.ui.scroll' );

    			this['tb.ui.scroll'].addHandler(
    				'scroll.active', 
    				function(){
    					this._super().trigger(':window.active:', true); // make window active when scroll becomes active
    				}
    			);
```


## Examples

### tb Objects

```html
<html>
	<head>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="http://<yourPathTo>/twobirds.js"></script>
	</head>
    <body data-tb="demoapp/body.js">
    </body>
</html>
```
By default upon startup twoBirds will lookup DOM nodes containing a "data-tb" attribute, 
and treats them as a white-space delimited list of twoBirds instances to attach there. 
If the corresponding repo object doesnt exist, on-demand loading is performed recursively. 

#### Client repo object: simple requirement loading, inserting and recursively init children

demoapp/body.js 
```js 
tb.nameSpace( 'demoapp', true ).body = {

	name: 'demoapp.body',

	handlers: {
		'tb.init': function body_init(ev){
			$(this.target).html( tb.loader.get('demoapp/body.html') );

			// ... 

			this.initChildren();
		}
	},

	'tb.require': [
		'demoapp/props/icomoon/style.css',
		'demoapp/body.html',
		'demoapp/body.css'
	]

}
```
.initChildren() will run this initialization on newly inserted DOM content.

#### Client repo object: simple sub-instance, tb.observe example

demoapp/globalSpinner.js 
```js 
tb.nameSpace( 'demoapp', true ).globalSpinner = {

	name: 'demoapp.globalSpinner',

	'tb.ui.spinner': {},

	handlers: {

		'tb.init': function globalSpinner_tb_init(){
			var that = this['tb.ui.spinner'];

			// observe loading status and trigger spinner accordingly
			tb.loader.loading.observe( function globalSpinner_setSpinner( pBool ){ 
				if ( pBool ){
					that.trigger(':tb.ui.spinner.on:');
				} else {
					that.trigger(':tb.ui.spinner.off:');
				}
			});

		}

	}

}
```
* Properties that contain a dot (.) are said to be misleading because they look like a namespace. In twoBirds, what looks like a namespace IS a namespace - and will be treated as such.
* Named callback functions aid in debugging of asynchronous systems

### tb() Selector and inner structure example

All possible selectors:
```js 
// tb() SELECTOR ALWAYS RETURNS ONE OF...
// - an empty array ( indicating there is no match )
// - a single tB object ( one match )
// - an array containing tB objects ( more than one match )

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

// REGEXP: as object, but matching to instance 'name' property 

// always returns the root object

tb( /app.bod/ ) // returns the demoapp.body root object, its 'name' matches

// OTHER:

// both of the following return all toplevel objects in the current DOM, as expected.

tb( /./ ) 
tb( '*' )

// THIS:

this // in handler code, this always points to the current sub-instance

// CHAINING:

// currently these chained selectors exist,
// and can be used to get other page objects,
// positioned relatively to a selector result or 'this'

tb('body').children('div') // all children of body tB object that reside inside a div HTML element
tb('body').descendants() // all descendants of body tB object
tb( demoapp.infoWindow ).parent() // closest parent, in this case the windowController
tb( demoapp.infoWindow ).parents() // array of all parent tB objects, nearest first
tb( demoapp.infoWindow ).prev() // the previous tb instance in this.parent().children()
tb( demoapp.infoWindow ).next() // the next tb instance in this.parent().children()

// CHAINED SELECTOR RETURNS ARE ALWAYS UNIQUE
```

### tb(selector).trigger(event, data)
- communication between object instances on the page

some trigger snippets from demoapp:
```js 
// get the $('body') DOM node, 
// retrieve its tB toplevel object, 
// and trigger '<myevent>' on it, 
// ( by default ) bubbling down the sub-instances attached within.
tb('body').trigger('<myevent>' [, data])

// find all demoapp.body instances, 
// select their root object, 
// trigger <myevent> bubbling down locally.
tb( demoapp.body ).trigger('root:<myevent>:ld' [, data] )	

// find all tb.ui.scroll instances, 
// and trigger ':scroll.update:l' on it, meaning its a local event that doesnt bubble. 
// As for this special event, all scrollBar handles will be resized and repositioned.
tb( tb.ui.scroll ).trigger(':scroll.update:l' [, data] )			

// find all tb.ui.scroll instances, 
// select their super object, 
// trigger scroll.ready bubbling up locally.
tb( tb.ui.scroll ).trigger('super:scroll.ready:lu' [, data] )		

// same as above, but easier. 
// Missing 'l' indicates not to trigger it locally.<br />
tb( tb.ui.scroll ).trigger(':scroll.ready:u' [, data ] )		

// as you might have guessed - the infamous 'tb.init' system event<br />	
tb( <anyObject> ).trigger(':tb.init:ld' )				
```

## Reflection

### .structure()

When on the demoapp, and the info window is on page, enter this in console...
```js 
tb( demoapp.infoWindow ).structure()
```

... and console will come up with its inner structure, much as expected it looks like:
```js 
demoapp.infoWindow Object { target=div, handlers={...}, name="demoapp.infoWindow", mehr...}
	['demoapp.sys.window']: demoapp.sys.window Object { target=div, handlers={...}, name="demoapp.sys.window", mehr...}
		['tb.ui.scroll']: tb.ui.scroll Object { target=div, handlers={...}, name="tb.ui.scroll", mehr...}
```



To see the complete structure attached to this DOM node, enter this in console...
```js 
tb( demoapp.infoWindow )._root().structure()
```

... and the response will be:
```js 
_1415886556968_036833262191511307 Object { target=div, handlers={...}, name="_1415886556968_036833262191511307", mehr...}
	['demoapp.infoWindow']: demoapp.infoWindow Object { target=div, handlers={...}, name="demoapp.infoWindow", mehr...}
		['demoapp.sys.window']: demoapp.sys.window Object { target=div, handlers={...}, name="demoapp.sys.window", mehr...}
			['tb.ui.scroll']: tb.ui.scroll Object { target=div, handlers={...}, name="tb.ui.scroll", mehr...}

```

As you see, it is a consistent nested structure of instances, looking all the same codewise.

### .describe()

When on the demoapp, enter this in console...
```js 
tb( demoapp.userLogin ).describe()
```

... and console will come up with the events it handles, and the events it triggers inside these handlers:
```js 
[demoapp.userLogin] describe handlers:
-> tb.init
    <- .trigger( 'userlogin.success', that.model.data()
    <- .trigger(':userLogin.login:')
-> userlogin.login
-> userlogin.logout
-> userlogin.success
    <- .trigger( ':tb.model.failure:l' )
    <- .trigger(':tb.init:')
-> tb.model.failure
```
This helps in following the asynchronous event flow.

### .structure( true )

When on the demoapp, enter this in console...
```js 
tb( demoapp.globalSpinner ).structure( true )
```

... and console will show both structure and handlers/triggers:
```js 
demoapp.globalSpinner Object { target=div, handlers={...}, name="demoapp.globalSpinner", mehr...}
	-> tb.init
	   <- .trigger(':tb.ui.spinner.on:d')
	   <- .trigger(':tb.ui.spinner.off:d')
	['tb.ui.spinner']: tb.ui.spinner Object { target=div, handlers={...}, name="tb.ui.spinner", mehr...}
		-> tb.init
		-> tb.ui.spinner.on
		-> tb.ui.spinner.off
```


## Installation

copy twoBirds.js from demoapp and insert into your project

## Use case 
- component style web programming
- distributed programming
- any size from embedded small functionality to enterprise apps

# Features
- async on demand loading, recursive inside tb objects
- effective multiple inheritance
- web-components-like programming, defining repository objects
- instances of top level tB objects live in a DOM node
- own chained selector for tl tB objects
- own async trigger mechanism on app level

# Status:
- preliminary stable
- will be updated w/ new functionality as needed

# History
twoBirds was created 2006 by the [repo owner](http://frank.thuerigen.two-birds.ch) to be able to build a complex web application for an insurance company.
It was first made public in 2007 ( [Ajaxian](http://ajaxian.com/archives/twobirds-lib-20-released) ), but had no impact then.
It stayed submerged for the next years, though it was constantly under development. 

In case of questions contact [me](http://frank.thuerigen.two-birds.ch).
