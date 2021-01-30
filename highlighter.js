window.Prism = window.Prism || {};
window.Prism.manual = true;

let timer;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  const messageTypes = ['loadedscript', 'urlchange'];
  if (messageTypes.includes(request.message)) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      highlight();
      drawButton();
      timer = null;
    }, 500);
  }
});

/**
 * Grabs language based on icon
 *
 * TODO: use the filename?????
 */
function getLanguage(block) {
  let language = '';

  const map = {
    'ms-Icon--JavaScriptLanguage': 'js',
    'ms-Icon--CSharpLanguage': 'cs',
    'ms-Icon--FileHTML': 'html',
    'ms-Icon--TypeScriptLanguage': 'ts',
    'ms-Icon--FileLess': 'less',
  };
  const icon = block.getElementsByClassName(
    'repos-change-summary-file-icon'
  )[0];

  if (icon) {
    icon.classList.forEach(function (className) {
      language = map[className];
    });
  }

  return language;
}

function highlight() {
  const blocks = document.getElementsByClassName('repos-summary-header');

  for (const block of blocks) {
    const language = getLanguage(block);
    const lines = block.getElementsByClassName('repos-line-content');
    for (const line of lines) {
      try {
        const highlighted = window.Prism.highlight(
          line.innerText,
          window.Prism.languages[language],
          language
        );
        line.innerHTML = highlighted;
      } catch (ex) {
        console.log(ex);
      }
    }
  }
}

function drawButton() {
  const buttonId = 'syntax-highlighter-btn';

  if (!document.getElementById(buttonId)) {
    const btn = document.createElement('BUTTON');
    btn.id = 'syntax-highlighter-btn';
    btn.innerHTML = 'Highlight Syntax';
    const styles = [
      'position:absolute',
      'bottom:15px',
      'right:15px',
      'cursor:pointer',
      'align-items:center',
      'border-radius:2px',
      'border:1px solid transparent',
      'font-family:inherit',
      'font-size:inherit',
      'font-weight:600',
      'line-height:inherit',
      'outline:none',
      'padding:6px 12px',
      'transition:background 80ms linear',
    ];
    btn.style = styles.join(';');
    document.body.appendChild(btn);
    btn.onclick = highlight;
  }
}
