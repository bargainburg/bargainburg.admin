function populateEditCouponForm() {
	// NECESSARY DATA
	var mid = $.cookie("mid");
	var cid = $.cookie("cid");
	
	// DISABLE FORM UNTIL READY
	BB_disableForm("#form-coupon-edit");
	console.log("FORM (Edit Coupon coupon_id="+cid+"): Getting Data");

	///////////////////////////////////////////////////////////////
	// GET DATA
	// TODO: Implement This

	console.log("FORM (Edit Coupon coupon_id="+cid+"): Filling Data");
	///////////////////////////////////////////////////////////////
	// FILL FORM WITH DATA
	// TODO: Implement This

	///////////////////////////////////////////////////////////////
	// DONE
	console.log("FORM (Edit Coupon coupon_id="+cid+"): COMPLETED");
}

$(document).ready(function() {

	// NO MERCHANT CONTEXT
	// kick back to homepage
	if($.cookie(mid) == null) {
		window.location.href="../../";
	}

	// DO NOT KNOW WHAT COOKIE TO EDIT
	// kick back to coupon list
	if($.cookie(cid) == null) {
		window.location.href="../";
	}

	populateEditCouponForm();
	/**
	 * FORM: 	EDIT COUPON
	 * HANDLE	FORM RESET BUTTON
	 */
	$("#form-coupon-edit").bind("submit", function() {
		// PREVENT DEFAULT
		e.preventDefault();
		e.stopPropagation();

		// DISABLE FORM
		BB_disableForm("#fomr-coupon-edit");

		// ATTEMP TO UPDATE COUPON
		form_data = ConvertFormToJSON(this, true);

		$.ajax({
    			url: 'http://api.bargainburg.co/v1/coupons/',
				type: 'POST',
				data: form_data,
				dataType: 'json',
				xhrFields: {withCredentials: true},
				crossDomain: true,
	 			success: function(result) {
	 				console.log(result);
	 				var success = '<div class="alert alert-success"><strong>Success!</strong> The coupon has been created.</div><a href="../../" class="btn btn-default"><i class="icon-dashboard"></i> Return to the Dashboard</a>'; 
	 				$("#form-wrapper").html(success); 		
				},
				error: function(result) {
					console.log(result);
					// ERROR 
					if(result.status == 404) {
						BB_Error("#form-coupon-edit-error", "The server is currently unavailable.");
					}
					else {
						BB_Error("#form-coupon-edit-error", result.responseJSON);
					}
					BB_enableForm("#form-coupon-edit");
				}
			});	

	});

	/**
	 * FORM: 	EDIT COUPON
	 * HANDLE	FORM RESET BUTTON
	 */
	$("#form-coupon-edit").bind("reset", function() {
		// PREVENT DEFAULT
		e.preventDefault();
		e.stopPropagation();
		var sure = confirm("Do You really want to cancel? All changes will be lost.");
		if(sure) {
			// KICK USER BACK TO ADMIN PANEL
			window.location.href="../";
		}
	});

});