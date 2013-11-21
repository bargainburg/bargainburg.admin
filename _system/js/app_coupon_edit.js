/**
 * pre populate edit coupon form
 * pulls data from the api & populates the form
 * while blocking ui interactions
 */
function populateEditCouponForm() {
	// NECESSARY DATA
	var mid = $.cookie("mid");
	var cid = $.cookie("cid");
	
	// DISABLE FORM UNTIL READY
	BB_disableForm("#form-coupon-edit");

	///////////////////////////////////////////////////////////////
	// GET DATA
	BB_Log("[Coupon > Form > Load Data]: STARTED");
    $.ajax({
		url: $.cookie("api_url")+'coupons/'+$.cookie("cid"),
		type: 'GET',
		xhrFields: {withCredentials: true},
		contentType: 'application/x-www-form-urlencoded',
			
			success: function(data) {
				if (data != null) {
					BB_Log("[Coupon > Form > Load Data]: SUCCESS");
					BB_Log(data);

					// PULL RELEVANT DATA
					var name = data.name;
					var category_id = data.category_id;
					var start = data.begin_date.substring(0,10);;
					var end   = data.end_date.substring(0,10);;
					var description = data.description;

					// POPULATE FORM
					BB_Log("[Coupon > Form > Populate]: STARTED");
					$('[name="coupon[name]"').val(name);
					$('[name="coupon[description]"]').html(description);
					$('option[value="'+category_id+'"]').attr('selected', "selected");
					$('[name="coupon[begin_date]"]').val(start);
					$('[name="coupon[end_date]"]').val(end);
					BB_Log("[Coupon > Form > Populate]: DONE");

					BB_enableForm('#form-coupon-edit');

				}
				return true;
			},
			error: function(err) {
				BB_Log("[Coupon > Form > Load Data]: FAILED");
				alert("Something went wrong when trying to contact the server.");
				window.location.href="../";
			}

	});
}

/** 
 * DOCUMENT READY EVENT HANDLER
 */
$(document).ready(function() {

	// NO MERCHANT CONTEXT
	// kick back to homepage
	if($.cookie("mid") == null) {
		BB_Log("[MERCHANT COOKIE]: FAILED");
		window.location.href="../../";
	}

	// DO NOT KNOW WHAT COOKIE TO EDIT
	// kick back to coupon list
	if($.cookie("cid") == null) {
		BB_Log("[COUPON COOKIE]: FAILED");
		window.location.href="../";
	}


	/**
	 * FORM: 	EDIT COUPON
	 * HANDLE	FORM SUBMISSION
	 */
//	$("#form-coupon-edit").bind("submit", function(e) {
//		BB_Log("[Coupon > Form > Submit]: STARTED");
//		// PREVENT DEFAULT
//		e.preventDefault();
//		e.stopPropagation();
//
//		// DISABLE FORM
//		BB_disableForm("#fomr-coupon-edit");
//
//		// ATTEMP TO UPDATE COUPON
//		form_data = ConvertFormToJSON(this, true);
//
//		BB_Log("[Edit Cookie > Form > Submit]: STARTED");
//		$.ajax({
//			url: $.cookie("api_url")+'coupons/'+$.cookie("cid"),
//			type: 'POST',
//			data: form_data,
//			dataType: 'json',
//			xhrFields: {withCredentials: true},
//			crossDomain: true,
// 			success: function(result) {
// 				BB_Log("[Coupon > Form > Submit]: SUCCESS");
// 				var success = '<div class="alert alert-success"><strong>Success!</strong> The coupon changes have been saved.</div><a href="../" class="btn btn-default"><i class="icon-dashboard"></i> Return to the Dashboard</a>'; 
// 				$("#form-wrapper").html(success); 		
//			},
//			error: function(result) {
//				BB_Log("[Coupon > Form > Submit]: FAILED");
//				// ERROR 
//				if(result.status == 404) {
//					BB_Error("#form-coupon-edit-error", "The server is currently unavailable.");
//				}
//				else {
//					BB_Error("#form-coupon-edit-error", result.responseJSON);
//				}
//				BB_enableForm("#form-coupon-edit");
//			}
//		});	

	});

	/**
	 * FORM: 	EDIT COUPON
	 * HANDLE	FORM RESET BUTTON
	 */
	$("#form-coupon-edit").bind("reset", function(e) {
		BB_Log("[Edit Cookie > Form > Cancel]: STARTED");
		// PREVENT DEFAULT
		e.preventDefault();
		e.stopPropagation();
		var sure = confirm("Do You really want to cancel? All changes will be lost.");
		if(sure) {
			BB_Log("[Edit Cookie > Form > Submit]: CONFIRMED BY USER");
			// KICK USER BACK TO ADMIN PANEL
			window.location.href="../";
		}
		else {
			BB_Log("[Edit Cookie > Form > Submit]: STOPPED BY USER");
		}
	});

	populateEditCouponForm();

});
