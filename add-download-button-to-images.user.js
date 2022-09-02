// ==UserScript==
// @name         Add Download Button to Images
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds download button to images when cursor moved on an image.
// @author       midnightBlueNebula
// @match        https://*/*
// @icon         https://iconarchive.com/download/i99352/dtafalonso/android-lollipop/Downloads.ico
// @grant        GM_registerMenuCommand
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

    function hasSameOrigin(sourceUrl){
        return (new URL(window.location.href).origin == new URL(sourceUrl).origin);
    }

    function showDownloader(event){
        if(event.target == downloader) { return; }
        if(event.target.tagName.toLowerCase() != "img") { hideDownloader(); return; }

        const imgRect = event.target.getBoundingClientRect();
        if(imgRect.height < 100) { return; } // prevents adding button to icons.

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = event.target.src;
        image.onload = function(){
            let imageSrc;
            if(hasSameOrigin(image.src)){
              imageSrc = image.src;
            } else {
                context.canvas.width = imgRect.width;
                context.canvas.height = imgRect.height;
                context.drawImage(image, 0, 0, imgRect.width, imgRect.height);

                imageSrc = canvas.toDataURL("image/jpeg");
            }


            downloader.style.left = imgRect.x + window.scrollX + "px";
            downloader.style.top = imgRect.y + imgRect.height/2 - downloader.getBoundingClientRect().height/2 + window.scrollY + "px";
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

    const downloadMemory = {};
    function notDownloadedYet(href){
      return !downloadMemory[href];
    }

    const images = document.querySelectorAll("img");
    function downloadAllImages(_images = images, index = 0){
        if(!images[index]) { return; }

        const currentImg = images[index];
        const image = new Image();
        image.crossOrigin = "anonymous";

        try {
            image.src = currentImg.parentElement.tagName == "A" && currentImg.parentElement.href ? currentImg.parentElement.href : currentImg.src;
            image.onload = function(){
                document.body.appendChild(image);
                const imgRect = image.getBoundingClientRect();
                context.canvas.width = imgRect.width;
                context.canvas.height = imgRect.height;
                context.drawImage(image, 0, 0, imgRect.width, imgRect.height);

                downloader.href = canvas.toDataURL("image/jpeg");
                console.log(image)
                if(notDownloadedYet() && downloader.href.length/1000 >= 10){
                    downloader.click();
                    downloadMemory[downloader.href] = true;
                }
                document.body.removeChild(image);
                downloadAllImages(_images, ++index);
            }
            image.onerror = function(){
                downloadAllImages(_images, ++index);
            }
        } catch {
            downloadAllImages(_images, ++index);
        }
    }


    var time;
    var key;
    window.addEventListener("keydown", (event) => {
        const t = new Date();
        if((event.key == "1" && key == "2") || (event.key == "2" && key == "1")){
            if(time){
                if(t - time < 30){
                    downloadAllImages();
                }
            }
        }
        key = event.key;
        time = t;
    })

    GM_registerMenuCommand("download all images from this website", downloadAllImages, "q");
    document.addEventListener("mouseover", showDownloader);
})();
