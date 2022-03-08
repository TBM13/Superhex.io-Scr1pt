// ==UserScript==
// @name         Superhex.io Scr1pt - Zoom Hack and more
// @namespace    Superhex.io Scr1pt
// @version      2.0.0
// @license      MIT
// @homepageURL  https://github.com/TBM13/Superhex.io-Scr1pt
// @icon         http://superhex.io/img/fav_icon_1.png
// @description  Mod for Superhex.io
// @author       TBM13
// @match        *://superhex.io/*
// @match        www.superhex.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

class ModPanel {
    constructor(parent) {
        let mainPanel = document.createElement("div");

        parent.appendChild(mainPanel);
        this.mainPanel = mainPanel;
        this.leftMargin = null;
    }

    createLabel(text) {
        let label = document.createElement("label");
        label.innerText = text;
        label.style.width = "100%";
        label.style.color = "white";
        label.style.display = "inline-block";
        label.style.marginTop = "5%";
        label.style.fontWeight = "bold";
        label.style.marginLeft = this.leftMargin ?? "5px";

        this.mainPanel.appendChild(label);
        return label;
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

    createCheckboxAndButton(text) {
        let checkbox = this.createCheckbox(text);

        let btn = document.createElement("Button");
        btn.style.height = "16px";
        btn.style.width = "16px";
        btn.style.position = "relative";
        btn.style.left = "-12px";
        btn.style.top = "4px";
        checkbox[1].appendChild(btn);

        return [checkbox[0], checkbox[1], btn];
    }
}

class Setting {
    constructor(key, defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;

        if (this.read() === null) this.write(defaultValue);
    }

    read() {
        return localStorage.getItem(this.key);
    }

    write(value) {
        localStorage.setItem(this.key, value);
    }
}

class BoolSetting extends Setting {
    constructor(key, defaultValue) {
        super(key, defaultValue);
        this.read = this._read;
    }

    _read() {
        let val = super.read().toLowerCase();
        return val === "true" || val === "1";
    }
}

class NumberSetting extends Setting {
    constructor(key, defaultValue) {
        super(key, defaultValue)
        this.read = this._read;
    }

