
document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("save");

  chrome.storage.sync.get("apiKey", ({ apiKey }) => {
    if (apiKey) {
      apiKeyInput.value = apiKey;
    }
  });

  saveButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value;
    if (apiKey) {
      chrome.storage.sync.set({ apiKey }, () => {
        alert("Ключ сохранен!");
        window.close();
      });
    } else {
      alert("Пожалуйста, введите ключ.");
    }
  });
});
