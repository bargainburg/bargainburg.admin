///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////////

function simulateJoinSuccess() {

	var success_html = '<div class="alert alert-success"><strong>Success!</strong><p>You have successfully signed up for BargainBurg. We will contact you shortly to verify &amp; activate your account.</p></div>';

	$("#form-container").html(success_html);

}

/**
 * HELPER: Bind Remove Contact Row
 * this binds the remove button for generated rows
 */
function BB_form_join_bind_removeContactRow() {
	// UNBIND PREVIOUS EVENT HANDLERS
	$('[rel="data-form-join-table-contact-removerow"]').unbind("click");
	// REATTACH EVENT HANDLERS FOR ALL ROWS
	$('[rel="data-form-join-table-contact-removerow"]').bind("click", function() {
		var table_row = $($($(this).parent())).parent();
		table_row.remove();
		console.log("CONTACT REMOVED");
	});
}

$(document).ready(function() {

	//////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	// RUN EVENT BINDING HELPERS
	BB_form_join_bind_removeContactRow();

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	// JOIN FORM EVENT BINDING
	////////////////////////////////////////////////////////////
	/**
	 * JOIN: FORM SUBMISSION
	 * serializes & submits the join form
	 */
	$("#form-join").bind("submit", function(e) {
		////////////////////////////////////////
		// STOP FORM SUBMISSION (page refresh)
		e.preventDefault();
		e.stopPropagation();

		////////////////////////////////////////
		// DISABLE FORM
		BB_disableForm("#form-join");

		////////////////////////////////////////
		// GET FORM DATA INTO ASSOCIATE ARRAY
		var data = {};
		var form_str = $(this).serialize();
		var list     = form_str.split("&");
		for(var i=0; i<list.length; i++) {
			var param_str = list[i];
			var field     = param_str.split("=");
			data[field[0]] = field[1];
		}

		////////////////////////////////////////
		// VALIDATE FORM DATA
		var form_valid = true;
		var invalid_fields = {};
		// USERNAME
		if(data["username"].length < 4) {
			form_valid = false;
			invalid_fields["username"] = "Please provide a longer username";
		}
		// PASSWORD
		if(data["password"].length < 6) {
			form_valid = false;
			invalid_fields["password"] = "Must contain at least 6 characters";
		}
		// COMPANY NAME
		if(data["company"].length < 4) {
			form_valid = false;
			invalid_fields["company"] = "Please provide the name of your company";
		}
		// ADDRESS_STREET
		if(data["address_street"].length < 6) {
			form_valid = false;
			invalid_fields["address_street"] = "House Number & Street Address";
		}
		// ADDRESS_CITY
		if(data["address_city"].length < 4) {
			form_valid = false;
			invalid_fields["address_city"] = "City Name";
		}
		// ADDRESS_CITY
		if(data["address_state"] == "") {
			form_valid = false;
			invalid_fields["address_state"] = "";
		}
		// ADDRESS_ZIP
		if(data["address_zip"].length != 5) {
			form_valid = false;
			invalid_fields["address_zip"] = "Provide a valid ZIP code";
		}
		// PHONE
		if(data["phone"].length != 10) {
			form_valid = false;
			invalid_fields["phone"] = "Provide a valid phone number";
		}
		// WEBSITE
		if(data["website"].length < 5) {
			form_valid = false;
			invalid_fields["website"] = "Provide a valid website url.";
		}
		// CATEGORY
		if(data["company_category"] == "") {
			form_valid = false;
			invalid_fields["company_category"] = "";
		}
		// CATEGORY
		if(data["company_hours"].length < 5) {
			form_valid = false;
			invalid_fields["company_hours"] = "Please provide your company's hours of operation.";
		}

		// CONTACT POINTS
		var contact_count = $("#form-join-table-contact").children().length;
		for(var c=0; c<contact_count; c++) {
			// CHECK NAME
			if(data["name"+c].length < 4) {
				form_valid = false;
				invalid_fields["name"+c] = "Full Name";	
			}
			if(data["phone"+c].length != 10) {
				form_valid = false;
				invalid_fields["phone"+c] = "Phone";	
			}
			if(data["email"+c].length < 5) {
				form_valid = false;
				invalid_fields["email"+c] = "Email";	
			}
		}

		if(!form_valid) {
			///////////////////////////////////////////////////////
			///////////////////////////////////////////////////////
			// FORM VALIDATION FAILED 

			// SHOW ERROR MESSAGES
			for(var field in invalid_fields) {
				var elem = $('[name="'+field+'"]');
				elem.val('');
				elem.toggleClass("form-error", true);
				elem.attr("placeholder", invalid_fields[field]);
			}
			// RE-ENABLE FORM
			BB_enableForm("#form-join");
			///////////////////////////////////////////////////////
			///////////////////////////////////////////////////////
		}
		else {
			///////////////////////////////////////////////////////
			///////////////////////////////////////////////////////
			// FORM VALDATION SUCCESSFUL
			// TODO: Implement This
			///////////////////////////////////////////////////////
			///////////////////////////////////////////////////////
			
			var form_data = {};
			var array = jQuery(this).serializeArray();
			jQuery.each(array, function() {
        		//form_data[this.name] = this.value || '';
        		if (this.name == 'username')
        			form_data['user[email]'] = this.value;
        		else if (this.name == 'password') {
        			form_data['user[password]'] = this.value;
        			form_data['user[password_confirmation]'] = this.value;
        		}
    		});
    		$.ajax({
    			url: $.cookie("api_url")+'users/',
    			type: 'POST',
    			data: form_data,
    			dataType: 'json',
    			xhrFields: {withCredentials: true},
    			crossDomain: true,
    			success: function(result) {
    				var uid = result;
    				var address = '';
    				form_data = {};
    				form_data['merchant[description]'] = '';
    				form_data['merchant[approved]'] = False;
    				form_data['merchant[price_range]'] = '';
    				form_data['merchant[created_at]'] = '';
    				form_data['merchant[updated_at]'] = '';
    				form_data['merchant[user_id]'] = uid;
    				jQuery.each(array,function() {
    					if (this.name == 'company')
    						form_data['merchant[name]'] = this.value;
    					else if (this.name == 'user[email]') 
    						form_data['merchant[email]'] = this.value;
    					else if (this.name == 'phone')
    						form_data['merchant[phone]'] = this.value;
    					else if (this.name == 'company_hours')
    						form_data['merchant[hours]'] = this.value;
    					else if (this.name == 'website')
    						form_data['merchant[link]'] = this.value;
    					else if (this.name == 'comapany_category')
    						form_data['merchant[category_id]'] = this.value;
    					else if (this.name == 'address_street')
    						address = address + this.value + ', ';
    					else if (this.name == 'address_city')
    						address = address + this.value + ', ';
    					else if (this.name == 'address_state')
    						address = address + this.value;
    				});
    				//form_data['merchant[address]'] = address;
    					
    				$.ajax({
    					url: $.cookie("api_url")+'merchants/',
    					type: 'POST',
    					data: form_data,
    					dataType: 'json',
    					xhrFields: {withCredentials: tru},
    					crossDomain: true,
    					success: function(result) {
							var success = '<div class="alert alert-success"><strong>Success!</strong> The user has been created.</div><a href="../" class="btn btn-default"><i class="icon-dashboard"></i> Return to the Homepage</a>';
   							$("#form-container").html(success);
   						},
    					error: function(result) {
    						alert("merchant error: " + result);
    					}
    				});	
    			},
    			error: function(result) {
    				//alert("user error: " + JSON.stringify(result));
    				$("#form-container").html(result);
    			}
    		});
		}

	});

	/**
	 * JOIN: ADDING AN ADDITIONAL CONTACT
	 * adds the row for an additional contact
	 */
	$("#form-join-btn-addcontact").bind("click", function() {
		///////////////////////////////////////////////////////
		// HTML CODE FOR A NEW CONTACT INPUT ROW
		var row_count = $("#form-join-table-contact").children().length;
		console.log(row_count);
		var contactRowHTML = '<tr><td><input type="text" name="name'+row_count+'" class="form-control" placeholder="Full Name" /></td><td><input type="text" name="phone'+row_count+'" class="form-control" placeholder="540 123 4567" /></td><td><input type="text" name="email'+row_count+'" class="form-control" placeholder="smith@company.com" /></td><td><button type="button" class="btn btn-danger" rel="data-form-join-table-contact-removerow"><i class="icon-remove"></i></button></td></tr>';
		// APPEND A NEW ROW
		$("#form-join-table-contact").append(contactRowHTML);
		///////////////////////////////////////////////////////
		// RE-BIND EVENTS
		BB_form_join_bind_removeContactRow();
	});

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

});