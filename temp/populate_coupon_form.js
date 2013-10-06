window.onload = function ()
{
	//get id of coupon, retrieved from url (coupon.html?id=xxx) using: window.location.href

	var url = window.location.href;
		var idList = url.match(/(\?|&)id=([^&]+)/);
	var id = null;
	if (idList != null)
	{
		id = idList.pop()
	}

	if (id != null) {
		var final_id = id;
	}
	else {
		final_id = "";
	}

	//do http get
	$(document).ready(function() {
		$.getJSON("http://api.bargainburg.co/v1/coupons/"+final_id+"?callback=?", function(data) {
			if (data != null) {
				$.each(data, function(i, item) {
					populate(i, item);
				});
			}
		});
	});

	$('#form').submit(function (e) { 
		e.preventDefault(); 
		
		var url = window.location.href;
		var idList = url.match(/(\?|&)id=([^&]+)/);
		var id = null;
		if (idList != null)
		{
			id = idList.pop();
		}

		if (id != null) {	//updating
			var form = this;
        		var json = ConvertFormToJSON(form);
			$.ajax({
    				url: 'http://api.bargainburg.co/v1/coupons/' + id,
	    			type: "PUT",
				data: json,
				contentType: 'application/x-www-form-urlencoded',
				//beforeSend: function(xhr){
				//    xhr.withCredentials = true;
				//},
				//crossDomain: true,
	 			success: function(x, status, xhr) {
					window.location =  'http://admin.bargainburg.co/temp/panel.html';
					//alert('Submitted!');
	        			return true;	    		
				},
				error: function (err) {
					alert(err.responseText);
					return false;
				}
			});
		}
		else			//new coupon
		{
			$.ajax({
    				url: 'http://api.bargainburg.co/v1/coupons/',
	    			type: "POST",			
				data: json,
				action: 'http://admin.bargainburg.co/temp/panel.html',
				contentType: 'application/x-www-form-urlencoded',
				beforeSend: function(xhr){
				    xhr.withCredentials = true;
				},
				crossDomain: true,
	 			success: function(x, status, xhr) {
					alert('Submitted!');
	        			return true;	    		
				},
				error: function (err) {
					alert(err.responseText);
					return false;
				}
			});		
		}

		return false; 
	});
}
function ConvertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};
    
    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });
    
    return json;
}

function populate (i, item){
	if (document.getElementById(i) != null) {
		if (item != null) {
			document.getElementById(i).value = item;
		}
		else {
			if (i == "name" || i == "description")	//need to handle different types of fields differently
			{
				document.getElementById(i).value = "NULL";
			}
		}
	}
}
