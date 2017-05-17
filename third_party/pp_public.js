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
  s.inIframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }
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
  s.getDate = function(){
    var a = new Date();
    var b = ('0000'+a.getFullYear()).slice(-4);
    b += "-";
    b += ('00'+(a.getMonth()+1)).slice(-2);
    b += "-";
    b += ('00'+a.getDate()).slice(-2);
    return b;
  }
  s.getYear = function(){
    var a = new Date();
    var b = ('0000'+a.getFullYear()).slice(-4);
    return b;
  }
  if ($(window).width() < 768) {
      s.sizeName = 'xs';
        s.sizeInt = 0;
  }
  else if ($(window).width() >= 768 &&  $(window).width() <= 992) {
      s.sizeName = 'sm';
      s.sizeInt = 1;
  }
  else if ($(window).width() > 992 &&  $(window).width() <= 1200) {
      s.sizeName = 'md';
      s.sizeInt = 2;
  }
  else  {
      s.sizeName = 'lg';
      s.sizeInt = 3;
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
  s.showModal = function(data){
    data = data || {};
    data.body = data.body || 'Modal Body';
    data.text = data.text || 'Modal Text';
    $('#sdfwaModal').hide();
    $('.modal-backdrop').hide();
    $('#sdfwaModal').remove();
    $('#sdfwaModalBtn').remove();
    var modal_html = '\
      <a id="sdfwaModalBtn" href="#sdfwaModal" role="button" class="btn hidden" data-toggle="modal">Show Modal</a>\
      <div id="sdfwaModal" class="modal'+(s.detectIE()===false ? ' hide fade"':'"')+' tabindex="-1" role="dialog" aria-labelledby="sdfwaModalLabel" aria-hidden="true" style="">\
      <div class="modal-header">\
        <button type="button" class="close sdfwaModalClose" data-dismiss="modal" aria-hidden="true">×</button>\
        <h3 id="sdfwaModalLabel">{{modal_title}}</h3>\
      </div>\
      <div class="modal-body">\
        {{modal_body}}\
      </div>\
      <div class="modal-footer">\
      </div>\
      </div>\
    ';
    modal_html = modal_html.replace('{{modal_title}}', data.title);
    modal_html = modal_html.replace('{{modal_body}}', data.body);
    $('.container').append($(modal_html));
    $('#sdfwaModalBtn').click();
    if(s.sizeInt > 1){
      $('#sdfwaModal').css({
        "width":"100%", 
        "left":"0%",
        "margin-left":"auto",
        "margin-right":"auto",
      }); 
    }
    $('.modal-body').css('height', Math.round(window.innerHeight * .65)+'px').css('min-height', Math.round(window.innerHeight * .65)+'px');
    $('.modal-body').css('border', '1px solid #ccc');
    $('.sdfwaModalClose').click(function(){
      $('#sdfwaModal').hide();
      $('.modal-backdrop').hide();
      $('#sdfwaModal').remove();
      $('#sdfwaModalBtn').remove();
    });                      
  }
  s.showVideo = function (s){
    s.showModal({type:"text",title:"How to use the Member Shop App",body:'<p><video controls="controls" width="80%"><source src="https://s3-us-west-2.amazonaws.com/briankranson/video/how_to_use_member_shop_app.mp4" type="video/mp4"> Your browser does not support the video tag.</video></p>'});
  }

  /* end helper functions */
  if(s.inIframe()){
    setTimeout(function(){
      parent.postMessage(window.innerHeight,"https://shop.sdfwa.org");
    }, 100);
  }
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
    s.delay_remove_elements = [];
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
        s.delay_remove_elements.push('.bottom-gap');
        break;
      case /\/calendar/.test(s.url):
        s.remove_elements.push('a.btn-public.bump:contains("Create Account")');
        s.remove_elements.push('a.btn-public.bump:contains("Purchase A Pass Online")');
        s.delay_remove_elements.push('.bottom-gap');
        break;
      case /\/2729\/member/.test(s.url):
        s.delay_remove_elements.push('.gap-bottomtop');
        s.remove_elements.push('.gap:contains("Delete My Account")');
        $('div[id*=flash]:contains("igned in")').siblings('a.close').click();
        break;
      default:
        s.tmp.match_hide_elements = false;
    }
    for(var i=0; i<s.remove_elements.length; i++){
      $(s.remove_elements[i]).addClass('hidden');
    }
    setTimeout(function(){
      for(var i=0; i<sdfwa.delay_remove_elements.length; i++){
        $(sdfwa.delay_remove_elements[i]).addClass('hidden');
      }
    }, 500);
    /* end hide elements */
    /* start modify elements */
    s.tmp.match_modify_elements = true;
    switch(true) {
      case /\/sign_in/.test(s.url):
        $('<a id="howto" class="btn btn-small btn-public bump" style="cursor:pointer; margin-left:3px">How To Video</a>').insertAfter('a.btn-public.bump:contains("Calendar")');
		$('#howto').click(function(){
			s.showVideo(s);
		});
		$('#member_remember_me').prop('checked', true);
		if(s.readCookie('watched_video') === null){
		  s.showVideo(s);
		  s.createCookie('watched_video', 'true', 365);
		}
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
    
    /* start hide purchase buttons */
    s.hidePurchaseButtons = function(){
      if(/\/purchase\/?$/.test(s.url)){
          $('a[href*="21781"]').parent().addClass('hidden'); // Gold + Init + SDFWA
          $('a[href*="21782"]').parent().addClass('hidden'); // Silver + Init + SDFWA
          $('a[href*="21783"]').parent().addClass('hidden'); // Gold + Init
          $('a[href*="21784"]').parent().addClass('hidden'); // Silver + Init
          $('a[href*="21042"]').parent().addClass('hidden'); // Gold
          $('a[href*="21043"]').parent().addClass('hidden'); // Silver
          $('a[href*="21785"]').parent().addClass('hidden'); // Gold + SDFWA
          $('a[href*="21786"]').parent().addClass('hidden'); // Silver + SDFWA
          $('a[href*="21787"]').parent().addClass('hidden'); // Extra 10 Exp 12 Months
          $('a[href*="21788"]').parent().addClass('hidden'); // Extra 10 Exp 11 Months
          $('a[href*="21789"]').parent().addClass('hidden'); // Extra 10 Exp 10 Months
          $('a[href*="21790"]').parent().addClass('hidden'); // Extra 10 Exp 9 Months
          $('a[href*="21791"]').parent().addClass('hidden'); // Extra 10 Exp 8 Months
          $('a[href*="21792"]').parent().addClass('hidden'); // Extra 10 Exp 7 Months
          $('a[href*="21793"]').parent().addClass('hidden'); // Extra 10 Exp 6 Months
          $('a[href*="21794"]').parent().addClass('hidden'); // Extra 10 Exp 5 Months
          $('a[href*="21795"]').parent().addClass('hidden'); // Extra 10 Exp 4 Months
          $('a[href*="21796"]').parent().addClass('hidden'); // Extra 10 Exp 3 Months
          $('a[href*="21797"]').parent().addClass('hidden'); // Extra 10 Exp 2 Months
          $('a[href*="21798"]').parent().addClass('hidden'); // Extra 10 Exp 1 Months
        if(s.local.isShopCurrent){
          switch(s.local.months_remaining) {
              case 1:
                  $('a[href*="21798"]').parent().removeClass('hidden');
                  $('a[href*="21042"]').parent().removeClass('hidden'); // Gold
                  $('a[href*="21043"]').parent().removeClass('hidden'); // Silver
                  break;
              case 2:
                  $('a[href*="21797"]').parent().removeClass('hidden');
                  $('a[href*="21042"]').parent().removeClass('hidden'); // Gold
                  $('a[href*="21043"]').parent().removeClass('hidden'); // Silver
                  break;
              case 3:
                  $('a[href*="21796"]').parent().removeClass('hidden');
                  break;
              case 4:
                  $('a[href*="21795"]').parent().removeClass('hidden');
                  break;
              case 5:
                  $('a[href*="21794"]').parent().removeClass('hidden');
                  break;
              case 6:
                  $('a[href*="21793"]').parent().removeClass('hidden');
                  break;
              case 7:
                  $('a[href*="21792"]').parent().removeClass('hidden');
                  break;
              case 8:
                  $('a[href*="21791"]').parent().removeClass('hidden');
                  break;
              case 9:
                  $('a[href*="21790"]').parent().removeClass('hidden');
                  break;
              case 10:
                  $('a[href*="21789"]').parent().removeClass('hidden');
                  break;
              case 11:
                  $('a[href*="21788"]').parent().removeClass('hidden');
                  break;
              case 12:
                  $('a[href*="21787"]').parent().removeClass('hidden');
                  break;
              default:
                  console.log('no match');
          } 
        }else if(s.local.isInitCurrent === false && s.local.isSDFWACurrent === false){
          $('a[href*="21781"]').parent().removeClass('hidden'); // Gold + Init + SDFWA
          $('a[href*="21782"]').parent().removeClass('hidden'); // Silver + Init + SDFWA 
        }else if(s.local.isInitCurrent === false){
          $('a[href*="21783"]').parent().removeClass('hidden'); // Gold + Init
          $('a[href*="21784"]').parent().removeClass('hidden'); // Silver + Init
        }else if(s.local.isSDFWACurrent === false){
          $('a[href*="21785"]').parent().removeClass('hidden'); // Gold + SDFWA
          $('a[href*="21786"]').parent().removeClass('hidden'); // Silver + SDFWA
        }else if(s.local.isInitCurrent === true && s.local.isSDFWACurrent === true){
          $('a[href*="21042"]').parent().removeClass('hidden'); // Gold
          $('a[href*="21043"]').parent().removeClass('hidden'); // Silver
        }
        
      }
    }
    s.hidePurchaseButtons();
    /* end hide purchase buttons */
    /* start modal code */
      if(/\/member\/?$/.test(s.url) || /\/purchase\/?$/.test(s.url)){
        $.getJSON('https://shop.sdfwa.org/api/get_member_id.php?email='+(s.local.email || '')).done(function(data){
        if(typeof data.email !== 'undefined'){
            s.local.shop_expire = (data.shop_expire || '1970-01-01');
            s.local.member_id = data.member_id;
            s.local.success = data.success;
            s.local.message = data.message;
            s.local.referer = data.referer;
            s.local.year = data.year;
            // s.local.shop_type = data.shop_type;
            s.local.military_rank = data.military_rank;
            s.local.isSDFWACurrent = data.isSDFWACurrent;
            s.local.isShopCurrent = data.isShopCurrent;
            s.local.isGoldMember = data.isGoldMember;
            s.local.isSilverMember = data.isSilverMember;
            s.local.isShopFounder = data.isShopFounder;
            s.local.isMilitaryDiscount = data.isMilitaryDiscount;
            s.local.isInitCurrent = data.isInitCurrent;
            s.local.months_remaining = data.months_remaining;
            s.update_shop_expire = false;
            try{
              s.tmp.shop_expire = null;
              $('h4:contains("Active Passes")').parent().find('.row').filter(function(){return /(gold|silver)/i.test($(this).text());}).each(function(){
                var html = $(this).html();
                var date = new Date(html.split('Expiration Date: ')[1].split('<br>')[0].trim());
                var date_str = date.getFullYear();
                date_str += '-' + ('00'+(date.getMonth()+1)).slice(-2);
                date_str += '-' + ('00'+(date.getDate())).slice(-2);
                if(date_str.replace(/-/g, '') > s.tmp.shop_expire){
                  s.tmp.shop_expire = date_str;
                }
              });
			  if(s.tmp.shop_expire.replace(/-/g, '') > s.local.shop_expire.replace(/-/g, '')){
				s.update_shop_expire = true;
				s.local.shop_expire = s.tmp.shop_expire;  
			  }
              
              if(typeof s.local.member_id === 'undefined'){
                if(/\(/.test(s.local.full_name) === false){
                  s.local.first_name = s.local.full_name.split(' ')[0];
                  s.local.last_name = s.local.full_name.split(' ')[1];  
                }
                if(s.local.shop_expire !== null){
                  s.tmp.comment = 'added by member shop';
                  $.getJSON('https://shop.sdfwa.org/api/add_sdfwa_member.php?email='+(s.local.email || '')+'&first_name='+s.local.first_name+'&last_name='+s.local.last_name+'&year='+s.getYear()+'&comment='+s.tmp.comment).done(function(){
                    $.getJSON('https://shop.sdfwa.org/api/update_shop_expire.php?email='+(s.local.email || '')+'&shop_expire='+s.local.shop_expire)
                  });
                }
              }else{
                if(typeof s.local.email !== 'undefined' && s.local.email !== '' && s.local.shop_expire !== null && s.update_shop_expire === true){
                  $.getJSON('https://shop.sdfwa.org/api/update_shop_expire.php?email='+(s.local.email || '')+'&shop_expire='+s.local.shop_expire);
                }
              }
            }catch(e){}
            
            localStorage.setItem('sdfwa', JSON.stringify(s.local));
            if(/\/member\/?$/.test(s.url)){
              s.checklist_body = '\
                <h5>\
                  A good place to start is to make sure you understand that this is your Shop!  It is "of, by and for" our Members.  We want you to not only use the Shop but help us make it better.<br><br>\
                  This checklist will help get you in the shop as soon as possible.  And once you complete the list, we will update our records so you don\'t have to see this popup again.  Please be patient with us while we get our records in order.<br><br>\
                  All of us will need to go through a basic Shop Safety Training program.  This training is essential to ensure that we offer everyone a safe environment, that everyone knows how to operate each piece of equipment safely and to satisfy our insurance provider.\
              ';
              s.checklist_body += '\
                <h4>\
                  1) To join the Member Shop, you must be a member of the San Diego Fine Woodworkers Association.\
                </h4>\
              ';
              s.checklist_body += '\
                <h4>\
                  2) Pick either a Silver or Gold Membershop from the Purchase A Pass Section.</a>\
                </h4>\
              ';
              s.checklist_body += '\
                <h4>\
                  3) Download and read our Member Shop Safety Manual {link coming soon}\
                </h4>\
              ';
              s.checklist_body += '\
                <h4>\
                  4) Register for a Shop Safety Training via the calendar.\
                </h4>\
              ';
              s.checklist_body += '\
                <h4>\
                  5) Pass the Shop Safety Exam taken during the Shop Safety Training.\
                </h4>\
              ';
              s.checklist_body += '\
                <h5>\
                  If you are Activie Military with a paygrade E5 or below, click <a id="sdfwa_military_rank" style="cursor: pointer;">here</a> for a discount.\
                </h5>\
              ';
              if(s.detectIE !== false){
                (function($, s){
                  setTimeout(function(){
                    if((data.shop_expire || '1970-01-01').replace(/-/, '') < s.getDate().replace(/-/, '')){
                      s.showModal({type:"text",title:"Welcome to the SDFWA Member Shop!",body:s.checklist_body});
                    }
                  }, 500);
                }($, s))
              }else{
                if((data.shop_expire || '1970-01-01').replace(/-/, '') < s.getDate().replace(/-/, '')){
                  s.showModal({type:"text",title:"Welcome to the SDFWA Member Shop!",body:s.checklist_body});
                }
              }
              // $('a:contains("Home")').text('Home - Checklist');
              $('<span><a id="checklist_link" style="cursor:pointer;">Checklist</a>  |  </span>').insertBefore('a:contains("Home")');
              $('#checklist_link').click(function(){
                s.showModal({type:"text",title:"Welcome to the SDFWA Member Shop!",body:s.checklist_body});
              });
              $(document.body).on('click', '#sdfwa_military_rank', function(){
                $('.sdfwaModalClose').click();
                s.military_body='Please select your military paygrade.\
                  <br>\
                  <select id="sdfwa_select_rank">\
                    <option value="Not Selected">None</option>\
                    <option value="E1">E1</option>\
                    <option value="E2">E2</option>\
                    <option value="E3">E3</option>\
                    <option value="E4">E4</option>\
                    <option value="E5">E5</option>\
                  </select>\
                  <br>\
                  <a id="sdfwa_update_military_rank" class="btn" style="cursor: pointer;">Submit</a>\
                  ';
                s.showModal({type:"text",title:"Military Discount",body:s.military_body});
                $('#sdfwa_update_military_rank').click(function(){
                  $.getJSON('https://shop.sdfwa.org/api/update_military_info.php?email='+(s.local.email || '')+'&military_rank='+$('#sdfwa_select_rank').val());
                  $('.sdfwaModalClose').click();
                });
              });
            }else{
              s.hidePurchaseButtons();
            }
          }
        });
      }
    /* end modal code */
  }
}(window, 'sdfwa'))