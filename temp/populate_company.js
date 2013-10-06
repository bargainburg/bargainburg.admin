window.onload = function ()
{
        //get id of merchant, retrieved from url (html?id=xxx) using: window.location.href

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

        //do http get for company info
        $(document).ready(function() {
                $.getJSON("http://api.bargainburg.co/v1/merchants/"+final_id, function(data) {
                        if (data != null) {
                                $.each(data, function(i, item) {
                                        populate(i, item);
                                });
                        }
                });
        });

	//do http get for coupon list
        $(document).ready(function() {
                $.getJSON("http://api.bargainburg.co/v1/merchants/"+final_id+"/coupons", function(data) {
                        if (data != null) {
							//This is the coupon list in json form, you can view at the above url with id of 1
							/*
                                $.each(data, function(i, item) {
                                        populate(i, item);
                            	});
                            */
				if ($.isEmptyObject(data)) {
					$("#list").append('<th> No Coupons </th>');
				}
                            $.each(data, function(i, item) {
				$("#list").append('<tr><td width=100px><a href="http://admin.bargainburg.co/temp/coupon.html?id=' + item.id + '">' + item.name + '</a></td><td width=100px>' + parseDate(item.created_at) + '</td><td width=50px align="center"><input type="checkbox" checked="' + !item.hidden + '"></input></td></tr>');	
                            });
			}		
                });
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
