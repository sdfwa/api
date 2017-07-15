// ==UserScript==
// @name          Punchpass Updates
// @namespace     pp_tampermonkey
// @require       http://code.jquery.com/jquery-2.1.1.min.js
// @require       https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.min.js
// @require       https://raw.github.com/ccampbell/mousetrap/master/plugins/global-bind/mousetrap-global-bind.min.js
// @require       https://code.jquery.com/ui/1.11.2/jquery-ui.js
// @run-at        document-end
// @version       1.03
// @description   Addons to Punchpass
// @include       https://app.punchpass.net*
// @updateURL     https://shop.sdfwa.org/third_party/pp_tampermonkey.user.js
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

  if($ && $.fn){
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
  }

  var arrayUnique = function arrayUnique(a) {
      return a.reduce(function(p, c) {
          if (p.indexOf(c) < 0) p.push(c);
          return p;
      }, []);
  };
  
  var getDate = function(){
    var a = new Date();
    var b = ('0000'+a.getFullYear()).slice(-4);
    b += "-";
    b += ('00'+(a.getMonth()+1)).slice(-2);
    b += "-";
    b += ('00'+a.getDate()).slice(-2);
    return b;
  }

  /* start next url */
  s.tmp.next_url = unsafe.localStorage.getItem('next_url') || '';
  if(s.tmp.next_url !== ''){
    unsafe.localStorage.removeItem('next_url');
    unsafe.document.location = s.tmp.next_url;
  }
  /* end next url */
  /* start update all users */
  s.tmp.all_user_status = unsafe.localStorage.getItem('all_user_status') || 'do_nothing';
  if(currentURLMatches(['app.punchpass.net\/customers\/?$'])){
    jQuery('.customers th[aria-label^="Last Name:"]').css('width', '200px');
    // window.localStorage.setItem('all_user_status', 'all_urls_to_local_storage');
    // window.localStorage.removeItem('all_user_status'); window.localStorage.removeItem('urls');
    if(s.tmp.all_user_status === 'all_urls_to_local_storage'){
        s.tmp.urls = [];
        jQuery('.customers tbody a[href*="/customers"]').each(function(){
          s.tmp.urls.push('https://app.punchpass.net' + jQuery(this).attr('href') + '/edit');
        });
        unsafe.localStorage.setItem('all_user_status', 'loop_urls');
        s.tmp.urls = arrayUnique(s.tmp.urls);
        unsafe.localStorage.setItem('urls', JSON.stringify(s.tmp.urls));
        unsafe.document.location = currentURL;
    }else if(s.tmp.all_user_status === 'loop_urls'){
        s.tmp.urls = JSON.parse(unsafe.localStorage.getItem('urls'));
        if(s.tmp.urls.length === 0){
          unsafe.localStorage.removeItem('all_user_status');
          unsafe.localStorage.removeItem('urls');
          document.location = 'https://app.punchpass.net\/customers';
        }else{
          s.tmp.url = s.tmp.urls.pop();
          unsafe.localStorage.setItem('urls', JSON.stringify(s.tmp.urls));
          unsafe.document.location = s.tmp.url;
        }
    }
  }
  /* end update all users */

  /* start update user */
  if(currentURLMatches(['app.punchpass.net\/customers\/([0-9]+)\/edit'])){
    s.update_user = function(){
      s.tmp.email = $('#customer_email').val();
      $.getJSON('https://shop.sdfwa.org/api/get_member_assoc_info.php?email=' + s.tmp.email).done(function(data){
        if(data.success === 'true' && s.tmp.email.toLowerCase().trim() === data.email.toLowerCase().trim() && /^\d{4}$/.test(data.member_id)){
          // add dashes to 10 digit phone number
          s.tmp.phone = ('0000000000' + data.phone.replace(/(\ |\.|\-|\(|\))/g, '')).substr(-10);
          s.tmp.phone = s.tmp.phone.slice(0,3)+"-"+s.tmp.phone.slice(3,6)+"-"+s.tmp.phone.slice(6);
          s.tmp.last_name = data.last_name + ' (' + data.member_id + ')';
          if(1 === 1){
            s.tmp.update = false;
            if($('#customer_first_name').val() !== data.first_name) {
              $('#customer_first_name').val(data.first_name);
              s.tmp.update = true;
            }
            if($('#customer_last_name').val() !== s.tmp.last_name) {
              $('#customer_last_name').val(s.tmp.last_name);
              s.tmp.update = true;
            }
            if($('#customer_phone').val() !== s.tmp.phone) {
              $('#customer_phone').val(s.tmp.phone);
              s.tmp.update = true;
            }
            if($('#customer_street_address').val() !== data.address) {
              $('#customer_street_address').val(data.address);
              s.tmp.update = true;
            }
            if((parseInt(data.year) >= (new Date()).getFullYear() || parseInt(data.year) == 99)){
              if($('#customer_city').val() !== '') {
                $('#customer_city').val('');
                s.tmp.update = true;
              }
            }else if(s.tmp.email === ''){
              if($('#customer_city').val() !== 'NO EMAIL') {
                $('#customer_city').val('NO EMAIL');
                s.tmp.update = true;
              }
            }else{
              if($('#customer_city').val() !== data.year) {
                $('#customer_city').val(data.year);
                s.tmp.update = true;
              }
            }
            if($('#customer_state').val() !== data.state) {
              $('#customer_state').val(data.state);
              s.tmp.update = true;
            }
            if($('#customer_zip_code').val() !== data.zip_code) {
              $('#customer_zip_code').val(data.zip_code);
              s.tmp.update = true;
            }
            if(s.tmp.update === true){
              // $('#customer_notes').val($('#customer_notes').val() + ($('#customer_notes').val() === '' ? '' : '\n') + (new Date()).toISOString());
              $('#customer_notes').val();
              if(s.tmp.all_user_status === 'loop_urls'){
                unsafe.localStorage.setItem('next_url', 'https://app.punchpass.net/customers');
              }else{
                unsafe.localStorage.removeItem('all_user_status');
                unsafe.localStorage.setItem('next_url', currentURL); 
              }
              $('input[value="Update Customer"]')[0].click(); 
            }else{
              $('#sdfwa_alert').remove();
              $('.content').prepend(
                '<div id="sdfwa_alert" class="alert alert-info fade in">\
                  <button type="button" class="close" data-dismiss="alert">×</button>\
                  <strong>The member record is in sync with the assocaion database.</string>\
                </div>'
              )
              if(s.tmp.all_user_status !== 'loop_urls'){
                unsafe.localStorage.removeItem('all_user_status');
              }
            }
          }
        }else if(data.success === 'false'){
          if($('#customer_city').val() !== 'NO MEMBER ID') {
            $('#customer_city').val('NO MEMBER ID');
            s.tmp.update = true;
          }
          if(s.tmp.update === true){
            $('#customer_notes').val($('#customer_notes').val() + ($('#customer_notes').val() === '' ? '' : '\n') + (new Date()).toISOString());
            if(s.tmp.all_user_status === 'loop_urls'){
              unsafe.localStorage.setItem('next_url', 'https://app.punchpass.net/customers');
            }else{
              unsafe.localStorage.setItem('next_url', currentURL);
            }
            $('input[value="Update Customer"]')[0].click(); 
          }else{
            $('#sdfwa_alert').remove();
            $('.content').prepend(
              '<div id="sdfwa_alert" class="alert alert-info fade in">\
                <button type="button" class="close" data-dismiss="alert">×</button>\
                <strong>The member record is in sync with the assocaion database.</string>\
              </div>'
            )
            if(s.tmp.all_user_status !== 'loop_urls'){
              unsafe.localStorage.removeItem('all_user_status');
            }
          }
        }
      });
    }
    console.log('start update user');
    $('ul.nav-pills').append('<li><a id="sdfwa_update_user" style="cursor: pointer;"><i class="fa fa-download"></i> Pull Assoc Info</a></li>').click(function(){s.update_user();});
    if(s.tmp.all_user_status !== 'do_nothing'){
      s.update_user();
    }
  }
  /* end update user */

  /* start update local objects */
  if(currentURLMatches(['\/\/app\.punchpass\.net\/customers$'])){
    s.members={};
    $('table.customers tbody tr').each(function(i, elem){
      var that = this;
      $(this).find('td').each(function(i, elem){
        switch(i){
            case 0:
              s.tmp.member_id = $(this).find('input').val().trim();
              s.members[s.tmp.member_id] = {};
            break;
            case 1:
              s.members[s.tmp.member_id].first_name = $(this).find('a').text().trim();
            break;
            case 2:
              s.members[s.tmp.member_id].last_name = $(this).text().replace(/\s\([0-9]+\)$/, '').trim();
              s.members[s.tmp.member_id].member_id = $(this).text().replace(/^.+\s\(/, '').replace(/\)$/, '').trim();
            break;
            case 3:
              s.members[s.tmp.member_id].email = $(this).text().toLowerCase().trim();
            break;
            case 4:
              s.members[s.tmp.member_id].phone = $(this).text().trim().trim();
            break;
            case 5:
              if(/^[0-9]{4}$/.test($(this).text().trim())){
                s.members[s.tmp.member_id].member_id = $(this).text().trim();
                s.members[s.tmp.member_id].sync = false;
              }else if($(this).text().trim() === ''){
                s.members[s.tmp.member_id].sync = false;
              }else{
                s.members[s.tmp.member_id].city = $(this).text().trim();
                $($(that).find('td')[1]).css('color', 'red');
                s.members[s.tmp.member_id].sync = true;
              }
            break;
            default:
              s.members[s.tmp.member_id]['unknown' + Math.random()]=$(this).html();
        }
      });
    });
    s.tmp.member_id = void(0);

    s.tmp.member_keys = Object.keys(s.members);
    s.need_sync={};
    for(var i=0, len=s.tmp.member_keys.length; i<len; i++){
      var member_id = s.tmp.member_keys[i];
      if(!s.members[member_id].sync){
        s.need_sync[member_id] = s.members[member_id];
      }
    }
    s.tmp.member_keys = void(0);
  }
  /* end update local objects */

  /* start check for update of single user */
  if(currentURLMatches(['app.punchpass.net\/customers\/([0-9]+)\/?$'])){
    $('ul.nav-pills').append('<li><a id="sdfwa_update_user" style="cursor: pointer;"><i class="fa fa-download"></i> Pull Assoc Info</a></li>').click(function(){
      unsafe.localStorage.setItem('all_user_status', 'update_single_user');
      document.location = document.location + '/edit';
    });
  }
  /* end check for update of single user */
})(unsafeWindow);