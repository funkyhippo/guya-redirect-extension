const BASE_URL = "https://guya.moe";
const FS_URL = "https://guya.moe/fs";

const ctx = chrome || browser;

const allowed_url_list = [
  "mangadex.org/title",
  "mangadex.org/manga",
  "mangadex.org/chapter",
  "nhentai.net/g",
  "imgur.com/a",
];

const tachiyomi_foolslide_list = [
  // %%FOOLSLIDE START%%
  "ajianoscantrad.fr",
  "deathtollscans.net",
  "evilflowers.com",
  "faworeader.altervista.org",
  "gtothegreatsite.net",
  "helveticascans.com",
  "hentai.cafe",
  "hni-scantrad.com/eng/lel/",
  "hni-scantrad.com/lel/",
  "jaiminisbox.com",
  "kireicake.com",
  "kirishimafansub.net",
  "kobato.hologfx.com",
  "leitura.baixarhentai.net",
  "lupiteam.net",
  "mabushimajo.com",
  "mangascouts.org",
  "mangatellers.gr",
  "maryfaye.net",
  "midnighthaven.shounen-ai.net",
  "motokare.xyz",
  "otscans.com",
  "phantomreader.com",
  "ramareader.it",
  "read-nifteam.info",
  "readedenszero.com",
  "reader.powermanga.org",
  "reader.silentsky-scans.net",
  "reader2.thecatscans.com",
  "rusmanga.ru",
  "sensescans.com",
  "smuglo.li",
  "storm-in-heaven.net",
  "tortuga-ceviri.com",
  "tuttoanimemanga.net",
  "yuri-ism.net/slide",
  "zandynofansub.aishiteru.org",
  // %%FOOLSLIDE END%%
];

// This is more for entries that one might want to keep regardless of what is on tachi, because
// the scraper will erase any entry when updating.
const override_foolslide_list = [];

let updateIcon = (tabId) => {
  ctx.tabs.get(tabId, (tab) => {
    if (!ctx.runtime.lastError) {
      try {
        if (
          allowed_url_list.some((allowed_url) =>
            tab.url.includes(allowed_url)
          ) ||
          tachiyomi_foolslide_list.some((allowed_url) =>
            tab.url.includes(allowed_url)
          ) ||
          override_foolslide_list.some((allowed_url) =>
            tab.url.includes(allowed_url)
          )
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
  } else if (
    tachiyomi_foolslide_list.some((allowed_url) =>
      tab.url.includes(allowed_url)
    ) ||
    override_foolslide_list.some((allowed_url) => tab.url.includes(allowed_url))
  ) {
    ctx.tabs.executeScript({
      code: `
        window.location.href = "${FS_URL}" + "/" + document.location.href;
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
