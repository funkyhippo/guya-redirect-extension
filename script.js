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
