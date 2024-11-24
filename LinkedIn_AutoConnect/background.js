/*
  @Author Anshul Surpaithankar
*/

let interval;
let isRunning = false; // Track the running state
let count = 0;

chrome.storage.local.get(["connectCount"], (result) => {
  count = result.connectCount || 0;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ connectCount: 0 }, () => {
    console.log("connectCount initialized to 0.");
  });
});

/*
  Message "start" : Get the tabId to send message, inject the script and start connecting at random interval between 5-10 seconds and set running state to true
  Message "stop"  : Clear the interval, set running state to false and clear the count
  Message "incrementCount" : Increase the count by 1, set in local storage and send "updateCount" message  
*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start" && !isRunning) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        count = 0;
        chrome.storage.local.set({ connectCount: count });

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
          }, () => {
            console.log("Content script injected.");
          });

        interval = setInterval(() => {
          chrome.tabs.sendMessage(tabId, { action: "connect" });
        }, Math.random() * (10000 - 5000) + 5000);

        isRunning = true;
      }
    });
  } else if (message.action === "stop" && isRunning) {
    clearInterval(interval);
    isRunning = false;
    count = 0;
  } else if (message.action === "incrementCount") {
    count++;
    chrome.storage.local.set({ connectCount: count });
    chrome.runtime.sendMessage({ action: "updateCount", count });
  }
});



