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