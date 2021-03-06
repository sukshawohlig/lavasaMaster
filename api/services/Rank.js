var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
// var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
var autoIncrement = require('mongoose-auto-increment');
var objectid = require("mongodb").ObjectID;
var schema = new Schema({
    name: {
        type: String
    },
    medal: {
        "gold": {
            name: String,
            count: Number,
            points: Number
        },
        "silver": {
            name: String,
            count: Number,
            points: Number
        },
        "bronze": {
            name: String,
            count: Number,
            points: Number
        }
    },
    totalCount: Number,
    totalPoints: Number,
    totalMatches: Number,
    sportData: [{
        name: String,
        medals: {
            "gold": {
                name: String,
                count: Number,
                points: Number
            },
            "silver": {
                name: String,
                count: Number,
                points: Number
            },
            "bronze": {
                name: String,
                count: Number,
                points: Number
            }
        },
        count: Number,
        totalCount: Number,
        totalPoints: Number,
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Rank', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    sortingPriority: {
        "totalPoints": -1,
        "medal.gold.points": -1,
        "medal.silver.points": -1,
        "medal.bronze.points": -1,
        "totalMatches": -1
    },

    getSchoolByRanks: function (callback) {
        Rank.find().sort(Rank.sortingPriority).lean().exec(function (err, data) {
            var sportsToMerge = ['Tennis', 'Badminton', 'Table Tennis', 'Athletics', 'Swimming']
            var sportsFound = [];
            var arr = [];

            async.concatSeries(data, function (singleData, callback) {

                _.each(sportsToMerge, function (sportName, key) {


                    singleData[sportName] = _.filter(singleData.sportData, function (sport) {
                        // console.log(sport.name.indexOf(sportName) == 0);
                        if (sport.name.indexOf(sportName) != -1 && !sport.name.indexOf(sportName) > 0) {
                            return sport;
                        }
                    })

                    if (!_.isEmpty(singleData[sportName])) {
                        var obj = {
                            _ids: {},
                            name: sportName,
                            count: 0,
                            totalCount: 0,
                            totalPoints: 0,
                            medals: {
                                bronze: {
                                    name: "bronze",
                                    count: 0,
                                    points: 0
                                },
                                silver: {
                                    name: "silver",
                                    count: 0,
                                    points: 0
                                },
                                gold: {
                                    name: "gold",
                                    count: 0,
                                    points: 0
                                }
                            }
                        }
                        _.each(singleData[sportName], function (n) {
                            obj.count += n.count;
                            obj.totalCount += n.totalCount;
                            obj.totalPoints += n.totalPoints;
                            var o = {};
                            o[n.name] = n._id;
                            // console.log("o", o);
                            obj._ids = _.assign(obj._ids, o);
                            // console.log("obj", obj);
                            if (n && n.medals && n.medals['bronze']) {
                                obj.medals['bronze'].count += n.medals['bronze'].count;
                                obj.medals['bronze'].points += n.medals['bronze'].points;
                            }

                            if (n && n.medals && n.medals['silver']) {
                                obj.medals['silver'].count += n.medals['silver'].count;
                                obj.medals['silver'].points += n.medals['silver'].points;
                            }

                            if (n && n.medals && n.medals['gold']) {
                                obj.medals['gold'].count += n.medals['gold'].count;
                                obj.medals['gold'].points += n.medals['gold'].points;
                            }

                            n.removeElement = true;
                        });

                        singleData.sportData.push(obj);
                    }
                    delete singleData[sportName];
                    singleData.sportData = _.filter(singleData.sportData, function (n) {
                        return !n.removeElement;
                    });
                    if (sportsToMerge.length - 1 == key) {
                        callback(null, singleData);
                    }

                });

            }, function (err, result) {
                callback(null, result);
            });
        });
    },

    getSchoolBySport: function (data, callback) {
        // console.log("data", data);
        var str = '^' + data.name;
        var re = new RegExp(str, 'i');
        console.log("re", re);

        var sportRankPipeline = [{
            $match: {
                "sportData.name": re
            }
        }, {
            $project: {
                "name": 1,
                "sportData": 1
            }
        }, {
            $unwind: {
                path: "$sportData",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                "sportData.name": re
            }
        }, {
            $group: {
                "_id": "$name",
                "sportData": {
                    $push: "$sportData"
                },
                "count": {
                    "$sum": "$sportData.count"
                },
                "totalCount": {
                    "$sum": "$sportData.totalCount"
                },
                "totalPoints": {
                    "$sum": "$sportData.totalPoints"
                },
                "bronzeCount": {
                    "$sum": "$sportData.medals.bronze.count"
                },
                "bronzePoints": {
                    "$sum": "$sportData.medals.bronze.points"
                },
                "silverCount": {
                    "$sum": "$sportData.medals.silver.count"
                },
                "silverPoints": {
                    "$sum": "$sportData.medals.silver.points"
                },
                "goldCount": {
                    "$sum": "$sportData.medals.gold.count"
                },
                "goldPoints": {
                    "$sum": "$sportData.medals.gold.points"
                },
            }
        }, {
            $sort: {
                "totalPoints": -1,
                "goldPoints": -1,
                "silverPoints": -1,
                "bronzePoints": -1
            }
        }];

        var risingAwardPipeline = [{
            $lookup: {
                "from": "awards",
                "localField": "award",
                "foreignField": "_id",
                "as": "award"
            }
        }, {
            $unwind: {
                path: "$award",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                "award.awardType": "rising"
            }
        }, {
            $unwind: {
                path: "$sports",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $lookup: {
                "from": "sportslistsubcategories",
                "localField": "sports",
                "foreignField": "_id",
                "as": "sports"
            }
        }, {
            $unwind: {
                path: "$sports",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                "sports.name": data.name
            }
        }, {
            $project: {
                "award": 1,
                "gender": 1,
                "athlete": 1
            }
        }];



        var sendObj = {
            table: [],
            risingAthletes: []
        }

        async.waterfall([
            function (callback) {
                Rank.aggregate(sportRankPipeline, function (err, result) {
                    // console.log("result",result);
                    if (err) {
                        callback(err, null);
                    } else {
                        var sendObj = {};
                        sendObj.table = result;
                        callback(null, sendObj);
                    }
                });
            },
            function (sendObj, callback) {
                SpecialAwardDetails.aggregate(risingAwardPipeline, function (err, risingAwards) {
                    sendObj.risingAthletes = risingAwards;
                    if (err) {
                        callback(err, null);
                    } else {
                        sendObj.risingAthletes = risingAwards;
                        callback(null, sendObj);
                    }
                })
            },
            function (sendObj, callback) {
                async.concatSeries(sendObj.risingAthletes, function (singleData, callback) {
                    var matchObj = {
                        "athleteId": singleData.athlete
                    }
                    Profile.getAthleteProfile(matchObj, function (err, profile) {
                        if (err) {
                            callback(null, "");
                        } else {
                            singleData.medalData = _.groupBy(profile.medalData, 'name');
                            singleData.sportsPlayed = _.map(profile.sport, 'sportslist.sportsListSubCategory.name');
                            singleData.athleteProfile = profile.athlete;
                            callback(null, singleData);
                        }
                    })
                }, function (err, result) {
                    sendObj.risingAthletes = result;
                    callback(null, sendObj);
                })
            }

        ], function (err, finalData) {
            callback(null, finalData);
        })

    },

    getMedalWinners: function (data, callback) {
        // console.log("data", data);
        var str = '^' + data.name;
        var re = new RegExp(str, 'i');
        console.log("re", re);

        var medalWinnerPipeLine = [{
            $lookup: {
                "from": "sportslists",
                "localField": "sportslist",
                "foreignField": "_id",
                "as": "sportslist"
            }
        }, {
            $unwind: {
                path: "$sportslist",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $lookup: {
                "from": "sportslistsubcategories",
                "localField": "sportslist.sportsListSubCategory",
                "foreignField": "_id",
                "as": "sportslist.sportsListSubCategory"
            }
        }, {
            $unwind: {
                path: "$sportslist.sportsListSubCategory",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                "sportslist.sportsListSubCategory.name": {
                    $regex: re
                }
            }
        }, {
            $lookup: {
                "from": "agegroups",
                "localField": "ageGroup",
                "foreignField": "_id",
                "as": "ageGroup"
            }
        }, {
            $unwind: {
                path: "$ageGroup",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }];

        async.waterfall([
                // find all sport events
                function (callback) {
                    Sport.aggregate(medalWinnerPipeLine, function (err, sports) {
                        // console.log("sports", sports);
                        var sendObj = {};
                        if (err) {
                            callback(err, null);
                        } else {
                            sendObj.medalWinners = sports;
                            callback(null, sendObj);
                        }
                    });
                },

                function (sendObj, callback) {
                    if (data.event && data.age && data.gender) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                // console.log("singleData", singleData);
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.sportslist.name === data.event && medalData.sport.ageGroup.name === data.age && medalData.sport.gender == data.gender) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        console.log("n", n);
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "error";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else if (data.event && data.age) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.sportslist.name === data.event && medalData.sport.ageGroup.name === data.age) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        console.log("n", n);
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "erroor";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else if (data.event && data.gender) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.sportslist.name === data.event && medalData.sport.gender == data.gender) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "error";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else if (data.age && data.gender) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.ageGroup.name === data.age && medalData.sport.gender == data.gender) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "erroor";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else if (data.event) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.sportslist.name === data.event) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "erroor";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else if (data.age) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.ageGroup.name === data.age) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "erroor";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else if (data.gender) {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        async.eachSeries(found, function (medalData, callback) {
                                            // console.log("medalData", medalData);
                                            if (medalData.sport.gender == data.gender) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        // console.log("n", n);
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.sfaId = n.sfaId;
                                                        info.profile = n.photograph;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "erroor";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });

                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    } else {
                        var final = [];
                        async.eachSeries(sendObj.medalWinners, function (singleData, callback) {
                                // console.log("singleData", singleData);
                                var matchObj = {
                                    "sport": singleData._id
                                }
                                Medal.find(matchObj).deepPopulate("player.school team sport.sportslist.sportsListSubCategory sport.ageGroup").lean().exec(function (err, found) {
                                    if (err) {
                                        callback();
                                    } else if (_.isEmpty(found)) {
                                        callback();
                                    } else {
                                        var obj = {};
                                        obj.medals = [];
                                        // console.log("medal found***", found);
                                        async.eachSeries(found, function (medalData, callback) {
                                            if (medalData) {
                                                obj.name = medalData.sport.ageGroup.name + " " + medalData.sport.sportslist.name;
                                                obj.gender = medalData.sport.gender;
                                                if (!_.isEmpty(medalData.team)) {
                                                    async.each(medalData.team, function (n, callback) {
                                                        console.log("n", n);
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        info.participantName = n.name;
                                                        info.school = n.schoolName;
                                                        if (n.school) {
                                                            info.schoolId = n.school;
                                                        }
                                                        info.team = n._id;
                                                        info.TeamId = n.teamId;
                                                        obj.medals.push(info);
                                                        callback(null, final);
                                                    }, function (err) {
                                                        callback(null, obj);
                                                    });
                                                } else {
                                                    // console.log("went in player", medalData.player);
                                                    async.each(medalData.player, function (n, callback) {
                                                        var info = {};
                                                        info.sport = medalData.sport._id;
                                                        info.medal = medalData.medalType;
                                                        if (n.middleName) {
                                                            info.participantName = n.firstName + " " + n.middleName + " " + n.surname;
                                                        } else {
                                                            info.participantName = n.firstName + " " + n.surname;
                                                        }
                                                        // console.log("n******", n);
                                                        if (n.atheleteSchoolName) {
                                                            info.school = n.atheleteSchoolName;
                                                        } else {
                                                            info.school = n.school.name;
                                                        }
                                                        info.profile = n.photograph;
                                                        info.sfaId = n.sfaId;
                                                        info.athleteId = n._id;
                                                        obj.medals.push(info);
                                                        callback(null, obj);
                                                    }, function (err) {
                                                        if (err) {
                                                            obj.err = "error";
                                                        }
                                                        callback(null, obj);
                                                    });
                                                }
                                            } else {
                                                obj.err = "erroor";
                                                callback(null, obj);
                                            }
                                        }, function (err) {
                                            if (!obj.err) {
                                                final.push(obj);
                                            }
                                            callback(null, obj);
                                        });
                                    }
                                });
                            },
                            function (err) {
                                if (final.length > 0) {
                                    var results = _.groupBy(final, "name");
                                    _.each(results, function (result, key) {
                                        results[key] = _.groupBy(result, 'gender');
                                    });
                                    callback(null, results);
                                } else {
                                    callback(null, []);
                                }
                            });
                    }
                }
            ],
            function (err, finalResult) {
                callback(null, finalResult);
            });
    },

    getAgeGroupsAndEvents: function (data, callback) {
        // console.log("data", data);
        var str = '^' + data.name;
        var re = new RegExp(str, 'i');
        console.log("re", re);
        async.waterfall([
            function (callback) {
                var sendObj = {
                    "ageGroups": [],
                    "events": [],
                    "weight": []
                };
                var pipeline = [{
                    $lookup: {
                        "from": "sportslists",
                        "localField": "sportslist",
                        "foreignField": "_id",
                        "as": "sportslist"
                    }
                }, {
                    $unwind: {
                        path: "$sportslist",
                        includeArrayIndex: "arrayIndex", // optional
                        preserveNullAndEmptyArrays: false // optional
                    }
                }, {
                    $lookup: {
                        "from": "sportslistsubcategories",
                        "localField": "sportslist.sportsListSubCategory",
                        "foreignField": "_id",
                        "as": "sportslist.sportsListSubCategory"
                    }
                }, {
                    $unwind: {
                        path: "$sportslist.sportsListSubCategory",
                        includeArrayIndex: "arrayIndex", // optional
                        preserveNullAndEmptyArrays: false // optional
                    }
                }, {
                    $match: {
                        "sportslist.sportsListSubCategory.name": re
                    }
                }, {
                    $lookup: {
                        "from": "agegroups",
                        "localField": "ageGroup",
                        "foreignField": "_id",
                        "as": "ageGroup"
                    }
                }, {
                    $unwind: {
                        path: "$ageGroup",
                        includeArrayIndex: "arrayIndex", // optional
                        preserveNullAndEmptyArrays: false // optional
                    }
                }, {
                    $lookup: {
                        "from": "weights",
                        "localField": "weight",
                        "foreignField": "_id",
                        "as": "weight"
                    }
                }, {
                    $unwind: {
                        path: "$weight",
                        includeArrayIndex: "arrayIndex", // optional
                        preserveNullAndEmptyArrays: true // optional
                    }
                }, {
                    $project: {
                        // specifications
                        "ageGroup": 1,
                        "sportslist": 1,
                        "weight": 1,
                        "gender": 1
                    }
                }];

                console.log("pipeline", pipeline);
                var agePipeline = _.cloneDeep(pipeline);
                console.log("pipeline", pipeline);
                agePipeline.push({
                    $group: {
                        "_id": "$ageGroup.name"
                    }
                });
                Sport.aggregate(agePipeline, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var temp1 = [];
                        var temp2 = [];
                        sendObj.ageGroups = _.map(data, '_id');
                        _.each(sendObj.ageGroups, function (n, k1) {
                            temp1.push(parseInt((_.split(n, '-'))[1]));
                            if (k1 == sendObj.ageGroups.length - 1) {
                                temp1.sort(function (a, b) {
                                    return a - b
                                });
                                _.each(temp1, function (n, k2) {
                                    temp2.push("U-" + n);
                                    if (k2 == temp1.length - 1) {
                                        sendObj.ageGroups = temp2;
                                        callback(null, sendObj, pipeline);
                                    }
                                });
                            }
                        });
                    }
                })
            },
            function (sendObj, pipeline, callback) {
                console.log("pipeline", pipeline);
                var weightPipeline = _.cloneDeep(pipeline);
                console.log("pipeline", pipeline);
                weightPipeline.push({
                    $group: {
                        "_id": "$weight.name"
                    }
                });
                Sport.aggregate(weightPipeline, function (err, data) {
                    console.log(data);
                    if (err) {
                        callback(err, null);
                    } else if (_.isEmpty(data) || data[0]._id === null || data[0]._id === undefined) {
                        callback(null, sendObj, pipeline);
                    } else {
                        var temp1 = [];
                        var temp2 = [];
                        sendObj.weight = _.map(data, '_id');
                        _.each(sendObj.weight, function (n, k1) {
                            console.log("weight", n, "k1", k1);
                            temp1.push(n);
                            if (k1 == sendObj.weight.length - 1) {
                                temp1.sort(function (a, b) {
                                    return a - b
                                });
                                _.each(temp1, function (n, k2) {
                                    temp2.push(n);
                                    if (k2 == temp1.length - 1) {
                                        sendObj.weight = temp2;
                                        callback(null, sendObj, pipeline);
                                    }
                                });
                            }
                        });
                    }
                })
            },
            function (sendObj, pipeline, callback) {
                var eventPipeline = _.cloneDeep(pipeline);
                eventPipeline.push({
                    $group: {
                        "_id": "$sportslist.name"
                    }
                });
                Sport.aggregate(eventPipeline, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        sendObj.events = _.map(data, '_id');
                        sendObj.gender = ['male', 'female', 'mixed'];
                        callback(null, sendObj);
                    }
                })
            }
        ], function (err, final) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, final);
            }
        });
    }

};
module.exports = _.assign(module.exports, exports, model);