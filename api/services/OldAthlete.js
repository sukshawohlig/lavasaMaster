var generator = require('generate-password');
var schema = new Schema({

    deleteStatus: Boolean,
    hours: String,
    minutes: String,
    timer: String,
    via: String,
    payment: String,
    sfaid: String,
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        index: true
    },
    lastname: String,
    firstname: String,
    middlename: String,
    gender: String,
    dob: Date,
    address: String,
    contact: String,
    email: String,
    dateOfForm: String,
    name: String,
    image: [{
        type: String
    }],
    video: [{
        type: String
    }],

    year: String,
    totalPoints: Number,
    totalPoints2015: Number,
    totalPoints2016: Number,
    totalPoints2017: Number,
    status: Boolean
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('OldAthlete', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getAllStudent: function (data, callback) {
        async.waterfall([
            function (callback) {
                OldAthlete.find({
                    year: data.year
                }).lean().exec(function (err, oldSchoolData) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (_.isEmpty(oldSchoolData)) {
                            callback(null, []);
                        } else {
                            callback(null, oldSchoolData);
                        }
                    }
                });
            },
            function (oldSchoolData, callback) {
                async.each(oldSchoolData, function (mainData, callback) {
                        async.waterfall([
                            function (callback) {
                                Registration.find({
                                    oldId: mainData.school
                                }).lean().exec(function (err, schoolData) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        if (_.isEmpty(schoolData)) {
                                            callback(null, []);
                                        } else {
                                            callback(null, schoolData);
                                        }
                                    }
                                });
                            },
                            function (schoolData, callback) {
                                var final = {};
                                final.atheleteID = mainData.sfaid;
                                // var year = data.year.substr(2, 2);
                                final.sfaId = "M" + "A" + "16" + mainData.sfaid;
                                final.status = "Verified";
                                final.school = mainData.school;
                                final.year = data.year;
                                final.surname = mainData.lastname;
                                final.firstName = mainData.firstname;
                                final.middleName = mainData.middlename;
                                final.password = generator.generate({
                                    length: 8,
                                    numbers: true
                                });
                                final.gender = mainData.gender;
                                final.dob = mainData.dob;

                                var today = new Date();
                                var birthDate = new Date(mainData.dob);
                                var age = today.getFullYear() - birthDate.getFullYear();
                                var m = today.getMonth() - birthDate.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                    age--;
                                }
                                final.age = age;
                                final.playedTournaments = false;
                                final.sportLevel = [];
                                final.mobile = mainData.contact;
                                final.email = mainData.email;
                                final.address = mainData.address;
                                final.addressLine2 = mainData.location;
                                final.state = "Maharastra";
                                final.city = "Mumbai";
                                final.termsAndCondition = true;
                                final.parentDetails = [];
                                final.registrationFee = "cash";
                                final.paymentStatus = "Paid";
                                final.verifyCount = 1;
                                final.oldId = mainData._id;
                                Athelete.saveData(final, function (err, complete) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, complete);
                                    }
                                });

                            }
                        ], function (err, found) {
                            if (found) {
                                callback(null, found);
                            } else {
                                callback(null, found);
                            }
                        });

                    },
                    function (err) {
                        callback(null, "All data Stored");
                    });
            }
        ], function (err, found) {
            if (found) {
                callback(null, found);
            } else {
                callback(null, found);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);