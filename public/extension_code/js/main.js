// Main content script
console.log('<main> inside!');

// var port = chrome.runtime.connect({name: "knockknock2"});
// port.postMessage({joke: "Knock knock"});
// port.onMessage.addListener(function(msg) {
//     if (msg.question == "Who's there?") {
//         console.log('who there',msg);
//         port.postMessage({answer: "Madame"});
//     } else if (msg.question == "Madame who?") {
//         console.log('madame who',msg);
//         port.postMessage({answer: "Madame... Bovary"});
//     } else {
//         console.log('madame bovary',msg);
//         console.warn('the end...');
//     }
// });