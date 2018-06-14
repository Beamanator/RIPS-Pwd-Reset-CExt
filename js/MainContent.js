$(document).ready(function(){
	let pageURL = $(location).attr('href');

	loadValidation();
	loadViewManipulator(pageURL);

	handleUserLogin(pageURL);
});

/**
 * Function triggers setting up all validation blur functions.
 * 
 * 'true' is needed for each to throw swal errors. When validation is envoked
 * from SetupSubmitListeners, validation is called with 'false' to prevent each
 * swal error from triggering
 */
function loadValidation() {
	setValidateUNHCR( true );
	setValidatePhoneNo( true );
	setValidateOtherPhoneNo( true );
	setValidateDates( true );
}

/**
 * Function is responsible for changing the view for different purposes
 * examples: hiding elements, changing html data, adding html elements
 * 
 * @param {string} pageURL - url of current page
 */
function loadViewManipulator(pageURL) {
	var username = getUsernameElem().text();

	Manipulate(pageURL, username);
}

/**
 * Function triggers background.js to handle user login data storage / tracking
 * 
 * @param {string} pageURL - url of current page
 */
function handleUserLogin(pageURL) {
	var username = getUsernameElem().text();

	// if page is 'recently accessed clients', handle login in background.js
	if ( pageURL.includes('RecentlyAccessedClients') ) {
		// set up message config object
		var mObj = {
			action: 'firebase_handle_user_login',
			username: username,

			// no callback function needed
			noCallback: true
		};

		// send message config to background.js
		chrome.runtime.sendMessage(mObj);
	}

	else {
		// do nothing since we should have already counded this user
	}
}

/**
 * Functions return HTML input element IDs 
 */
function getUnhcrElemID() { return 'UNHCRIdentifier'; }
function getPhoneElemID() { return 'CDAdrMobileLabel'; }
function getOtherPhoneElemId() { return 'CDAdrTelLabel'; }
function getDateElemIDs() { return ['LDATEOFBIRTH']; }

/**
 * Function returns jQuery html element
 */
function getUsernameElem() { return $('a.username[title="Manage"]'); }

/**
 * Functions return jQuery elements, based off above element IDs
 */
function getUnhcrElem() { return $('#'+getUnhcrElemID() ); }
function getPhoneElem() { return $('#'+getPhoneElemID() ); }
function getOtherPhoneElem() { return $('#'+getOtherPhoneElemId() ); }
function getDateElems() {
	let dateElemIDs = getDateElemIDs(),
		$dateElems = [];
	for (let i = 0; i < dateElemIDs.length; i++) {
		let $dateElem = $('#'+dateElemIDs[i]);

		// throw error if couldn't find element
		if ($dateElem.length === 0) {
			console.warn('couldnt find date element with id: <' + dateElemIDs[i]
				+ '>');
		}
		
		// else, put element in array to return
		else
			$dateElems.push( $dateElem );
	}
	return $dateElems;
}

// ========================================================================
//                       CHANGE -> VALIDATION FUNCTIONS
// ========================================================================

/**
 * Function adds / removes phone number validation to the following pages:
 * Registration
 * Client Basic Information
 * 
 * @param {boolean} on specifies if we are turning validation on or off
 */
function setValidatePhoneNo(on) {
	// Add jQuery 'blur' function to phone text box.
	// When phone number is changed and focus leaves, calls validation function
    
    if (on) {
    	getPhoneElem().blur(function (e) {
			validatePhoneNo( $(this), true );
		});
	} else {
		getPhoneElem().unbind("blur");
	}
}

/**
 * Function does the same as setValidatePhoneNo, but for the "Other Phone" field
 * on Registration & Client Basic Information pages
 * 
 * @param {any} on 
 */
function setValidateOtherPhoneNo(on) {
	if (on) {
		getOtherPhoneElem().blur(function(e) {
			validatePhoneNo( $(this), true, 'other' );
		});
	} else {
		getOtherPhoneElem().unbind("blur");
	}
}

/**
 * Function adds / removes UNHCR number validation to the following pages:
 * Registration
 * Client Basic Inforamtion
 * 
 * @param {boolean} on specifies if we are turning validation on or off
 */
function setValidateUNHCR(on) {
    // Add jQuery 'blur' function to UNHCR text box.
    // When UNHCR number is changed and focus leaves, call validation function
    
    if (on) {
		getUnhcrElem().blur(function (e) {
			validateUNHCR( $(this), true );
		});
	} else {
		getUnhcrElem().unbind("blur");
	}
}

