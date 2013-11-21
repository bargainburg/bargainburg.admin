
/** 
 * DOCUMENT READY EVENT HANDLER
 */
$(document).ready(function () {

	if($.cookie("mid") != 'null') {
		window.location.href = './admin';
	} 
        
    /** 
     * HANDLE FORM: Login
     */
    $('#form-login').submit(function (e) {
    	BB_Log("[Login > Form > Submit]: STARTED");

        e.preventDefault();
        e.stopPropagation();
		
        var user_email = $("#email").val();
        var user_password = $("#password").val();

		if (user_email != "" && user_password != "") {
			var uid = document.getElementById("email").value;
			var pw = document.getElementById("password").value;
            
			BB_disableForm("#form-login");

			BB_Log("[Login > Form > Submit > Authorize]: STARTED");
            $.ajax({
                url: 			$.cookie("api_url")+'login',
				type: 			'POST',
                data: 			{email:user_email, password:user_password},
				contentType: 	'application/x-www-form-urlencoded',
				xhrFields: 		{withCredentials: true},
                
                success: function(result) {
					if (result != null) {
						BB_Log("[Login > Form > Submit > Authorize]: SUCCESS");
						$.cookie("mid", result.merchant_id);
						window.location = './admin/';  
						return true;
					}
					else {
						BB_Log("[Login > Form > Submit > Authorize]: FAILED (Unexpected API Response)");
						// UNKNOWN SERVER ERROR (no response)
						BB_Error("#error_login", "An unexpected server error occurred.");
					}
					BB_enableForm("#form-login");
					
				},
				
				error: function(xhr, ajaxOptions, thrownError) {
					// ERROR 
					BB_Log("[Login > Form > Submit > Authorize]: FAILED (API Login Error)");
					if(xhr.status == 404) {
						BB_Error("#error_login", "The server is currently unavailable.");
					}
					else {
						BB_Error("#error_login", "Please check your email and password.");
					}
					BB_enableForm("#form-login");
				}
            });
        }
		else {
			BB_Log("[Login > Form > Submit]: FAILED (Incomplete Form)");
			// FORM INCOMPLETE
			BB_Error("#error_login", "Please enter both your account email and password.");
		}
    });
});
