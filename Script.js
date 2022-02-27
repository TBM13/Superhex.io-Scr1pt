// ==UserScript==
// @name         Superhex.io Scr1pt - Zoom Hack and more
// @namespace    Superhex.io Scr1pt
// @version      1.9.2
// @license      MIT
// @homepageURL  https://github.com/TBM13/Superhex.io-Scr1pt
// @icon         http://superhex.io/img/fav_icon_1.png
// @description  Mod for Superhex.io
// @author       TBM13
// @match        *://superhex.io/*
// @match        www.superhex.io/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

var style = document.createElement("style"),
    AdsTBM = localStorage.getItem("AdsTBM"), currSkin = localStorage.getItem("selectedSkin"), currQuality = localStorage.getItem("quality"), zoomHack = localStorage.getItem("zoomTBM"), zoomValue = localStorage.getItem("zoomValTBM"),
    superhex = window.superhex,
    stopRemoveAdsService = false,
    math_max_o = Math.max;

style.innerHTML = '.scr1ptPanel {background:rgba(0,60,0,0.5); border-style: solid; border-width: 3px; border-color: rgb(60,185,60,0.5); border-radius: 5px;} .scr1ptButton {line-height: 1; outline: none; color: white; background-color: #5CB85C; border-radius: 4px; border-width: 0px; transition: 0.2s;} .scr1ptButton:hover {background-color: #5ed15e; cursor: pointer;} .scr1ptButton:active {background-color: #4e9c4e;} .scr1ptButton.unselected {opacity: 0.5;} .scr1ptButton .spinner {display: none; vertical-align: middle;} .scr1ptButton.button-loading {background-color: #7D7D7D; color: white;} .scr1ptButton.button-loading .spinner {display: inline-block;} .scr1ptButton-grey {color: black; background-color: #f5f5f5;} .scr1ptButton-grey:hover {background-color: white; color: #5e5e5e;} .scr1ptButton-grey:active {background-color: #cccccc; color: #5e5e5e;} .scr1ptButton-gold {background-color: #c9c818;} .scr1ptButton-gold:hover {background-color: #d9d71a;} .scr1ptButton-gold:active {background-color: #aba913;}';
document.getElementsByTagName("head")[0].appendChild(style);

function init() {
    createGui();

    if (AdsTBM) removeAdsService();
    changeQuality(currQuality == null ? 0.75 : currQuality);
    window.zoomValue = zoomValue ? Number(zoomValue) : 13;
    if (zoomHack == "True") zoomH(false);

    let highQB = document.getElementById("button-quality-high");
    let mediumQB = document.getElementById("button-quality-medium");
    let lowQB = document.getElementById("button-quality-low");

    highQB.onclick = () => changeQuality(1);
    highQB.setAttribute("class", highQB.className == "green" ? "scr1ptButton" : "scr1ptButton unselected");
    mediumQB.onclick = () => changeQuality(0.75);
    mediumQB.setAttribute("class", mediumQB.className == "green" ? "scr1ptButton" : "scr1ptButton unselected");
    lowQB.onclick = () => changeQuality(0.5);
    lowQB.setAttribute("class", lowQB.className == "green" ? "scr1ptButton" : "scr1ptButton unselected");
}

function changeQuality(qualityValue) {
    superhex.setQuality(qualityValue);
    currQuality = localStorage.getItem("quality");
    document.getElementById("btn2").innerText = "Custom Quality";
    if (currQuality != 1 && currQuality != 0.75 && currQuality != 0.5) {
        document.getElementById("btn2").setAttribute("class", "scr1ptButton");
        document.getElementById("btn2").innerText += " (" + currQuality.toString() + ")";
    } else {
        document.getElementById("btn2").setAttribute("class", "scr1ptButton unselected");
    }
}

function toggleRemoveAds(restoreAds) {
    stopRemoveAdsService = restoreAds;

    if (restoreAds) {
        localStorage.removeItem("AdsTBM");
        return;
    }
    
    localStorage.setItem("AdsTBM", true);
    removeAdsService();
}

