function monitorVideo() {
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('ended', () => {
        console.log("video ended ")
        chrome.runtime.sendMessage({ message: "nextVideo" });
      });
    }
  }
  
  monitorVideo();
  