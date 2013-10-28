
$(document).ready(function() {

	if($.cookie("mid") == null) {
		window.location.href="../../";
	}

	/**
	 * HANDLE SUBMIT BUTTON
	 * attempt to create coupon
	 */
	$("#form-coupon-add").bind("submit", function(e) {
		// STOP DEFAULT BEHAVIOR
		e.preventDefault();
		e.stopPropagation();

		// FORM LOADING SCREEN
		BB_disableForm("#form-coupon-add");

		// ATTEMPT SUMBISSION
		var form_data  = ConvertFormToJSON(this, false);
		console.log(form_data);

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
						BB_Error("#form-coupon-add-error", "The server is currently unavailable.");
					}
					else {
						BB_Error("#form-coupon-add-error", result.responseJSON);
					}
					BB_enableForm("#form-coupon-add");
				}
			});	

	});

	/**
	 * HANDLE CANCEL BUTTON
	 * ask user if they are sure
	 */
	$("#form-coupon-add").bind("reset", function(e) {
		e.preventDefault();
		e.stopPropagation();
		var sure = confirm("Are You sure You want to Cancel?");
		if(sure) {
			window.location.href = "../../";
		}
	});

});