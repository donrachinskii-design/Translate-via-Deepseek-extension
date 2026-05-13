
document.addEventListener("DOMContentLoaded", async () => {
  const { apiKey, targetLanguage } = await chrome.storage.sync.get(["apiKey", "targetLanguage"]);
  
  if (apiKey) {
    document.getElementById("apiKey").value = apiKey;
  }
  
  if (targetLanguage) {
    document.getElementById("targetLanguage").value = targetLanguage;
  } else {
    document.getElementById("targetLanguage").value = "russian";
  }
});

document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value;
  const targetLanguage = document.getElementById("targetLanguage").value;
  
  await chrome.storage.sync.set({ apiKey, targetLanguage });
  
  const status = document.getElementById("status");
  status.textContent = "Сохранено!";
  status.style.color = "green";
  
  setTimeout(() => {
    status.textContent = "";
  }, 2000);
});
