const BASE_URL = "";

const MD_PROXY = "md_proxy/";
const NH_PROXY = "nh_proxy/";

const ctx = chrome || browser;

let execute = (prefix, path) => {
  ctx.tabs.executeScript({
    code: `
      let path = document.location.pathname
        .split("/")
        .filter(e => e);
      let number = path[path.indexOf("${prefix}") + 1];
      let url = "${BASE_URL}" + "${path}" + number + "/";
      window.location.href = url;
    `
  });
};

let updateIcon = tabId => {
  try {
    ctx.tabs.get(tabId, tab => {
      if (
        tab.url.includes("mangadex.org/title") ||
        (tab.url.includes("nhentai.net/g") &&
          tab.url
            .split("/")
            .filter(e => e)
            .slice(-2)[0] === "g")
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
  if (tab.url.includes("mangadex") && tab.url.includes("/title/")) {
    execute("title", MD_PROXY);
  } else if (tab.url.includes("nhentai") && tab.url.includes("/g/")) {
    if (
      tab.url
        .split("/")
        .filter(e => e)
        .slice(-2)[0] === "g"
    ) {
      execute("g", NH_PROXY);
    }
  }
});

ctx.tabs.onUpdated.addListener(tabId => {
  updateIcon(tabId);
});

ctx.tabs.onActivated.addListener(info => {
  updateIcon(info.tabId);
});