function removeAdsService(timeout = 50) {
    if (document.getElementById("TKS_superhex-io_300x250").innerHTML != "")
    {
        console.log("Removing ads");
        superhex.clickPlay = superhex.aipComplete;
        superhex.clickPlayAgain = superhex.aipComplete;
        removeAdElement(document.getElementById("TKS_superhex-io_300x250"));
        removeAdElement(document.getElementById("respawn-ad"));
        removeAdElement(document.getElementsByClassName("curse-ad")[0]);

        timeout = 50;
    }

    console.log(timeout);
    if (timeout < 1000) timeout += 50;

    if (!stopRemoveAdsService) setTimeout(() => removeAdsService(timeout), timeout);
}

function removeAdElement(elem) {
    elem.innerHTML = "";
    elem.setAttribute("style", "display: none;");
}

var originalKeyup = document.onkeyup;
document.onkeyup = (e) => {
    if (originalKeyup) originalKeyup(e);

    try {
        e = e || window.event;
        var key = e.which || e.keyCode;
        if (key === 49 && document.getElementById("leaderboard").getAttribute("style") != null || key === 97 && document.getElementById("leaderboard").getAttribute("style") != null)
        {
            document.getElementById("leaderboard").setAttribute("style", "display: " + (document.getElementById("leaderboard").getAttribute("style") == "display: block;" ? "none;" : "block;"));
        }
        if (key === 48 && document.getElementById("leaderboard").getAttribute("style") != null || key === 96 && document.getElementById("leaderboard").getAttribute("style") != null) {
            if (document.getElementById("leaderboard").getAttribute("style") == "display: block;") document.getElementById("leaderboard").setAttribute("style", "display: none;");
            if (document.getElementById("minimap").getAttribute("style") == "display: block;") document.getElementById("minimap").setAttribute("style", "display: none;");
            if (document.getElementById("friendsScores").getAttribute("style") == "display: block;") document.getElementById("friendsScores").setAttribute("style", "display: none;");
            if (document.getElementById("score").getAttribute("style") == "display: block;") document.getElementById("score").setAttribute("style", "display: none;"); else {
                document.getElementById("score").setAttribute("style", "display: block;");
                document.getElementById("minimap").setAttribute("style", "display: block;");
                document.getElementById("leaderboard").setAttribute("style", "display: block;");
                if (window.location.hash.length > 5 && window.location.hash.length < 8) document.getElementById("friendsScores").setAttribute("style", "display: block;");
            }
        }
        if (key === 50 || key === 98) document.getElementById("fps").setAttribute("style", "display: " + (document.getElementById("fps").getAttribute("style") == "display: block; color: white;" ? "none;" : "block; color: white;"));
    } catch (err) {
        console.error("Superhex.io Scr1pt onKeyUp Error: " + err);
    }
};

function changeQ() {
    var QualityPrompt = Number(window.prompt("Insert value. Example:\n0.25: Very low\n0.5: Low\n0.75: Medium\n1: High\n1.5: Very high\n2: Ultra"));
    if (QualityPrompt > 2.7) alert("WARNING: Values higher than 2.7 can cause problems.");
    if (QualityPrompt < 0.1 && QualityPrompt > 0) alert("WARNING: Values lower than 0.1 can cause problems.");
    if (QualityPrompt.toString() == "NaN") alert("Invalid value. Make sure to only use numbers.\nExample: 1.2"); else {
        if (QualityPrompt === 0) return;
        changeQuality(QualityPrompt);
        alert("Quality changed to: " + QualityPrompt);
    }
}

