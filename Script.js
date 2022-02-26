// ==UserScript==
// @name         Superhex.io Scr1pt - Zoom Hack and more
// @namespace    Superhex.io Scr1pt
// @version      1.9.2
// @license      MIT
// @homepageURL  https://github.com/TBM13/Superhex.io-Scr1pt
// @icon         http://superhex.io/img/fav_icon_1.png
// @description  Mod for Superhex.io
// @description:es-ES Mod para Superhex.io
// @author       TBM13
// @match        *://superhex.io/*
// @match        www.superhex.io/*
// @grant        none

// ==/UserScript==

var style = document.createElement("style"),
    AdsTBM = localStorage.getItem("AdsTBM"), currSkin = localStorage.getItem("selectedSkin"), currQuality = localStorage.getItem("quality"), zoomHack = localStorage.getItem("zoomTBM"), zoomValue = localStorage.getItem("zoomValTBM"),
    skinPag = 1,
    superhex = window.superhex,
    adsDeleted = false,
    highQB, mediumQB, lowQB, playBtn, playAgBtn, mMenuBtn, math_max_o = Math.max;

style.innerHTML = '.scr1ptPanel {background:rgba(0,60,0,0.5); border-style: solid; border-width: 3px; border-color: rgb(60,185,60,0.5); border-radius: 5px;} .scr1ptButton {line-height: 1; outline: none; color: white; background-color: #5CB85C; border-radius: 4px; border-width: 0px; transition: 0.2s;} .scr1ptButton:hover {background-color: #5ed15e; cursor: pointer;} .scr1ptButton:active {background-color: #4e9c4e;} .scr1ptButton.unselected {opacity: 0.5;} .scr1ptButton .spinner {display: none; vertical-align: middle;} .scr1ptButton.button-loading {background-color: #7D7D7D; color: white;} .scr1ptButton.button-loading .spinner {display: inline-block;} .scr1ptButton-grey {color: black; background-color: #f5f5f5;} .scr1ptButton-grey:hover {background-color: white; color: #5e5e5e;} .scr1ptButton-grey:active {background-color: #cccccc; color: #5e5e5e;} .scr1ptButton-gold {background-color: #c9c818;} .scr1ptButton-gold:hover {background-color: #d9d71a;} .scr1ptButton-gold:active {background-color: #aba913;}';
document.getElementsByTagName("head")[0].appendChild(style);

var originalLoad = window.onload;
window.onload = function () {
    if (originalLoad) originalLoad();
    window.mkGui();
    var skinRightArrow = document.getElementById("skin-right-arrow"),
        skinLeftArrow = document.getElementById("skin-left-arrow");
    skinRightArrow.setAttribute("onclick", "skinChangePage(true, 1)");
    skinLeftArrow.setAttribute("onclick", "skinChangePage(false, 1)");
    playBtn = document.getElementById("button-play");
    playAgBtn = document.getElementById("button-play-again");
    mMenuBtn = document.getElementById("button-main-menu");
    highQB = document.getElementById("button-quality-high");
    mediumQB = document.getElementById("button-quality-medium");
    lowQB = document.getElementById("button-quality-low");
    if (AdsTBM) window.removeAds(false);
    window.changeQuality(currQuality == null ? 0.75 : currQuality);
    window.zoomValue = zoomValue ? Number(zoomValue) : 13;
    if (zoomHack == "True") window.zoomH(false);
    if (playBtn.className == "green") playBtn.setAttribute("class", "scr1ptButton");
    if (playAgBtn.className == "playagain green") playAgBtn.setAttribute("class", "playagain scr1ptButton");
    if (mMenuBtn.className == "mainmenu grey") mMenuBtn.setAttribute("class", "mainmenu scr1ptButton scr1ptButton-grey");
    highQB.setAttribute("onclick", "changeQuality(1);");
    highQB.setAttribute("class", highQB.className == "green" ? "scr1ptButton" : "scr1ptButton unselected");
    mediumQB.setAttribute("onclick", "changeQuality(0.75);");
    mediumQB.setAttribute("class", mediumQB.className == "green" ? "scr1ptButton" : "scr1ptButton unselected");
    lowQB.setAttribute("onclick", "changeQuality(0.5);");
    lowQB.setAttribute("class", lowQB.className == "green" ? "scr1ptButton" : "scr1ptButton unselected");
};

window.skinChangePage = function (next, cantidad) {
    if (!next) {
        if (cantidad >= 1) superhex.previousSkins();
        if (cantidad >= 2) superhex.previousSkins();
        if (cantidad >= 3) superhex.previousSkins();
        skinPag -= cantidad;
    } else {
        if (cantidad >= 1) superhex.nextSkins();
        if (cantidad >= 2) superhex.nextSkins();
        if (cantidad >= 3) superhex.nextSkins();
        skinPag += cantidad;
    }
};

