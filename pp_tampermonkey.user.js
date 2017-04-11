// ==UserScript==
// @name          Punchpass Updates
// @namespace     pp_tampermonkey
// @require       http://code.jquery.com/jquery-2.1.1.min.js
// @require       https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.min.js
// @require       https://raw.github.com/ccampbell/mousetrap/master/plugins/global-bind/mousetrap-global-bind.min.js
// @require       https://code.jquery.com/ui/1.11.2/jquery-ui.js
// @run-at        document-end
// @version       1.01
// @description   Addons to Punchpass
// @include       https://app.punchpass.net*
// @updateURL     https://shop.briankranson.com/pp_tampermonkey.user.js
// ==/UserScript==
console.log('Started Punchpass enhancements');

(function(unsafe) {
  'use strict';
  unsafe.sdfwa = unsafe.sdfwa || {};
  var s = unsafe.sdfwa;
  s.tmp = {};
  $ = unsafe.jQuery;

  var contentEval = function contentEval(source, execute) {
    // Check for function input.
    if ('function' == typeof source && execute) {
      // Execute this function with no arguments, by adding parentheses.
      // One set around the function, required for valid syntax, and a
      // second empty set calls the surrounded function.
      source = '(' + source + ')();';
    }
    // Create a script node holding this  source code.
    var script = unsafe.document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
    // Insert the script node into the page, so it will run
    document.body.appendChild(script);
  };

  var currentURL = unsafe.location.toString();

  var currentURLMatches = function currentURLMatches(listToMatch) {
    //console.log("Testing " + listToMatch);
    for (var i in listToMatch) {
      var pattern = listToMatch[i];
      var regex = new RegExp(pattern);
      if (currentURL.match(regex)) {
        return true;
      }
    }
  };

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
            console.log('Reached maximum number of attepts.  Going to stop checking.');
          }
        }
      }
    }, sleep);
  };

  var when = function when(test, run, sleep, maxAttempts) {
    var args = Array.prototype.slice.call(arguments, 2);
    keepTrying(test, function() {
        run.apply(null, args);
      },
      sleep, maxAttempts);
  };

  $.fn.bindFirst = function(name, fn) {
    // bind as you normally would
    // don't want to miss out on any jQuery magic
    this.on(name, fn);
    // Thanks to a comment by @Martin, adding support for
    // namespaced events too.
    this.each(function() {
      var handlers = $._data(this, 'events')[name.split('.')[0]];
      // console.log(handlers);
      // take out the handler we just inserted from the end
      var handler = handlers.pop();
      // move it at the beginning
      handlers.splice(0, 0, handler);
    });
  };

  /* start next url */
  s.tmp.next_url = unsafe.localStorage.getItem('next_url') || '';
  if(s.tmp.next_url !== ''){
    unsafe.localStorage.removeItem('next_url');
    unsafe.document.location = s.tmp.next_url;
  }
  /* end next url */

  /* start update user */
  // jQuery('.customers tbody a[href*="/customers"]').each(function(){jQuery(this).attr('href', (jQuery(this).attr('href') + '/edit'));});
  if(currentURLMatches(['app.punchpass.net\/customers\/([0-9]+)\/edit'])){
    console.log('start update user');
    s.tmp.email = $('#customer_email').val();
    $.getJSON('https://shop.briankranson.com/api/get_member_assoc_info.php?email=' + s.tmp.email).done(function(data){
      if(data.success === 'true' && s.tmp.email.toLowerCase().trim() === data.email.toLowerCase().trim() && /^\d{4}$/.test(data.member_id) && parseInt(data.year) >= (new Date()).getFullYear()){
        // add dashes to 10 digit phone number
        s.tmp.phone = ('0000000000' + data.phone.replace(/(\ |\.|\-|\(|\))/g, '')).substr(-10);
        s.tmp.phone = s.tmp.phone.slice(0,3)+"-"+s.tmp.phone.slice(3,6)+"-"+s.tmp.phone.slice(6);
        s.tmp.last_name = data.last_name + ' (' + data.member_id + ')';
        if($('#customer_first_name').val() != data.first_name ||
          $('#customer_last_name').val() != s.tmp.last_name ||
          $('#customer_phone').val() != s.tmp.phone ||
          $('#customer_street_address').val() != data.address ||
          $('#customer_city').val() != data.city ||
          $('#customer_state').val() != data.state ||
          $('#customer_zip_code').val() != data.zip_code
        ){
          $('#customer_first_name').val(data.first_name);
          $('#customer_last_name').val(s.tmp.last_name);
          $('#customer_phone').val(s.tmp.phone);
          $('#customer_street_address').val(data.address);
          $('#customer_city').val(data.city);
          $('#customer_state').val(data.state);
          $('#customer_zip_code').val(data.zip_code);
          $('#customer_notes').val($('#customer_notes').val() + ($('#customer_notes').val() === '' ? '' : '\n') + (new Date()).toISOString());
          // unsafe.localStorage.setItem('next_url', 'https://app.punchpass.net/customers');
          unsafe.localStorage.setItem('next_url', currentURL);
          $('input[value="Update Customer"]')[0].click();
        }
      }
    });
  }
  /* end update user */

})(unsafeWindow);