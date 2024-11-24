/*
  @Author Anshul Surpaithankar
*/

// Set my variables
let countDisplay = document.getElementById("countDisplay");
let toggleButton = document.getElementById("toggleButton");
let isRunning = false; 

// Initialize Invitations Sent Count Value from localStorage
chrome.storage.local.get(["connectCount"], (result) => {
    countDisplay.textContent = result.connectCount || 0;
  });

// For the Invitations Sent Count Value  
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateCount") {
    countDisplay.textContent = message.count;
  }
});

/* Handle the Click Event on the Toggle Button
  CASE 1 : The extension is in running state and "Stop" is clicked
    - set isRunning to false
    - Change the text of button to "Start"
    - Add start class name replacing stop
    - Set count to 0

  CASE 2 : The extension is in stopped state and "Start" is clicked
    - set isRunning to true
    - Change the text of button to "Stop"
    - Add stop class name replacing start
*/
toggleButton.addEventListener("click", () => {
  if (isRunning) {
    chrome.runtime.sendMessage({ action: "stop" });
    isRunning = false;
    toggleButton.textContent = "START CONNECTING";
    toggleButton.classList.remove("stop");
    toggleButton.classList.add("start");
    countDisplay.textContent = "0";
  } else {
    chrome.runtime.sendMessage({ action: "start" });
    toggleButton.textContent = "STOP CONNECTING";
    toggleButton.classList.remove("start");
    toggleButton.classList.add("stop");
    isRunning = true;

  }
});