function unlockSK() {
    if (localStorage.getItem("shareClicked") && localStorage.getItem("subscribeClicked") && localStorage.getItem("likeClicked") && localStorage.getItem("tweetClicked") && localStorage.getItem("followClicked")) alert("You already unlocked the skins."); else {
        var ChickenS = true, TweetS = true, CowS = true, RedBirdS = true, ElephantS = true;
        if (localStorage.getItem("followClicked")) ChickenS = false;
        if (localStorage.getItem("tweetClicked")) TweetS = false;
        if (localStorage.getItem("likeClicked")) CowS = false;
        if (localStorage.getItem("subscribeClicked")) RedBirdS = false;
        if (localStorage.getItem("shareClicked")) ElephantS = false;
        localStorage.setItem("shareClicked", 1);
        localStorage.setItem("subscribeClicked", 1);
        localStorage.setItem("likeClicked", 1);
        localStorage.setItem("tweetClicked", 1);
        localStorage.setItem("followClicked", 1);
        superhex.nextSkins();
        superhex.previousSkins();
        var msg = "The following skins were unlocked:";
        if (ChickenS) msg += "\nYellow chicken";
        if (TweetS) msg += "\nLight blue bird";
        if (CowS) msg += "\nCow";
        if (RedBirdS) msg += "\nRed bird";
        if (ElephantS) msg += "\nElephant";
        alert(msg);
    }
}

function zoomH(message) {
    if (zoomHack == "True" && message) {
        localStorage.removeItem("zoomTBM");
        Math.max = math_max_o;
    } else {
        Math.max = function (a, b) {
            return a == window.innerWidth / 40 / 2 / .75 && b == window.innerHeight / 40 / Math.sqrt(3) ? window.zoomValue : math_max_o(a, b);
        };
        if (message) localStorage.setItem("zoomTBM", "True");
        document.onmousewheel = function(e) {
            var delta;
            if (!e) e = window.event;
            if (e.wheelDelta) delta = e.wheelDelta / 60; else if (e.detail) delta = -e.detail / 2;

            var oldValue = window.zoomValue;
            if (delta !== null && delta > 0) {
               if (window.zoomValue < 60) window.zoomValue += window.zoomValue < 16 ? 1 : 2;
            } else {
               if (window.zoomValue > 5) window.zoomValue -= window.zoomValue < 16 ? 1 : 2;
            }

            if (oldValue != window.zoomValue) {
                window.dispatchEvent(new Event('resize'));
                localStorage.setItem("zoomValTBM", window.zoomValue);
            }
        };
    }
    zoomHack = localStorage.getItem("zoomTBM");
}

function setZoomH() {
    var zoomHPrompt = window.prompt("Insert zoom value.\nBy default is 13 (higher value = more zoom)\nNote: You can also use the mouse wheel to zoom in/out.");
    if (zoomHPrompt !== null && zoomHPrompt.length != 0) {
        zoomHPrompt = Number(zoomHPrompt);
        if (zoomHPrompt > 60) alert("Value can't be greater than 60."); else if (zoomHPrompt < 5) alert("Value can't be less than 5."); else if (zoomHPrompt.toString() == "NaN") alert("Invalid value. Make sure to only use numbers."); else {
            window.zoomValue = zoomHPrompt;
            localStorage.setItem("zoomValTBM", zoomHPrompt);
        }
    }
}

class ModPanel {
    constructor(parent) {
        let mainPanel = document.createElement("div");

        parent.appendChild(mainPanel);
        this.mainPanel = mainPanel;
        this.leftMargin = null;
    }

    createButton(text) {
        let btn = document.createElement("button");
        btn.innerText = text;
        btn.style.height = "6%";
        btn.style.width = "95%";
        btn.style.marginTop = "5%";

        this.mainPanel.appendChild(btn);

        if (this.leftMargin === null) {
            let left = btn.clientWidth * 5 / 100;
            left /= 2;
            this.leftMargin = left + "px";
        }

        btn.style.marginLeft = this.leftMargin;

        return btn;
    }

    createCheckbox(text) {
        let label = document.createElement("label");
        label.innerText = text;
        label.style.color = "white";
        label.style.display = "inline-block";
        label.style.marginTop = "5%";
        label.style.fontSize = "13px";
        label.style.fontWeight = "bold";

        let check = document.createElement("input");
        check.type = "checkbox";
        check.style.position = "relative";

        this.mainPanel.appendChild(label);
        label.appendChild(check);
        
        check.style.left = "-" + (label.clientWidth) + "px";
        label.style.marginLeft = (check.clientWidth + 10) + "px";

        return [check, label];
    }
}