// TODO: combine down setValidate<blah> functions
/**
 * Function adds / removes Date number validation to the following pages:
 * Registration
 * Client Basic Information
 * 
 * @param {any} on 
 */
function setValidateDates(on) {
	// Add jQuery 'blur' function to UNHCR text box.
    // When UNHCR number is changed and focus leaves, call validation function

	let dateElems = getDateElems();

	if (on) {
		// set blur function on all date elements
		for (let i = 0; i < dateElems.length; i++) {
			dateElems[i].blur(function (e) {
				// set pause so date can be stored in input element
				// by jQuery, then validated using $this.val()
				setTimeout(function($this) {
					validateDate( $this, true );
				}, 500, $(this))
		    });
		}
	} else {
		// remove blur function on all date elements
		for (let i = 0; i < dateElems.length; i++) {
			dateElems[i].unbind("blur");
		}
	}
}

function setValidateAppointmentNo(on) {
	console.log('woot! not implemented yet...');
}

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
	        // case "validate_phone":
	        // 	setValidatePhoneNo(request.on);
        	// 	break;
        	// case "validate_dates":
        	// 	changeValidateDates(request.on);
        	// 	break;
        	// case "validate_appt_no":
        	// 	changeValidateAppointmentNo(request.on);
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

// ========================================================================
//                            VALIDATION FUNCTIONS
// ========================================================================

/**
 *	Validates if a given UNHCR ID is valid in the new or old format
 *		valid 'New' format: ###-YYC#####
 *		valid 'Old' format: ####/YYYY
 *		valid 'Pre-card' format: ###-CS########
 *		valid 'Unknown' / 'None' format: 'None'
 * 
 * @param {object} $elem - jQuery element that needs validation
 * @param {boolean} throwErrorFlag if true, errors is thrown. If false, is not thrown
 * @returns boolean for valid fields (true = valid, false = invalid) 
 */
function validateUNHCR($elem, throwErrorFlag) {

    // can use '\\n' to enter text on a new line if needed
    function throwUnhcrError(message, fatal) {
    	var msg = '';

    	// if message is passed in, use that string. else use default.
    	if (message) {
    		msg = message;
    	} else {
    		msg = 'UNHCR numbers must match one of these formats:' +
    			'\\n###-YYC##### (new)' +
	        	'\\n####/YYYY (old)' +
				'\\n###-AP######## (new appointment slip)' +
				'\\n###-CS######## (old appointment slip)' +
	        	'\\nFor no UNHCR number, enter \\"None\\"';
    	}

    	// if ThrowError (from ErrorThrowingAIP.js) doesn't exist,
    	// -> log error message to console
		// also if throwErrorFlag is false, just throw console error.
    	if (!ThrowError || !throwErrorFlag) {
    		console.error(msg);
    		return;
    	}

	    // if fatal flag is set, show different title
	    if (fatal) {
	    	title = 'Invalid UNHCR #';
	    } else {
	    	title = 'Warning: UNHCR # Edited'
	    }

    	ThrowError({
    		title: title,
    		message: msg,
        	errMethods: ['mConsole', 'mSwal']
    	});
    }

    // function removes non-alphanumeric values like \, -, +, etc
    function removeNonAlphanumeric(num) {
    	return num.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/g,'');
    }

    // function checks if format is valid for the new UNHCR ID style
    function checkValidNew(num) {
        var format = "^[0-9]{3}-[0-9]{2}C[0-9]{5}$";

        // remove non-alphanumeric values from num
        num = removeNonAlphanumeric(num);

        // convert letters to uppercase and replace capital O with zeros (0)
	    num = num.replace(/O/g,"0");

        // add '-' in 3rd position!
	    num = num.substr(0, 3) + "-" + num.substr(3);

        // if entered data doesn't match format, return false.
        if (num.match(format) == null) {
        	return false;
        } else {
        	placeInputValue($elem, num);
        	return true; 
        }
    }

    // function checks if format is valid for the old UNHCR ID style
    function checkValidOld(num) {
        var format = "^[0-9]{4}/[0-9]{4}$";

        // remove non-alphanumeric values from num
        num = removeNonAlphanumeric(num);

        // convert letters to uppercase and replace capital O with zeros (0)
	    num = num.replace(/O/g,"0");

        // add '/' in 4th position!
	    num = num.substr(0, 4) + "/" + num.substr(4);

        // if entered data doesn't match format, return false.
        if (num.match(format) == null) {
            return false;
        } else {
        	placeInputValue($elem, num);
        	return true
        }
    }

	// function checks if format is valid for case number (before getting card)
	// 8 Aug 2017: new appointment slip #s have 'AP', not 'CS' in them.
    function checkValidApptSlip(num) {
		var format1 = "^[0-9]{3}-CS[0-9]{8}$";
		var format2 = "^[0-9]{3}-AP[0-9]{8}$"

    	// remove non-alphanumeric values from num
        num = removeNonAlphanumeric(num);

        // convert letters to uppercase and replace capital O with zeros (0)
	    num = num.replace(/O/g,"0");

        // add '/' in 4th position!
	    num = num.substr(0, 3) + "-" + num.substr(3);
    	
    	// if entered data doesn't match format, return false.
    	if (num.match(format1) == null && num.match(format2) == null) {
    		return false;
    	} else {
    		placeInputValue($elem, num);
    		return true;
    	}
    }

    // function checks if value is equal to "None"!!
    // @param: num = UNHCR ID in capital letters
    function checkValidNone(num) {
    	// remove non-alphanumeric values from num
        num = removeNonAlphanumeric(num);

    	// check if it is "NONE"
    	if (num === 'NONE') {
    		placeInputValue($elem, 'None');
    		return true;
    	} else {
    		return false;
    	}
    }

    // get UNHCR number from input box (in string data type)
    var UNHCRID = "" + $elem.val();

    // quit if number is empty
    if (!UNHCRID) return;

    // convert ID to uppercase:
    UNHCRID = UNHCRID.toUpperCase();

    // put upper-case value back into input box
    placeInputValue($elem, UNHCRID);

    // Logic for deciding which format to validate on
    if (
    			checkValidApptSlip(UNHCRID)  ||
    			checkValidNew(UNHCRID) ||
    			checkValidOld(UNHCRID) ||
    			checkValidNone(UNHCRID)
    		) {
    	// one format is correct, so we're happy!
    	// console.log('UNHCR ID is valid');
    	return true;
    } else {
    	// No valid formats, so pop up warning!
    	throwUnhcrError('', 1);
    	return false;
    }

    // notifications I threw out:
    // throwUnhcrError('Note: Added [-] to UNHCR Number', 0);
}

