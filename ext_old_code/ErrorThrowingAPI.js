// Last Updated: March 21, 2017
// ==================== ERROR THROWING API =======================

/*
	Ideas for improvement:
	1) Throw swal error?
*/

/*
	@Function:
		API takes in a config object with different available properties, outlined
			in param section below. This API is made to be transferrable between
			many applications (originally created for Chrome Extensions). Written
			in pure JS, no extra libraries are required.

	@Params:
		config = configuration object with the following possible properties:

			title:			(String) - title to display on swal errors only

			message: 		(String) - message to display via errorTypes array

			errMethods: 	(Array) - List of methods for displaying error message
				mConsole: 		(String / number) - message
				mPopup: 		(String) - message (REQUIRES EXTRA JQUERY LIBRARIES)
				mAlert: 		(String) - message
				mConfirm: 		(String) - message
				mSwal: 			(String) - message (Swal error comes from RIPS codebase) 

			possible future properties that could be useful:
				fFormatFunction: (function callback)
				eValue: (Obj, String, etc) - error value (used in format function)

	@Return:
		boolean = true if error throwing is successful, false otherwise
*/
function ThrowError(config) {
	if (!config) return;

	var title = config.title;
	var message = config.message;
	var errArr = config.errMethods;

	// defaults
	if (!message) return;
	if (!title) title = "Basic Error";
	if (!errArr || errArr.length === 0) errArr = ['mConsole'];

	// internal functions:
	function ThrowSwal(title, message) {
		location.href="javascript:" +
        "swal({" +
        	"title: '" + title + "'," +
        	"text: '" + message + "'" +
        "});";
	}

	// main logic below:
	if (typeof(errArr) !== 'object') {
		throw "TypeError - prop 'errMethods' must be of type object / Array";
		return;
	}
	for (var i = 0; i < errArr.length; i++) {
		var errType = errArr[i];

		switch(errType) {
			case 'mConsole':
				console.log(message);
				break;

			case 'mAlert':
				alert(message);
				break;

			case 'mConfirm':
				confirm(message);
				break;

			case 'mSwal':
				ThrowSwal(title, message);
				break;
			// case: 'popup':
			//	break;
			default:
				console.log('not sure where to send error message: ', message);
		}
	}

	// ============================= MESSAGE TYPES =================================
	/*
	// Message: Console Log
	var mConsole = config.mConsole;
	if (mConsole) console.log( mConsole );

	// Message: Alert
	var mAlert = config.mAlert;
	if (mAlert) alert( mAlert );

	// Message: Confirm
	var mConfirm = config.mConfirm;
	if (mConfirm) {
		var confirmResponse = confirm(mConfirm);
		// TODO: do something with response
	}

	// Message: Popup
	var mPopup = config.mPopup;
	// TODO: throw popup (requires jQuery)
	*/
}