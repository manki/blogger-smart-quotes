const BLOGGER_EDITOR_URL = '^https?\\://(?:www|draft)\\.blogger\\.com/blog/post/edit/';
const GMAIL_URL = '^https\\://mail\\.google\\.com/';

const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {
        originAndPathMatches: `(?:${BLOGGER_EDITOR_URL})|(?:${GMAIL_URL})`,
      },
    }),
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()],
};

function onActionClick(tab) {
  chrome.scripting.executeScript({
    'target': {tabId: tab.id},
    'files': ['changequotes.js'],
  });
}

chrome.runtime.onInstalled.addListener((details) => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
});
chrome.action.onClicked.addListener(onActionClick);
