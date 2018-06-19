/**
 * Notes about 'background.js':
 * 1) console.log() DOES work - look at background scrip from chrome://extensions
 * --- http://stackoverflow.com/questions/3829150/google-chrome-extension-console-log-from-background-page
 * 2) This is supposed to be the "M" in "MVC" architecture
 */

// Initialize firebase:
var config = {
    apiKey: FBApiKey,
    authDomain: "rips-validation.firebaseapp.com",
    databaseURL: "https://rips-validation.firebaseio.com",
    projectId: "rips-validation"
};
firebase.initializeApp(config);

// ================================================================================================
//                                  MAIN EVENT LISTENERS
// ================================================================================================

/* mObj             object containing config and data
 *                  {
 *               		action: "get_data_...",
 *               		dataObj: {
 *                          'key1': value1,
 *                          'key2': value2
 *                      },
 *                      noCallback: false
 *               	}
 * MessageSender    chrome object that holds information about message sender (ex: tab id)
 * sendResponse     callback function for message sender
 */
chrome.runtime.onMessage.addListener(function(mObj, MessageSender, sendResponse) {
    var action = mObj.action;
    var async = false;
    var noCallback = mObj.noCallback;

    // set default key:
    if (!mObj.key) mObj.key = 'key';

    // kill callback if noCallback flag is true
    if (noCallback) sendResponse = undefined;

    switch (action) {

        // gets data from chrome's local storage and returns to caller via sendResponse
        case 'get_data_from_chrome_storage_local':
            getValuesFromChromeLocalStorage(mObj, sendResponse);
            // async because uses promises
            async = true;
            break;

        // save data to chrome's local storage
        case 'store_data_to_chrome_storage_local':
            storeToChromeLocalStorage(mObj, sendResponse);
            // async because uses promises
            async = true;
            break;

        // clear data from keys in mObj.dataObj [clear means set to '']
        case 'clear_data_from_chrome_storage_local':
            clearDataFromChromeLocalStorage(mObj, sendResponse);
            // async because uses promises
            async = true;
            break;

        // handle user login - firebase data tracking
        case 'firebase_handle_user_login':
            FB_handleUserLogin(firebase, mObj);
            // async not needed b/c no callback function
            break;

        // send message back saying no response found:
        default:
            chrome.tabs.sendMessage(MessageSender.tab.id, {
                "message": 'message_not_handled_by_background_script'
            });
    }

    // returns true if asyncronous is needed
    if (async) return true;
});

// Listener tracks any changes to local storage in background's console 
// Got code here: https://developer.chrome.com/extensions/storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		console.log('Storage key "%s" in namespace "%s" changed. ' +
			'Old value was "%s", new value is: ',
			key,
			namespace,
			storageChange.oldValue,
			storageChange.newValue
		);
	}
});

// ==============================================================
//                      main functions
// ==============================================================

/**
 * Function gets chrome local data and sends data back to caller
 * 
 * Expects mObj to look like this:
 * {
 *      action: '...',
 *      keysObj: {
 *          'key1', '',
 *          'key2', '',
 *          ...
 *      }
 * }
 * 
 * @param {object} mObj message object with key data
 * @param {function} responseCallback callback function where gathered data will be sent
 */
function getValuesFromChromeLocalStorage(mObj, responseCallback) {
    // get object of keys from message object
    var keysObj = mObj.keysObj;

    getValuesFromStorage( keysObj )

    // responses is an array of objects {key:value}
    .then( function( responses ) {
        // turn responses into a serializable object
        var obj = Serialize_ArrayToObj(responses);

        responseCallback( obj );
    });
}

/**
 * Function stores data to chrome local storage based off config object (mObj)
 * 
 * @param {any} mObj message object holding data to store
 * @param {any} responseCallback callback function where success message is sent
 */
