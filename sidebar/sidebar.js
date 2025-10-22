// Perplexity sidebar functionality
document.addEventListener("DOMContentLoaded", function() {
  console.log("Perplexity sidebar loaded");
  
  // Add any additional sidebar-specific functionality here
  const iframe = document.getElementById('perplexity');
  const fallback = document.getElementById('fallback');
  
  if (iframe) {
    iframe.addEventListener('load', function() {
      console.log('Perplexity iframe loaded successfully');
      if (fallback) fallback.classList.remove('show');
    });
    
    iframe.addEventListener('error', function(event) {
      console.error('Perplexity iframe failed to load:', event);
      if (fallback) fallback.classList.add('show');
    });
    
    // Set a timeout to show fallback if iframe doesn't load within 10 seconds
    setTimeout(() => {
      if (iframe.contentDocument === null || iframe.contentWindow === null) {
        console.warn('Iframe failed to load within timeout period');
        if (fallback) fallback.classList.add('show');
      }
    }, 10000);
  }
  
  // Handle potential CORS/CSP issues by adding error boundary
  window.addEventListener('error', function(event) {
    console.warn('Sidebar error caught:', event.error);
  });
  
  window.addEventListener('unhandledrejection', function(event) {
    console.warn('Unhandled promise rejection in sidebar:', event.reason);
  });
  
  // Try to inject a script to handle CORS issues within the iframe
  setTimeout(() => {
    try {
      if (iframe.contentWindow) {
        // This might not work due to cross-origin restrictions, but worth trying
        iframe.contentWindow.postMessage({ type: 'CORS_FIX' }, '*');
      }
    } catch (e) {
      console.log('Could not access iframe content (expected due to CORS)');
    }
  }, 2000);
});