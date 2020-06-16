# Scrapes relevant data from the Tachiyomi Extension
# Google Sheets file in order to update a list of whitelisted
# FoolSlide URLs.

import json
import requests
from urllib import parse
from os import getenv


def scrape_urls():
    CONFIG_FILE_PATH = "credentials.json"
    SHEET_ID = "1TyJEUg78WWH4zgnf3g6M2lkbWpBWbd40FYiPVQhW8IU"
    SHEETS_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets"
    SHEET_RANGE = "A1:C1000"
    FOOLSLIDE_EXTENSION_NAME = "all.foolslide"

    api_key = None
    with open(CONFIG_FILE_PATH) as f:
        api_key = json.load(f).get("key")
        if api_key is None:
            raise Exception("Missing API key!")
        params = {"key": api_key}

        # First, let's get some data about the sheet overall to grab sheet names:
        sheet_name_request = requests.get(SHEETS_BASE_URL + "/" + SHEET_ID, params=params)
        if not sheet_name_request.ok:
            raise Exception("Failed to get sheet names.")
        sheet_names = [parse.quote_plus(sheet["properties"]["title"]) for sheet in sheet_name_request.json()["sheets"]]

        # Now get list of FS URLs
        fs_urls = set()
        for sheet_name in sheet_names:
            print("Grabbing entries from %s" % sheet_name)
            request = requests.get(
                SHEETS_BASE_URL + "/" + SHEET_ID + "/values/" + sheet_name + "!" + SHEET_RANGE, params=params
            )
            if request.ok:
                for entry in request.json()["values"]:
                    if len(entry) >= 3 and entry[0] == FOOLSLIDE_EXTENSION_NAME and entry[1] != "Customizable":
                        parse_result = parse.urlparse(entry[2])
                        url = parse_result.path if parse_result.netloc == "" else parse_result.netloc
                        if url.startswith("www."):
                            url = url[4:]
                        fs_urls.add('"' + url + '"')
            else:
                print("Failed to get entries from %s" % sheet_name)

        # print(fs_urls)
        fs_urls = list(fs_urls)
        fs_urls.sort()
        return fs_urls


def replace_urls(fs_urls):
    FOOLSLIDE_START = "%%FOOLSLIDE START%%"
    FOOLSLIDE_END = "%%FOOLSLIDE END%%"
    to_write_lines = []

    with open("../script.js") as script_file:
        lines = script_file.readlines()

        # First, let's delete anything that already exists...
        ignoring_text = False
        for line in lines:
            if ignoring_text:
                if FOOLSLIDE_END in line:
                    ignoring_text = False
                    to_write_lines.append(line)
            else:
                to_write_lines.append(line)
                if FOOLSLIDE_START in line:
                    ignoring_text = True
                    for url in fs_urls:
                        to_write_lines.append(url + ",\n")

    with open("../script.js", "w") as script_file:
        script_file.writelines(to_write_lines)


def main():
    fs_urls = scrape_urls()
    if fs_urls is not None:
        replace_urls(fs_urls)
    else:
        print("Found no URLs...")


if __name__ == "__main__":
    main()
