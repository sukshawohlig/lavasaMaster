module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    generateReportCard:function (req,res){
        res.connection.setTimeout(200000000);
        req.connection.setTimeout(200000000);
        Reportcard.generateReportCard(res.callback);
    },

    getOneReportCard:function(req,res){
        if(req.body.name){
            Reportcard.getOneReportCard(req.body,res.callback);
        }else{
            res.json({
                data:"Invalid Params",
                value:false
            });
        }
    },

    getTotalMatchesSchool:function(req,res){
        if(req.body.school){
            Reportcard.getTotalMatchesSchool(req.body,res.callback);
        }else{
            res.json({
                data:"Invalid Params",
                value:false
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);
