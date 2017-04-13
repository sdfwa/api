<?php
// $seconds_to_cache = 5 * 60; // 5 minutes
// $ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";
// header("Expires: $ts");
// header("Pragma: cache");
// header("Cache-Control: max-age=$seconds_to_cache");
// header('Content-Type: application/javascript');
?>
if(typeof jQuery === 'undefined'){
  (function(s,d,f,w,a){
    a = s.getElementsByTagName('body')[0];
    if (s.getElementById(f)) {return;}
    w = s.createElement(d); w.id = f;
    w.src = "https://code.jquery.com/jquery-1.12.0.min.js";
    a.parentNode.insertBefore(w, a);
    }(document,'script','sdfwa-jquery')); 
}

(function(w, n, s) {
  "use strict";
  w[n] = w[n] || {};
  s = w[n];
  s.tmp={};
  s.detectIE = function () {
      var ua = window.navigator.userAgent;

      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
          // IE 10 or older => return version number
          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
         // Edge (IE 12+) => return version number
         return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      return false;
  }
  s.local = JSON.parse(localStorage.getItem('sdfwa') || '{}');
  /* start helper functions */
  // Cookies
  s.createCookie = function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    } else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
  }
  s.readCookie = function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  s.eraseCookie = function eraseCookie(name) {
    s.createCookie(name, "", -1);
  }
  s.getParameterByName = function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  /* end helper functions */
  s.enable = true;
  s.tmp.qp_enable = s.getParameterByName('enable');
  if(s.tmp.qp_enable === 'false'){
    s.createCookie('enable', 'false', 1);
  }else if(s.tmp.qp_enable === 'true'){
    s.eraseCookie('enable');
  }
  if(s.readCookie('enable') === 'false'){
    s.enable = false;
  }
  s.url = document.URL;
  if(s.enable){
    /* start hide elements */
    s.remove_elements = [];
    s.tmp.match_hide_elements = true;
    switch(true) {
      case /\/sign_in/.test(s.url):
        s.remove_elements.push('a.btn-public.bump:contains("Sign In")');
        s.remove_elements.push('a.btn-public.bump:contains("Create Account")');
        s.remove_elements.push('a.btn-public.bump:contains("Purchase A Pass Online")');
        break;
      case /\/sign_up/.test(s.url):
        s.remove_elements.push('a.btn-public.bump:contains("Sign In")');
        s.remove_elements.push('a.btn-public.bump:contains("Create Account")');
        s.remove_elements.push('a.btn-public.bump:contains("Purchase A Pass Online")');
        break;
      case /\/classes/.test(s.url):
        s.remove_elements.push('a.btn-public.bump:contains("Create Account")');
        s.remove_elements.push('a.btn-public.bump:contains("Purchase A Pass Online")');
        s.remove_elements.push('.bottom-gap');
        break;
      case /\/calendar/.test(s.url):
        s.remove_elements.push('a.btn-public.bump:contains("Create Account")');
        s.remove_elements.push('a.btn-public.bump:contains("Purchase A Pass Online")');
        s.remove_elements.push('.bottom-gap');
        break;
      case /\/2729\/member/.test(s.url):
        s.remove_elements.push('.gap-bottomtop');
        s.remove_elements.push('.gap:contains("Delete My Account")');
        $('div[id*=flash]:contains("igned in")').siblings('a.close').click();
        break;
      default:
        s.tmp.match_hide_elements = false;
    }
    for(var i=0; i<s.remove_elements.length; i++){
      $(s.remove_elements[i]).addClass('hidden');
    }
    /* end hide elements */
    /* start modify elements */
    s.tmp.match_modify_elements = true;
    switch(true) {
      case /\/sign_in/.test(s.url):
        $('#member_remember_me').prop('checked', true);
        if(/@/.test(s.local.email) && $('#member_email').val() === ''){
          $('#member_email').val(s.local.email);
          $('#member_password').focus();
        }else{
          $('#member_email').focus();
        }
        break;
      case /\/classes\//.test(s.url):
        $('p:contains("https://goo.gl/maps/BrV9CCqrHMp")').html($('p:contains("https://goo.gl/maps/BrV9CCqrHMp")').html().replace('https://goo.gl/maps/BrV9CCqrHMp', '<a href="https://goo.gl/maps/BrV9CCqrHMp" target="_blank">https://goo.gl/maps/BrV9CCqrHMp</a>'));
        break;
      default:
        s.tmp.match_modify_elements = false;
    }
    /* end modify elements */
    /* start update user info */
    s.tmp.full_name = jQuery('h3:contains("Account Info")').text().replace(/Account Information For: /, '').trim();
    if(typeof s.tmp.full_name !== 'undefined' && s.tmp.full_name !== ''){
      s.local.full_name = s.tmp.full_name;
    }
    s.tmp.email = jQuery('h3:contains("Account Info")').siblings('p').text().trim();
    if(typeof s.tmp.email !== 'undefined' && s.tmp.email !== ''){
      s.local.email = s.tmp.email;
    }
    localStorage.setItem('sdfwa', JSON.stringify(s.local));  
    /* end update user info */
    
    /* start modal code */
      s.showModal = function(data){
        data = data || {};
        data.body = data.body || 'Modal Body';
        data.text = data.text || 'Modal Text';
        $('#sdfwaModal').remove();
        $('#sdfwaModalBtn').remove();
        var modal_html = '\
          <a id="sdfwaModalBtn" href="#sdfwaModal" role="button" class="btn hidden" data-toggle="modal">Show Modal</a>\
          <div id="sdfwaModal" class="modal'+(s.detectIE()===false ? ' hide fade"':'"')+' tabindex="-1" role="dialog" aria-labelledby="sdfwaModalLabel" aria-hidden="true" style="width : 80%; margin-left : -40%;">\
            <div class="modal-header">\
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
              <h3 id="sdfwaModalLabel">{{modal_title}}</h3>\
            </div>\
            <div class="modal-body">\
              {{modal_body}}\
            </div>\
            <div class="modal-footer">\
              <button id="sdfwaModalClose" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\
            </div>\
          </div>\
        ';
        modal_html = modal_html.replace('{{modal_title}}', data.title);
        modal_html = modal_html.replace('{{modal_body}}', data.body);
        $('.container').append($(modal_html));
        $('#sdfwaModalBtn').click();
      }
      s.tmp.body = '\
        <h5>\
          A good place to start this is to make sure you understand that this is your Shop!  It is "of, by and for" our Members.  We want you to not only use the Shop but help us make it better.<br><br>\
          This checklist will help get you in the shop as soon as possible.  And once you complete the list, we will update our records so you don\'t have to see this popup again.  Please be patient with us while get our records in order.<br><br>\
          All of us will need to go through a basic Shop Safety Training program.  This training is essential to insure that we offer everyone a safe environment, that everyone knows how to operate each piece of equipment safely and to satisfy our insurance provider.\
      ';
      s.tmp.body += '\
        <h4>\
          <i class="fa fa-square-o"></i>&nbsp;\
          1) Jump over to <a href="https://asoft10232.accrisoft.com/sdfwa/forms/sdfwa-membership-application-jan-sept/" target="_blank">sdfwa membership</a> site and get a $30 General Membership.\
        </h4>\
      ';
      s.tmp.body += '\
        <h4>\
          <i class="fa fa-square-o"></i>&nbsp;\
          2) Pick either a Silver or Gold Membershop Punchcard from the Purchase A Pass Section. (Skip this step if you are a founder).</a>\
        </h4>\
      ';
      s.tmp.body += '\
        <h4>\
          <i class="fa fa-square-o"></i>&nbsp;\
          3) Download and read our Member Shop Safety Manual {link coming soon}\
        </h4>\
      ';
      s.tmp.body += '\
        <h4>\
          <i class="fa fa-square-o"></i>&nbsp;\
          4) Register for a Shop Safety Training via the calendar.  If you are in the military and E5 or below, please reach out to <a href"mailto:shopit@sdfwa.org?Subject=Military%20Discount" target="_top">shopit@sdfwa.org</a> about a discount\
        </h4>\
      ';
      s.tmp.body += '\
        <h4>\
          <i class="fa fa-square-o"></i>&nbsp;\
          5) Pass the Shop Safety Exam taken during the Shop Safety Training.\
        </h4>\
      ';
      if(/\/member\/?$/.test(s.url)){
        s.showModal({type:"text",title:"Welcome to the SDFWA Member Shop!",body:s.tmp.body});
        $('#sdfwaModalClose').click(function(){
          $('#sdfwaModal').remove();
          $('#sdfwaModalBtn').remove();
        });
        $('a:contains("Home")').text('Home - Checklist');
      }
    /* end modal code */
  }
}(window, 'sdfwa'))