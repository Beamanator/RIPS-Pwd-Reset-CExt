/**
 * Returns a copy of the old object, with new properties from updatedProperties obj
 * @param {object} oldObject 
 * @param {object} updatedProperties 
 */
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

/**
 * Checks validity of input value based on rules
 * @param {number || string} value 
 * @param {object} rules - array of rules 
 */
export const checkValidity = ( value, rules ) => {
    let isValid = true;

    if ( !rules ) {
        return true;
    }

    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9]+(\.[a-z0-9])*@[a-z0-9-]+(\.[a-z])+/i;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid;
    }

    return isValid;
}

/**
 * Helper function to sortStringArr - abstraction of the key array's reduce fn
 * @param {object} obj - accumulatory object
 * @param {string} key - name of key to look for in object
 */
const sortStringArrReduce = (obj, key) => {
    if (!obj[key]) {
        console.error(`<sortStringArr> key [${key}] not defined in:`, obj);
        return {};
    } else return obj[key];
}
/**
 * Sorts an array of strings - can search through objects if passing in keyArr
 * @param {object} strArr - array of strings / objects with strings
 * @param {object} [keyArr=[]] - array of keys to get to sort values (ex: ['username'])
 */
export const sortStringArr = (strArr, keyArr=[]) => {
    const newArr = [...strArr]; // create new copy of shell array

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    return newArr.sort((elemA, elemB) => {
        // get strings from object elems
        const strA = keyArr.reduce(sortStringArrReduce, elemA).toUpperCase();
        const strB = keyArr.reduce(sortStringArrReduce, elemB).toUpperCase();

        // console.log(elemA, elemB, strA, strB);
        
        if (strA > strB) {
            return 1;
        }
        if (strA < strB) {
            return -1;
        }
        return 0;
    });
}