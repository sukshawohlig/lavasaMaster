module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllMedia: function (req, res) {
        if (req.body) {
            OldGallery.getAllMedia(req.body, res.callback);
        } else {
            res.json({
                "data": "OldAthelete Id not Found",
                "value": false
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);