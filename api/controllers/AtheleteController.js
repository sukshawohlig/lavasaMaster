module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    saveAthelete: function (req, res) {
        if (req.body) {
            async.waterfall([
                    function (callback) {
                        ConfigProperty.find().lean().exec(function (err, property) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (_.isEmpty(property)) {
                                    callback(null, []);
                                } else {
                                    callback(null, property);
                                }
                            }
                        });
                    },
                    function (property, callback) {
                        req.body.property = property[0];
                        Athelete.saveAthelete(req.body, res.callback);

                    }
                ],
                function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        callback(null, data2);
                    }

                });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    generateAtheleteSfaID: function (req, res) {
        if (req.body) {
            Athelete.generateAtheleteSfaID(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    updatePaymentStatusBackend: function (req, res) {
        if (req.body) {
            Athelete.updatePaymentStatusBackend(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    delete: function (req, res) {
        if (req.body) {
            Athelete.delete(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    searchByFilter: function (req, res) {
        Athelete.searchByFilter(req.body, res.callback);
    },

    search: function (req, res) {
        if (req.body) {
            Athelete.search(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    searchByNameId: function (req, res) {
        if (req.body) {
            Athelete.searchByNameId(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    getTargetAthlete: function (req, res) {
        res.connection.setTimeout(200000000);
        req.connection.setTimeout(200000000);
        if (req.body) {
            Athelete.getTargetAthlete(req.body, res);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    getOneBySfaId: function (req, res) {
        if (req.body) {
            Athelete.getOneBySfaId(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    getOneBySfaIdStatus: function (req, res) {
        if (req.body) {
            Athelete.getOneBySfaIdStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    generateExcelOld: function (req, res) {
        res.connection.setTimeout(200000000);
        req.connection.setTimeout(200000000);
        Athelete.generateExcelOld(res);
    },

    generateExcel: function (req, res) {
        res.connection.setTimeout(200000000);
        req.connection.setTimeout(200000000);
        if (req.body) {
            console.log(req.body);
            Athelete.generateExcel(req.body, res);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    filterAthlete: function (req, res) {
        if (req.body) {
            Athelete.filterAthlete(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    getAllAtheleteDetails: function (req, res) {
        if (req.body) {
            Athelete.getAllAtheleteDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    getOneAtheleteDetails: function (req, res) {
        if (req.body) {
            Athelete.getOneAtheleteDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    generateEmailOTP: function (req, res) {
        if (req.body) {
            async.waterfall([
                    function (callback) {
                        ConfigProperty.find().lean().exec(function (err, property) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (_.isEmpty(property)) {
                                    callback(null, []);
                                } else {
                                    callback(null, property);
                                }
                            }
                        });
                    },
                    function (property, callback) {
                        req.body.propertyType = property[0].institutionType;
                        req.body.city = property[0].sfaCity;
                        req.body.year = property[0].year;
                        req.body.eventYear = property[0].eventYear;
                        Athelete.generateEmailOTP(req.body, res.callback);
                    }
                ],
                function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        callback(null, data2);
                    }

                });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    generateMobileOTP: function (req, res) {
        if (req.body) {
            Athelete.generateMobileOTP(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    registeredAtheletePaymentMail: function (req, res) {
        if (req.body) {
            Athelete.registeredAtheletePaymentMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    cronAthleteWithPaymentDue: function (req, res) {
        async.waterfall([
                function (callback) {
                    ConfigProperty.find().lean().exec(function (err, property) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(property)) {
                                callback(null, []);
                            } else {
                                callback(null, property);
                            }
                        }
                    });
                },
                function (property, callback) {
                    req.body.property = property[0];
                    console.log("property", req.body.property);
                    Athelete.cronAthleteWithPaymentDue(req.body, res.callback);

                }
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, data2);
                }

            });
    },

    cronAthleteWithSportsRegistrationDue: function (req, res) {
        async.waterfall([
                function (callback) {
                    ConfigProperty.find().lean().exec(function (err, property) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(property)) {
                                callback(null, []);
                            } else {
                                callback(null, property);
                            }
                        }
                    });
                },
                function (property, callback) {
                    req.body.property = property[0];
                    console.log("property", req.body.property);
                    Athelete.cronAthleteWithSportsRegistrationDue(req.body, res.callback);

                }
            ],
            function (err, data2) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, data2);
                }

            });
    },

    updateAthleteName: function (req, res) {
        if (req.body) {
            Athelete.updateAthleteName(req.body, res.callback);
        } else {
            res.json({
                data: "Body Not Found",
                value: false
            });
        }
    },
    updateAthleteEmailMobileNo: function (req, res) {
        if (req.body) {
            Athelete.updateAthleteEmailMobileNo(req.body, res.callback);
        } else {
            res.json({
                data: "No data found",
                value: false
            });
        }
    },

    getAthletePaymentStatus: function (req, res) {
        if (req.body) {
            Athelete.getAthletePaymentStatus(req.body, res.callback);

        } else {
            res.json({
                data: "No data found",
                value: false
            });
        }
    },
    getOneAthlete: function (req, res) {
        if (req.body && req.body._id) {
            Athelete.getOneAthlete(req.body, res.callback);
        } else {
            res.json({
                data: "Please provide parameters",
                value: false
            });
        }
    },
    getOTP: function (req, res) {
        if (req.body && req.body.sfaId) {
            Athelete.getOTP(req.body, res.callback);
        } else {
            res.json({
                data: "Please provide parameters",
                value: false
            });
        }
    }

};
module.exports = _.assign(module.exports, controller);