function createGui() {
    let homepage = document.getElementById("homepage");

    let panel = new ModPanel(homepage);
    let mainPanel = panel.mainPanel;

    mainPanel.className = "scr1ptPanel";
    mainPanel.style.position = "fixed";
    mainPanel.style.top = "12%";
    mainPanel.style.left = "-4px";
    mainPanel.style.width = "20%";
    mainPanel.style.maxWidth = "200px";
    mainPanel.style.height = "60%";

    let title = document.createElement("h3");
    title.style.color = "white";
    title.style.position = "fixed";
    title.style.top = "6%";
    title.style.left = "5px";
    title.innerText = "Superhex.io Scr1pt";
    homepage.appendChild(title);

    let githubButton = panel.createButton("GitHub");
    githubButton.className = "scr1ptButton scr1ptButton-gold";
    githubButton.onclick = () => window.open("https://github.com/TBM13/Superhex.io-Scr1pt");

    let greasyForkButton = panel.createButton("Greasy Fork");
    greasyForkButton.className = "scr1ptButton scr1ptButton-gold";
    greasyForkButton.onclick = () => window.open("https://greasyfork.org/es/scripts/36071-superhex-io-scr1pt");

    let unlockSkinsButton = panel.createButton("Unlock skins");
    unlockSkinsButton.className = "scr1ptButton";
    unlockSkinsButton.onclick = () => unlockSK();

    let customQualityButton = document.createElement("Button");
    customQualityButton.setAttribute("class", "scr1ptButton unselected");
    customQualityButton.setAttribute("type", "button");
    customQualityButton.setAttribute("id", "btn2");
    customQualityButton.innerText = "Custom Quality";
    customQualityButton.onclick = () => changeQ();
    document.getElementById("button-quality-high").parentElement.appendChild(customQualityButton);

    let versionText = document.createElement("h5");
    versionText.setAttribute("style", "color: rgba(255,255,255,0.6); position: absolute; bottom: -20px; right: 5px;");
    versionText.innerText = "v1.9.2";
    mainPanel.appendChild(versionText);

    let removeAdsCheckbox = panel.createCheckbox("Remove ads")[0]
    removeAdsCheckbox.onclick = () => toggleRemoveAds(!removeAdsCheckbox.checked);
    removeAdsCheckbox.checked = AdsTBM;

    let zoomHackCheckbox = panel.createCheckbox("Zoom Hack")[0];
    zoomHackCheckbox.onclick = () => zoomH(true);
    zoomHackCheckbox.checked = zoomHack == "True";

    let btnZHS = document.createElement("Button");
    btnZHS.setAttribute("style", "position: absolute; top: 286px; left: 130px; height: 16px; width: 16px;");
    btnZHS.setAttribute("class", "scr1ptButton");
    btnZHS.innerHTML = "<img src='https://lh3.googleusercontent.com/Abm4DjvPOP55GK2MCe9gYh8M1ZJa7ws71oXcW2q6Rl1pQXIQ_bUcVxbN5vZ8_6pmP248O-uQEN2fUxq-xzFlzefdXyEBakvzEgGKzIwSkcdSBHdM2PwtgpgXbMvbP_N7FSI4BYIujg=s16-no' style='position: absolute; left: 0px; top: 0px;'/>";
    btnZHS.setAttribute("type", "button");
    btnZHS.setAttribute("id", "btnZHS");
    btnZHS.onclick = () => setZoomH();
    mainPanel.appendChild(btnZHS);

    let hotkeysPanel = document.createElement("Div");
    hotkeysPanel.setAttribute("style", "position: fixed; bottom: -4px; right: -4px; height:150px; width:300px;");
    hotkeysPanel.setAttribute("class", "scr1ptPanel");
    hotkeysPanel.setAttribute("id", "scr1ptPanel2");
    document.getElementById("homepage").appendChild(hotkeysPanel);

    let scrText2 = document.createElement("h4");
    scrText2.setAttribute("style", "color: white; position: relative; left: 10px;");
    scrText2.setAttribute("id", "scrText2");
    scrText2.innerText = "Hotkeys:\n\n1 = Hide/show Leaderboard.\n0 = Hide/show UI.\n2 = Hide/show FPS and connection info.";
    hotkeysPanel.appendChild(scrText2);
}

init();