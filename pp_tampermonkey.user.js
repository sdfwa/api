// ==UserScript==
// @name          Punchpass Updates
// @namespace     pp_tampermonkey
// @require       http://code.jquery.com/jquery-2.1.1.min.js
// @require       https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.min.js
// @require       https://raw.github.com/ccampbell/mousetrap/master/plugins/global-bind/mousetrap-global-bind.min.js
// @require       https://code.jquery.com/ui/1.11.2/jquery-ui.js
// @run-at        document-end
// @version       1.0
// @description   Addons to Punchpass
// @include       https://app.punchpass.net
// @updateURL     https://shop.briankranson.com/pp_tampermonkey.user.js
// ==/UserScript==
console.log('Started Punchpass enhancements');

(function(unsafe) {
  'use strict';

  var contentEval = function contentEval(source, execute) {
    // Check for function input.
    if ('function' == typeof source && execute) {
      // Execute this function with no arguments, by adding parentheses.
      // One set around the function, required for valid syntax, and a
      // second empty set calls the surrounded function.
      source = '(' + source + ')();'
    }
    // Create a script node holding this  source code.
    var script = unsafe.document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
    // Insert the script node into the page, so it will run
    document.body.appendChild(script);
  }

  var currentURL = unsafe.location.toString();

  var currentURLMatches = function currentURLMatches(listToMatch) {
    //console.log("Testing " + listToMatch);
    for (var i in listToMatch) {
      var pattern = listToMatch[i];
      var regex = new RegExp(pattern);
      if (currentURL.match(regex)) {
        return true;
      };
    }
  }
  
  var keepTrying = function keepTrying(func, callback, sleep, maxAttempts) {
    if (typeof(sleep) == 'undefined') {
      sleep = 100;
    }
    var totalAttempts = 0;
    var args = Array.prototype.slice.call(arguments, 2);
    var timer = setInterval(function() {
      if (func.apply(null, args)) {
        clearInterval(timer);
        // console.log('done trying: '+func);
        callback();
      } else {
        // console.log('tried: '+func);
        totalAttempts++;
        if (typeof maxAttempts !== 'undefined') {
          if (totalAttempts > maxAttempts) {
            clearInterval(timer);
            console.log('Reached maximum number of attepts.  Going to stop checking.')
          }
        }
      }
    }, sleep);
  }
  
  var when = function when(test, run, sleep, maxAttempts) {
    var args = Array.prototype.slice.call(arguments, 2);
    keepTrying(test, function() {
        run.apply(null, args);
      },
      sleep, maxAttempts);
  }

  //Natural sort function
  var alphaNumSort = function alphaNumSort(a, b) {
    function chunkify(t) {
      var tz = new Array();
      var x = 0,
        y = -1,
        n = 0,
        i, j;

      while (i = (j = t.charAt(x++)).charCodeAt(0)) {
        var m = (i == 46 || (i >= 48 && i <= 57));
        if (m !== n) {
          tz[++y] = "";
          n = m;
        }
        tz[y] += j;
      }
      return tz;
    }

    var aa = chunkify(a);
    var bb = chunkify(b);

    for (x = 0; aa[x] && bb[x]; x++) {
      if (aa[x] !== bb[x]) {
        var c = Number(aa[x]),
          d = Number(bb[x]);
        if (c == aa[x] && d == bb[x]) {
          return c - d;
        } else return (aa[x] > bb[x]) ? 1 : -1;
      }
    }
    return aa.length - bb.length;
  }

  jQuery.fn.bindFirst = function(name, fn) {
    // bind as you normally would
    // don't want to miss out on any jQuery magic
    this.on(name, fn);
    // Thanks to a comment by @Martin, adding support for
    // namespaced events too.
    this.each(function() {
      var handlers = jQuery._data(this, 'events')[name.split('.')[0]];
      // console.log(handlers);
      // take out the handler we just inserted from the end
      var handler = handlers.pop();
      // move it at the beginning
      handlers.splice(0, 0, handler);
    });
  }

})(unsafeWindow);