function storeToChromeLocalStorage(mObj, responseCallback) {
    var dataObj = mObj.dataObj;
    
    var storePromises = []; // used to store all key promises below

    // loop through keys in dataObj (turns obj into array of keys)
    // if dataObj is empty, loop will get skipped
    Object.keys( dataObj ).forEach( function(key, index) {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        var dataValue = dataObj[key]; 

		/* ============== AVAILABLE KEYS =============
				VALID_UNHCR   -	holds the on/off (true / false) value for each field
				VALID_PHONE
				VALID_DATES   - N/A
				VALID_APPT    - N/A

                CACHED_DATA   - Stores saved data in case RIPS timed out
                TIMEOUT_ERROR_FLAG  - flag that indicates if RIPS timed out recently
		*/
		switch (key) {
            // Recent update: all validation keys can just automatically store data, no need
            // for special handling (maybe in the future it will be needed)
			case 'VALID_UNHCR':
				// var validateUNHCR = dataValue;
				// storePromises.push(
				// 	saveValueToStorage('VALID_UNHCR', validateUNHCR)
				// );
                storePromises.push( saveValueToStorage(key, dataValue) );
				break;
            
            // store data directly to local storage
			case 'VALID_PHONE':
				storePromises.push( saveValueToStorage(key, dataValue) );
				break;

            // store data directly to local storage
            case 'CACHED_DATA':
                storePromises.push( saveValueToStorage(key, dataValue) );
                break;
            
            // store data directly to local storage
            case 'TIMEOUT_ERROR_FLAG':
                storePromises.push( saveValueToStorage(key, dataValue) );
                break;

            default:
                // log errored key to background console:
                console.log('unable to handle key when saving: ', key);
		}
    });

	Promise.all(storePromises)
    .then( function(responseMessageArr) {
        // if responseCallback isn't real, just console log the message
        if (responseCallback)
            responseCallback( responseMessageArr );
        else
            console.log('store messages: ',responseMessageArr);
    });
}

/**
 * Function clears all store data in chrome local storage for passed-in keys
 * 
 * Keys should be pased in serialized, like this:
 * {
 *      'CACHED_DATA': '',
 *      'VALID_PHONE': '',
 *      ... etc
 * }
 * 
 * @param {any} mObj message config object holding data keys object
 * @param {any} responseCallback callback function (may be undefined)
 */
function clearDataFromChromeLocalStorage(mObj, responseCallback) {
    var dataObj = mObj.dataObj;

    storeToChromeLocalStorage({
        dataObj: dataObj
    }, responseCallback);    
}

// ==============================================================
//                     firebase functions
// ==============================================================

/**
 * Function handles user login event. Triggered any time user is on 
 * Recently Accessed Clients page. Stores new data to firebase only when
 * current date is past old stored date
 * 
 * @param {object} fb - firebase object
 * @param {object} mObj - message config object with username data
 */
function FB_handleUserLogin(fb, mObj) {
    let username = mObj.username,
        dateToday = (new Date()),
        cExtVersion = chrome.runtime.getManifest().version;

    // replace period '.' chars with dashes '-' for firebase to accept it
    cExtVersion = cExtVersion.replace(/[.]/g, '-');

    // if username is undefined [somehow], set username to 'unknown']
    if (!username.trim())
        username = 'unknown';

    // GET user holder -> user object from firebase
    var userHolderPromise = fb.database()
        .ref('/user_holder/' + cExtVersion + '/' + username)
        .once('value');
 
    userHolderPromise.then( function(snapshot) {
        let userData = snapshot.val(),
            newLoginDate,
            newLoginCount;

        // if user data doesn't exist or isn't defined well, set firebase data
        // to starting values
        if ( !userData || typeof(userData) !== 'object' || 
                Object.keys(userData).length === 0 ) {
            newLoginCount = 1;
            newLoginDate = dateToday.toDateString();
        }
        
        // else, evaluate old data to determind if data should be updated or
        // also set to startin values
        else {
            let oldLoginCount = parseInt( userData.login_count, 10),
                oldLoginDate = (new Date( userData.last_login ));

            // ==== evaluate login count ====:
            if ( !oldLoginCount ) // NaN
                newLoginCount = 0;
            else
                newLoginCount = oldLoginCount;

            // ==== evaluate last login date ====:
            if (oldLoginDate.toDateString() !== 'Invalid Date') {
                // check if old date is before current date
                if ( oldLoginDate.setHours(0,0,0,0) <
                        dateToday.setHours(0,0,0,0) ) {
                    newLoginDate = dateToday.toDateString();
                    newLoginCount++;
                }

                // check if old date is same as current date
                else if ( oldLoginDate.setHours(0,0,0,0) ===
                        dateToday.setHours(0,0,0,0) ) {
                    // nothing to update so quit.
                    return;
                }

                // else, old date is after current date
                else {
                    newLoginDate = dateToday.toDateString();
                    // no counter increment since date was messed up
                }
            } else {
                // invalid date, so set as new login date
                newLoginDate = dateToday.toDateString();
            }
        }

        // store new data in firebase
        firebase.database().ref('/user_holder/' + cExtVersion + '/' + username).set({
            last_login: newLoginDate,
            login_count : newLoginCount
        });

        // send message to background page console for tracking / fun
        console.info(
            'Data passed to Firebase for user login tracking:',
            [newLoginCount, newLoginDate]
        );
    });
    
}

