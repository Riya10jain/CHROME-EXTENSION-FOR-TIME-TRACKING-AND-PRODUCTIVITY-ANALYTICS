'use strict';
// Lightweight MV3 background service worker to track active tab time (minute granularity)
// NOT a production-ready implementation. Use for development and iterate from here.

const DEFAULTS = {
  productiveDomains: ['github.com','stackoverflow.com','gitlab.com','replit.com','codesandbox.io','vscode.dev'],
  unproductiveDomains: ['facebook.com','instagram.com','twitter.com','tiktok.com','reddit.com','youtube.com'],
  ignoreList: []
};

let currentSession = null; // {startTs, tabId, url, title, focused}
let lastPersist = Date.now();

function nowIso(){ return new Date().toISOString(); }
function dateKey(d=new Date()){ return d.toISOString().slice(0,10); }

async function getSettings(){
  return new Promise(res => {
    chrome.storage.local.get(['settings'], data => {
      res(Object.assign({}, DEFAULTS, data.settings || {}));
    });
  });
}

function domainFromUrl(url){
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./,'');
  } catch(e){ return ''; }
}

function classifyUrl(url, settings){
  const domain = domainFromUrl(url);
  if(!domain) return 'neutral';
  if(settings.ignoreList && settings.ignoreList.includes(domain)) return 'ignored';
  for(const d of settings.productiveDomains) if(domain.endsWith(d)) return 'productive';
  for(const d of settings.unproductiveDomains) if(domain.endsWith(d)) return 'unproductive';
  return 'neutral';
}

function saveEvent(event){
  // event: {start, end, url, title, category, durationMinutes}
  const key = 'events_' + dateKey(new Date(event.start));
  chrome.storage.local.get([key], data => {
    const arr = data[key] || [];
    arr.push(event);
    const obj = {}; obj[key] = arr;
    chrome.storage.local.set(obj);
  });
}

function flushCurrentSession(){
  if(!currentSession) return;
  const endTs = Date.now();
  const mins = Math.max(1, Math.round((endTs - currentSession.startTs)/60000));
  const ev = {
    start: new Date(currentSession.startTs).toISOString(),
    end: new Date(endTs).toISOString(),
    url: currentSession.url || '',
    title: currentSession.title || '',
    durationMinutes: mins,
    category: currentSession.category || 'neutral'
  };
  saveEvent(ev);
  currentSession = null;
  lastPersist = Date.now();
}

async function startSessionForTab(tab){
  if(!tab || !tab.url) return;
  const settings = await getSettings();
  const category = classifyUrl(tab.url, settings);
  // If domain ignored, don't start
  if(category === 'ignored') { currentSession = null; return; }
  // If existing session same tab+url, keep it
  if(currentSession && currentSession.tabId === tab.id && currentSession.url === tab.url) return;
  flushCurrentSession();
  currentSession = {
    startTs: Date.now(),
    tabId: tab.id,
    url: tab.url,
    title: tab.title || '',
    category
  };
}

// Listen to tab activation
chrome.tabs.onActivated.addListener(async info => {
  try {
    const tab = await chrome.tabs.get(info.tabId);
    startSessionForTab(tab);
  } catch(e){ /* ignore */ }
});

// Listen to tab updates (URL/title changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === 'complete' || changeInfo.url){
    if(tab.active) startSessionForTab(tab);
  }
});

// Visibility changes from content script
chrome.runtime.onMessage.addListener((msg, sender) => {
  if(msg && msg.type === 'visibility'){
    if(msg.visible){
      // tab visible again: start session for sender.tab
      if(sender && sender.tab) startSessionForTab(sender.tab);
    } else {
      // tab hidden: flush
      flushCurrentSession();
    }
  }
});

// Idle detection
chrome.idle.onStateChanged.addListener(state => {
  if(state === 'idle' || state === 'locked') flushCurrentSession();
});

// Alarm to flush every minute (and persist)
chrome.alarms.create('periodicFlush', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(alarm => {
  if(alarm.name === 'periodicFlush'){
    // flush if worker lives long enough
    // persist currently running session to storage as a short heartbeat
    if(currentSession){
      // flush small partial chunk every 5 minutes to avoid losing too much
      if(Date.now() - lastPersist > 5*60*1000){
        flushCurrentSession();
      }
    }
  }
});

// Simple action badge update for quick feedback
async function updateBadge(){
  const key = 'events_' + dateKey();
  chrome.storage.local.get([key], data => {
    const arr = data[key] || [];
    const minutesToday = arr.reduce((s,e)=> s + (e.durationMinutes||0), 0);
    chrome.action.setBadgeText({text: String(Math.min(minutesToday,999))});
    chrome.action.setBadgeBackgroundColor({color: '#333'});
  });
}

// Periodic update every 30 seconds while service worker running
setInterval(updateBadge, 30*1000);
updateBadge();

// On install, set defaults
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['settings'], data => {
    if(!data.settings) chrome.storage.local.set({settings: DEFAULTS});
  });
});
