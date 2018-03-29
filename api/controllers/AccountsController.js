module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
  getAccount: function (req, res) {
    Accounts.findOne({
      _id: req.body._id
    }).lean().deepPopulate("athlete athlete.school school").exec(
      function (err, found) {
        if (err) {
          res.callback(err, null);
        } else {
          res.callback(null, found);
        }
      }
    )
  }
};
module.exports = _.assign(module.exports, controller);