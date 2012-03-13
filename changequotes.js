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
  var iframe = document.querySelector('#postingComposeBox');
  if (!iframe) {
    alert('Could not locate Blogger editor in this page.');
    return;
  }

  var nodes = iframe.contentDocument.querySelector('[contentEditable]').childNodes;
  for (var i = 0; i < nodes.length; ++i) {
    processNode(nodes[i]);
  }
}

updatePunctuation();
