/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// GLOBALS
$.cookie("mid", null);
$.cookie("cid", null);

$(document).ready(function () {
        
    $('#form-login').submit(function (e) {
        e.preventDefault();
        e.stopPropagation();
		
        var user_email = $("#email").val();
        var user_password = $("#password").val();

		if (user_email != "" && user_password != "") {
			var uid = document.getElementById("email").value;
			var pw = document.getElementById("password").value;
            
			BB_disableForm("#form-login");

            $.ajax({
                url: 			'http://api.bargainburg.co/v1/login',
				type: 			'POST',
                data: 			{email:user_email, password:user_password},
				contentType: 	'application/x-www-form-urlencoded',
				xhrFields: 		{withCredentials: true},
                
                success: function(result) {
					if (result != null) {
						$.cookie("mid", result.merchant_id);
						window.location = './admin/';  
						return true;
					}
					else {
						// UNKNOWN SERVER ERROR (no response)
						BB_Error("#error_login", "An unexpected server error occurred.");
					}
					BB_enableForm("#form-login");
					
				},
				
				error: function(xhr, ajaxOptions, thrownError) {
					// ERROR 
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
			// FORM INCOMPLETE
			BB_Error("#error_login", "Please enter both your account email and password.");
		}
    });
});
