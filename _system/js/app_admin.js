/**
 * get all coupons for the merchant from the api
 * @param callback function called on success (renderCouponList)
 */
function getCouponList(callback) {
	BB_Log("[Coupon List > GET]: STARTED");
	return $.ajax({
		url: $.cookie("api_url")+'merchants/'+$.cookie("mid")+"/coupons",
		type: 'GET',
		xhrFields: {withCredentials: true},
		contentType: 'application/x-www-form-urlencoded',
		success: callback,
		error: function(xhr, ajaxOptions, thrownError) {
			BB_Log("[Coupon List > GET]: FAILED");
			if(xhr.status == 404) {
				window.location.href = "../";
			}
		}
	});
}

/** 
 * render the list of retrieved coupons
 * @param data the api response containing the coupons
 */
function renderCouponList(data) {
	BB_Log("[Coupon List > GET]: SUCCESS");
	BB_Log("[Coupon List > Render]: STARTED");
	var table = $("#coupon-list");
	for(var i=0; i<data.length; i++) {
		var c = data[i];
		
		//////////////////////////////////////////////////////
		// SET TOGGLE SWITCH FOR VISIBILITY
		var visible = "";
		if(c.hidden == false) {
			visible = ' checked="true"';
		}

		//////////////////////////////////////////////////////
		// DATE OPERATIONS
		// GET TIMESTAMPS
		var ts_start = new Date(c.begin_date.substring(0,10));
		var ts_end = new Date(c.end_date.substring(0,10));

		// FORMAT DATE STRINGS
		var date_format_options = {
		    weekday: "long", year: "numeric", month: "short",
		    day: "numeric"
		};
		var begin_date = ts_start.toLocaleDateString("en-us", date_format_options);
		var end_date = ts_end.toLocaleDateString("en-us", date_format_options);
		
		// DETERMINE CAMPAIGN DURATION
		var day_duration = 60*60*24;
		var duration = Math.round(((ts_end - ts_start) / 1000) / (day_duration));
		var duration_warning = "";
		// SET VISUAL WARNING FOR INCORRECT DURATION
		if(duration <= 0) {
			duration_warning = '<i style="color:#990000" class="icon-warning-sign"></i> ';
		}

		// DETERMINE CAMPAIGN STATUS
		var ts_start = Math.round(ts_start / 1000);
		var ts_end = Math.round(ts_end / 1000);
		var now = Math.round(new Date().getTime() / 1000);
		var status = "expired";
		var status_message = "Expired";
		if(now < ts_start) {
			status = "unstarted";
			status_message = "Not Yet Active";
		}
		else if(now < ts_end && now > ts_start) {
			status = "running";
			status_message = "Currently Active";
		}

		var status_warning = "";
		if(status == "running" && c.hidden == true) {
			status_warning = ' <i class="icon-warning-sign" style="color:#990000" rel="tooltip" title="CAMPAIGN IS NOT VISIBLE" data-placement="right"></i>';
		}

		// GENERATE COUPON ROW HTML
		var coupon_row = "";
		coupon_row += '<tr>';
		coupon_row += '<td><i rel="tooltip" title="'+status_message+'" data-placement="right" class="icon-circle status-'+status+'"></i></td>';
		coupon_row += '<td>'+c.name+''+status_warning+'</td><td>'+begin_date+'</td><td>'+end_date+'</td><td>'+duration_warning+''+duration+' days</td>';
		coupon_row += '<td><div class="switch"><input type="checkbox" rel="coupon-toggle" type="checkbox" id="'+c.id+'"'+visible+'><label><i></i></label></div></td>';
		coupon_row += '<td><button class="btn btn-success" data-action="coupon-edit" data-coupon-id="'+c.id+'">Edit</button></td>';
		coupon_row += '</tr>';

		table.append(coupon_row);
	}
	BB_Log("[Coupon List > Render]: DONE");
	bindCouponToggles();
	bindEditButtons();
	$('[rel="tooltip"]').tooltip();
}

/** 
 * bind the toggles to change the visibility state of the coupon
 */
function bindCouponToggles() {
	BB_Log("[Coupon List > Visibile Toggles > BIND]: STARTED");
	$('[rel="coupon-toggle"]').bind("click", function() {

//		alert($(this).attr('id') + " hidden?: " + !$(this).is(":checked"));

		var json = {};
		json['coupon[hidden]'] = !$(this).is(":checked");
		//json['_method'] = 'patch';

		$.ajax({
			url: $.cookie("api_url")+'coupons/'+$(this).attr('id'),
			type: 'PUT',
			xhrFields: {withCredentials: true},
			data: json,
			dataType: 'json',
			crossDomain: true,
			//contentType: 'application/x-www-form-urlencoded',
			success: function(result) {
				console.log("COUPON STATE TOGGLED");
			},
			error: function(err) {
				alert("Something went wrong. Please try again.")
				return false;
			}
		});
	});
	BB_Log("[Coupon List > Visible Toggles > BIND]: DONE");
}
/**
 * bind the coupon edit button click event
 * has to set the cid cookie & redirect to edit page
 */
function bindEditButtons() {
	BB_Log("[Coupon List > Edit Buttons > BIND]: STARTED");
	$('[data-action="coupon-edit"]').bind("click", function() {
		var couponId = $(this).attr("data-coupon-id");
		$.cookie("cid", couponId);
		window.location.href="./coupon/";
	});
	BB_Log("[Coupon List > Edit Buttons > BIND]: DONE");
}

/** 
 * get the merchant data from api endpoint
 * @param callback the function that will render the merchant data
 */
function getMerchantData(callback) {
	BB_Log("[Merchant Data > GET]: STARTED");
	$.ajax({
		url: $.cookie("api_url")+'merchants/'+$.cookie("mid"),
		type: 'GET',
		xhrFields: {withCredentials: true},
		contentType: 'application/x-www-form-urlencoded',
		success: function(data) {
			$("#merchant_name").html(data.name);
			BB_Log("[Merchant Data > GET]: SUCCESS");
		},
		error: function(xhr, ajaxOptions, thrownError) {
			BB_Log("[Merchant Data > GET]: FAILED");
			if(xhr.status == 404) {
				window.location.href = "../";
			}
		}
	});
}

/** 
 * render the merchant data retrieved from the api
 * @param data the merchant data from the api
 */
function renderMerchantData(data) {
	BB_Log("[Merchant Data > Render]: STARTED");
	$("#merchant_name").html(data.name);
	$("#merchant_description").html(data.description);
	BB_Log("[Merchant Data > Render]: DONE");
}

/** 
 * document ready event
 * initialize the admin panel ui by triggering 
 * the loading of the coupon list and merchant data
 */
$(document).ready(function() {
	// REDIRECT UPON LOGIN FAILURE
	// if the user types in the url to this 
	// page and is not logged in, he needs to be sent to login
	if($.cookie("mid") == null) {
		BB_Log("[MERCHANT COOKIE]: FAILED");
		window.location.href = '../';
	} 
	else {
		// RESET COUPON ID COOKIE
		// so that ./coupon will kick the user back as we
		// do not know which coupon he wants to edit

//		This line was commented out so that issue #8 on admin could be resolved
//		$.cookie("cid", null);

		// PULL DATA & RENDER ADMIN PANEL
		getMerchantData(renderMerchantData);
		getCouponList(renderCouponList);
	}
});
