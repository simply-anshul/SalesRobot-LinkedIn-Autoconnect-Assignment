/*
  @Author Anshul Surpaithankar
*/

let stop = false;
let connectInProgress = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "connect" && !stop) {
    const buttons = document.querySelectorAll("button");
    let connected = false;

    for (let button of buttons) {
      if (button.innerText === "Connect" && !connectInProgress) {
        button.click();
        connectInProgress = true;

        setTimeout(() => {
          const addNotePopup = document.querySelector("div.artdeco-modal__content");
        
          if (addNotePopup) {
            const sendWithoutNoteButton = Array.from(
              document.querySelectorAll("span.artdeco-button__text")
            ).find((span) => span.innerText.trim() === "Send without a note");
        
            if (sendWithoutNoteButton) {
              sendWithoutNoteButton.parentElement.click();
              chrome.runtime.sendMessage({ action: "incrementCount" });
            } else {
              console.log("'Send without a note' button not found!");
            }
          } else {

            chrome.runtime.sendMessage({ action: "incrementCount" });
          }
        
          connectInProgress = false;
        }, 4000);        
        connected = true;
        break;
      }
    }

    if (!connected) {
      console.log("No 'Connect' button found on this page.");
    }
  } else if (message.action === "stop") {
    console.log("Stopped Connecting!");
    stop = true;
  }
});
