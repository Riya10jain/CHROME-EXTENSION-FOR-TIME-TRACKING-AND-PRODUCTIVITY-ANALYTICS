async function getTodayKey(){ return 'events_' + new Date().toISOString().slice(0,10); }
function minsSum(arr, category){
  return arr.filter(a=> a.category === category).reduce((s,e)=> s + (e.durationMinutes||0), 0);
}
async function refresh(){
  const key = await getTodayKey();
  chrome.storage.local.get([key,'trackingPaused'], data=>{
    const arr = data[key] || [];
    document.getElementById('prod').textContent = minsSum(arr,'productive');
    document.getElementById('unprod').textContent = minsSum(arr,'unproductive');
    document.getElementById('neutral').textContent = minsSum(arr,'neutral');
    const paused = data.trackingPaused;
    const btn = document.getElementById('toggle');
    btn.textContent = paused ? 'Resume Tracking' : 'Pause Tracking';
  });
}
document.getElementById('toggle').addEventListener('click', ()=>{
  chrome.storage.local.get(['trackingPaused'], data=>{
    const paused = !data.trackingPaused;
    chrome.storage.local.set({trackingPaused: paused});
    // simple pause behavior: flush current session and ignore starts while paused
    if(paused) chrome.runtime.sendMessage({type:'pause'});
    else chrome.runtime.sendMessage({type:'resume'});
    refresh();
  });
});
document.getElementById('options').addEventListener('click', ()=>{ /* link handled by browser */ });
refresh();
