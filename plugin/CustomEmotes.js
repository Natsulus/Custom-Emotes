//META{"name":"CustomEmotes"}

function CustomEmotes() {}

var observer;

CustomEmotes.prototype.unload = function() {
    //
};

CustomEmotes.prototype.start = function() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var startTry = setInterval(function() {
        if (CustomEmotes.isReady) clearInterval(startTry);
        else return;

        observer = new MutationObserver(function() {
            CustomEmotes.processChat();
        });

        var chatRetry = setInterval(function() {
            $(".chat").each(function() {
                clearInterval(chatRetry);
                if (CustomEmotes.settings["ce-icons"]) {
                    observer.observe(this, {childList: true, characterData: true, attributes: false, subtree: true});
                    CustomEmotes.processChat();
                }
            });
        }, 100);
        CustomEmotes.createSettings();
        console.log("[Custom Emotes] Started");
    }, 100);
};

CustomEmotes.parseEmotes = function (node) {
    var returnArr = [];
    if (node.length > 0) {
        var html = node.nodeValue;
        var match = false;
        $.each(CustomEmotes.emoteList, function (key, emote) {
            if (match) return;
            var index = html.lastIndexOf(key);
            if (index !== -1) {
                match = true;
                returnArr.extend(CustomEmotes.parseEmotes(document.createTextNode(html.slice(0, index))));

                var iconNode = document.createElement("div");
                iconNode.className = "emotewrapper";
                iconNode.setAttribute("tooltip", key);
                if (CustomEmotes.settings["ce-icon-tooltip"]) iconNode.className += " icon-tooltip";
                iconNode.style.cssText = "top: " + Math.ceil((icon.size - 8) / 2.5) + "px";
                var iconImage;
                if (icon.type == "image") {
                    iconImage = document.createElement("div");
                    iconImage.className = "ce-icon";
                    iconImage.style.width = icon.size + "px";
                    iconImage.style.height = icon.size + "px";
                    iconImage.style.backgroundImage = "url('" + icon.url + "')";
                    iconImage.style.backgroundSize = icon.size + "px auto";
                } else if (icon.type == "animation") {
                    iconImage = document.createElement("div");
                    iconImage.className = "ce-icon ce-icon-sprite";
                    iconImage.style.width = icon.size + "px";
                    iconImage.style.height = icon.size + "px";
                    iconImage.style.animationTimingFunction = "steps(" + (icon.steps - 1) + ")";
                    iconImage.style.animationDuration = (icon.steps * CustomEmotes.animationSpeed) + "s";
                    iconImage.style.backgroundImage = "url('" + icon.url + "')";
                    iconImage.style.backgroundSize = icon.size + "px auto";
                }
                iconNode.appendChild(iconImage);
                returnArr.push(iconNode);

                returnArr.extend(CustomEmotes.parseEmotes(document.createTextNode(html.slice(index + key.length))));
            }
        });
    }
    if (returnArr.length > 0) return returnArr;
    return [node];
};

CustomEmotes.processChat = function() {
    $(".message-content>span:not(.ce-icons-scanned),.comment .markup>span:not(.ce-icons-scanned)").each(function() {
        $(this).contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            var rarr = CustomEmotes.parseEmotes(this);
            for (var i = 0; i < rarr.length; i++) {
                this.parentNode.insertBefore(rarr[i], this);
            }
            if (rarr.length > 1) this.remove();
        })

    }).addClass("av-icons-scanned");
};

CustomEmotes.prototype.stop = function () {
    console.log("[Custom Emotes] Stopped");
};

CustomEmotes.prototype.update = function () {
    console.log("[Custom Emotes] Updated");
};

CustomEmotes.prototype.getName = function () {
    return "Custom Emotes";
};

CustomEmotes.prototype.getDescription = function () {
    return "Add as many custom emotes as you want!";
};

CustomEmotes.prototype.getVersion = function () {
    return "0.1.0";
};

CustomEmotes.prototype.getAuthor = function () {
    return "Natsulus";
};