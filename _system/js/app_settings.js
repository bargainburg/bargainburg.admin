BB_disableForm("#form-settings");

function populateSettingForm(data) {
	// LOG FUNCTION ENTRY & DATA
	BB_Log("[Settings > Form > Populate]: STARTED");

	if(data.name) {
		$("#merchant_name").html(data.name);
	}

	// POPULATE FORM LOOP
	for (var field in data){
		// GET CORRESPONDING FORM ELEMENT
		var e = $("#"+field);
		// IF ELEMENT EXISTS
		if(e) {
			if(e.prop("tagName") == "INPUT") {
				// SET VALUE FOR INPUT FIELD
				e.val(data[field]);
			}
			else if(e.prop("tagName") == "SELECT") {
				// SELECT CORRECT OPTION IN SELECT
				// based on the value of the option element
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// UNRELIABLE IF OPTIONS EVER CHANGE
				$('#'+field+' option[value="'+data[field]+'"]').attr("selected", "selected");
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			} 
			else if(e.prop("tagName") == "TEXTAREA") {
				// SET VALUE FOR TEXTAREA
				e.html(data[field]);
			}
		}
	}

	BB_Log("[Settings > Form > Populate]: DONE");
	BB_enableForm("#form-settings");

}

function loadSettings() {

	//////////////////////////////////////////////
	// CHECK IF MERCHANT ID COOKIE IS SET
	if($.cookie("mid") == null) {
		// SEND USER TO HOMEPAGE
		window.location.href='../../';
	}

	//////////////////////////////////////////////
	// PULL MERCHANT DATA
	$.getJSON($.cookie("api_url")+"merchants/"+$.cookie("mid"), function(data) {
        // PROCESS RETRIEVED DATA
        if (data != null) {
        	BB_Log("[Settings > Form > Load Data]: SUCCESS");
        	BB_Log(data);
        	populateSettingForm(data);
        }
        else {
        	// PULLING MERCHANT DATA FAILED
        	BB_Log("[Settings > Form > Load Data]: FAILED");
        	alert("Something unexpected happened. Please try again.");
        	window.location.href="../";
        }
    });

}
loadSettings();


function bindSettingsForm() {

	BB_Log("[Settings > Event Binding]: STARTED");

	$("#form-settings").bind("submit", function(e) {
		// PREVENT DEFAULT FORM ACTIONS
		e.preventDefault();
		e.stopPropagation();

		BB_disableForm("#form-settings");

		form_data = ConvertFormToJSON(this, true);

		// PROCESS FROM DATA
		BB_Log("[Settings > Form > Submit]: STARTED");
		$.ajax({
            url: $.cookie("api_url")+'merchants/' + $.cookie("mid"),
            type: 'POST',
            data: form_data,
            dataType: 'json',
            xhrFields:
                    {withCredentials: true},
            crossDomain: true,
            success: function(result) {
                    BB_Log("[Settings > Form > Submit]: SUCCESS");

                    var success = '<div class="alert alert-success"><strong>Success!</strong> The settings have been saved.</div><a href="../" class="btn btn-default"><i class="icon-dashboard"></i> Return to the Dashboard</a>'; 
                    $("#form-wrapper").html(success);

                    return true;
            },
            error: function (result) {
        		BB_Log("[Settings > Form > Submit]: FAILED");
                BB_Error("#form-settings-error", result);
                BB_enableForm("#form-settings");
            }
    	});

	});

	$("#form-settings").bind("reset", function(e) {
		// PREVENT DEFAULT FORM ACTIONS
		e.preventDefault();
		e.stopPropagation();
		////////////////////////////////////////////
		var check = confirm("Are you sure you want to cancel? All changes will be lost.");
		if(check) {
			window.location.href='../';
		}
	})

	BB_Log("[Settings > Event Binding]: DONE");


}
bindSettingsForm();