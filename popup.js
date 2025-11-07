document.getElementById('scan').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      return Array.from(document.images).map(img => img.src);
    }
  }, (results) => {
    if (results && results[0] && results[0].result) {
      displayImages(results[0].result);
    }
  });
});

function displayImages(images) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  
  if (images.length === 0) {
    list.innerHTML = '<p>No images found on this page</p>';
    return;
  }
  
  images.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'img-item';
    div.innerHTML = `
      <img src="${src}" onerror="this.style.display='none'">
      <a href="${src}" download="image_${i + 1}" target="_blank">Download ${i + 1}</a>
    `;
    list.appendChild(div);
  });
}