// ===============================================================
//                      helper functions
// ===============================================================

/**
 * Function turns an array into a serializable object
 * Purpose = must send chrome messages as objects, not arrays
 * Note: if arr[i] is undefined, doesn't add to obj!
 * Note2: if arr[i]['key'] is undefined or null, also doesn't add to obj!
 * TODO: think if note2 is good or bad...
 * 
 * @param {array} arr array of objects to convert to single serializable object
 * @param {object} [obj={}] object to add keys to
 * @param {number} [index=0] starting index
 * @returns serializable object made from array
 */
function Serialize_ArrayToObj(arr, obj = {}, index = 0) {
    if (arr.length < 1) {
        console.error('Array not populated');
        return {};
    }

    for (let i = index; i < arr.length; i++) {
        // var nextKey = key + i;
        // // skip undefined values in arr:
        // if ( arr[i] != undefined )
        //     obj[nextKey] = arr[i];

        // get data object from array
        var dataObj = arr[i];

        // check if dataObj is an empty object. if so, skip
        if ( Object.keys( dataObj ).length < 1 )
            continue;

        else {
            Object.keys( dataObj ).forEach( function(nextKey, index) {
                // get next value to serialize from dataObj
                var nextVal = dataObj[nextKey];

                // if nextVal is legit, push into obj
                if (nextVal !== undefined && nextVal !== null)
                    obj[nextKey] = nextVal;
            });
        }
            
    }

    return obj;
}

/**
 * Gets key array from mObj - keys are derived from mObj like this:
 * 'key'0: key0val,
 * 'key'1: key1val,
 * etc...
 * 
 * key0, key1, etc are keys where data is stored
 * 
 * @param {any} mObj 
 * @returns array of keys from mObj
 */
function Serialize_ObjToArray(mObj) {
    var keyArr = [];
    var index = 0;
    var key = mObj.key;
    
    // default key to 'key'
    if (!key) key = 'key';

    var nextKey = key + index;

    while ( mObj[nextKey] !== undefined ) {
        keyArr.push( mObj[nextKey] );

        index++;
        nextKey = key + index;
    }

    return keyArr;
}

/**
 * Function stores single key of data into chrome local storage
 * 
 * @param {any} key self-explanatory
 * @param {any} value self-explanatory
 * @returns Promise that resolves with success message
 */
function saveValueToStorage(key, value) {
    return new Promise( function(resolve, reject) {
		var obj = {};
		obj[key] = value;

		chrome.storage.local.set(obj, function() {
            // if value is empty, it's a data clear (not store)
            var message = '';

            if (value === '')
                message = 'Cleared: ' + key;
            else
                message = 'Saved: ' + key + ':' + value;

            // send message back to caller
			resolve(message);
		});
	});
}

/**
 * Function gets single key of data from chrome local storage
 * 
 * @param {string} key self-explanatory
 * @returns Promise with data from 1 key
 */
function getValFromStorage(key) {
	return new Promise( function( resolve, reject ) {
		chrome.storage.local.get( key, function( dataObj ) {

			// successful -> return data from database
			resolve( dataObj );
		});
	});
}

/**
 * Function gets multiple keys of data from chrome local storage
 * 
 * @param {object} keysObj object full of keys
 * @returns Promise array with data from all keys
 */
function getValuesFromStorage( keysObj ) {
    var promises = [];

    Object.keys( keysObj ).forEach( function( key, index ) {
        promises.push( getValFromStorage( key ) );
    });

	return Promise.all(promises);
}