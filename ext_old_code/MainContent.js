// ========================================================================
//                            CHROME LISTENERS
// ========================================================================

// "clicked_browser_action" is our point for kicking things off
chrome.runtime.onMessage.addListener( function(request, MessageSender, sendResponse) {
	// Kick things off in content.js!
	if( request.message === "clicked_browser_action" ) {
		// console.log(request.value, request.on);
		switch (request.value) {
			// case "validate_unhcr":
			// 	setValidateUNHCR(request.on);
			// 	break;
			default:
				console.log('unhandled browser action click!');
		}
	} else {
		console.log('listened to message, but not handled -> ',
			request,
			request.message
		);
	}
});

$(document).ready(function(){
	let pageURL = $(location).attr('href');

	console.log('inside main page load function!');

	// TODO: move to options page?
	// handleUserLogin();
});

// ========================================================================
//                             AUTH FUNCTIONS
// ========================================================================

/**
 * Function triggers background.js to handle user login data storage / tracking
 * 
 * @param {string} pageURL - url of current page
 */
function handleUserLogin(pageURL) {
	
}

// ========================================================================
//                             OTHER FUNCTIONS
// ========================================================================

// function to localize where messages are sent
// Options:
// 		1 = console.log (default)
//  	2 = alert()
// 		3 = both (console.log then alert)
function message(text, option) {
	if (!text) return;
	else {
		if (option === 1) {
			console.log(text);
		} else if (option === 2) {
			alert(text);
		} else if (option === 3) {
			console.log(text);
			alert(text);
		} else {
			// default message method - no valid 'option' specified
			console.log(text);
		}
	}
}
