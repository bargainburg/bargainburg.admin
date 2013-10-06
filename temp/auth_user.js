var URL = 'http://api.bargainburg.co/v1';
window.onload = function () {
        $('#form').submit(function (e) {
                e.preventDefault();
		if (document.getElementById("email").value != null && document.getElementById("password").value != null) {
			var uid = document.getElementById("email").value;
			var pw = document.getElementById("password").value;
                        $.ajax({
                                url: URL + '/login',
				type: 'POST',
                                data: {email : uid, password : pw },
				contentType: 'application/x-www-form-urlencoded',
                                success: function(result) {
					//should add error checking for bad merchant id to quit out
					var mid = "";
					if (result != null) {
						mid = result.merchant_id;
					}
					window.location = 'http://admin.bargainburg.co/temp/panel.html?id='+ mid;  
					return true;
				},
				error: function(resutl) {
					alert('Error! Incorrect Email/Password!');
					return false;
				}
                        });
                }
		else {
			alert('Error! Enter Email/Password!');
		}
        });
}
