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

demoapp/body.js ( simple requirement loading, inserting and recursively init children )
```js 
tb.nameSpace( 'demoapp', true ).body = {

	name: 'demoapp.body',

	handlers: {
		'tb.init': function body_init(ev){
			$(this.target).html( tb.loader.get('demoapp/body.html') );

			var url = $('.thissitenamelink')
				.text( window.location.host )
				.attr( 'href', window.location.protocol + '//' + window.location.host );

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

some trigger snippets from demoapp:
```js 
tb('body').trigger('<myevent>') 						// get the body toplevel object, and trigger '<myevent>' on it, by default bubbling down the sub-instances.
tb( tb.ui.scroll ).trigger(':scroll.update:l')			// get all sub-instances of tb.ui.scroll, and trigger ':scroll.update:l' on it, meaning its a local event that doesnt bubble. As for this special event, all scrollBar handles will be resized and repositioned to reflect their inner content.
tb( demoapp.body ).trigger('root:<myevent>:ld')	// find all body instances, select their root object, trigger <myevent> bubbling down locally.<br />
tb( tb.ui.scroll ).trigger('super:scroll.ready:lu')		// find all tb.ui.scroll instances, select their super object, trigger scroll.ready bubbling up locally.<br />
tb( tb.ui.scroll ).trigger(':scroll.ready:u')			// easier, but the same as above. Missing 'l' indicates not to trigger it locally.<br />
tb( <anyObject> ).trigger(':tb.init:ld')				// as you might have guessed - the infamous 'tb.init' system event<br />
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