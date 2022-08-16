// ==UserScript==
// @name         Add Download Button to Images
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds download button to images when cursor moved on an image.
// @author       midnightBlueNebula
// @match        https://*/*
// @icon         https://iconarchive.com/download/i99352/dtafalonso/android-lollipop/Downloads.ico
// ==/UserScript==

(function() {
    'use strict';

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "-1000px";
    document.body.appendChild(canvas);
    const context = canvas.getContext("2d");

    const downloader = document.createElement("a");
    downloader.href = "";
    downloader.download = "";
    downloader.style.position = "absolute";
    downloader.style.left = "0px";
    downloader.style.top = "-1000px";
    downloader.style.zIndex = "10000000";
    downloader.style.color = "white";
    downloader.style.backgroundColor = "black";
    downloader.style.textAlign = "center";
    downloader.innerText = "Download";
    document.body.insertBefore(downloader, document.body.firstChild);

    function showDownloader(event){
        if(event.target == downloader) { return; }
        if(event.target.tagName.toLowerCase() != "img") { hideDownloader(); return; }

        const imgRect = event.target.getBoundingClientRect();
        const image = new Image();

        image.crossOrigin = "anonymous";
        image.src = event.target.src;
        image.onload = function(){
            context.canvas.width = imgRect.width;
            context.canvas.height = imgRect.height;
            context.drawImage(image, 0, 0, imgRect.width, imgRect.height);

            var imageSrc = canvas.toDataURL("image/jpeg");

            downloader.style.left = imgRect.x + "px";
            downloader.style.top = imgRect.y + window.scrollY + "px";
            downloader.style.width = imgRect.width + "px";
            downloader.style.fontSize = "1em";
            downloader.download = event.target.title ? event.target.title + " - " + new Date() : new Date();
            downloader.href = imageSrc;
        }
    }

    function hideDownloader(){
        downloader.style.left = "0px";
        downloader.style.top = "-1000px";
    }

    document.addEventListener("mouseover", showDownloader);
})();
