sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
    'use strict';

    return UIComponent.extend('com.yourcompany.myreactapp.Component', {

        metadata: {
            manifest: 'json'
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        },

        createContent: function () {
            var oHTML = new sap.ui.core.HTML({
                content: '<div id="react-root" style="height:100%;width:100%"></div>',
                afterRendering: function () {
                    this._mountReactApp();
                }.bind(this)
            });
            return oHTML;
        },

        _mountReactApp: function () {
            // Fetch asset-manifest.json to get the hashed JS filename dynamically
            var sManifestUrl = sap.ui.require.toUrl(
                'com/yourcompany/myreactapp/react-app/asset-manifest.json'
            );

            fetch(sManifestUrl)
                .then(function (res) { return res.json(); })
                .then(function (manifest) {
                    var sJsUrl = manifest.files['main.js'];

                    // Also load CSS
                    var sCssUrl = manifest.files['main.css'];
                    if (sCssUrl) {
                        var link = document.createElement('link');
                        link.rel  = 'stylesheet';
                        link.href = sap.ui.require.toUrl(
                            'com/yourcompany/myreactapp/react-app' + sCssUrl.replace('./', '/')
                        );
                        document.head.appendChild(link);
                    }

                    // Load React JS bundle
                    var script = document.createElement('script');
                    script.src = sap.ui.require.toUrl(
                        'com/yourcompany/myreactapp/react-app' + sJsUrl.replace('./', '/')
                    );
                    document.head.appendChild(script);
                })
                .catch(function (err) {
                    console.error('Failed to load React app:', err);
                });
        }
    });
});