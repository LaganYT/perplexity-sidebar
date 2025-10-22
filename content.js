// Content script to help with iframe loading and CORS issues
console.log('Perplexity content script loaded');

// Listen for messages from the sidebar
window.addEventListener('message', function(event) {
  if (event.data.type === 'CORS_FIX') {
    console.log('Received CORS fix message');
    // Try to handle any CORS-related issues
    try {
      // Override fetch to add CORS headers
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        options.mode = 'cors';
        options.credentials = 'omit';
        return originalFetch(url, options);
      };
    } catch (e) {
      console.log('Could not override fetch:', e);
    }
  }
});

// Try to handle service worker issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log('Service worker message:', event.data);
  });
}
