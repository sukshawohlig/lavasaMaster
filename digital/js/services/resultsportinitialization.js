myApp.factory('ResultSportInitialization', function () {
    var obj = {

        //for getting TEPLATE for result"Spotname" eg:resultFootball,resultBasketball etc
        getPlayerTemplate: function (sportName, player) {
            console.log(player, "-----------------------");
            var format = {
                player: player.studentId._id,
                sfaId: player.studentId.sfaId,
                jerseyNo: "",
                isPlaying: false,
                noShow: false,
                walkover: false,
                color: "",
                playerPoints: {},
                firstName: player.studentId.firstName,
                surname: player.studentId.surname,
                fullName: player.studentId.firstName + " " + player.studentId.surname
            };
            switch (sportName) {
                case "Basketball":
                    format.playerPoints.freeThrow = [];
                    format.playerPoints.Points2 = [];
                    format.playerPoints.Points3 = [];
                    format.playerPoints.personalFoul = [];
                    format.playerPoints.technicalFoul = [];
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
                case "Hockey":
                    format.playerPoints.goal = [];
                    format.playerPoints.assist = [];
                    format.playerPoints.redCard = [];
                    format.playerPoints.yellowCard = [];
                    format.playerPoints.greenCard = [];
                    format.playerPoints.penaltyPoint = "";
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
                case "Kabaddi":
                    format.playerPoints.raids = [];
                    format.playerPoints.bonusPoint = [];
                    format.playerPoints.superRaid = [];
                    format.playerPoints.tackle = [];
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
                case "Handball":
                    format.playerPoints.goal = [];
                    format.playerPoints.yellowCard = [];
                    format.playerPoints.greenCard = [];
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
                case "Water Polo":
                    format.playerPoints.goal = [];
                    format.playerPoints.penaltyPoint = "";
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
                case "Volleyball":
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
                case "Football":
                    format.playerPoints.goal = [];
                    format.playerPoints.assist = [];
                    format.playerPoints.redCard = [];
                    format.playerPoints.yellowCard = [];
                    format.playerPoints.penaltyPoint = "";
                    format.playerPoints.in = [];
                    format.playerPoints.out = [];
                    break;
            };

            return format;

        },

        getTeamTemplate: function (sportName, team) {
            console.log("getTeamTemplate", team);
            var format = {
                teamId: team.teamId,
                team: team._id,
                noShow: false,
                walkover: false,
                coach: "",
                schoolName: team.schoolName,
                teamResults: {},
                players: [],
                isDraw: false
            };
            switch (sportName) {
                case "Basketball":
                    format.teamResults.quarterPoints = [{
                        basket: '',
                    }, {
                        basket: '',
                    }, {
                        basket: '',
                    }, {
                        basket: '',
                    }];
                    format.teamResults.finalGoalPoints = "";
                    break;
                case "Handball":
                    format.teamResults.halfPoints = "";
                    format.teamResults.finalPoints = "";
                    format.teamResults.shotsOnGoal = "";
                    format.teamResults.penalty = "";
                    format.teamResults.saves = "";
                    break;
                case "Hockey":
                    format.teamResults.halfPoints = "";
                    format.teamResults.finalPoints = "";
                    format.teamResults.shotsOnGoal = "";
                    format.teamResults.totalShots = "";
                    format.teamResults.penalty = "";
                    format.teamResults.penaltyPoints = "";
                    format.teamResults.penaltyCorners = "";
                    format.teamResults.penaltyStroke = "";
                    format.teamResults.saves = "";
                    format.teamResults.fouls = "";

                    break;
                case "Kabaddi":
                    format.teamResults.halfPoints = "";
                    format.teamResults.finalPoints = "";
                    // format.teamResults.goalPoints = [];
                    // format.teamResults.finalGoalPoints = "";
                    format.teamResults.superTackle = "";
                    format.teamResults.allOut = "";
                    break;

                case "Water Polo":
                    format.teamResults.quarterPoints = [{
                        points: '',
                    }, {
                        points: '',
                    }, {
                        points: '',
                    }, {
                        points: '',
                    }];
                    format.teamResults.finalGoalPoints = "";
                    format.teamResults.shotsOnGoal = "";
                    format.teamResults.totalShots = "";
                    format.teamResults.penalty = "";
                    format.teamResults.penaltyPoints = "";
                    format.teamResults.penalty = "";
                    format.teamResults.saves = "";
                    break;
                case "Volleyball":
                    format.teamResults.set = [];
                    format.teamResults.fouls = "";
                    format.teamResults.spike = "";
                    format.teamResults.block = "";
                    break;
                case "Football":
                    format.formation = "";
                    format.teamResults.halfPoints = 0;
                    format.teamResults.finalPoints = 0;
                    format.teamResults.shotsOnGoal = 0;
                    format.teamResults.totalShots = 0;
                    format.teamResults.corners = 0;
                    format.teamResults.penalty = 0;
                    format.teamResults.saves = 0;
                    format.teamResults.fouls = 0;
                    format.teamResults.offSide = 0;
                    format.teamResults.cleanSheet = 0;
                    format.teamResults.noShow = 0;
                    format.teamResults.walkover = 0;
                    break;
            };

            _.each(team.studentTeam, function (player, pk) {
                format.players[pk] = obj.getPlayerTemplate(sportName, player);
            })

            return format;


        },

        initializeTeamAndPlayers: function (sportName, resultSportname, match) {
            // console.log(resultSportname, match);
            _.each(match.teams, function (team, tk) {
                resultSportname.teams[tk] = obj.getTeamTemplate(sportName, team);
            });
            return resultSportname;
        },

        getResultTemplate: function (sportName, match) {
            var format = {
                "teams": [],
                "matchPhoto": [],
                "scoreSheet": [],
                "status": "",
                "winner": {},
                "isNoMatch": false
            };
            var returnResult = {};

            switch (sportName) {
                case "Basketball":
                    returnResult.resultBasketball = format;
                    returnResult.resultBasketball = obj.initializeTeamAndPlayers(sportName, returnResult.resultBasketball, match);
                    return returnResult;

                case "Football":
                    returnResult.resultFootball = format;
                    obj.initializeTeamAndPlayers(sportName, returnResult.resultFootball, match);
                    return returnResult;

                case "Hockey":
                    returnResult.resultHockey = format;
                    obj.initializeTeamAndPlayers(sportName, returnResult.resultHockey, match);
                    return returnResult;

                case "Kabaddi":
                    returnResult.resultKabaddi = format;
                    obj.initializeTeamAndPlayers(sportName, returnResult.resultKabaddi, match);
                    return returnResult;

                case "Volleyball":
                    returnResult.resultVolleyball = format;
                    obj.initializeTeamAndPlayers(sportName, returnResult.resultVolleyball, match);
                    return returnResult;

                case "Handball":
                    returnResult.resultHandball = format;
                    obj.initializeTeamAndPlayers(sportName, returnResult.resultHandball, match);
                    return returnResult;

                case "Water Polo":
                    returnResult.resultWaterPolo = format;
                    obj.initializeTeamAndPlayers(sportName, returnResult.resultWaterPolo, match);
                    return returnResult;

            }

        },

        getMyResult: function (sportName, match, callback) {
            var template = obj.getResultTemplate(sportName, match);
            console.log("template", template);
            callback(template);
        },
        //for getting TEPLATE for result"Spotname" eg:resultFootball,resultBasketball etc end

        //for getting result variable that sport contains
        getResultVariable: function (sportName, sportType) {
            if (sportType == "Racquet Sports") {
                var arr = _.split(sportName, " ");
                var foundDoubles = _.indexOf(arr, 'Doubles');
                if (foundDoubles == -1) {
                    return {
                        resultVar: "resultsRacquet",
                        opponentsVar: "opponentsSingle"
                    };
                } else {
                    return {
                        resultVar: "resultsRacquet",
                        opponentsVar: "opponentsTeam"
                    };
                }

            } else if (sportType == "Combat Sports") {
                switch (sportName) {
                    case "Karate Team Kumite":
                        return {
                            resultVar: "resultsCombat",
                            opponentsVar: "opponentsTeam"
                        };
                    default:
                        return {
                            resultVar: "resultsCombat",
                            opponentsVar: "opponentsSingle"
                        };
                }

            } else {
                switch (sportName) {
                    case "Basketball":
                        return {
                            resultVar: "resultBasketball",
                            html: "scorebasketball.html",
                            scoringModal: "scoreplayer-basketball.html",
                            opponentsVar: "opponentsTeam"
                        };

                    case "Football":
                        return {
                            resultVar: "resultFootball",
                            html: "scorefootball.html",
                            scoringModal: "scoreplayer-football.html",
                            opponentsVar: "opponentsTeam"
                        };

                    case "Hockey":
                        return {
                            resultVar: "resultHockey",
                            html: "scorehockey.html",
                            scoringModal: "scoreplayer-hockey.html",
                            opponentsVar: "opponentsTeam"
                        };

                    case "Kabaddi":
                        return {
                            resultVar: "resultKabaddi",
                            html: "scorekabaddi.html",
                            scoringModal: "scoreplayer-kabaddi.html",
                            opponentsVar: "opponentsTeam"
                        };

                    case "Volleyball":
                        return {
                            resultVar: "resultVolleyball",
                            html: "scorevolleyball.html",
                            scoringModal: "scoreplayer-volleyball.html",
                            opponentsVar: "opponentsTeam"
                        };

                    case "Handball":
                        return {
                            resultVar: "resultHandball",
                            html: "scorehandball.html",
                            scoringModal: "scoreplayer-handball.html",
                            opponentsVar: "opponentsTeam"
                        };

                    case "Water Polo":
                        return {
                            resultVar: "resultWaterPolo",
                            html: "scorewaterpolo.html",
                            scoringModal: "scoreplayer-waterpolo.html",
                            opponentsVar: "opponentsTeam"
                        };
                    case "Throwball":
                        return {
                            resultVar: "resultsCombat",
                            opponentsVar: "opponentsTeam"
                        };
                    case "Kho Kho":
                        return {
                            resultVar: "resultsCombat",
                            opponentsVar: "opponentsTeam"
                        };
                }
            }


        },
        //for getting result variable that sport contains ends

        getFormattedObject: function (isArray) {
            var obj = {
                isObj: false
            }
            if (isArray) {
                obj.isObj = true;
                obj.obj = {
                    time: ""
                };
            }
            return obj;
        },

        nullOrEmptyTo0:function(sportName,format){
            switch (sportName) {
                case "Basketball":
                    format.teamResults.quarterPoints[0].basket=format.teamResults.quarterPoints[0].basket||0;
                    format.teamResults.quarterPoints[1].basket=format.teamResults.quarterPoints[1].basket||0;
                    format.teamResults.quarterPoints[2].basket=format.teamResults.quarterPoints[2].basket||0;
                    format.teamResults.quarterPoints[3].basket=format.teamResults.quarterPoints[3].basket||0;
                    format.teamResults.finalGoalPoints = format.teamResults.finalGoalPoints||0;
                    break;

                case "Handball":
                    format.teamResults.halfPoints = format.teamResults.halfPoints || 0;
                    format.teamResults.finalPoints = format.teamResults.finalPoints||0;
                    format.teamResults.shotsOnGoal = format.teamResults.shotsOnGoal||0;
                    format.teamResults.penalty = format.teamResults.penalty||0;
                    format.teamResults.saves = format.teamResults.saves||0;
                    break;

                case "Hockey":
                    format.teamResults.halfPoints = format.teamResults.halfPoints||0;
                    format.teamResults.finalPoints = format.teamResults.finalPoints||0;
                    format.teamResults.shotsOnGoal = format.teamResults.shotsOnGoal||0;
                    format.teamResults.totalShots = format.teamResults.totalShots||0;
                    format.teamResults.penalty = format.teamResults.penalty||0;
                    format.teamResults.penaltyPoints = format.teamResults.penaltyPoints||0;
                    format.teamResults.penaltyCorners = format.teamResults.penaltyCorners||0;
                    format.teamResults.penaltyStroke = format.teamResults.penaltyStroke||0;
                    format.teamResults.saves = format.teamResults.saves||0;
                    format.teamResults.fouls = format.teamResults.fouls||0;
                    break;

                case "Kabaddi":
                    format.teamResults.halfPoints = format.teamResults.halfPoints||0;
                    format.teamResults.finalPoints = format.teamResults.finalPoints||0;
                    format.teamResults.superTackle = format.teamResults.superTackle||0;
                    format.teamResults.allOut = format.teamResults.allOut||0;
                    break;

                case "Water Polo":
                    format.teamResults.quarterPoints[0].points=format.teamResults.quarterPoints[0].points||0;
                    format.teamResults.quarterPoints[1].points=format.teamResults.quarterPoints[1].points||0;
                    format.teamResults.quarterPoints[2].points=format.teamResults.quarterPoints[2].points||0;
                    format.teamResults.quarterPoints[3].points=format.teamResults.quarterPoints[3].points||0;
                    format.teamResults.finalGoalPoints = format.teamResults.finalGoalPoints||0;
                    format.teamResults.shotsOnGoal = format.teamResults.shotsOnGoal||0;
                    format.teamResults.totalShots = format.teamResults.totalShots||0;
                    format.teamResults.penalty = format.teamResults.penalty||0;
                    format.teamResults.penaltyPoints = format.teamResults.penaltyPoints||0;
                    format.teamResults.penalty = format.teamResults.penalty||0;
                    format.teamResults.saves = format.teamResults.saves||0;
                    break;

                case "Volleyball":
                    format.teamResults.set = [];
                    format.teamResults.fouls = "";
                    format.teamResults.spike = "";
                    format.teamResults.block = "";
                    break;

                case "Football":
                    format.formation = "";
                    format.teamResults.halfPoints = 0;
                    format.teamResults.finalPoints = 0;
                    format.teamResults.shotsOnGoal = 0;
                    format.teamResults.totalShots = 0;
                    format.teamResults.corners = 0;
                    format.teamResults.penalty = 0;
                    format.teamResults.saves = 0;
                    format.teamResults.fouls = 0;
                    format.teamResults.offSide = 0;
                    format.teamResults.cleanSheet = 0;
                    format.teamResults.noShow = 0;
                    format.teamResults.walkover = 0;
                    break;
            };
            return format;
        }

    }
    return obj;
});
