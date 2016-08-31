var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var intent = require('./IntentDialog');
var request = require('request');
var WitDialog = (function (_super) {
    __extends(WitDialog, _super);
    function WitDialog(serviceUri) {
        _super.call(this);
        this.serviceUri = serviceUri;
    }
    WitDialog.prototype.recognizeIntents = function (language, utterance, callback) {
        WitDialog.recognize(utterance, this.serviceUri, callback);
    };
    WitDialog.recognize = function (utterance, serviceUri, callback) {
        var uri = serviceUri.trim();
        if (uri.lastIndexOf('&q=') != uri.length - 3) {
            uri += '&q=';
        }
        uri += encodeURIComponent(utterance || '');
        request.get(uri, function (err, res, body) {
            var calledCallback = false;
            try {
                if (!err) {
                    var result = JSON.parse(body);
                    if (result.error) {
                      calledCallback = true;
                      return callback(result.error);
                    }
                    var intents = result.entities.intent || []
                    intents = intents.map(function (d) {
                      var obj = {}
                      obj.intent = d.value;
                      obj.score = d.confidence;
                      return obj;
                    })
                    if (!intents.length) {
                      intents = [{intent: 'None', score: 1 }];
                    }
                    var entities = result.entities
                    delete entities.intent
                    entities = [entities]
                    calledCallback = true;
                    callback(null, intents, entities);
                }
                else {
                    calledCallback = true;
                    callback(err);
                }
            }
            catch (e) {
                if (!calledCallback) {
                    callback(e);
                }
                else {
                    console.error(e.toString());
                }
            }
        });
    };
    return WitDialog;
})(intent.IntentDialog);
exports.WitDialog = WitDialog;
