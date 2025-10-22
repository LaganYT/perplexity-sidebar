// Toggle side panel when toolbar button is clicked
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });

    // Inject content script when side panel is opened
    if (tab.url && tab.url.includes('perplexity.ai')) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        console.log('Content script injected into Perplexity tab');

        // Send message to apply CORS fixes immediately
        await chrome.tabs.sendMessage(tab.id, { action: 'APPLY_CORS_FIX' });
        console.log('CORS fix message sent to content script');
      } catch (scriptError) {
        console.error('Error injecting content script:', scriptError);
      }
    }
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

      // Inject content script into Perplexity tabs when they finish loading
      if (tab.url.includes('perplexity.ai')) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          });
          console.log('Content script injected into loaded Perplexity tab:', tabId);

          // Send message to apply CORS fixes
          await chrome.tabs.sendMessage(tabId, { action: 'APPLY_CORS_FIX' });
          console.log('CORS fix message sent to loaded tab');
        } catch (scriptError) {
          console.error('Error injecting content script into loaded tab:', scriptError);
        }
      }
    } catch (error) {
      console.error('Error setting side panel options:', error);
    }
  }
});

// Header modifications are now handled by declarativeNetRequest rules in rules.json
// Note: In Manifest V3, request header modification is not possible with declarativeNetRequest
// Only response headers can be modified