    _read() {
        let val = Number(super.read());
        if (isNaN(val)) val = 0;
        return val;
    }
}

var cfg_quality = new NumberSetting("quality", 0.75),
    cfg_preferredServer = new Setting("mod_preferredServer", ""),
    cfg_removeAds = new BoolSetting("mod_removeAds", false),
    cfg_zoomHack = new BoolSetting("mod_zoomHack", true),
    cfg_zoomValue = new NumberSetting("mod_zoomValue", 13),
    cfg_showKills = new BoolSetting("mod_showKills", false);

var style = document.createElement("style");
style.innerHTML = '.scr1ptPanel {background:rgba(0,60,0,0.5); border-style: solid; border-width: 3px; border-color: rgb(60,185,60,0.5); border-radius: 5px;} .scr1ptButton {line-height: 1; outline: none; color: white; background-color: #5CB85C; border-radius: 4px; border-width: 0px; transition: 0.2s;} .scr1ptButton:hover {background-color: #5ed15e; cursor: pointer;} .scr1ptButton:active {background-color: #4e9c4e;} .scr1ptButton.unselected {opacity: 0.5;} .scr1ptButton .spinner {display: none; vertical-align: middle;} .scr1ptButton.button-loading {background-color: #7D7D7D; color: white;} .scr1ptButton.button-loading .spinner {display: inline-block;} .scr1ptButton-grey {color: black; background-color: #f5f5f5;} .scr1ptButton-grey:hover {background-color: white; color: #5e5e5e;} .scr1ptButton-grey:active {background-color: #cccccc; color: #5e5e5e;} .scr1ptButton-gold {background-color: #c9c818;} .scr1ptButton-gold:hover {background-color: #d9d71a;} .scr1ptButton-gold:active {background-color: #aba913;}';

var superhex, injected,
    originalMathMax, originalOnMouseWheel,
    stopRemoveAdsService = false, adElem,
    customQualityButton,
    lastKill = [new Date().getTime(), "", ""],
    leaderboard, minimap, friendsScores, score, fps;

function initObserver() {
    while (document.documentElement == null) {
        setTimeout(initObserver, 50);
        return;
    }

    // This is required to prevent the browser from using the cached script
    let head = document.getElementsByTagName('head')[0];
    head.innerHTML = head.innerHTML.replace("game.min.js", "game.min.js?version=1")

    console.debug("Initializing observer...");

    new MutationObserver(mutations => {
        mutations.forEach(({addedNodes}) => {
            addedNodes.forEach(node => {
                if (node.src) {
                    if (cfg_removeAds.read()) {
                        // Prevent ads-related scripts from loading
                        if (node.src.includes('criteo') || node.src.includes('adin') || node.src.includes('analytics')) {
                            console.info('Blocking ad provider', node.src)
                            node.type = 'javascript/blocked'
                            node.parentElement.removeChild(node)
                        }
                    }

                    if (node.src.includes('game.min.js')) {
                        console.debug("Intercepting " + node.src);
                        node.type = 'javascript/blocked'
                        node.parentElement.removeChild(node)

                        fetch(node.src)
                            .then(res => res.text())
                            .then(script => {injectGame(script)})
                    }
                }
            })
        })
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

function injectGame(script) {
    script = script.replace("var superhex=function()", "window.superhex=function()");
    let originalScript = script;

    // Server list
    script = script.replace('console.log("kept zone ping",e.z,wt[e.z])', 
                            'console.log("kept zone ping",e.z,wt[e.z],", reporting to Mod"),window.addServer(e.z,wt[e.z])')
                   .replace('.open("GET",MM_URL+"?zone="+(n||"")', 
                            '.open("GET",MM_URL+"?zone="+(window.preferredServer||n||"")');

    // Show kills
    script = script.replace('delete ln[i],delete sn[i],delete dn[i]', 
                            'window.showKill(sn[i],i,sn[a],a),delete ln[i],delete sn[i],delete dn[i]')

    console.debug("Loading modified Game...")

    try {
        Function(script)();
        injected = true;
    }
    catch (e) {
        console.error("-----------------------------------------------------------------------------------------------------");
        console.error("Loading of modified game failed. Attempting to load original game. Some features will be unavailable!")
        console.error("-----------------------------------------------------------------------------------------------------");
        console.trace(e);

        console.debug("Loading Original Game...")
        Function(originalScript)();
    }
    
    superhex = window.superhex;
}

window.addServer = (zone, ping) => {
    let select = document.getElementById("serverListSelect");

    if (select.children[0].text.toLowerCase().includes("loading")){
        select.children[0].text = "Auto (Default)";
        if (window.preferredServer != null) select.children[0].text = window.preferredServer + " (?)";
    }

    let previousSelectedI = select.selectedIndex;

    let option = document.createElement("option");
    option.text = zone + " (" + ping + " ms)";
    select.appendChild(option);  

    if (window.preferredServer != null) {
        if (window.preferredServer == zone) {
            select.children[0].text = "Auto (Default)";
            select.selectedIndex = select.children.length - 1;
        }
        else {
            select.selectedIndex = previousSelectedI;
        }
    }
};

function changePreferredServer(item) {
    let value = item.text.toUpperCase();

    if (value.includes("AUTO")) {
        window.preferredServer = null;
        cfg_preferredServer.write("");
        return;
    }

    let zone = value.substr(0, value.indexOf(" ("));
    window.preferredServer = zone;
    cfg_preferredServer.write(zone);
}

window.showKill = (victim, victimId, killer, killerId) => {
    let text = document.getElementById("killsText");
    if (text == null) return;

    let time = new Date().getTime();
    let msg;
    if (killerId == 0) {
        if (victimId == lastKill[2] && time - lastKill[0] < 1000) {
            msg = lastKill[1] + " and " + victim + " killed each other";
            text.innerText = text.innerText.substring(0, text.innerText.lastIndexOf('\n'));
        }
        else msg = victim + " hit the map border";
    }
    else if (victimId == killerId) msg = victim + " killed themselves";
    else msg = victim + " killed by " + killer;

    if ((victim == null) || (killer == null && killerId != 0)) {
        console.log("Ignored kill due to victim/killer username being null:", victim, victimId, killer, killerId);
        return;
    }

    let lines = text.innerText.split("\n");
    if (lines.length > 5)
    {
        lines.splice(0,1);
        text.innerText = lines.join('\n');
    }

    lastKill = [time, victim, killerId];
    text.innerText += "\n" + msg;
};

function init() {
    superhex = window.superhex;
    if (superhex == null) {
        setTimeout(init, 100);
        return;
    }

    console.info("Initializing Mod...");

    if (!injected) {
        console.error("Mod is loading but game wasn't injected!")
    }

    document.getElementsByTagName("head")[0].appendChild(style);
    originalMathMax = Math.max;
    originalOnMouseWheel = window.onmousewheel;

    createGui();

    adElem = document.getElementById("TKS_superhex-io_300x250");
    if (cfg_removeAds.read()) removeAdsService();
    if (cfg_zoomHack.read()) toggleZoomHack(true);
    if (cfg_preferredServer.read().length > 0) window.preferredServer = cfg_preferredServer.read();
    if (cfg_showKills.read()) toggleShowKills(true);

    changeQuality(cfg_quality.read());
    document.getElementById("button-quality-high").onclick = () => changeQuality(1);
    document.getElementById("button-quality-medium").onclick = () => changeQuality(0.75);
    document.getElementById("button-quality-low").onclick = () => changeQuality(0.5);

    leaderboard = document.getElementById("leaderboard");
    minimap = document.getElementById("minimap");
    friendsScores = document.getElementById("friendsScores");
    score = document.getElementById("score");
    fps = document.getElementById("fps");
    fps.style.color = 'white';
    window.addEventListener("keyup", onKeyUp);

    console.info("Mod initialized");
}

function changeQuality(quality) {
    superhex.setQuality(quality);

    customQualityButton.innerText = "Custom Quality";

    if (quality != 1 && quality != 0.75 && quality != 0.5) {
        customQualityButton.className = "scr1ptButton";
        customQualityButton.innerText += " (" + quality + ")";
        return;
    }

    customQualityButton.className = "scr1ptButton unselected";
}

function customQuality() {
    let quality = Number(window.prompt("Insert value. Example:\n0.25: Very low\n0.5: Low\n0.75: Medium\n1: High\n1.5: Very high\n2: Ultra"));
    if (quality > 2.7) alert("WARNING: Values higher than 2.7 may cause problems.");
    if (quality < 0.1 && quality > 0) alert("WARNING: Values lower may 0.1 can cause problems.");

    if (quality.toString() == "NaN") {
        alert("Invalid value. Make sure to only use numbers.\nExample: 1.2"); 
        return
    }

    if (quality == 0) return;
    changeQuality(quality);
}

function toggleRemoveAds(restoreAds) {
    stopRemoveAdsService = restoreAds;

    if (restoreAds) {
        cfg_removeAds.write(false);
        return;
    }
    
    cfg_removeAds.write(true);
    removeAdsService();
}

function removeAdsService(timeout = 50) {
    if (adElem.innerHTML != "")
    {
        console.debug("Removing ads...");
        superhex.clickPlay = superhex.aipComplete;
        superhex.clickPlayAgain = superhex.aipComplete;
        removeAdElement(adElem);
        removeAdElement(document.getElementById("respawn-ad"));
        removeAdElement(document.getElementsByClassName("curse-ad")[0]);
        removeAdElement(document.getElementById("780560"));

        timeout = 50;
    }

    if (timeout < 1000) timeout += 50;
    if (!stopRemoveAdsService) setTimeout(() => removeAdsService(timeout), timeout);
}

function removeAdElement(elem) {
    if (elem == null) return;

    elem.innerHTML = "";
    elem.style.display = "none";
}

function onKeyUp(e) {
    e ??= window.event;

    let key = e.key;

    if (leaderboard.getAttribute("style") != null) {
        if (key == '0') {
            if (leaderboard.style.display == "block") leaderboard.style.display = "none";
            if (minimap.style.display == "block") minimap.style.display = "none";
            if (friendsScores.style.display == "block") friendsScores.style.display = "none";
            if (score.style.display == "block") score.style.display = "none";
            else {
                score.style.display = "block";
                minimap.style.display = "block";
                leaderboard.style.display = "block";
                if (window.location.hash.length > 5 && window.location.hash.length < 8) friendsScores.style.display = "block";
            }
        }
        else if (key == '1') {
            leaderboard.style.display = leaderboard.style.display == "block" ? "none" : "block";
        }
    }

    if (key == '2') {
        fps.style.display = fps.style.display == "block" ? "none" : "block";
    }
    else if (key == ',') {
        changeZoom(false);
    }
    else if (key == '.') {
        changeZoom(true);
    }
}

function unlockSkins() {
    let skins = ["shareClicked", "subscribeClicked", "likeClicked", "tweetClicked", "followClicked"]

    let unlocked = 0;
    skins.forEach((skin) => {
        if (localStorage.getItem(skin) == 1) unlocked++;
    });

    if (unlocked == skins.length) { 
        alert("You have already unlocked all the skins."); 
        return;
    }

    skins.forEach((skin) => {
        localStorage.setItem(skin, 1);
    });

    superhex.nextSkins();
    superhex.previousSkins();
    alert("All the skins were unlocked!");
}

function toggleZoomHack(enable) {
    if (!enable) {
        cfg_zoomHack.write(false);
        Math.max = originalMathMax;
        window.onmousewheel = originalOnMouseWheel;
    } else {
        Math.max = (a, b) => {
            return a == window.innerWidth / 40 / 2 / .75 && b == window.innerHeight / 40 / Math.sqrt(3) ? cfg_zoomValue.read() : originalMathMax(a, b);
        };

        cfg_zoomHack.write(true);

        window.onmousewheel = function(e) {
            if (originalOnMouseWheel) originalOnMouseWheel();

            let delta;
            if (!e) e = window.event;
            if (e.wheelDelta) delta = e.wheelDelta / 60; else if (e.detail) delta = -e.detail / 2;

            changeZoom(delta != null && delta > 0);
        };
    }
}

function toggleShowKills(enable) {
    cfg_showKills.write(enable);

    if (enable) {
        let killsText = document.createElement("h4");
        killsText.style.color = "rgba(255,255,255,0.6)";
        killsText.style.position = "fixed";
        killsText.style.textAlign = "center";
        killsText.style.right = "10px";
        killsText.style.bottom = "0px";
        killsText.style.zIndex = "1";
        killsText.id = "killsText";
        window.document.body.appendChild(killsText);

        return;
    }

    document.getElementById("killsText").remove();
}

function changeZoom(zoomIn) {
    let value = cfg_zoomValue.read();
    let increaser = 2;
    if (value < 16) increaser = 1;
    else if (value > 30) increaser = 4;

    if (zoomIn) value += increaser;
    else value -= increaser;

    if (value > 60) value = 60;
    if (value < 3) value = 3;

    if (value != cfg_zoomValue.read()) {
        cfg_zoomValue.write(value);
        window.dispatchEvent(new Event('resize'));
    }
}

function createGui() {
    console.debug("Creating Mod UI...");

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

    let title = panel.createLabel("Superhex.io Scr1pt");
    title.style.marginLeft = mainPanel.style.left;
    title.style.textAlign = "center";

    let githubButton = panel.createButton("GitHub");
    githubButton.className = "scr1ptButton scr1ptButton-gold";
    githubButton.onclick = () => window.open("https://github.com/TBM13/Superhex.io-Scr1pt");

    let greasyForkButton = panel.createButton("Greasy Fork");
    greasyForkButton.className = "scr1ptButton scr1ptButton-gold";
    greasyForkButton.onclick = () => window.open("https://greasyfork.org/es/scripts/36071-superhex-io-scr1pt");

    let unlockSkinsButton = panel.createButton("Unlock skins");
    unlockSkinsButton.className = "scr1ptButton";
    unlockSkinsButton.onclick = () => unlockSkins();

    customQualityButton = document.createElement("Button");
    customQualityButton.setAttribute("class", "scr1ptButton unselected");
    customQualityButton.setAttribute("type", "button");
    customQualityButton.setAttribute("id", "btn2");
    customQualityButton.innerText = "Custom Quality";
    customQualityButton.onclick = () => customQuality();
    document.getElementById("button-quality-high").parentElement.appendChild(customQualityButton);

    let versionText = document.createElement("h5");
    versionText.setAttribute("style", "color: rgba(255,255,255,0.6); position: absolute; bottom: -20px; right: 5px;");
    versionText.innerText = "v2.0.0";
    mainPanel.appendChild(versionText);

    let removeAdsCheckbox = panel.createCheckbox("Remove ads")[0]
    removeAdsCheckbox.onclick = () => toggleRemoveAds(!removeAdsCheckbox.checked);
    removeAdsCheckbox.checked = cfg_removeAds.read();

    let zoomHackCheckbox = panel.createCheckbox("Zoom Hack")[0];
    zoomHackCheckbox.onclick = () => toggleZoomHack(zoomHackCheckbox.checked);
    zoomHackCheckbox.checked = cfg_zoomHack.read();

    let showKillsCheckbox = panel.createCheckbox("Show Kills")[0];
    if (injected) {
        showKillsCheckbox.onclick = () => toggleShowKills(showKillsCheckbox.checked);
        showKillsCheckbox.checked = cfg_showKills.read();
    }
    else showKillsCheckbox.disabled = true;

    let hotkeysPanel = new ModPanel(homepage);
    hotkeysPanel.mainPanel.className = "scr1ptPanel";
    hotkeysPanel.mainPanel.style.position = "fixed";
    hotkeysPanel.mainPanel.style.bottom = "-4px";
    hotkeysPanel.mainPanel.style.right = "-4px";
    hotkeysPanel.mainPanel.style.height = "40%";
    hotkeysPanel.mainPanel.style.width = "30%";
    hotkeysPanel.mainPanel.style.maxHeight = "200px";
    hotkeysPanel.mainPanel.style.maxWidth = "350px";

    let hotkeysLabel = hotkeysPanel.createLabel("Hotkeys:\n\n" +
                                                "1 = Hide/show Leaderboard\n" +
                                                "0 = Hide/show UI\n" +
                                                "2 = Hide/show FPS and connection info\n" +
                                                ", = Zoom Out\n" +
                                                ". = Zoom In\n" +
                                                "Mouse wheel = Zoom in/out");
    hotkeysLabel.style.marginLeft = "10px";

    let serverListSelect = document.createElement("select");
    serverListSelect.style.width = "100%";
    serverListSelect.id = "serverListSelect";
    document.getElementById("button-play").parentElement.appendChild(serverListSelect);
    serverListSelect.onchange = () => changePreferredServer(serverListSelect.children[serverListSelect.selectedIndex]);

    let option = document.createElement("option");
    option.text = "Loading servers...";
    if (!injected) option.text = "Feature unavailable. Refresh the page";
    serverListSelect.appendChild(option);
}

initObserver();
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    console.error("Late init! Some features may not work!");
    init();
}