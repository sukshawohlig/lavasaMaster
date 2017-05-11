module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    updateSFAID: function (req, res) {
        if (req.body) {
            School.updateSFAID(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    search: function (req, res) {
        if (req.body) {
            School.search(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAllSchoolDetails: function (req, res) {
        if (req.body) {
            School.getAllSchoolDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    removeDuplicates: function (req, res) {
        if (req.body) {
            School.removeDuplicates(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

};
module.exports = _.assign(module.exports, controller);