module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getSchoolByRanks: function (req, res) {
        Rank.getSchoolByRanks(res.callback);
    },

    getSchoolBySport: function (req, res) {
        if (req.body && req.body.name) {
            var obj = {
                "name": req.body.name
            }
            Rank.getSchoolBySport(obj, res.callback);
        } else {
            res.json({
                "data": "Invalid Data",
                "value": false
            });
        }
    },

    getAgeGroupsAndEvents: function (req, res) {
        if (req.body.name) {
            Rank.getAgeGroupsAndEvents(req.body,res.callback);
        } else {
            res.json({
                data: "Insufficient Data",
                value: false
            });
        }
    },


    getMedalWinners: function (req, res) {
        if (req.body) {
            Rank.getMedalWinners(req.body, res.callback);
        } else {
            res.json({
                data: "Insufficient Data",
                value: false
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);