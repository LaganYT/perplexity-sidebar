// Content script to help with iframe loading and CORS issues
console.log('Perplexity content script loaded');

// Apply CORS fixes immediately when script loads
applyCORSFixes();

// Listen for messages from the sidebar or extension
window.addEventListener('message', function(event) {
  if (event.data.type === 'CORS_FIX') {
    console.log('Received CORS fix message');
    applyCORSFixes();
  }
});

// Listen for runtime messages from extension
if (chrome && chrome.runtime) {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'APPLY_CORS_FIX') {
      console.log('Received CORS fix request from extension');
      applyCORSFixes();
      sendResponse({success: true});
    }
  });
}

function applyCORSFixes() {
  try {
    // Override fetch to add CORS headers
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      if (!options) options = {};
      options.mode = 'cors';
      options.credentials = 'omit';
      return originalFetch(url, options);
    };
    console.log('Fetch override applied');
  } catch (e) {
    console.log('Could not override fetch:', e);
  }

  try {
    // Override XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      xhr.open = function(method, url, async, user, password) {
        return originalOpen.call(this, method, url, async || true, user, password);
      };
      return xhr;
    };
    console.log('XMLHttpRequest override applied');
  } catch (e) {
    console.log('Could not override XMLHttpRequest:', e);
  }

  try {
    // Remove any existing CSP meta tags that might interfere
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (metaCSP) {
      metaCSP.remove();
      console.log('Removed CSP meta tag');
    }
  } catch (e) {
    console.log('Could not remove CSP meta tag:', e);
  }
}

// Try to handle service worker issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log('Service worker message:', event.data);
  });
}
