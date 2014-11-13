# twoBirds v5.0

[twoBirds](https://github.com/FrankieTh-xx/twobirds) is a lightweight, component-based,
event-driven JavaScript framework that maps nested objects to DOM nodes. 
It was created 2006 by the [repo owner](http://frank.thuerigen.two-birds.ch) to able to build a web application for an insurance company.
It was first made public in 2007 ( [Ajaxian](http://ajaxian.com/archives/twobirds-lib-20-released) ), but had no impact then.
It stayed submerged for the next years, though it was constantly under development. 

jQuery is needed, but is not absolutely essential. You can replace it with other selector libs.

* [Tech demo](http://demo.two-birds.ch/) Desktop only. Code is included in this repo.
* [API documentation](doc/README.md) only this so far, but it will get you going. The demo page contains an info window that explains a bit more.

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

### tb() selector and inner structure example

when on the demoapp, and the info window is on page, enter this in console:
```js 
tb( demoapp.infoWindow ).structure()
```

the console will come up with its inner structure, much as expected it looks like:
```js 
demoapp.infoWindow Object { target=div, handlers={...}, name="demoapp.infoWindow", mehr...}
	['demoapp.sys.window']: demoapp.sys.window Object { target=div, handlers={...}, name="demoapp.sys.window", mehr...}
		['tb.ui.scroll']: tb.ui.scroll Object { target=div, handlers={...}, name="tb.ui.scroll", mehr...}
```

to see the complete structure attached to this DOM node, enter this in console:
```js 
tb( demoapp.infoWindow )._root().structure()
```

and the response will be:
```js 
_1415886556968_036833262191511307 Object { target=div, handlers={...}, name="_1415886556968_036833262191511307", mehr...}
	['demoapp.infoWindow']: demoapp.infoWindow Object { target=div, handlers={...}, name="demoapp.infoWindow", mehr...}
		['demoapp.sys.window']: demoapp.sys.window Object { target=div, handlers={...}, name="demoapp.sys.window", mehr...}
			['tb.ui.scroll']: tb.ui.scroll Object { target=div, handlers={...}, name="tb.ui.scroll", mehr...}

```

As you see, it is a consistent nested structure of instances, looking all the same codewise.
You can access every object on the page via tb( selector ), as shown in the trigger examples below.


### tb( selector$ ).trigger( event )
- communication between object instances on the page

some trigger snippets from demoapp:
```js 
// get the $('body') DOM node, 
// retrieve its tB toplevel object, 
// and trigger '<myevent>' on it, 
// ( by default ) bubbling down the sub-instances attached within.
tb('body').trigger('<myevent>')

// find all body instances, 
// select their root object, 
// trigger <myevent> bubbling down locally.
tb( demoapp.body ).trigger('root:<myevent>:ld')	

// get all sub-instances of tb.ui.scroll, 
// and trigger ':scroll.update:l' on it, meaning its a local event that doesnt bubble. 
// As for this special event, all scrollBar handles will be resized and repositioned.
tb( tb.ui.scroll ).trigger(':scroll.update:l')			

// find all tb.ui.scroll instances, 
// select their super object, 
// trigger scroll.ready bubbling up locally.
tb( tb.ui.scroll ).trigger('super:scroll.ready:lu')		

// same as above, but easier. 
// Missing 'l' indicates not to trigger it locally.<br />
tb( tb.ui.scroll ).trigger(':scroll.ready:u')		

// as you might have guessed - the infamous 'tb.init' system event<br />	
tb( <anyObject> ).trigger(':tb.init:ld')				
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

In case of questions contact me.