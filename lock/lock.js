function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
waiting = "To Access Member Shop<br><br>Enter Member ID";
error = "Please try your Member ID again or ask the shift supervisor for assistance."
open = "Door is unlocked, pull to open."
$( "#PINcode" ).html(
	"<div id='helpText' class='waiting'>"+waiting+"</div><div id='pin'><form action='' method='' name='PINform' id='PINform' autocomplete='off' >" +
		"<input id='PINbox' type='password' value='' name='PINbox' autofocus/>" +
		"<br/>" +
		"<input type='button' class='PINbutton' name='1' value='1' id='1' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton' name='2' value='2' id='2' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton' name='3' value='3' id='3' onClick=addNumber(this); />" +
		"<br>" +
		"<input type='button' class='PINbutton' name='4' value='4' id='4' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton' name='5' value='5' id='5' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton' name='6' value='6' id='6' onClick=addNumber(this); />" +
		"<br>" +
		"<input type='button' class='PINbutton' name='7' value='7' id='7' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton' name='8' value='8' id='8' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton' name='9' value='9' id='9' onClick=addNumber(this); />" +
		"<br>" +
		"<input type='button' class='PINbutton clear' name='clear' value='clear' id='clear' onClick=clearForm(this); />" +
		"<input type='button' class='PINbutton' name='0' value='0' id='0' onClick=addNumber(this); />" +
		"<input type='button' class='PINbutton enter' name='enter' value='enter' id='enter' onClick=submitForm(PINbox); />" +
	"</form></div>"
);
$('#PINbox').focus();
$('#PINcode').keypress(debounce(function (event) {
  addNumber();
}, 250));

function addNumber(e){
	if(e){
		var v = $( "#PINbox" ).val();
		$( "#PINbox" ).val( v + e.value );
	}
	if($( "#PINbox" ).val().length === 4){
		$('#enter').click();
	}
}
function clearForm(e){
	$( "#PINbox" ).val( "" );
}
function submitForm(e) {
	if (e.value == "") {
		$('#helpText').html(error).removeClass('open').removeClass('waiting').removeClass('error').addClass('error');
	} else {
		// console.log( "Your PIN has been sent! - " + e.value );
		$.get("https://shop.sdfwa.org/api/check.php?member_id="+e.value+"&_rnd="+Math.random()).done(function(d){
			if(d.success == "true"){
				$('#helpText').html(open).removeClass('open').removeClass('waiting').removeClass('error').addClass('open');
				$.get('http://127.0.0.1:8001/cgi-bin/open.py?member_id='+d.member_id);
			}else{
				$('#helpText').html(error).removeClass('open').removeClass('waiting').removeClass('error').addClass('error');
        $.get('http://127.0.0.1:8001/cgi-bin/fail.py?member_id='+d.member_id);
			}
			$("#PINbox").val("");
			$('#PINbox').focus();
			setTimeout(function(){
				$('#helpText').html(waiting).removeClass('open').removeClass('waiting').removeClass('error').addClass('waiting');
			}, 3000);
		});
	};
};