/**
 * Validates if main Phone number is valid (11 numbers):
 * If only 10, add leading 0 and warn user
 * 
 * Notes about formatting function:
 * 		Turns 'I' and 'L' into 1's
 * 		Turns 'O' into 0's
 * 		Removes all other characters that aren't numbers
 * 
 * @param {object} $elem - jQuery element that needs validation check
 * @param {boolean} throwErrorFlag - true ? error is thrown : error is not thrown
 * @param {string} [type='main'] - 'main' or 'other' phone number
 * @returns {boolean} - valid field (true = valid, false = invalid) 
 */
function validatePhoneNo($elem, throwErrorFlag, type='main') {
	function formatNum(num) {
		// use a regexp to replace 'I' or 'L' with '1'
		// num = num.replace(/[IL]/g,'1');
		
		// replace letter O's with 0's
		num = num.replace(/O/g,"0");

		// if type is 'main', remove non-digit characters in phone number:
		if (type == 'main') {
			num = num.replace(/[^0123456789]/g,'');
		}
		
		// if type is 'other', allow some delimiters and all #s
		else if (type == 'other') {
			num = num.replace(/[^0123456789,;/-]/g, '');
		}

		// somehow no 'type' was passed
		else return '';

		return num;
	}

	// can use '\\n' in swal error string to enter text on a new line if needed
    function throwPhoneNoError(message, fatal) {
    	var title;

		if (!message)
			message = 'Please fix phone number format and try again';

    	// if ThrowError (from ErrorThrowingAIP.js) doesn't exist,
		// 	or no message, or throwErrorFlag is false -> quit
    	if (!ThrowError || !throwErrorFlag) {
			console.error('Phone # Error: ', message);
			return;
		}

    	// if fatal flag is set, show different title on swal
    	if (fatal) {
    		title = 'Invalid Phone #';
    	} else {
    		title = 'Warning - Phone #';
    	}

    	ThrowError({
    		title: title,
    		message: message,
        	errMethods: ['mConsole', 'mSwal']
    	});
    }

	// get phone number from input box
	var num = $elem.val();

	// format user-entered number (after converting to upper-case)
	var num = formatNum( num.toUpperCase() );

	// replace text w/ new formatted text	
	placeInputValue($elem, num);

	// quit if num is empty
	if ( !num ) return;

	if ( num.length === 10 ) {
		// if leading number is a 0, then throw error and don't add leading 0
		// because phone #s can't be '00...'
		if ( num[0] === '0' ) {
			throwPhoneNoError(`Please fix "${type}" phone number. The entered` +
				' number is only 10 digits, beginning with 0, which is invalid.',
				true);

			return false;
		}

		// else add leading 0, then show warning
		num = '0' + num;

		// throw new number back into input box for user to see
		placeInputValue($elem, num);

		// show user warning
		throwPhoneNoError(`Added leading 0 to "${type}" phone number`, false);

		return true;
	}
	
	// if phone number is 11 characters, good. Now check more specific details
	else if ( num.length === 11 ) {
		// first character must be a '0'
		if ( num[0] !== '0' ) {
			throwPhoneNoError('The first digit of phone number in Egypt ' +
				'must be a "0". Please fix phone number.', true);

			return false;
		}

		// pass since other conditions passed
		return true;
	}
	
	// if phone number is > 11 characters, only allow in 'other phone' field
	else if (num.length > 11) {
		// default -> not allowed
		if (type == 'main') {
			throwPhoneNoError('Preferred Phone # must be 11 digits.\\n\\n' +
				'Not more! Please fix!', true);

			return false;
		}

		// 'other' phone #s are allowed to be more than 11 characters, in case
		// 	client has multiple 'other' numbers here.
		// TODO: maybe check if length is divisible by 11, or something?
		else if (type == 'other') {
			// send warning message
			throwPhoneNoError('Other Phone # is longer than 11 characters.\\n\\n' +
				'Please make sure it is accurate!', false);
			
			return true;
		}

		// shouldn't be here... only 2 types for now :)
		else {
			ThrowError({
				title: 'ERROR!',
				message: `Invalid "type" <${type}> in validatePhoneNo fn`,
				errMethods: ['mConsole']
			});
			
			return true;
		}
	}

	// phone number is < 10 characters. can't fix here. throw error.
	else {
		throwPhoneNoError(`Entered "${type}" phone number is less than\\n` +
			'10 digits - Please fix!', true);

        return false;
	}
}

