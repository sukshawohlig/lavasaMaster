module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    getAthletePerSchool: function (req, res) {
        if (req) {
            IndividualSport.getAthletePerSchool(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "User Not logged in"
            });
        }

    },

};
module.exports = _.assign(module.exports, controller);