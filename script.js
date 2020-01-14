const BASE_URL = "";

const MD_PROXY = "md_proxy/";
const NH_PROXY = "nh_proxy/";

let execute = (offset, path) => {
  chrome.tabs.executeScript({
    code: `
      let number = document.location.pathname
        .split("/")
        .filter(e => e)
        .slice(-${offset})[0];
      let url = "${BASE_URL}" + "${path}" + number + "/";
      window.location.href = url;
    `
  });
};

let updateIcon = (tabId) => {
  chrome.tabs.get(tabId, tab => {
    if (
      tab.url.includes("mangadex.org/title") ||
      (tab.url.includes("nhentai.net/g") &&
        tab.url
          .split("/")
          .filter(e => e)
          .slice(-2)[0] === "g")
    ) {
      chrome.browserAction.setIcon({ path: "logo_small.png" });
    } else {
      chrome.browserAction.setIcon({ path: "logo_small_bw.png" });
    }
  });
}

chrome.browserAction.onClicked.addListener(tab => {
  if (tab.url.includes("mangadex") && tab.url.includes("/title/")) {
    execute(2, MD_PROXY);
  } else if (tab.url.includes("nhentai") && tab.url.includes("/g/")) {
    if (
      tab.url
        .split("/")
        .filter(e => e)
        .slice(-2)[0] === "g"
    ) {
      execute(1, NH_PROXY);
    }
  }
});

chrome.tabs.onUpdated.addListener(tabId => {
  updateIcon(tabId);
});

chrome.tabs.onActivated.addListener(info => {
  updateIcon(info.tabId);
});
