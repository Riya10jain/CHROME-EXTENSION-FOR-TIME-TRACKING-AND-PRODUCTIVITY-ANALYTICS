function load(){
  chrome.storage.local.get(['settings'], data=>{
    const s = data.settings || {};
    document.getElementById('prod').value = (s.productiveDomains||[]).join('\n');
    document.getElementById('unprod').value = (s.unproductiveDomains||[]).join('\n');
    document.getElementById('ignore').value = (s.ignoreList||[]).join('\n');
  });
}
document.getElementById('save').addEventListener('click', ()=>{
  const s = {
    productiveDomains: document.getElementById('prod').value.split('\n').map(x=>x.trim()).filter(Boolean),
    unproductiveDomains: document.getElementById('unprod').value.split('\n').map(x=>x.trim()).filter(Boolean),
    ignoreList: document.getElementById('ignore').value.split('\n').map(x=>x.trim()).filter(Boolean)
  };
  chrome.storage.local.set({settings: s}, ()=> {
    document.getElementById('status').textContent = 'Saved ✓';
    setTimeout(()=> document.getElementById('status').textContent = '', 1500);
  });
});
load();
