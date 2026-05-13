
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-text",
    title: "Перевести с DeepSeek",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-text" && info.selectionText) {
    translateText(info.selectionText, tab.id);
  }
});

async function translateText(text, tabId) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"]
  });

  chrome.tabs.sendMessage(tabId, { type: "show_loader" });

  const { apiKey, targetLanguage } = await chrome.storage.sync.get(["apiKey", "targetLanguage"]);
  if (!apiKey) {
    chrome.tabs.sendMessage(tabId, {
      type: "show_translation",
      translation: "Ошибка: API ключ DeepSeek не установлен. Нажмите на иконку расширения, чтобы его добавить."
    });
    return;
  }

  const language = targetLanguage || "russian";
  const languageMap = {
    "russian": "Russian",
    "english": "English"
  };
  const targetLang = languageMap[language];

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            "role": "system", 
            "content": `You are an excellent translator. Translate the text into ${targetLang}. IMPORTANT: 
1. Your response MUST NOT contain Chinese characters or symbols. Use only ${targetLang} and Latin script (if necessary for proper nouns or terms).
2. Preserve the original paragraph structure and line breaks. Keep the same formatting as in the source text.`
          },
          { "role": "user", "content": text }
        ]
      })
    });

    if (!response.ok) {
      let errorDetails = await response.text();
      try {
        const errorJson = JSON.parse(errorDetails);
        errorDetails = JSON.stringify(errorJson, null, 2);
      } catch (e) {
      }
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}\n\nОтвет сервера:\n${errorDetails}`);
    }

    const data = await response.json();
    const translation = data.choices[0].message.content;

    chrome.tabs.sendMessage(tabId, {
      type: "show_translation",
      translation: translation
    });

  } catch (error) {
    chrome.tabs.sendMessage(tabId, {
      type: "show_translation",
      translation: `Ошибка перевода: ${error.message}`
    });
  }
}
