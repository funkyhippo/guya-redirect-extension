const BASE_URL = "";

const ctx = chrome || browser;

let updateIcon = tabId => {
  try {
    ctx.tabs.get(tabId, tab => {
      if (
        tab.url.includes("mangadex.org/title") ||
        tab.url.includes("mangadex.org/manga") ||
        tab.url.includes("mangadex.org/chapter") ||
        tab.url.includes("nhentai.net/g")
      ) {
        ctx.browserAction.setIcon({ path: "logo_small.png" });
      } else {
        ctx.browserAction.setIcon({ path: "logo_small_bw.png" });
      }
    });
  } catch (e) {
    ctx.browserAction.setIcon({ path: "logo_small_bw.png" });
  }
};

ctx.browserAction.onClicked.addListener(tab => {
  if (
    tab.url.includes("mangadex.org/title") ||
    tab.url.includes("mangadex.org/manga") ||
    tab.url.includes("mangadex.org/chapter") ||
    tab.url.includes("nhentai.net/g")
  ) {
    ctx.tabs.executeScript({
      code: `
        window.location.href = "${BASE_URL}" + document.location.pathname;
      `
    });
  }
});

ctx.tabs.onUpdated.addListener(tabId => {
  updateIcon(tabId);
});

ctx.tabs.onActivated.addListener(info => {
  updateIcon(info.tabId);
});
