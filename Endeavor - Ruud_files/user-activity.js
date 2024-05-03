function UA(domain) {
    this.pid = "";
    this.domain = domain;
    this.host = "//" + this.domain;
    this.settings = {
        'click_enabled': false
    };

    this.init = function () {
        this.initIframe();
        this.initActions();
        this.initAlertBar();
    };

    this.initIframe = function() {
        var uai = document.createElement('iframe');
        uai.name = 'uaiframe';
        uai.src = this.host + '/wp-json/users-activity/init';//?pid=' + this.getCookie('pid');
        uai.id = 'uaiframe';
        uai.style.display = 'none';
        uai.addEventListener("load", function() {
            window.ua.push('pageview', {});
        });
        document.body.appendChild(uai);
    };

    this.initActions = function() {
        if (this.settings.click_enabled) {
            jQuery(document).on("click", function (e) {
                var attrs = {};
                jQuery.each(e.target.attributes, function (index, attribute) {
                    attrs[attribute.name] = attribute.value;
                });

                var details = {
                    "element": jQuery(e.target).prop("tagName"),
                    "attributes": attrs
                };

                window.ua.push('click', details);
            });
        }
    };

    this.getCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    this.initAlertBar = function() {
        var person_id = this.getCookie('PersonID');
        if (this.getCookie('ua-alert-box') === '0') {
            return;
        }
        if (person_id) {
            this.getOrganization(function(data) {
                if (!data.organization.name) {
                    return;
                }

                // jQuery('body').prepend('<div id="ua-alert-box"><a href="/my-history">Welcome back, ' + data.organization.name + '<a/><span id="ua-alert-box-close">X</span></div>')
                //     .addClass('ua-alert-box');

                if (typeof jQuery.fn.headroom === "function") {
                    jQuery("#ua-alert-box").headroom({
                        offset: 100,
                        classes: {
                            initial: "headroom",
                            pinned: "scrollin-up",
                            unpinned: "scrollin-down",
                            top: "aboveoffset",
                            notTop: "belowoffset",
                            bottom: "atbottom",
                            notBottom: "notatbottom"
                        }
                    });
                 }

                jQuery('#ua-alert-box-close').click(function(){
                    jQuery('#ua-alert-box').toggle();
                    jQuery('body').removeClass('ua-alert-box');
                    document.cookie = "ua-alert-box=0; expires=0; path=/";
                });
            });
        }
    };

    this.getOrganization = function(cb) {
        jQuery.ajax({
            type: 'GET',
            context: this,
            url: this.host + '/wp-json/users-activity/organization',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if (data.status === "OK") {
                    cb(data);
                }
            }
        });
    };

    this.push = function(t, details) {
        var data = {
            "dl": window.location.href,
            "ul": window.navigator.userLanguage || window.navigator.language,
            "de": document.characterSet,
            "dt": document.title,
            "sr": window.outerWidth + "x" + window.outerHeight,
            "vp": window.innerWidth + "x" + window.innerHeight,
            "d": details
        };

        jQuery.ajax({
            type: 'POST',
            context: this,
            url: this.host + "/wp-json/users-activity/collect?t="+t,
            data: data,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if (data.status === "OK") {
                    console.log('Activity collected');
                }
            }
        });
    };

    this.submitActivity = function() {
        jQuery.ajax({
            type: 'GET',
            context: this,
            url: this.host + '/wp-json/users-activity/submit',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if (data.status === "OK") {
                }
            }
        });
    };
}

jQuery(document).ready(function() {
    window.ua = new UA(window.ua_domain);
    window.ua.init();
});