window.changeSkin = function (ID) {
    currSkin = Number(localStorage.getItem("selectedSkin"));
    if (currSkin != ID) {
        if (ID <= 3) {
            if (skinPag == 2) window.skinChangePage(false, 1); else if (skinPag == 3) window.skinChangePage(false, 2);
        } else if (ID <= 7) {
            if (skinPag == 1) window.skinChangePage(true, 1); else if (skinPag == 3) window.skinChangePage(false, 1);
        } else if (ID <= 9) {
            if (skinPag == 2) window.skinChangePage(true, 1); else if (skinPag == 1) window.skinChangePage(true, 2);
        } else {
            alert("The skin doesn't exist.");
            return;
        }
        superhex.selectSkin(ID);
        currSkin = ID;
        alert("Skin changed.");
    } else alert("You are already using the skin");
};

window.changeQuality = function (qualityValue) {
    superhex.setQuality(qualityValue);
    currQuality = localStorage.getItem("quality");
    document.getElementById("btn2").innerText = "Custom Quality";
    if (currQuality != 1 && currQuality != 0.75 && currQuality != 0.5) {
        document.getElementById("btn2").setAttribute("class", "scr1ptButton");
        document.getElementById("btn2").innerText += " (" + currQuality.toString() + ")";
    } else document.getElementById("btn2").setAttribute("class", "scr1ptButton unselected");
};

window.removeAds = function (checkBox) {
    if (checkBox) {
        if (!document.getElementById("checkAdBlock").checked) { //Restore Ads
            localStorage.removeItem("AdsTBM");
            adsDeleted = true;
            alert("Ads restored. Reload the website to apply the changes.");
        } else {
            localStorage.setItem("AdsTBM", true);
            if (!adsDeleted) window.rAds();
        }
    } else setTimeout(function () { window.rAds(); }, 400);
};

window.rAds = function () {
    superhex.clickPlay = superhex.aipComplete;
    superhex.clickPlayAgain = superhex.aipComplete;
    window.removeAdElement(document.getElementById("TKS_superhex-io_300x250"));
    window.removeAdElement(document.getElementById("respawn-ad"));
    window.removeAdElement(document.getElementsByClassName("curse-ad")[0]);
};

window.removeAdElement = function (elem) {
    elem.innerHTML = "";
    elem.setAttribute("style", "display: none;");
};

