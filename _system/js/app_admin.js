

function getAllCoupons(callback) {
	return $.ajax({
		url: 'http://api.bargainburg.co/v1/merchants/'+$.cookie("mid")+"/coupons",
		type: 'GET',
		xhrFields: {withCredentials: true},
		contentType: 'application/x-www-form-urlencoded',
		success: callback,
		error: function(xhr, ajaxOptions, thrownError) {
			if(xhr.status == 404) {
				window.location.href = "../";
			}
		}
	});
}

function renderCoupons(data) {
	console.log(data);
	var table = $("#coupon-list");
	for(var i=0; i<data.length; i++) {
		var c = data[i];
		var visible = "";
		if(c.hidden == false) {
			visible=' checked="true"';
		}

		// DATE CHECK
		var begin_date = "None";
		if(c.begin_date) {
			begin_date = c.begin_date.substring(0,10)
		}
		var end_date = "None";
		if(c.end_date) {
			end_date = c.end_date.substring(0,10)
		}

		var coupon_row = '<tr><td>'+c.name+'</td><td>'+begin_date+'</td><td>'+end_date+'</td><td><input type="checkbox" id="'+c.id+'"'+visible+' /></td><td><button class="btn btn-success" data-coupon-id="'+c.id+'">Edit</button></td></tr>';
		table.append(coupon_row);
	}
}

function getMerchantData(callback) {
	return $.ajax({
		url: 'http://api.bargainburg.co/v1/merchants/'+$.cookie("mid"),
		type: 'GET',
		xhrFields: {withCredentials: true},
		contentType: 'application/x-www-form-urlencoded',
		success: callback,
		error: function(xhr, ajaxOptions, thrownError) {
			if(xhr.status == 404) {
				window.location.href = "../";
			}
		}
	});
}

function renderMerchantData(data) {
	$("#merchant_name").html(data.name);
	$("#merchant_description").html(data.description);
}

$(document).ready(function() {

	// REDIRECT UPON LOGIN FAILURE
	if($.cookie("mid") == null) {
		window.location.href = '../';
	}

	getMerchantData(renderMerchantData);
	getAllCoupons(renderCoupons);

});
    /*
	$('#form').submit(function (e) { 
		e.preventDefault(); 
		
		var url = window.location.href;
		var idList = url.match(/(\?|&)id=([^&]+)/);
		var id = null;
		if (idList != null)
		{
			id = idList.pop();
		}

		var form = this;

		if (id != null) {	//updating
     			var json = ConvertFormToJSON(form, true);
			$.ajax({
    				url: 'http://api.bargainburg.co/v1/coupons/' + id,
	    			type: 'POST',
				data: json,
				dataType: 'json',
				xhrFields: 
					{withCredentials: true},
				crossDomain: true,
	 			success: function(result) {
					window.location =  'http://admin.bargainburg.co/panel.html?id=' + mid;
					return true;	    		
				},
				error: function (result) {
					alert(result.responseText);
					return false;
				}
			});
		}
		else			//new coupon
		{
	     		var json = ConvertFormToJSON(form, false);
			$.ajax({
    				url: 'http://api.bargainburg.co/v1/coupons/',
				type: 'POST',
				data: json,
				dataType: 'json',
				xhrFields: 
					{withCredentials: true},
				crossDomain: true,
	 			success: function(result) {
					window.location =  'http://admin.bargainburg.co/panel.html?id=' + mid;
	        			return true;	    		
				},
				error: function (result) {
					alert(result.responseText);
					return false;
				}
			});		
		}

		return false; 
	});
}

function ConvertFormToJSON(form, isPatch){
	var url = window.location.href;

	var midList = url.match(/(\?|&)merchantid=([^&]+)/);
	var mid = null;
	if (midList != null)
	{
		mid = midList.pop();
	}

	if (mid == null)
	{
		mid = "";
	}

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

function populate (i, item){
	if (document.getElementById(i) != null) {
		if (item != null) {
			if (i == "begin_date" || i == "end_date")
			{	
				document.getElementById(i).value = item.substring(0,10);
			}
			else if (i == "category_id")
			{
				document.getElementById(i).selectedIndex = item;
			}
                     else
			{
				document.getElementById(i).value = item;
			}
		}
		else {
			if (i == "name" || i == "description")	//need to handle different types of fields differently
			{
				document.getElementById(i).value = "NULL";
			}
		}
	}
}*/
