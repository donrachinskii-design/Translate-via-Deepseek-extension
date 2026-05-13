
console.log("Скрипт content.js загружен.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "show_translation") {
    showTranslationPopup(request.translation);
  } else if (request.type === "show_loader") {
    showLoader();
  }
});

function showLoader() {
  const oldPopup = document.getElementById("deepseek-translation-popup");
  if (oldPopup) {
    oldPopup.remove();
  }

  const loader = document.createElement("div");
  loader.id = "deepseek-translation-popup";
  loader.innerHTML = `
    <div id="deepseek-popup-header">
      <span>Перевод DeepSeek</span>
    </div>
    <div id="deepseek-popup-content" 
         style="display: flex; justify-content: center; align-items: center; min-height: 100px;">
      <div class="deepseek-loader"></div>
    </div>
  `;
  document.body.appendChild(loader);
  
  // Добавляем обработчик Escape
  addEscapeHandler(loader);
}

function showTranslationPopup(text) {
  const oldPopup = document.getElementById("deepseek-translation-popup");
  if (oldPopup) {
    oldPopup.remove();
  }

  const popup = document.createElement("div");
  popup.id = "deepseek-translation-popup";
  popup.innerHTML = `
    <div id="deepseek-popup-header">
      <span>Перевод DeepSeek</span>
      <button id="deepseek-close-btn">×</button>
    </div>
    <div id="deepseek-popup-content">${text}</div>
  `;
  document.body.appendChild(popup);

  document.getElementById("deepseek-close-btn").addEventListener("click", () => {
    popup.remove();
  });
  
  // Добавляем обработчик Escape
  addEscapeHandler(popup);
}

function addEscapeHandler(popup) {
  const escapeHandler = (event) => {
    if (event.key === "Escape") {
      popup.remove();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  
  document.addEventListener("keydown", escapeHandler);
}
