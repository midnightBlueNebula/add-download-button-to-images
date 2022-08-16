// ==UserScript==
// @name         Add Download Button to Images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds download button to images when cursor moved on an image.
// @author       midnightBlueNebula
// @match        https://*/*
// @icon         https://iconarchive.com/download/i99352/dtafalonso/android-lollipop/Downloads.ico
// ==/UserScript==

(function() {
    'use strict';

    const downloader = document.createElement("a");
    downloader.href = "";
    downloader.download = "";
    downloader.style.position = "absolute";
    downloader.style.left = "0px";
    downloader.style.top = "-1000px";
    downloader.style.zIndex = "1000";
    downloader.style.color = "white";
    downloader.style.backgroundColor = "black";
    downloader.style.textAlign = "center";
    downloader.innerText = "Download";
    document.body.insertBefore(downloader, document.body.firstChild);

    function showDownloader(event){
        if(event.target == downloader) { return; }
        if(event.target.tagName.toLowerCase() != "img") { hideDownloader(); return; }

        const coords = event.target.getBoundingClientRect();
        downloader.style.left = coords.x + "px";
        downloader.style.top = coords.y + window.scrollY + "px";
        downloader.style.width = coords.width + "px";
        downloader.style.fontSize = "1em";
        downloader.download = event.target.title ? event.target.title + " - " + new Date() : new Date();
        downloader.href = event.target.src;
    }

    function hideDownloader(){
        downloader.style.left = "0px";
        downloader.style.top = "-1000px";
    }

    document.addEventListener("mouseover", showDownloader);
})();
