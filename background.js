// chrome.browserAction.onClicked.addListener(function (tab) {
//   //repos-summary-diff-blocks
//   // chrome.tabs.executeScript({
//   //   code: 'document.body.style.backgroundColor="red"',
//   // });
//   chrome.scripting.executeScript({
//     function: showAlert,
//   });
// });

// function showAlert() {
//   alert('test!');
// }

// chrome.scripting.executeScript({
//   function: showAlert,
// });

console.log('backgorund');

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(changeInfo);
  if (changeInfo.url) {
    console.log(changeInfo.url);
    chrome.tabs.sendMessage(tabId, {
      message: 'urlchange',
      url: changeInfo.url,
    });
  }
});

chrome.webRequest.onCompleted.addListener(
  function (details) {
    // azure is retreiving more code to display
    if (
      details.initiator === 'https://dev.azure.com' &&
      details.type === 'script'
    ) {
      // console.log(details);

      chrome.tabs.sendMessage(details.tabId, {
        message: 'loadedscript',
      });
    }
  },
  { urls: ['<all_urls>'] }
);
