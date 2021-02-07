function processNode(node) {
  if (node.nodeName === '#text') {
    var text = node.nodeValue;
    node.nodeValue = node.nodeValue.
        replace(/(\s|^|\()"/g, '$1“').
        replace(/"/g, '”').
        replace(/(\s|^|\()'/g, '$1‘').
        replace(/'/g, '’').
        replace(/(\w|\s)---(\w|\s)/g, '$1—$2').
        replace(/(\w|\s)--(\w|\s)/g, '$1—$2');
    return;
  }

  if (shouldSkip(node)) {
    return;
  }
  if (!node.hasChildNodes()) {
    return;
  }

  var children = node.childNodes;
  for (var i = 0; i < children.length; ++i) {
    var child = children[i];
    if (shouldSkip(child)) {
      continue;
    }
    processNode(child);
  }
}

function shouldSkip(node) {
  if (isBlogger()) {
    return shouldPreserveText(node);
  } else if (isGmail()) {
    if (node.classList && node.classList.contains('gmail_quote')) {
      return true;
    }
    return shouldPreserveText(node);
  }

  return false;
}

function shouldPreserveText(node) {
  var tag = node.nodeName;
  return tag === 'PRE' ||
      tag === 'CODE' ||
      tag === 'SAMP' ||
      tag === 'LINK' ||
      tag === 'SCRIPT' ||
      tag === 'STYLE' ||
      tag === 'TT' ||
      tag === 'XMP';
}

function updatePunctuation() {
  var nodes = getEditorNodes();
  if (nodes.length == 0) {
    alert('Could not locate editor in this page.');
    return;
  }

  for (var i = 0; i < nodes.length; ++i) {
    processNode(nodes[i]);
  }
}

function getEditableFromIframe(iframe) {
  return iframe.contentDocument.querySelector('[contentEditable]');
}

function getEditorNodes() {
  if (isBlogger()) {
    var iframe = document.querySelector('iframe.editable');
    if (iframe == null) {
      return [];
    }
    return [getEditableFromIframe(iframe)];
  } else if (isGmail()) {
    // Try to locate new compose boxes.
    var newComposeBoxes = document.querySelectorAll('div.editable');
    if (newComposeBoxes.length > 0) {
      return newComposeBoxes;
    }

    // Look for old compose boxes.
    var oldComposeIframe = document.querySelector('iframe.editable');
    if (oldComposeIframe) {
      return [getEditableFromIframe(oldComposeIframe)];
    }

    // Can't find any; give up.
    return [];
  }

  return [];
}

function isBlogger() {
  return /^https?:\/\/(?:www|draft)\.blogger\.com/.test(location.href);
}

function isGmail() {
  return /^https?:\/\/mail\.google\.com/.test(location.href);
}

updatePunctuation();
