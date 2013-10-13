window.onload = function ()
{
	//get id of coupon, retrieved from url (coupon.html?id=xxx) using: window.location.href

	var url = window.location.href;
		var idList = url.match(/(\?|&)id=([^&]+)/);
	var id = null;
	if (idList != null)
	{
		id = idList.pop();
	}

	if (id != null) {
		var final_id = id;
	}
	else {
		final_id = "";
	}

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



	//do http get
        $(document).ready(function() {
              $.ajax({
			url: 'http://api.bargainburg.co/v1/coupons/'+final_id,
			type: 'GET',
			xhrFields: 
				{withCredentials: true},
			contentType: 'application/x-www-form-urlencoded',
			success: function(data) {
				if (data != null) {
					$.each(data, function(i, item) {
						populate(i, item);
					});
				}
				return true;
			},
			error: function(err) {
				alert(JSON.stringify(err));
				return false;
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
}
