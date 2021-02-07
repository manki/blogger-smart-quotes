var BLOGGER_NEW_UI_EDITOR_URL = /^https?:\/\/(?:www|draft)\.blogger\.com\/blog\/post\/edit\//;
var BLOGGER_OLD_UI_EDITOR_URL = /^https?:\/\/(?:www|draft)\.blogger\.com\/blogger\.g\?.*#editor\b/;
var GMAIL_URL = /^https:\/\/mail\.google\.com\//;

function onTabEvent(tabId) {
  chrome.tabs.get(tabId, function(tab) {
    if (BLOGGER_NEW_UI_EDITOR_URL.test(tab.url) ||
        BLOGGER_OLD_UI_EDITOR_URL.test(tab.url) ||
        GMAIL_URL.test(tab.url)) {
      chrome.pageAction.show(tab.id);
    } else {
      chrome.pageAction.hide(tab.id);
    }
  });
}

function onPageActionClick(tab) {
  chrome.tabs.executeScript(tab.id, {'file': 'changequotes.js'});
}

chrome.tabs.onUpdated.addListener(onTabEvent);
chrome.tabs.onActiveChanged.addListener(onTabEvent);
chrome.pageAction.onClicked.addListener(onPageActionClick);
