window.onload = function ()
{
        //get id of merchant, retrieved from url (html?id=xxx) using: window.location.href
        var url = window.location.href;
        var idList = url.match(/(\?|&)id=([^&]+)/);
        var id = null;
        if (idList != null) {
            id = idList.pop()
        }
        if (id != null) {
            var final_id = id;
        }
        else {
            final_id = "";
        }
        // GET COMPANY INFO
        // http request
        $(document).ready(function() {
            $.getJSON(URL+"merchants/"+final_id, function(data) {
                if (data != null) {
                        $.each(data, function(i, item) {
                                populate(i, item);
                        });
                }
    			$("#logo").append('<h1>Logged in as ' + data.name + '</h1>');
            });
        });

	//do http get for coupon list
        $(document).ready(function() {
              $.ajax({
			url: URL+'merchants/' + final_id + '/coupons',
			type: 'GET',
			xhrFields: 
				{withCredentials: true},
			contentType: 'application/x-www-form-urlencoded',
			success: function(data) {
				if (data != null) {
					if ($.isEmptyObject(data)) {
						$("#list").append('<th> No Coupons </th>');
					}
                           		$.each(data, function(i, item) {
						if(item.hidden) {
							$("#list").append('<tr><td width=100px><a href="http://admin.bargainburg.co/coupon.html?id=' + item.id + '&merchantid=' + final_id + '">' + item.name + '</a></td><td width=100px>' + parseDate(item.created_at) + '</td><td width=50px align="center"><input type="checkbox" class = "check" id = "' + item.id + '"></input></td></tr>');
						}
						else {
							$("#list").append('<tr><td width=100px><a href="http://admin.bargainburg.co/coupon.html?id=' + item.id + '&merchantid=' + final_id + '">' + item.name + '</a></td><td width=100px>' + parseDate(item.created_at) + '</td><td width=50px align="center"><input type="checkbox" class = "check" id = "' + item.id + '" checked="' + !(item.hidden) + '"></input></td></tr>');	
                            			}
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

	$(document).on('click', '.check', function() {
		//alert($(this).attr('id') + " checked?: " + !$(this).is(":checked"));
		
		var json = {};
		json["coupon[hidden]"] = !$(this).is(":checked");
		json["_method"] = 'patch';

		$.ajax({
			url: 'http://api.bargainburg.co/v1/coupons/'+$(this).attr('id'),
			type: 'POST',
			xhrFields: 
				{withCredentials: true},
			data:json,
			contentType: 'application/x-www-form-urlencoded',
			success: function(result) {
				//alert("success");
			},
			error: function(err) {
				alert(JSON.stringify(err));
				return false;
			}
		});
	});

	document.getElementById("add_coupon").action= 'http://admin.bargainburg.co/coupon.html?merchantid=' + final_id;
         
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
                var json = ConvertFormToJSON(form, true);
                if (id != null) {       //updating
                        $.ajax({
                                url: 'http://api.bargainburg.co/v1/merchants/' + final_id,
                                type: 'POST',
                                data: json,
                                dataType: 'json',
                                xhrFields:
                                        {withCredentials: true},
                                crossDomain: true,
                                success: function(result) {
                                        window.location =  'http://admin.bargainburg.co/panel.html?id=' + final_id;
                                        return true;
                                },
                                error: function (result) {
                                        alert(result);
                                        return false;
                                }
                        });
                }
                return false;
        });
}

function parseDate(longDate) {
	var year = longDate.substring(0,4);
	var month = longDate.substring(5,7);
	var day = longDate.substring(8,10);
	return month + ' / ' + day + ' / ' + year;
}

function populate (i, item){
        if (document.getElementById(i) != null) {
                if (item != null) {                    
			document.getElementById(i).value = item;
                }
                else {
                        if (i == "name" || i == "description")  //need to handle different types of fields differently
                        {
                                document.getElementById(i).value = "NULL";
                        }
                }
        }
}
function ConvertFormToJSON(form, isPatch){
        var url = window.location.href;

    var array = jQuery(form).serializeArray();
    var json = {};

    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });

    json['_method'] = 'patch';
    return json;
}
