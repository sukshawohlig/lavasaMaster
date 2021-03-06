var fs = require("fs");
var sha512 = require('sha512');
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    emailReader: function (req, res) {
        var isfile2 = fs.existsSync('./views/' + req.body.filename);
        console.log("isfile2", isfile2);
        if (isfile2) {
            res.view(req.body.filename, req.body);
        } else {
            res.json({
                value: false,
                message: "Please provide params"
            });
        }
    },
    uploadTest: function (req, res) {
        res.callback(null, {
            total: 5,
            value: [
                "Chintan",
                "Chirag",
                "ABC",
                {
                    name: "Chintan",
                    error: "Some Error Occured"
                },
                {
                    name: "Chirag",
                    error: "Some Other Error Occured"
                }
            ]

        });
    },

    removeChunkCover: function (req, res) {
        res.connection.setTimeout(20000000000);
        req.connection.setTimeout(20000000000);
        if (req.body) {
            Config.removeChunkCover(res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },


};
module.exports = _.assign(module.exports, controller);