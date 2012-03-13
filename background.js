var NEW_UI_EDITOR_URL = /^https?:\/\/(?:www|draft)\.blogger\.com\/blogger\.g\?.*#editor\b/;
var OLD_UI_EDITOR_URL = /^https?:\/\/(?:www|draft)\.blogger\.com\/post-(?:create|edit)\.g\?/;

function onTabEvent(tabId) {
  chrome.tabs.get(tabId, function(tab) {
    if (NEW_UI_EDITOR_URL.test(tab.url) ||
        OLD_UI_EDITOR_URL.test(tab.url)) {
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
