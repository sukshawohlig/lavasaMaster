 var fs = require('fs');
 var schema = new Schema({

     deleteStatus: Boolean,
     timestamp: Date,
     sfaid: String,
     name: String,
     board: String,
     status: Boolean,
     address: String,
     location: String,
     email: String,
     contact: String,
     department: [{
         email: String,
         contact: String,
         designation: String,
         name: String,
         year: String,
     }],
     image: [{
         type: String
     }],
     video: [{
         type: String
     }],
     contingentLeader: [{
         type: String
     }],
     sports: [{
         year: String,
         sporttype: String,
         name: String,
     }],
     principal: String,
     paymentType: String,
     numberOfSports: String,
     representative: String,
     notpaidfor: String,
     year: [{
         type: String
     }],
     totalPoints: Number,
     totalPoints2015: Number,
     totalPoints2016: Number,
     totalPoints2017: Number

 });

 schema.plugin(deepPopulate, {});
 schema.plugin(uniqueValidator);
 schema.plugin(timestamps);
 module.exports = mongoose.model('School', schema);

 var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
 var model = {

     search: function (data, callback) {
         var Model = this;
         var Const = this(data);
         var maxRow = Config.maxRow;

         var page = 1;
         if (data.page) {
             page = data.page;
         }
         var field = data.field;
         var options = {
             field: data.field,
             filters: {
                 keyword: {
                     fields: ['sfaid', 'name'],
                     term: data.keyword
                 }
             },
             sort: {
                 asc: 'sfaid'
             },
             start: (page - 1) * maxRow,
             count: maxRow
         };
         var Search = Model.find(data.filter)

             .order(options)
             // .deepPopulate(deepSearch)
             .keyword(options)
             .page(options, callback);

     },

     updateSFAID: function (data, callback) {
         var result = {};
         result.msg = "Updated";
         School.find().exec(function (err, found) {
             if (err) {
                 callback(err, null);
             } else if (_.isEmpty(found)) {
                 callback(null, "Data is empty");
             } else {
                 var count = 0;
                 async.eachSeries(found, function (value, callback) {

                     console.log("sfa:", value.timestamp);
                     // var year = value.timestamp.getFullYear().toString().substr(2, 2);
                     // console.log("index", year);
                     count++;
                     var sfa = "M" + "S" + "16" + value.sfaid;
                     School.update({
                         _id: value._id,
                     }, {
                         sfaid: sfa,
                     }).exec(function (err, updated) {
                         if (err) {
                             console.log("error :", err);
                             callback(null, err);
                         } else {

                             callback(null, updated);
                         }
                     });

                 }, function (err) {
                     if (err) {
                         console.log(err);
                         callback(err, null);
                     } else {
                         result.count = count;
                         console.log("count", count);
                         callback(null, result);
                     }
                 });

                 //callback(null, found);
             }
         });


     },

     getAllSchoolDetails: function (data, callback) {
         School.find().exec(function (err, found) {
             if (err) {
                 callback(err, null);
             } else if (_.isEmpty(found)) {
                 callback(null, "Data is empty");
             } else {
                 callback(null, found);
             }
         });

     },

     removeDuplicates: function (data, callback) {

         var obj = {};

         // Read the file and send to the callback
         fs.readFile(data.path, handleFile)

         // Write the callback function
         function handleFile(err, data) {
             if (err) throw err
             obj = JSON.parse(data)
             console.log("obj", obj);
             // You can now play with your datas
         }

     },



 };
 module.exports = _.assign(module.exports, exports, model);