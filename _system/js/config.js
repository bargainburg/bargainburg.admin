	
	/****************************************************************\
	 ****************************************************************
	 * 	CONFIG JS 													*
	 * 	/home/ sub-system											*
	 ****************************************************************
	 ****************************************************************
	 * 	This script sets global variables by setting cookies using	*
	 *  the $.cookie() function (jquery plugin).					*
	 *																*
	 *																*
	 *	NOTE: 	this file should be included in the header of all	*
	 * 			pages in the /home/ sub-system						*
	 *																*
	 *																*
	 * 	@author 		Jonas Weigert								*
	 * 	@version 		1.0				Monday, October 28th 2012	*
	\****************************************************************/

	//////////////////////////////////////////////////////////////////
	// API BASE URL 												//
	// the url where all api calls are executed						//
	//////////////////////////////////////////////////////////////////
	
	// DEVELOPMENT VALUE
	$.cookie("api_url", "http://api.dev.bargainburg.co/v1/");
	$.cookie("url", "http://dev.bargainburg.co/");

	// PRODUCTION VALUE
	$.cookie("api_url", "http://api.bargainburg.co/v1/");
	$.cookie("url", "http://bargainburg.co/");

	//////////////////////////////////////////////////////////////////
	// FLAG_DEBUG													//
	// enabeling this flag will console log diagnostic data			//
	//////////////////////////////////////////////////////////////////

	// DEVELOPMENT VALUE (enabled):
	$.cookie("FLAG_DEBUG", 1);
	
	// PRODUCTION VALUE (disabled):
	//$.cookie("FLAG_DEBUG", 0);

	//////////////////////////////////////////////////////////////////
	// LOGIN / LOGOUT HANDLER										//
	// ensure system vars are set correctly							//
	//////////////////////////////////////////////////////////////////
	var url = window.location.href;
	if(url.substring(url.length-5, url.length-1) == "home") {
		$.cookie("mid", null);
		$.cookie("cid", null);
	}

	//////////////////////////////////////////////////////////////////
	// CONFIG COMLETION MESSAGE										//
	// ensure config.js ran	(only show when FLAG_DEBUG is enabled)	//
	//////////////////////////////////////////////////////////////////
	if($.cookie("FLAG_DEBUG") == 1) {
		console.log("-----------------------------------------------------------------------------------");
		console.log("-----------------------------------------------------------------------------------");
		console.log("PAGE: "+url);
		console.log("-----------------------------------------------------------------------------------");
		console.log("SYSTEM VARS:");
		console.log("      Merchant Cookie: "+$.cookie("mid"));
		console.log("      Coupon   Cookie: "+$.cookie("cid"));
		console.log("-----------------------------------------------------------------------------------");
		console.log("[BB > CONFIG]: DONE");
	}
