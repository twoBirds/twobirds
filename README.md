# twoBirds v5.0

[twoBirds](https://github.com/FrankieTh-xx/twobirds) is a lightweight, component-based,
event-driven JavaScript framework that maps nested objects to DOM nodes. 

twoBirds is the minimum possible solution for an application framework, it consists of only 3 parts:
- a simple client repository object structure
- a selector to adress instances of these objects on the page
- a trigger to communicate with the selected object

twoBirds was created 2006 by the [repo owner](http://frank.thuerigen.two-birds.ch).

twoBirds utilizes jQuery.

* [Tech demo](http://demo.two-birds.ch/) Desktop only. Code is included in this repo.
* [API documentation](doc/README.md) only this so far, but it will get you going. 

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


Client repo object: simple requirement loading, inserting and recursively init children

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

By default upon startup twoBirds will lookup DOM nodes containing a "data-tb" attribute, 
and treats them as a white-space delimited list of twoBirds instances to attach there.
If the corresponding repo object doesnt exist, on-demand loading is performed recursively.


Client repo object: simple sub-instance, tb.observe example

demoapp/globalSpinner.js 
```js 
demoapp.globalSpinner = {

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

### tb() selector and inner structure example

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

// CHAINED SELECTOR RETURNS ARE ALWAYS UNIQUE
```



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
You can access every object on the page via tb(selector), as shown in the trigger examples below.


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
twoBirds was created 2006 by the [repo owner](http://frank.thuerigen.two-birds.ch) to able to build a web application for an insurance company.
It was first made public in 2007 ( [Ajaxian](http://ajaxian.com/archives/twobirds-lib-20-released) ), but had no impact then.
It stayed submerged for the next years, though it was constantly under development. 

In case of questions contact me.
