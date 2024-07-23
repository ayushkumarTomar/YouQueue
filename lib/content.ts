function monitorVideo(): void {
  function attachListener(video: HTMLVideoElement): void {
    video.addEventListener('ended', () => {
      console.log("video ended");
      chrome.runtime.sendMessage({ message: "nextVideo" });
    });
  }

  const video = document.querySelector<HTMLVideoElement>('video');
  if (video) {
    attachListener(video);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLVideoElement) {
            attachListener(node);
          } else if (node instanceof HTMLElement) {
            const nestedVideo = node.querySelector<HTMLVideoElement>('video');
            if (nestedVideo) {
              attachListener(nestedVideo);
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const specificContainer = document.querySelector('#container');
  if (specificContainer) {
    observer.observe(specificContainer, { childList: true, subtree: true });
  }
}

monitorVideo();
