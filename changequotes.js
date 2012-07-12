function processNode(node) {
  if (node.nodeName === '#text') {
    var text = node.nodeValue;
    node.nodeValue = node.nodeValue.
        replace(/(\s|^)"/g, '$1“').
        replace(/"/g, '”').
        replace(/(\s|^)'/g, '$1‘').
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
  var iframe = getEditorIframe();
  if (!iframe) {
    alert('Could not locate editor in this page.');
    return;
  }

  var nodes = iframe.contentDocument.querySelector('[contentEditable]').childNodes;
  for (var i = 0; i < nodes.length; ++i) {
    processNode(nodes[i]);
  }
}

function getEditorIframe() {
  if (isBlogger()) {
    return document.querySelector('#postingComposeBox');
  } else if (isGmail()) {
    var frames = document.querySelector('#canvas_frame').contentDocument.
        querySelectorAll('iframe');
    for (var i = 0; i < frames.length; ++i) {
      var editor = null;
      try {
        if (frames[i].contentDocument) {
          editor = frames[i].contentDocument.querySelector('[contentEditable]');
          if (editor) {
            return frames[i];
          }
        }
      } catch (e) {
        // Ignore any error.
      }
    }
    return null;
  }

  return null;
}

function isBlogger() {
  return /^https?:\/\/(?:www|draft)\.blogger\.com/.test(location.href);
}

function isGmail() {
  return /^https?:\/\/mail\.google\.com/.test(location.href);
}

updatePunctuation();
