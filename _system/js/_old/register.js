window.onload = function()
{
	$('#form').submit(function (e) {
		e.preventDefault();
		var form = this;

		var json = ConvertFormToJSON(form,false);
		$.ajax({
			url: 'http://api.bargainburg.co/v1/users/',
			type: 'POST',
			data: json,
			dataType: 'json',
			xhrFields:
				{withCredentials: true},
			crossDomain: true,
			success: function(result) {
				if (result != null) {
					var mid = result.merchant_id; 
				//	window.location = 'http://admin.bargainburg.co/panel.html?id=' + mid;
					alert("success");
				}
				return true;
			},
			error: function (result) {
				alert("failure");
				return false;
			}
		});
	return false;
	});
}

function ConvertFormToJSON(form, isPatch) {
	var array = jQuery(form).serializeArray();
	var json = {};

	jQuery.each(array,function() {
		json[this.name] = this.value || '';
	});
	
	console.log(json);

	return json;
}