/*
Validates if a given date is in correct format
	Validation format: DD/MM/YYYY
		00 <= DD <= 31
		00 <= MM <= 12
		1900 <= YYYY <= 2100
*/
function validateDate($elem, throwErrorFlag) {
	// can use '\\n' to enter text on a new line if needed
    function throwDateError(message) {
    	var title = 'Invalid Date Entered';

		if (!message)
			message = 'Please fix date format and try again. Format should be:' +
				' DD/MM/YYYY';

    	// if ThrowError (from ErrorThrowingAIP.js) doesn't exist,
		// or no message, or throwErrorFlag is false -> throw console
		// error and quit
    	if (!ThrowError || !throwErrorFlag) {
			console.error('Date Format Error: ', message);
			return;
		}

    	ThrowError({
    		title: title,
    		message: message,
        	errMethods: ['mConsole', 'mSwal']
    	});
    }

	var date = $elem.val();
	
	// date SHOULD be in format DD/MM/YYYY
	let dateArr = date.split('/');

	if (dateArr.length !== 3) {
		throwDateError('Date entered needs 3 groups of numbers (day, month, year)' +
			' - separated by "/"');
		return false;
	}

	let d = parseInt( dateArr[0] );
	let m = parseInt( dateArr[1] );
	let y = parseInt( dateArr[2] );

	// error if parsing went poorly
	if (d === NaN || m === NaN || y === NaN) {
		throwDateError('Date entered seems to include invalid characters');
		return false;
	}
	
	// error if day is out of range
	else if (d < 1 || d > 31) {
		throwDateError(`Day entered (${d}) is out of range (1 - 31)`);
		return false;
	}

	// error if months is out of range
	else if (m < 0 || m > 12) {
		throwDateError('Month entered (' + m + ') is out of range (1 - 12)');
		return false;
	}

	// error if year is out of range
	else if (y < 1900 || y > 2100) {
		throwDateError('Year entered (' + y + ') is out of range (1900 - 2100)');
		return false;
	}

	// all numbers are valid, so return true.
	return true;
}

// ========================================================================
//                             OTHER FUNCTIONS
// ========================================================================

/**
 * Places value into specified field
 * 
 * @param {object} $elem - jQuery element where 'val' param should be placed
 * @param {string} val 
 * @returns - undefined (only if $elem doesn't match an element)
 */
function placeInputValue($elem, val) {
	if (!$elem || $elem.length == 0) return;

	$elem.val(val);
}

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
