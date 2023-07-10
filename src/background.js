/**
 * This file is part of open-in-mpv.
 *
 * Copyright 2020 Andrew Udvare
 * Copyright 2023 movrsi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const contextMenuName = browser.i18n.getMessage("open-in-mpv");
const response = browser.i18n.getMessage("response");
const error = browser.i18n.getMessage("error");

browser.menus.create({
  id: "mpv",
  type: "normal",
  title: contextMenuName,
  contexts: ['audio', 'link', 'page', 'video'],
  icons: {
    "16": "icons/icon-16.png",
  }
});

browser.menus.create({
  id: "mpv-bookmark",
  type: "normal",
  title: contextMenuName,
  contexts: ['bookmark'],
  icons: {
    "16": "icons/icon-16.png",
  }
});

browser.menus.onClicked.addListener((info) => {
  const hyperlink = info.linkUrl || info.srcUrl || info.pageUrl;
  
  switch (info.menuItemId) {
    case "mpv":    
    case "mpv-bookmark":
      if (typeof hyperlink === 'undefined') {
        console.error(`${error} Context menu failed to retrieve the hyperlink.`);
        return;
      }
      
      browser.storage.local.get(['debug', 'singleUse']).then((settings) => {
        browser.runtime.sendNativeMessage("open-in-mpv", {
          debug: settings.debug === 'true',
          single: settings.singleUse === 'true',
          url: hyperlink
        }).then((res) => {
          console.log(`${response} ${res}`);
        }, (e) => {
          console.error(`${error} ${e}`);
        });
      }, (e) => {
        console.error(`${error} ${e}`);
      });
      break;
  }
});