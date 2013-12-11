function BB_Error(container, message) {
	var error = '<div class="alert alert-danger"><strong>Sorry,</strong> '+message+'</div>';
	$(container).html(error);
}

function BB_Log(message) {
	if($.cookie("FLAG_DEBUG") == 1) {
		console.log(message);
	}
}

function BB_disableForm(form_id) {
	////////////////////////////////////////////////
	// COVER FORM WITH LOADING SCREEN
	$(form_id).toggleClass("BB_disableForm", true);
	////////////////////////////////////////////////
}

function BB_enableForm(form_id) {
	////////////////////////////////////////////////
	// COVER FORM WITH LOADING SCREEN
	$(form_id).toggleClass("BB_disableForm", false);
	////////////////////////////////////////////////
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// HACKISH STUFF: FIX!!!!
////////////////////////////////////////////////
function ConvertFormToJSON(form, isPatch){
	var url = window.location.href;

	var mid = $.cookie("mid");

    var array = jQuery(form).serializeArray();
    var json = {};
    
    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });

    if (isPatch)
    {
        json['_method'] = 'patch';
    }
    else
    {
	 json['coupon[merchant_id]'] = mid;
	 json['coupon[hidden]'] = true;
    }
    
    return json;
}


$("#logout").click(function(event) {
	event.preventDefault();
	$.ajax({
		url: $.cookie("api_url")+'logout/',
		type: 'POST',
		xhrFields: {withCredentials: true},
		crossDomain: true,
		success: function(result) {
			$.cookie("mid", null, {path: '/'});
			window.location = '../';
		},
		error: function(err) {
			alert(JSON.stringify(err));
		}
	});
});