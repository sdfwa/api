if(/sdfwa\.org\/member\-shop\-app/.test(document.URL) || /shop\.sdfwa\.org/.test(document.URL)){
    sdfwa_custom = window.sdfwa_custom || {};
    sdfwa_custom.deleteCookie = function(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
    sdfwa_custom.createCookie = function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
    sdfwa_custom.readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    // this will resize the iframe
    sdfwa_custom.resize_iframe = function resize_iframe() {
        var width = Math.round(window.innerWidth * .95);
        jQuery('.interior').css('width', width + 'px');
        // jQuery('.interior iframe').attr('width', (width * .98));
    }
    // this will keep the resize from going bonkers and running too often, copied from underscore
    sdfwa_custom.debounce = function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            if (immediate && !timeout) func.apply(context, args);
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
	sdfwa_custom.createCookie('cookie_test', 'cookie_test', 1);
	if(sdfwa_custom.readCookie('cookie_test') === 'cookie_test'){
		if(/sdfwa\.org\/member\-shop\-app/.test(document.URL)){
			document.location = 'https://shop.sdfwa.org/';
		}else if(/shop\.sdfwa\.org/.test(document.URL)){
			sdfwa_custom.deleteCookie('cookie_test');
			sdfwa_custom.iframe = document.createElement('iframe');
			sdfwa_custom.iframe.src = 'https://app.punchpass.net/org/2729/sign_in';
			sdfwa_custom.iframe.name = 'punchpassFrame';
			sdfwa_custom.iframe.width = '100%';
			sdfwa_custom.iframe.frameBorder = '0';
			jQuery('#show_iframe').append(sdfwa_custom.iframe);
			jQuery('#noJS').hide();
			// only run after document is ready
			$(document).ready(function() {
				// only run on the punchpass iframe
				if (/app\.punchpass\.net/.test(jQuery('iframe[name="punchpassFrame"]').attr('src'))) {
            // Create IE + others compatible event handler
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

            // Listen to message from child window
            eventer(messageEvent,function(e) {
              $('iframe[name="punchpassFrame"]').attr('height', e.data+'px');
              $('iframe[name="punchpassFrame"]').attr('scrolling', 'no');
            },false);
					// run the resize function each time the user resizes their window
					window.onresize = sdfwa_custom.debounce(function() {
						sdfwa_custom.resize_iframe();
					}, 300);
					// run the resize function once when this code initializes
					jQuery('iframe[name=punchpassFrame]').attr('frameborder', '0');
					sdfwa_custom.resize_iframe();
				}
			});
		}
	}
}