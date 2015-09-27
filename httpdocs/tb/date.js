tb = tb || {};

tb.date = function(){
	var a = Array.prototype.slice.call(arguments);
	console.log(a);
	if (a[0]) {
		this.date = new Date( a );
	} else {
		this.date = new Date();
		this.date.setTime( (new Date()).getTime() );
	}
}

tb.date.prototype = (function(){
	//private
	var _locale = {
		'en': {
			firstDayOfWeek: 0,
			weekdays: [
				[ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
				[ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
				[ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
			],
			dateFormat: 'yyyy/mm/dd',
			timeFormat: 'hh:mm:ss',
			dateTimeFormat: 'yyyy/mm/dd hh:mm:ss'
		},
		'de': {
			firstDayOfWeek: 1,
			weekdays: [
				[ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
				[ 'Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam' ],
				[ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ]
			],
			dateFormat: 'dd.mm.yyyy',
			timeFormat: 'hh:mm:ss',
			dateTimeFormat: 'dd.mm.yyyy hh:mm:ss'
		}
	}

	

	return { // public prototype

		// inherited from Date Object
		getDate: function(){ return this.date.getDate() }, // Returns the day of the month (from 1-31)
		getDay: function(){ return this.date.getDay() }, // Returns the day of the week (from 0-6)
		getFullYear: function(){ return this.date.getFullYear() }, // Returns the year (four digits)
		getHours: function(){ return this.date.getHours() }, // Returns the hour (from 0-23)
		getMilliseconds: function(){ return this.date.getMilliseconds() }, // Returns the milliseconds (from 0-999)
		getMinutes: function(){ return this.date.getMinutes() }, // Returns the minutes (from 0-59)
		getMonth: function(){ return this.date.getMonth() }, // Returns the month (from 0-11)
		getSeconds: function(){ return this.date.getSeconds() }, // Returns the seconds (from 0-59)
		getTime: function(){ return this.date.getTime() }, // Returns the number of milliseconds since midnight Jan 1, 1970
		getTimezoneOffset: function(){ return this.date.getTimezoneOffset() }, // Returns the time difference between UTC time and local time, in minutes
		getUTCDate: function(){ return this.date.getUTCDate() }, // Returns the day of the month, according to universal time (from 1-31)
		getUTCDay: function(){ return this.date.getUTCDay() }, // Returns the day of the week, according to universal time (from 0-6)
		getUTCFullYear: function(){ return this.date.getUTCFullYear() }, // Returns the year, according to universal time (four digits)
		getUTCHours: function(){ return this.date.getUTCHours() }, // Returns the hour, according to universal time (from 0-23)
		getUTCMilliseconds: function(){ return this.date.getUTCMilliseconds() }, // Returns the milliseconds, according to universal time (from 0-999)
		getUTCMinutes: function(){ return this.date.getUTCMinutes() }, // Returns the minutes, according to universal time (from 0-59)
		getUTCMonth: function(){ return this.date.getUTCMonth() }, // Returns the month, according to universal time (from 0-11)
		getUTCSeconds: function(){ return this.date.getUTCSeconds() }, // Returns the seconds, according to universal time (from 0-59)
		//getYear: function(){ return this.date.getYear() }, // Deprecated. Use the getFullYear() method instead
		parse: function(){ return Date.parse( Array.prototype.slice.call(arguments) ) }, // Parses a date string and returns the number of milliseconds since January 1, 1970
		setDate: function(){ return this.date.setDate( Array.prototype.slice.call(arguments) ) }, // Sets the day of the month of a date object
		setFullYear: function(){ return this.date.setFullYear( Array.prototype.slice.call(arguments) ) }, // Sets the year (four digits) of a date object
		setHours: function(){ return this.date.setHours( Array.prototype.slice.call(arguments) ) }, // Sets the hour of a date object
		setMilliseconds: function(){ return this.date.setMilliseconds( Array.prototype.slice.call(arguments) ) }, // Sets the milliseconds of a date object
		setMinutes: function(){ return this.date.setMinutes( Array.prototype.slice.call(arguments) ) }, // Set the minutes of a date object
		setMonth: function(){ return this.date.setMonth( Array.prototype.slice.call(arguments) ) }, // Sets the month of a date object
		setSeconds: function(){ return this.date.setSeconds( Array.prototype.slice.call(arguments) ) }, // Sets the seconds of a date object
		setTime: function(){ return this.date.setTime( Array.prototype.slice.call(arguments) ) }, // Sets a date to a specified number of milliseconds after/before January 1, 1970
		setUTCDate: function(){ return this.date.setUTCDate( Array.prototype.slice.call(arguments) ) }, // Sets the day of the month of a date object, according to universal time
		setUTCFullYear: function(){ return this.date.setUTCFullYear( Array.prototype.slice.call(arguments) ) }, // Sets the year of a date object, according to universal time (four digits)
		setUTCHours: function(){ return this.date.setUTCHours( Array.prototype.slice.call(arguments) ) }, // Sets the hour of a date object, according to universal time
		setUTCMilliseconds: function(){ return this.date.setUTCMilliseconds( Array.prototype.slice.call(arguments) ) }, // Sets the milliseconds of a date object, according to universal time
		setUTCMinutes: function(){ return this.date.setUTCMinutes( Array.prototype.slice.call(arguments) ) }, // Set the minutes of a date object, according to universal time
		setUTCMonth: function(){ return this.date.setUTCMonth( Array.prototype.slice.call(arguments) ) }, // Sets the month of a date object, according to universal time
		setUTCSeconds: function(){ return this.date.setUTCSeconds( Array.prototype.slice.call(arguments) ) }, // Set the seconds of a date object, according to universal time
		//setYear: function(){ return this.date.setYear( Array.prototype.slice.call(arguments) ) }, // Deprecated. Use the setFullYear() method instead
		toDateString: function(){ return this.date.toDateString() }, // Converts the date portion of a Date object into a readable string
		//toGMTString: function(){ return this.date.toGMTString( Array.prototype.slice.call(arguments) ) }, // Deprecated. Use the toUTCString() method instead
		toISOString: function(){ return this.date.toISOString() }, // Returns the date as a string, using the ISO standard
		toJSON: function(){ return this.date.toJSON() }, // Returns the date as a string, formatted as a JSON date
		toLocaleDateString: function(){ return this.date.toLocaleDateString( Array.prototype.slice.call(arguments) ) }, // Returns the date portion of a Date object as a string, using locale conventions
		toLocaleTimeString: function(){ return this.date.toLocaleTimeString( Array.prototype.slice.call(arguments) ) }, // Returns the time portion of a Date object as a string, using locale conventions
		toLocaleString: function(){ return this.date.toLocaleString( Array.prototype.slice.call(arguments) ) }, // Converts a Date object to a string, using locale conventions
		toString: function(){ return this.date.toString( Array.prototype.slice.call(arguments) ) }, // Converts a Date object to a string
		toTimeString: function(){ return this.date.toTimeString( Array.prototype.slice.call(arguments) ) }, // Converts the time portion of a Date object to a string
		toUTCString: function(){ return this.date.toUTCString( Array.prototype.slice.call(arguments) ) }, // Converts a Date object to a string, according to universal time
		UTC: function(){ return this.date.UTC( Array.prototype.slice.call(arguments) ) }, // Returns the number of milliseconds in a date since midnight of January 1, 1970, according to UTC time
		valueOf: function(){ return this.date.valueOf( Array.prototype.slice.call(arguments) ) } // Returns the primitive value of a Date object
	}

})();
