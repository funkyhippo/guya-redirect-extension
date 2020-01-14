# Installation

Change `BASE_URL` to the URL for the proxy, and the routes for `MD_PROXY` and `NH_PROXY` (these probably don't need to change). For example, if an MD listing is `https://example.com/read/md_proxy/{series_id}/`, then:

```javascript
const BASE_URL = "https://example.com/read/";
```

Next, go to your Chrome [extensions](chrome://extensions) page and enable developer mode (at the top right). That should reveal three new options, `Load unpacked`, `Pack extension`, and `Update`.


Select `Load unpacked`, and select the folder for this repo. You should see a Guya icon.

It's probably also useful to enable `Allow in incognito` in the extensions detail page. For, yanno.
