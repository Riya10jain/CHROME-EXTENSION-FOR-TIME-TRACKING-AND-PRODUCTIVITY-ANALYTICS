(function(){
  function sendVisibility(){
    chrome.runtime.sendMessage({type:'visibility', visible: document.visibilityState === 'visible'});
  }
  document.addEventListener('visibilitychange', sendVisibility);
  sendVisibility();
})();
