/**
 *  @fileoverview
 *  TWOBIRDS JavaScript framework library
 *  project specific loader 
 *  @version 5.0a
 *  @author Frank Thuerigen 
 *          frank_thuerigen@yahoo.de
 */
  
/**
 * css file loader
 * @namespace tb.loader.css
 */
tb.loader.json = (function () {
    /** private */
    function cb( pPath, pUrl, pCb ) {
    	//console.log('generate css callback');
        return function (pXml, pText ) {
        };
    }

    /** @lends tb.loader.css */
    return {

        prefix: 'js/',

        /**
		 * @function
		 * @memberOf tb.loader.json
		 */
        load: function ( pPath, pCb ) {
            var url = ( tb.loader.json['prefix'] || '') + pPath,
                myCb = pCb || tb.nop; 
            
        	if ( !pPath ) return;
			tb.loader.count( 1, 'JSON: ' + pPath );

            //console.log( 'loader.css.load', pPath, pCb );
            c.set( pPath, 0 );

            if ( pCb ) { // if callback load via request
	            //console.log( 'loader.css.load METHOD xhr', pPath, pCb );
                tb.request({
                	method: 'GET',
                    url: url,
                    success: cb( pPath, url, myCb ),
                    failure: tb.loader.errCb( url )
                });
            }
        },

        test: function( pPath ){
        	var i = c.get( pPath );
        	return !!i; // status 1 is done
        }
    };
})();

