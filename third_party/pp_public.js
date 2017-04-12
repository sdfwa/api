(function(w, n, s) {
  "use strict";
  w[n] = w[n] || {};
  s = w[n];
  s.tmp={};
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
  }
}(window, 'sdfwa'))