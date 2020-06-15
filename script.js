const BASE_URL = "https://guya.moe";

const ctx = chrome || browser;

let allowed_url_list = [
  "mangadex.org/title",
  "mangadex.org/manga",
  "mangadex.org/chapter",
  "nhentai.net/g",
  "imgur.com/a",
];

let updateIcon = (tabId) => {
  ctx.tabs.get(tabId, (tab) => {
    if (!ctx.runtime.lastError) {
      try {
        if (
          allowed_url_list.some((allowed_url) => tab.url.includes(allowed_url))
        ) {
          ctx.browserAction.setIcon({ path: "logo_small.png" });
        } else {
          ctx.browserAction.setIcon({ path: "logo_small_bw.png" });
        }
      } catch (e) {
        ctx.browserAction.setIcon({ path: "logo_small_bw.png" });
      }
    }
  });
};

ctx.browserAction.onClicked.addListener((tab) => {
  if (allowed_url_list.some((allowed_url) => tab.url.includes(allowed_url))) {
    ctx.tabs.executeScript({
      code: `
        window.location.href = "${BASE_URL}" + document.location.pathname;
      `,
    });
  }
});

ctx.tabs.onUpdated.addListener((tabId) => {
  updateIcon(tabId);
});

ctx.tabs.onActivated.addListener((info) => {
  updateIcon(info.tabId);
});
