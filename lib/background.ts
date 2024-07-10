const QUEUE_KEY = "nextVideoQueue"

interface VideoItem{
  link:string;
  id:string
}


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "playNext",
    title: "Add to YouQueue",
    contexts: ["link"],
    targetUrlPatterns: ["*://www.youtube.com/watch*"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "playNext") {
    if(info.linkUrl) enqueue(info.linkUrl);
  }
});

function enqueue(item:string) {
  chrome.storage.local.get(QUEUE_KEY, (data) => {
    let queue = data[QUEUE_KEY] || [];
    queue.push({id:  Math.random().toString(36).substring(2, 5) +String(performance.now().toFixed(2)) + Math.random().toString(36).substring(2, 8) ,link:item});
    chrome.storage.local.set({ [QUEUE_KEY]: queue });
  });
}
async function dequeue() {
  const data = await chrome.storage.local.get(QUEUE_KEY);
  let queue = data[QUEUE_KEY] || [];
  const item = queue.shift();
  chrome.storage.local.set({ [QUEUE_KEY]: queue });
  return item;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "nextVideo") {
    (async () => {
      const video = await dequeue();
      if (video) {
      //@ts-ignore
      chrome.tabs.update(sender.tab?.id ,{
          url:video.link

        })
      }
    })();
    return true;
  }
  if (message.message === "playVideo") {
    console.log("playing video :: ", message.video)
  }

  if(message.message ==="getQueue"){
    (async()=>{
      const queue = await chrome.storage.local.get(QUEUE_KEY)
      sendResponse(queue.nextVideoQueue)
    })();
    return true
  }
  if(message.message==="swap"){
    swapQueueItems(message.index1 , message.index2)

  }
  if(message.message === "updateQueue"){
    updateQueue(message.queue)
  }
});
function updateQueue(newQueue:VideoItem[]) {
  chrome.storage.local.set({ [QUEUE_KEY]: newQueue }, () => {
  });
}

function swapQueueItems(index1:number, index2:number) {
  chrome.storage.local.get(QUEUE_KEY, (data) => {
      let queue = data[QUEUE_KEY] || [];

      if (index1 < 0 || index1 >= queue.length || index2 < 0 || index2 >= queue.length) {
          console.error('Invalid indices provided for swapping.');
          return;
      }

      const temp = queue[index1];
      queue[index1] = queue[index2];
      queue[index2] = temp;

      chrome.storage.local.set({ [QUEUE_KEY]: queue }, () => {
          console.log(`Swapped items at index ${index1} and ${index2}. Updated queue:`, queue);
      });
  });
}