var originalKeyup = document.onkeyup;
document.onkeyup = function (e) {
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

window.goGitHub = function () { window.open("https://github.com/TBM13/Superhex.io-Scr1pt"); };

window.goGreasyFork = function () { window.open("https://greasyfork.org/es/scripts/36071-superhex-io-scr1pt"); };

window.changeQ = function () {
    var QualityPrompt = Number(window.prompt("Insert value. Example:\n0.25: Very low\n0.5: Low\n0.75: Medium\n1: High\n1.5: Very high\n2: Ultra"));
    if (QualityPrompt > 2.7) alert("WARNING: Values higher than 2.7 can cause problems.");
    if (QualityPrompt < 0.1 && QualityPrompt > 0) alert("WARNING: Values lower than 0.1 can cause problems.");
    if (QualityPrompt.toString() == "NaN") alert("Invalid value. Make sure to only use numbers.\nExample: 1.2"); else {
        if (QualityPrompt === 0) return;
        window.changeQuality(QualityPrompt);
        alert("Quality changed to: " + QualityPrompt);
    }
};

window.changeS = function () {
    var SkinPrompt = Number(window.prompt("Skin ID:"));
    if (SkinPrompt == 0) return;
    SkinPrompt--;
    superhex.nextSkins();
    superhex.previousSkins();
    var ChickenS2, TweetS2, CowS2, RedBirdS2, ElephantS2;
    if (localStorage.getItem("followClicked")) ChickenS2 = true;
    if (localStorage.getItem("tweetClicked")) TweetS2 = true;
    if (localStorage.getItem("likeClicked")) CowS2 = true;
    if (localStorage.getItem("subscribeClicked")) RedBirdS2 = true;
    if (localStorage.getItem("shareClicked")) ElephantS2 = true;
    if (SkinPrompt.toString() == "NaN") alert("Invalid ID. Make sure to only use numbers."); else if (SkinPrompt => 0) {
        if (SkinPrompt == 0) {
            if (!ChickenS2) localStorage.setItem("followClicked", 1);
            window.changeSkin(0);
            if (!ChickenS2) localStorage.removeItem("followClicked");
        } else if (SkinPrompt == 1) {
            if (!TweetS2) localStorage.setItem("tweetClicked", 1);
            window.changeSkin(SkinPrompt);
            if (!TweetS2) localStorage.removeItem("tweetClicked");
        } else if (SkinPrompt == 2) {
            if (!CowS2) localStorage.setItem("likeClicked", 1);
            window.changeSkin(SkinPrompt);
            if (!CowS2) localStorage.removeItem("likeClicked");
        } else if (SkinPrompt == 3) {
            if (!RedBirdS2) localStorage.setItem("subscribeClicked", 1);
            window.changeSkin(SkinPrompt);
            if (!RedBirdS2) localStorage.removeItem("subscribeClicked");
        } else if (SkinPrompt == 4) {
            if (!ElephantS2) localStorage.setItem("shareClicked", 1);
            window.changeSkin(SkinPrompt);
            if (!ElephantS2) localStorage.removeItem("shareClicked");
        } else {
            try {
                window.changeSkin(SkinPrompt);
            } catch (err) {
                console.error("Superhex.io Scr1pt - Change skin by ID Error (changeS()): " + err);
                alert("An error has occurred. Make sure to insert a valid ID.");
            }
        }
    }
};

window.unlockSK = function () {
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
};

window.mkParty = function () {
    var partyPrompt = window.prompt("Party ID:");
    if (partyPrompt !== null && partyPrompt.length != 0) {
        if (partyPrompt.length < 5) alert("The party ID must have more than 5 characters."); else if (partyPrompt.length > 6) alert("The party ID must have less than 6 characters."); else {
            document.getElementById("create-party").style.display = "none";
            document.getElementById("in-party").style.display = "block";
            window.location.hash = partyPrompt;
            document.getElementById("party-share-link").value = "http://" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname + "#" + partyPrompt;
        }
    }
};

window.zoomH = function (message) {
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
};

window.setZoomH = function () {
    var zoomHPrompt = window.prompt("Insert zoom value.\nBy default is 13 (higher value = more zoom)\nNote: You can also use the mouse wheel to zoom in/out.");
    if (zoomHPrompt !== null && zoomHPrompt.length != 0) {
        zoomHPrompt = Number(zoomHPrompt);
        if (zoomHPrompt > 60) alert("Value can't be greater than 60."); else if (zoomHPrompt < 5) alert("Value can't be less than 5."); else if (zoomHPrompt.toString() == "NaN") alert("Invalid value. Make sure to only use numbers."); else {
            window.zoomValue = zoomHPrompt;
            localStorage.setItem("zoomValTBM", zoomHPrompt);
        }
    }
};

var scrText1 = document.createElement("h2");
scrText1.setAttribute("style", "color: white; position: fixed; top: 70px; left: 5px;");
scrText1.innerText = "Loading Superhex.io Scr1pt...";
document.getElementById("homepage").appendChild(scrText1);

var scrTextInfo = document.createElement("h4");
scrTextInfo.setAttribute("style", "color: white; position: fixed; top: 120px; left: 5px;");
scrTextInfo.innerText = "If the script doesn't load, refresh the website (F5).";
document.getElementById("homepage").appendChild(scrTextInfo);

window.mkGui = function() {
    scrTextInfo.remove();
    scrText1.innerText = "Superhex.io Scr1pt";

    var mainPanel = document.createElement("Div");
    mainPanel.setAttribute("style", "position: fixed; top: 130px; left: -4px; height:350px; width:170px;");
    mainPanel.setAttribute("class", "scr1ptPanel");
    mainPanel.setAttribute("id", "scr1ptPanel");
    document.getElementById("homepage").appendChild(mainPanel);

    var btn = document.createElement("Button");
    btn.setAttribute("style", "position: relative; top: 10px; left: 15px; height: 25px; width: 140px;");
    btn.setAttribute("class", "scr1ptButton scr1ptButton-gold");
    btn.setAttribute("type", "button");
    btn.setAttribute("id", "btn");
    btn.innerText = "GitHub";
    btn.setAttribute("onclick", "goGitHub();");
    mainPanel.appendChild(btn);

    var btn2 = document.createElement("Button");
    btn2.setAttribute("class", "scr1ptButton unselected");
    btn2.setAttribute("type", "button");
    btn2.setAttribute("id", "btn2");
    btn2.innerText = "Custom Quality";
    btn2.setAttribute("onclick", "changeQ();");
    document.getElementById("button-quality-high").parentElement.appendChild(btn2);

    var btnGF = document.createElement("Button");
    btnGF.setAttribute("style", "position: relative; top: 20px; left: 15px; height: 25px; width: 140px;");
    btnGF.setAttribute("class", "scr1ptButton scr1ptButton-gold");
    btnGF.setAttribute("type", "button");
    btnGF.setAttribute("id", "btnGF");
    btnGF.innerText = "Greasy Fork";
    btnGF.setAttribute("onclick", "goGreasyFork();");
    mainPanel.appendChild(btnGF);

    var btn3 = document.createElement("Button");
    btn3.setAttribute("style", "position: relative; top: 30px; left: 15px; height: 25px; width: 140px;");
    btn3.setAttribute("class", "scr1ptButton");
    btn3.setAttribute("type", "button");
    btn3.setAttribute("id", "btn3");
    btn3.innerText = "Set Skin (ID)";
    btn3.setAttribute("onclick", "changeS();");
    mainPanel.appendChild(btn3);

    var btn6 = document.createElement("Button");
    btn6.setAttribute("style", "position: relative; top: 50px; left: 15px; height: 25px; width: 140px;");
    btn6.setAttribute("class", "scr1ptButton");
    btn6.setAttribute("type", "button");
    btn6.setAttribute("id", "btn6");
    btn6.innerText = "Unlock skins";
    btn6.setAttribute("onclick", "unlockSK();");
    mainPanel.appendChild(btn6);

    var btn8 = document.createElement("Button");
    btn8.setAttribute("style", "position: relative; top: 60px; left: 15px; height: 25px; width: 140px;");
    btn8.setAttribute("class", "scr1ptButton");
    btn8.setAttribute("type", "button");
    btn8.setAttribute("id", "btn8");
    btn8.innerText = "Create Party";
    btn8.setAttribute("onclick", "mkParty();");
    mainPanel.appendChild(btn8);

    var versionText = document.createElement("h5");
    scrTextInfo.setAttribute("style", "color: rgba(255,255,255,0.6); position: absolute; bottom: -20px; right: 5px;");
    scrTextInfo.innerText = "v1.9.2";
    mainPanel.appendChild(scrTextInfo);

    var Check1 = document.createElement("INPUT");
    Check1.setAttribute("type", "checkbox");
    Check1.setAttribute("id", "checkAdBlock");
    Check1.setAttribute("style", "position: absolute; top: 260px; left: 15px;");
    Check1.setAttribute("onclick", "removeAds(true);");
    mainPanel.appendChild(Check1);

    Check1.checked = AdsTBM;

    var check1Text = document.createElement("h5");
    check1Text.setAttribute("style", "color: white; position: absolute; top: 240px; left: 35px;");
    check1Text.setAttribute("id", "check1Text");
    check1Text.innerText = "Remove ads";
    mainPanel.appendChild(check1Text);

    var Check2 = document.createElement("INPUT");
    Check2.setAttribute("type", "checkbox");
    Check2.setAttribute("id", "checkZoom");
    Check2.setAttribute("style", "position: absolute; top: 285px; left: 15px;");
    Check2.setAttribute("onclick", "zoomH(true);");
    mainPanel.appendChild(Check2);

    Check2.checked = zoomHack == "True";

    var check2Text = document.createElement("h5");
    check2Text.setAttribute("style", "color: white; position: absolute; top: 265px; left: 35px;");
    check2Text.setAttribute("id", "check2Text");
    check2Text.innerText = "Zoom Hack";
    mainPanel.appendChild(check2Text);

    var btnZHS = document.createElement("Button");
    btnZHS.setAttribute("style", "position: absolute; top: 286px; left: 130px; height: 16px; width: 16px;");
    btnZHS.setAttribute("class", "scr1ptButton");
    btnZHS.innerHTML = "<img src='https://lh3.googleusercontent.com/Abm4DjvPOP55GK2MCe9gYh8M1ZJa7ws71oXcW2q6Rl1pQXIQ_bUcVxbN5vZ8_6pmP248O-uQEN2fUxq-xzFlzefdXyEBakvzEgGKzIwSkcdSBHdM2PwtgpgXbMvbP_N7FSI4BYIujg=s16-no' style='position: absolute; left: 0px; top: 0px;'/>";
    btnZHS.setAttribute("type", "button");
    btnZHS.setAttribute("id", "btnZHS");
    btnZHS.setAttribute("onclick", "setZoomH();");
    mainPanel.appendChild(btnZHS);

    var hotkeysPanel = document.createElement("Div");
    hotkeysPanel.setAttribute("style", "position: fixed; bottom: -4px; right: -4px; height:150px; width:300px;");
    hotkeysPanel.setAttribute("class", "scr1ptPanel");
    hotkeysPanel.setAttribute("id", "scr1ptPanel2");
    document.getElementById("homepage").appendChild(hotkeysPanel);

    var scrText2 = document.createElement("h4");
    scrText2.setAttribute("style", "color: white; position: relative; left: 10px;");
    scrText2.setAttribute("id", "scrText2");
    scrText2.innerText = "Hotkeys:\n\n1 = Hide/show Leaderboard.\n0 = Hide/show UI.\n2 = Hide/show FPS and connection info.";
    hotkeysPanel.appendChild(scrText2);
};
