// Perplexity sidebar functionality
document.addEventListener("DOMContentLoaded", function() {
  console.log("Perplexity sidebar loaded");
  
  // Add any additional sidebar-specific functionality here
  const iframe = document.getElementById('perplexity');
  if (iframe) {
    iframe.addEventListener('load', function() {
      console.log('Perplexity iframe loaded successfully');
    });
  }
});