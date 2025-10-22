// Toggle side panel when toolbar button is clicked
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});

// Set up side panel for all tabs
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      await chrome.sidePanel.setOptions({
        tabId: tabId,
        path: 'sidebar/sidebar.html',
        enabled: true
      });
    } catch (error) {
      console.error('Error setting side panel options:', error);
    }
  }
});

// Handle CORS and CSP issues with webRequest API
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    console.log('Intercepting headers for:', details.url);
    const responseHeaders = details.responseHeaders || [];
    
    // Remove problematic headers
    const filteredHeaders = responseHeaders.filter(header => {
      const name = header.name.toLowerCase();
      return name !== 'x-frame-options' && 
             name !== 'content-security-policy' &&
             name !== 'access-control-allow-origin' &&
             name !== 'access-control-allow-methods' &&
             name !== 'access-control-allow-headers';
    });
    
    // Add CORS headers
    filteredHeaders.push({
      name: 'Access-Control-Allow-Origin',
      value: '*'
    });
    
    filteredHeaders.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, OPTIONS, HEAD'
    });
    
    filteredHeaders.push({
      name: 'Access-Control-Allow-Headers',
      value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma'
    });
    
    filteredHeaders.push({
      name: 'Access-Control-Allow-Credentials',
      value: 'true'
    });
    
    // Add a permissive CSP header
    filteredHeaders.push({
      name: 'Content-Security-Policy',
      value: "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src *; media-src *; object-src *; child-src *; frame-src *; worker-src *;"
    });
    
    console.log('Modified headers for:', details.url);
    return {
      responseHeaders: filteredHeaders
    };
  },
  {
    urls: [
      'https://www.perplexity.ai/*',
      'https://pplx-next-static-public.perplexity.ai/*',
      'https://perplexity-ai.cloudflareaccess.com/*'
    ]
  },
  ['responseHeaders', 'blocking']
);

// Also handle beforeSendHeaders to modify request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const requestHeaders = details.requestHeaders || [];
    
    // Add CORS headers to requests
    requestHeaders.push({
      name: 'Origin',
      value: 'https://www.perplexity.ai'
    });
    
    return {
      requestHeaders: requestHeaders
    };
  },
  {
    urls: [
      'https://pplx-next-static-public.perplexity.ai/*',
      'https://perplexity-ai.cloudflareaccess.com/*'
    ]
  },
  ['requestHeaders', 'blocking']
);