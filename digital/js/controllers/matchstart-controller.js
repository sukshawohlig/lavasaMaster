myApp.controller('MatchStartCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $stateParams, $state, toastr, $rootScope) {
  $scope.template = TemplateService.getHTML("content/match-start.html");
  TemplateService.title = "Sport Match"; //This is the Title of the Website
  $scope.navigation = NavigationService.getNavigation();
  $scope.matchId = $stateParams.id;
  // VARIABLE INITIALISE
  $scope.showMatchPhoto = false;
  $scope.matchData = {};
  $scope.matchDetails = {};
  $scope.matchPics = [];
  $scope.disableWinner = false;
  $scope.matchError = "";
  $scope.showError = false;
  $scope.removeReset = true;
  $scope.drawFormat = $stateParams.drawFormat;
  $scope.savePlayerList = [];
  $scope.savePlayers = {};
  // VARIABLE INITIALISE END

  //INTEGRATION
  // GET MATCH PLAYERS
  $scope.getIndividualPlayers = function () {
    $scope.individualPlayers = {
      sport: $stateParams.sport
    }
    NavigationService.getIndividualPlayers($scope.individualPlayers, function (data) {
      if (data.value == true) {
        $scope.playerLists = data.data;
        console.log("player success", data.data);
      } else {
        console.log("player fail", data);
      }
    });
  }
  $scope.getIndividualPlayers();
  // GET MATCH PLAYERS
  // ADD MATCH PLAYERS
  $scope.addPlayersMatch = function () {
    $scope.savePlayers.matchId = $scope.matchDetails.matchId;
    $scope.savePlayers.opponentsSingle = [];
    _.each($scope.savePlayerList, function (n) {
      if (n._id != "") {
        $scope.savePlayers.opponentsSingle.push(n._id);
      }
    });
    console.log("$scope.savePlayerList", $scope.savePlayers);
    NavigationService.addPlayersMatch($scope.savePlayers, function (data) {
      if (data.value == true) {
        // $scope.
        toastr.success("Players added successfully.");
        $scope.getOneMatch();
        console.log("$scope.savePlayerList", data.data);
      } else {
        toastr.error("Save Failed", "Error");
      }
    });
  };
  // ADD MATCH PLAYERS END
  // START SCORING SINGLE REDIRECT
  $scope.scoringRedirect = function(formData){
    console.log("hello");
    if (formData) {
      if ($scope.matchDetails.players.length == 1) {
        toastr.error('Minimum 2 Players required to start scoring');
      } else {
        // if (formData.matchPhoto.length == 0) {
        //   toastr.error('Please upload match photo.', 'Data Incomplete');
        // }
        //  else {
        // FOR IMG COMPULSORY
        $scope.matchResult = {
          matchId: $scope.matchData.matchId
        }
        switch ($scope.matchDetails.sportType) {
          case "Combat Sports":
            if ($scope.drawFormat == "League cum Knockout") {
              $scope.matchResult.resultFencing = formData;
              if (!$scope.matchResult.resultFencing.status) {
                $scope.matchResult.resultFencing.status = "IsLive";
              }
            } else {
              $scope.matchResult.resultsCombat = formData;
              if (!$scope.matchResult.resultsCombat.status) {
                $scope.matchResult.resultsCombat.status = "IsLive";
              }
            }
            break;
          case "Racquet Sports":
            $scope.matchResult.resultsRacquet = formData;
            if (!$scope.matchResult.resultsRacquet.status) {
              $scope.matchResult.resultsRacquet.status = "IsLive";
            }
            break;
          case "Team Sports":
            switch ($scope.matchDetails.sportsName) {
              case "Kho Kho":
              case "Throwball":
                $scope.matchResult.resultsCombat = formData;
                if (!$scope.matchResult.resultsCombat.status) {
                  $scope.matchResult.resultsCombat.status = "IsLive";
                }
                break;
            }
            break;
          case "Individual Sports":
            console.log("IN Individual SPORT")
            if ($scope.drawFormat == "League cum Knockout") {
              $scope.matchResult.resultFencing = formData;
              if (!$scope.matchResult.resultFencing.status) {
                $scope.matchResult.resultFencing.status = "IsLive";
              }
            } else {
              console.log("IN IF ELSE")
              $scope.matchResult.resultsCombat = formData;
              if (!$scope.matchResult.resultsCombat.status) {
                $scope.matchResult.resultsCombat.status = "IsLive";
              }
            }
            break;

        }
        if ($scope.drawFormat == "League cum Knockout") {
          console.log($scope.matchResult, 'saveijk');
          NavigationService.saveFencing($scope.matchResult, function (data) {
            if (data.value == true) {
              $state.go("scoreleague", {
                drawFormat: $stateParams.drawFormat,
                sport: $stateParams.sport,
                id: $scope.matchData.matchId
              });
            } else {
              toastr.error('Data save failed. Please try again or check your internet connection.', 'Save Error');
            }
          })
        } else {
          NavigationService.saveMatch($scope.matchResult, function (data) {
            if (data.value == true) {
              switch ($scope.matchDetails.sportType) {
                case "Combat Sports":
                  if ($scope.matchDetails.isTeam == false) {
                    $state.go("scorecombat", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                  } else if ($scope.matchDetails.isTeam == true) {
                    $state.go("scorecombatteam", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                  }

                  break;
                case "Racquet Sports":
                  if ($scope.matchDetails.isTeam == false) {
                    $state.go("scoreracquet", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                  } else if ($scope.matchDetails.isTeam == true) {
                    $state.go("scoreracquetdoubles", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                  }
                  break;
                case "Team Sports":
                  switch ($scope.matchDetails.sportsName) {
                    case "Kho Kho":
                    case "Throwball":
                      $state.go("scorecombatteam", {
                        drawFormat: $stateParams.drawFormat,
                        sport: $stateParams.sport,
                        id: $scope.matchData.matchId
                      });
                      break;
                  }
                  break;
                case "Individual Sports":
                  if ($scope.matchDetails.isTeam == false) {
                    $state.go("scorecombat", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                  } else if ($scope.matchDetails.isTeam == true) {
                    $state.go("scorecombatteam", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                  }
                  break;
              }
            } else {
              toastr.error('Data save failed. Please try again or check your internet connection.', 'Save Error');
            }
          });
        }
        // }
        // FOR IMG COMPULSORY
      }
    } else {
      toastr.error('No data to save. Please check for valid MatchID.', 'Save Error');
    }
  }
  // START SCORING SINGLE REDIRECT END
  // START SCORING TEAM REDIRECT
  $scope.scoringRedirectTeam = function(formData){
    console.log("hello");
    if (formData) {
      if ($scope.matchDetails.teams.length == 1) {
        toastr.error('Minimum 2 Teams required to start scoring');
      } else {
        // if (formData.matchPhoto.length == 0) {
        //   toastr.error('Please upload match photo.', 'Data Incomplete');
        // }
        //  else {

        $scope.matchResult = {
          matchId: $scope.matchData.matchId
        }
        switch ($scope.matchDetails.sportType) {
          case "Combat Sports":
            $scope.matchResult.resultsCombat = formData;
            if (!$scope.matchResult.resultsCombat.status) {
              $scope.matchResult.resultsCombat.status = "IsLive";
            }
            break;
          case "Racquet Sports":
            $scope.matchResult.resultsRacquet = formData;
            if (!$scope.matchResult.resultsRacquet.status) {
              $scope.matchResult.resultsRacquet.status = "IsLive";
            }
            break;
          case "Team Sports":
            switch ($scope.matchDetails.sportsName) {
              case "Kho Kho":
              case "Throwball":
                $scope.matchResult.resultsCombat = formData;
                if (!$scope.matchResult.resultsCombat.status) {
                  $scope.matchResult.resultsCombat.status = "IsLive";
                }
                break;
            }
            break;
        }
        NavigationService.saveMatch($scope.matchResult, function (data) {
          if (data.value == true) {
            switch ($scope.matchDetails.sportType) {
              case "Combat Sports":
                $state.go("scorecombatteam", {
                  drawFormat: $stateParams.drawFormat,
                  sport: $stateParams.sport,
                  id: $scope.matchData.matchId
                });

                break;
              case "Racquet Sports":
                $state.go("scoreracquetdoubles", {
                  drawFormat: $stateParams.drawFormat,
                  sport: $stateParams.sport,
                  id: $scope.matchData.matchId
                });
                break;
              case "Team Sports":
                switch ($scope.matchDetails.sportsName) {
                  case "Kho Kho":
                  case "Throwball":
                    $state.go("scorecombatteam", {
                      drawFormat: $stateParams.drawFormat,
                      sport: $stateParams.sport,
                      id: $scope.matchData.matchId
                    });
                    break;
                }
                break;
            }
          } else {
            toastr.error('Data save failed. Please try again.', 'Save Error');
          }
        });
        // }
      }
    } else {
      toastr.error('No data to save. Please check for valid MatchID.', 'Save Error');
    }
  }
  // START SCORING TEAM REDIRECT END
  // INITIALSE MATCH RESULTS
  $scope.initialiseResults = function (flag, size) {
    // INITIALISE RESULTS
    switch ($scope.matchDetails.sportType) {
      case "Combat Sports":
        if ($scope.matchDetails.isTeam == false) {
          console.log("COMBAT SINGLE!");
          if ($scope.drawFormat == "League cum Knockout") {
            if ($scope.matchDetails.resultFencing == null || $scope.matchDetails.resultFencing == "" || $scope.matchDetails.resultFencing == undefined) {
              $scope.matchDetails.resultFencing = {};
              $scope.formData = {
                "players": [],
                "matchPhoto": [],
                "scoreSheet": [],
                "winner": {},
                "isNoMatch": false
              }
              _.each($scope.matchDetails.players, function (n, key) {
                $scope.formData.players[key] = {
                  "player": n._id,
                  "firstName": n.firstName,
                  "surname": n.surname,
                  "fullName": n.firstName + " " + n.surname,
                  "sfaId": n.sfaId,
                  "noShow": false,
                  "walkover": false,
                  "finalPoints": ""
                }
              })
              console.log('EPRR', $scope.formData);
            } else {
              $scope.formData = $scope.matchDetails.resultFencing;
              if ($scope.matchDetails.resultFencing.status == 'IsCompleted') {
                toastr.warning("This match has already been scored.", "Match Complete");
              }
            }
          } else {
            if ($scope.matchDetails.resultsCombat == null || $scope.matchDetails.resultsCombat == "" || $scope.matchDetails.resultsCombat == undefined) {
              $scope.matchDetails.resultsCombat = {};
              $scope.formData = {
                "players": [],
                "matchPhoto": [],
                "scoreSheet": [],
                "winner": {},
                "isNoMatch": false
              }
              _.each($scope.matchDetails.players, function (n, key) {
                $scope.formData.players[key] = {
                  "player": n._id,
                  "firstName": n.firstName,
                  "surname": n.surname,
                  "fullName": n.firstName + " " + n.surname,
                  "sfaId": n.sfaId,
                  "noShow": false,
                  "walkover": false,
                  "sets": [{
                    point: "",
                  }]
                }
              })
            } else {
              $scope.formData = $scope.matchDetails.resultsCombat;
              if ($scope.matchDetails.resultsCombat.status == 'IsCompleted') {
                toastr.warning("This match has already been scored.", "Match Complete");
                if ($stateParams.drawFormat === 'Knockout') {
                  $state.go('knockout', {
                    drawFormat: $stateParams.drawFormat,
                    id: $stateParams.sport
                  });
                } else if ($stateParams.drawFormat === 'Heats') {
                  $state.go('heats', {
                    drawFormat: $stateParams.drawFormat,
                    id: $stateParams.sport
                  });
                }
              }
            }
          }
        } else if ($scope.matchDetails.isTeam == true) {
          console.log("COMBAT TEAM");
          if ($scope.matchDetails.resultsCombat == null || $scope.matchDetails.resultsCombat == "" || $scope.matchDetails.resultsCombat == undefined) {
            $scope.matchDetails.resultsCombat = {};
            $scope.formData = {
              "teams": [],
              "matchPhoto": [],
              "scoreSheet": [],
              "winner": {},
              "isNoMatch": false
            }
            _.each($scope.matchDetails.teams, function (n, key) {
              $scope.formData.teams[key] = {
                "team": n._id,
                "teamId": n.teamId,
                "schoolName": n.schoolName,
                "noShow": false,
                "walkover": false,
                "sets": [{
                  point: "",
                }],
                "players": []
              }
              _.each($scope.matchDetails.teams[key].studentTeam, function (m, mkey) {
                $scope.formData.teams[key].players[mkey] = {
                  "player": m.studentId._id,
                  "firstName": m.studentId.firstName,
                  "surname": m.studentId.surname,
                  "fullName": m.studentId.firstName + " " + m.studentId.surname,
                  "sfaId": m.sfaId,
                  "isPlaying": false,
                  "jerseyNo": "",
                }
              })
            })
          } else {
            $scope.formData = $scope.matchDetails.resultsCombat;
            if ($scope.matchDetails.resultsCombat.status == 'IsCompleted') {
              toastr.warning("This match has already been scored.", "Match Complete");
              if ($stateParams.drawFormat === 'Knockout') {
                $state.go('knockout-team', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              } else if ($stateParams.drawFormat === 'Heats') {
                $state.go('heats', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              }
            }
          }
        }
        break;
      case "Racquet Sports":
        if ($scope.matchDetails.isTeam == false) {
          console.log("RACQUET SINGLE!");
          if ($scope.matchDetails.resultsRacquet == null || $scope.matchDetails.resultsRacquet == "" || $scope.matchDetails.resultsRacquet == undefined) {
            $scope.matchDetails.resultsRacquet = {};
            $scope.formData = {
              "players": [],
              "matchPhoto": [],
              "scoreSheet": [],
              "winner": {},
              "isNoMatch": false
            }
            _.each($scope.matchDetails.players, function (n, key) {
              $scope.formData.players[key] = {
                "player": n._id,
                "firstName": n.firstName,
                "surname": n.surname,
                "fullName": n.firstName + " " + n.surname,
                "sfaId": n.sfaId,
                "noShow": false,
                "walkover": false,
                "sets": [{
                  point: "",
                  ace: "",
                  winner: "",
                  unforcedError: "",
                  serviceError: "",
                  doubleFaults: ""
                }]
              }
            })
          } else {
            $scope.formData = $scope.matchDetails.resultsRacquet;
            if ($scope.matchDetails.resultsRacquet.status == 'IsCompleted') {
              if ($stateParams.drawFormat === 'Knockout') {
                toastr.warning("This match has already been scored.", 'Scoring Completed');
                $state.go('knockout', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              } else if ($stateParams.drawFormat === 'Heats') {
                toastr.warning("This match has already been scored.", 'Scoring Completed');
                $state.go('heats', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              }
            }
          }
        } else if ($scope.matchDetails.isTeam == true) {
          console.log("RACQUET TEAMS!");
          if ($scope.matchDetails.resultsRacquet == null || $scope.matchDetails.resultsRacquet == "" || $scope.matchDetails.resultsRacquet == undefined) {
            $scope.matchDetails.resultsRacquet = {};
            $scope.formData = {
              "teams": [],
              "matchPhoto": [],
              "scoreSheet": [],
              "winner": {},
              "isNoMatch": false
            }
            _.each($scope.matchDetails.teams, function (n, key) {
              $scope.formData.teams[key] = {
                "team": n._id,
                "teamId": n.teamId,
                "schoolName": n.schoolName,
                "noShow": false,
                "walkover": false,
                "sets": [{
                  point: "",
                  ace: "",
                  winner: "",
                  unforcedError: "",
                  serviceError: "",
                  doubleFaults: ""
                }],
                "players": []
              }
              _.each($scope.matchDetails.teams[key].studentTeam, function (m, mkey) {
                $scope.formData.teams[key].players[mkey] = {
                  "player": m.studentId._id,
                  "firstName": m.studentId.firstName,
                  "surname": m.studentId.surname,
                  "fullName": m.studentId.firstName + " " + m.studentId.surname,
                  "sfaId": m.studentId.sfaId,
                  "isPlaying": false,
                }
              })
            })
          } else {
            $scope.formData = $scope.matchDetails.resultsRacquet;
            if ($scope.matchDetails.resultsRacquet.status == 'IsCompleted') {
              toastr.warning("This match has already been scored.", "Match Complete");
              if ($stateParams.drawFormat === 'Knockout') {
                $state.go('knockout-doubles', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              } else if ($stateParams.drawFormat === 'Heats') {
                $state.go('heats', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              }
            }
          }
        }
        break;
      case "Team Sports":
        switch ($scope.matchDetails.sportsName) {
          case "Throwball":
          case "Kho Kho":
            console.log('throwball ? KHO KHO');
            if ($scope.matchDetails.resultsCombat == null || $scope.matchDetails.resultsCombat == "" || $scope.matchDetails.resultsCombat == undefined) {
              $scope.matchDetails.resultsCombat = {};
              $scope.formData = {
                "teams": [],
                "matchPhoto": [],
                "scoreSheet": [],
                "winner": {},
                "isNoMatch": false
              }
              _.each($scope.matchDetails.teams, function (n, key) {
                $scope.formData.teams[key] = {
                  "team": n._id,
                  "teamId": n.teamId,
                  "schoolName": n.schoolName,
                  "noShow": false,
                  "walkover": false,
                  "coach": "",
                  "players": [],
                  "sets": [{
                    point: "",
                  }]
                }
                _.each($scope.matchDetails.teams[key].studentTeam, function (m, mkey) {
                  $scope.formData.teams[key].players[mkey] = {
                    "player": m.studentId._id,
                    "firstName": m.studentId.firstName,
                    "surname": m.studentId.surname,
                    "fullName": m.studentId.firstName + " " + m.studentId.surname,
                    "sfaId": m.studentId.sfaId,
                    "isPlaying": false,
                    "jerseyNo": "",
                  }
                })
              })
            } else {
              $scope.formData = $scope.matchDetails.resultsCombat;
              console.log($scope.formData, 'form');
              if ($scope.matchDetails.resultsCombat.status == 'IsCompleted') {
                toastr.warning("This match has already been scored.", "Match Complete");
                if ($stateParams.drawFormat === 'Knockout') {
                  $state.go('knockout-team', {
                    drawFormat: $stateParams.drawFormat,
                    id: $stateParams.sport
                  });
                } else if ($stateParams.drawFormat === 'Heats') {
                  $state.go('heats', {
                    drawFormat: $stateParams.drawFormat,
                    id: $stateParams.sport
                  });
                }
              }
            }
            break;
        }
        break;
      case "Individual Sports":
        if ($scope.matchDetails.isTeam == false) {
          console.log("COMBAT SINGLE!", $scope.drawFormat);
          if ($scope.drawFormat == "League cum Knockout") {
            if ($scope.matchDetails.resultFencing == null || $scope.matchDetails.resultFencing == "" || $scope.matchDetails.resultFencing == undefined) {
              $scope.matchDetails.resultFencing = {};
              $scope.formData = {
                "players": [],
                "matchPhoto": [],
                "scoreSheet": [],
                "winner": {},
                "isNoMatch": false
              }
              _.each($scope.matchDetails.players, function (n, key) {
                $scope.formData.players[key] = {
                  "player": n._id,
                  "firstName": n.firstName,
                  "surname": n.surname,
                  "fullName": n.firstName + " " + n.surname,
                  "sfaId": n.sfaId,
                  "noShow": false,
                  "walkover": false,
                  "finalPoints": ""
                }
              })
              console.log('EPRR', $scope.formData);
            } else {
              $scope.formData = $scope.matchDetails.resultFencing;
              if ($scope.matchDetails.resultFencing.status == 'IsCompleted') {
                toastr.warning("This match has already been scored.", "Match Complete");
              }
            }
          } else {
            if ($scope.matchDetails.resultsCombat == null || $scope.matchDetails.resultsCombat == "" || $scope.matchDetails.resultsCombat == undefined) {
              console.log("in carrom");
              $scope.matchDetails.resultsCombat = {};
              $scope.formData = {
                "players": [],
                "matchPhoto": [],
                "scoreSheet": [],
                "winner": {},
                "isNoMatch": false
              }
              _.each($scope.matchDetails.players, function (n, key) {
                $scope.formData.players[key] = {
                  "player": n._id,
                  "firstName": n.firstName,
                  "surname": n.surname,
                  "fullName": n.firstName + " " + n.surname,
                  "sfaId": n.sfaId,
                  "noShow": false,
                  "walkover": false,
                  "sets": [{
                    point: "",
                  }]
                }
              })
              console.log("CARROM formdata", $scope.formData);
            } else {
              $scope.formData = $scope.matchDetails.resultsCombat;
              if ($scope.matchDetails.resultsCombat.status == 'IsCompleted') {
                toastr.warning("This match has already been scored.", "Match Complete");
                if ($stateParams.drawFormat === 'Knockout') {
                  $state.go('knockout', {
                    drawFormat: $stateParams.drawFormat,
                    id: $stateParams.sport
                  });
                } else if ($stateParams.drawFormat === 'Heats') {
                  $state.go('heats', {
                    drawFormat: $stateParams.drawFormat,
                    id: $stateParams.sport
                  });
                }
              }
            }
          }
        }
        break;
    }
    // INITIALISE RESULTS END
    switch (size) {
      case 'single':
        if (flag == 'redirect') {
          $scope.scoringRedirect($scope.formData);
        } else if (flag == 'modal') {
          $scope.showNoModal();
        }
      break;
      case 'team':
        if (flag == 'redirect') {
          $scope.scoringRedirectTeam($scope.formData);
        } else if (flag == 'modal') {
          $scope.showNoModalTeam();
        }
      break;
    }
  }
  // INITIALSE MATCH RESULTS END
  // GET MATCH
  $scope.getOneMatch = function () {
    $scope.matchData.matchId = $stateParams.id;
    NavigationService.getOneMatch($scope.matchData, function (data) {
      if (data.value == true) {
        if (data.data.error) {
          $scope.matchError = data.data.error;
          console.log($scope.matchError, 'error');
          toastr.error('Invalid MatchID. Please check the MatchID entered.', 'Error');
        }
        $scope.matchDetails = data.data;
        $scope.matchDetails.matchId = $scope.matchData.matchId;
        console.log($scope.matchDetails, '$scope.matchDetails');
        if ($scope.matchDetails.opponentsSingle) {
          _.each($scope.matchDetails.opponentsSingle, function (n) {
            $scope.savePlayerList.push({
              _id: n
            })
          });
          if ($scope.matchDetails.opponentsSingle.length < 2) {
            $scope.savePlayerList.push({
              _id: ''
            })
          }
        } else {
          $scope.savePlayerList = [{
            _id: ''
          }, {
            _id: ''
          }]
        }

        console.log("players", $scope.savePlayerList);
      } else {
        console.log("ERROR IN getOneMatch");
        //redirect back to sportselection page
        // $state.go("sport-selection");
      }
    })
  };
  $scope.getOneMatch();
  // GET MATCH END
  // GET MATCH SCORESHEET
  $scope.getMatchPhoto = function (detail) {
    console.log(detail, 'pic return');
    $scope.showMatchPhoto = true;
  };
  // GET MATCH SCORESHEET END
  // REMOVE MATCH SCORESHEET
  $scope.removeMatchScore = function (pic) {
    _.remove($scope.formData.matchPhoto, function (n) {
      return n.image === pic.image;
    })
  }
  // REMOVE MATCH SCORESHEET END
  // NO MATCH
  $scope.setNoMatch = function () {
    _.each($scope.formData.players, function (player) {
      player.noShow = true;
      player.walkover = false;
    })
    $scope.formData.isNoMatch = true;
  }
  // NO MATCH END
  // TEAM NO MATCH
  $scope.setTeamNoMatch = function () {
    _.each($scope.formData.teams, function (team) {
      team.noShow = true;
      team.walkover = false;
    })
    $scope.formData.isNoMatch = true;
  }
  // TEAM NO MATCH END
  // SAVE RESULT
  $scope.saveResult = function (formData) {
    $scope.initialiseResults('redirect', 'single');
    console.log(formData, 'svae data');
  }
  // SAVE RESULT END
  // SAVE TEAM RESULT
  $scope.saveTeamResult = function (formData) {
    $scope.initialiseResults('redirect', 'team');
    console.log(formData, 'svae data');
  }
  // SAVE TEAM RESULT END
  // UPDATE WINNER RESULT
  $scope.updateWinnerResult = function () {
    $scope.matchResult = {
      matchId: $scope.matchData.matchId
    }
    switch ($scope.matchDetails.sportType) {
      case "Combat Sports":
        if ($scope.drawFormat == "League cum Knockout") {
          $scope.matchResult.resultFencing = $scope.formData;
          $scope.matchResult.resultFencing.status = "IsCompleted";
          _.each($scope.matchResult.resultFencing.players, function (n) {
            n.finalPoints = 0;
          });
        } else {
          $scope.matchResult.resultsCombat = $scope.formData;
          $scope.matchResult.resultsCombat.status = "IsCompleted";
          _.each($scope.matchResult.resultsCombat.players, function (n) {
            n.finalPoints = 0;
          });
        }
        break;
      case "Racquet Sports":
        $scope.matchResult.resultsRacquet = $scope.formData;
        $scope.matchResult.resultsRacquet.status = "IsCompleted";
        _.each($scope.matchResult.resultsRacquet.players, function (n) {
          n.sets = [];
        });
        break;
      case "Team Sports":
        switch ($scope.matchDetails.sportsName) {
          case "Kho Kho":
          case "Throwball":
            $scope.matchResult.resultsCombat = formData;
            if (!$scope.matchResult.resultsCombat.status) {
              $scope.matchResult.resultsCombat.status = "IsLive";
            }
            break;
        }
        break;
      case "Individual Sports":
        if ($scope.drawFormat == "League cum Knockout") {
          $scope.matchResult.resultFencing = $scope.formData;
          $scope.matchResult.resultFencing.status = "IsCompleted";
          _.each($scope.matchResult.resultFencing.players, function (n) {
            n.finalPoints = 0;
          });
        } else {
          $scope.matchResult.resultsCombat = $scope.formData;
          $scope.matchResult.resultsCombat.status = "IsCompleted";
          _.each($scope.matchResult.resultsCombat.players, function (n) {
            n.finalPoints = 0;
          });
        }
        break;


    }
    if ($scope.drawFormat == "League cum Knockout") {
      NavigationService.saveFencing($scope.matchResult, function (data) {
        if (data.value == true) {
          $state.go('league-knockoutIndividual', {
            drawFormat: $stateParams.drawFormat,
            id: $stateParams.sport
          });
        } else {
          toastr.error('Data save failed. Please try again or check your internet connection.', 'Save Error');
        }
      })
    } else {
      NavigationService.saveMatch($scope.matchResult, function (data) {
        if (data.value == true) {
          if ($stateParams.drawFormat === 'Knockout') {
            $state.go('knockout', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
          } else if ($stateParams.drawFormat === 'Heats') {
            $state.go('heats', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
          }
        } else {
          toastr.error('Match save failed. Please try again', 'Scoring Save Failed');
        }
      });
    }
  }
  // SAVE WINNER
  $scope.saveWinner = function () {
    console.log($scope.formData, 'savedata');
    if ($scope.matchDetails.players.length == 1) {
      if ($scope.formData.players[0].noShow == true) {
        $scope.formData.isNoMatch = true;
        $scope.formData.winner.player = "";
        $scope.formData.winner.opponentsSingle = "";
        $scope.updateWinnerResult();
      } else {
        $scope.formData.isNoMatch = false;
        if ($scope.formData.winner.player == "" || !$scope.formData.winner.player) {
          toastr.warning('Please select a winner');
        } else {
          if ($scope.formData.players[0].walkover == true) {
            $scope.updateWinnerResult();
          } else {
            $scope.formData.winner.reason = 'Bye';
            $scope.updateWinnerResult();
          }
        }
      }
    } else {
      if ($scope.formData.players[0].noShow == true && $scope.formData.players[1].noShow == true) {
        $scope.formData.isNoMatch = true;
        $scope.formData.winner = {};
        $scope.formData.winner.player = "";
        $scope.formData.winner.opponentsSingle = "";
        $scope.updateWinnerResult();
      } else {
        $scope.formData.isNoMatch = false;
        if ($scope.formData.winner.player == "" || !$scope.formData.winner.player) {
          toastr.warning('Please select a winner');
        } else {
          _.each($scope.formData.players, function (n) {
            if ($scope.formData.winner.player == n.player) {
              n.walkover = true;
              n.noShow = false;
            } else {
              n.walkover = false;
              n.noShow = true;
            }
          })
          $scope.updateWinnerResult();
        }
      }
    }
  }
  // SAVE WINNER  END
  // SAVE TEAM WINNER
  $scope.updateTeamWinner = function () {
    $scope.matchResult = {
      matchId: $scope.matchData.matchId
    }
    switch ($scope.matchDetails.sportType) {
      case "Combat Sports":
        $scope.matchResult.resultsCombat = $scope.formData;
        $scope.matchResult.resultsCombat.status = "IsCompleted";
        _.each($scope.matchResult.resultsCombat.players, function (n) {
          n.finalPoints = 0;
        });
        break;
      case "Racquet Sports":
        $scope.matchResult.resultsRacquet = $scope.formData;
        $scope.matchResult.resultsRacquet.status = "IsCompleted";
        if ($scope.matchDetails.isTeam == true) {
          _.each($scope.matchResult.resultsRacquet.teams, function (n) {
            n.sets = [];
          })
        }
        console.log("yiyiffui", $scope.matchResult);
        break;
      case "Team Sports":
        switch ($scope.matchDetails.sportsName) {
          case "Kho Kho":
          case "Throwball":
            $scope.matchResult.resultsCombat = $scope.formData;
            $scope.matchResult.resultsCombat.status = "IsCompleted";
            break;
        }
        break;
    }
    NavigationService.saveMatch($scope.matchResult, function (data) {
      if (data.value == true) {
        switch ($scope.matchDetails.sportType) {
          case "Combat Sports":
            if ($stateParams.drawFormat === 'Knockout') {
              $state.go('knockout-team', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            } else if($stateParams.drawFormat === 'League cum Knockout') {
              $state.go('league-knockoutTeam', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            } else if ($stateParams.drawFormat === 'Heats') {
              $state.go('heats', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            }
            break;
          case "Racquet Sports":
            if ($stateParams.drawFormat === 'Knockout') {
              $state.go('knockout-doubles', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            } else if ($stateParams.drawFormat === 'Heats') {
              $state.go('heats', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            }
            break;
          case "Team Sports":
            switch ($scope.matchDetails.sportsName) {
              case "Kho Kho":
              case "Throwball":
              if ($stateParams.drawFormat === 'Knockout') {
                $state.go('knockout-team', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              } else if($stateParams.drawFormat === 'League cum Knockout') {
                $state.go('league-knockoutTeam', {
                  drawFormat: $stateParams.drawFormat,
                  id: $stateParams.sport
                });
              }
                break;
            }
            break;
        }
      } else {
        alert('fail save');
      }
    });
  }
  $scope.saveTeamWinner = function () {
    if ($scope.matchDetails.teams.length == 1) {
      if ($scope.formData.teams[0].noShow == true) {
        $scope.formData.isNoMatch = true;
        $scope.formData.winner.player = "";
        $scope.updateTeamWinner();
      } else {
        $scope.formData.isNoMatch = false;
        if ($scope.formData.winner.player == "" || !$scope.formData.winner.player) {
          toastr.warning('Please select a winner');
        } else {
          if ($scope.formData.teams[0].walkover == true) {
            $scope.updateTeamWinner();
          } else {
            $scope.formData.winner.reason = 'Bye';
            $scope.updateTeamWinner();
          }
        }
      }
    } else {
      if ($scope.formData.teams[0].noShow == true && $scope.formData.teams[1].noShow == true) {
        $scope.formData.isNoMatch = true;
        $scope.formData.winner = {};
        $scope.formData.winner.player = "";
        $scope.updateTeamWinner();
      } else {
        $scope.formData.isNoMatch = false;
        if ($scope.formData.winner.player == "" || !$scope.formData.winner.player) {
          toastr.warning('Please select a winner');
        } else {
          _.each($scope.formData.teams, function (n) {
            if ($scope.formData.winner.player == n.team) {
              n.walkover = true;
              n.noShow = false;
            } else {
              n.walkover = false;
              n.noShow = true;
            }
          })
          $scope.updateTeamWinner();
        }
      }
    }
  }
  // SAVE TEAM WINNER END
  // INTEGRATION END
  // OPEN MATCH-NO MATCH MODAL
  $scope.showNoMatch = function () {
    $scope.initialiseResults();
    if ($scope.formData) {
      if ($scope.matchDetails.isTeam == false) {
        $uibModal.open({
          animation: true,
          scope: $scope,
          backdrop: 'static',
          keyboard: false,
          templateUrl: 'views/modal/match-nomatch.html',
          size: 'lg',
          windowClass: 'match-nomatch'
        })
      } else if ($scope.matchDetails.isTeam == true) {
        $uibModal.open({
          animation: true,
          scope: $scope,
          backdrop: 'static',
          keyboard: false,
          templateUrl: 'views/modal/team-match-nomatch.html',
          size: 'lg',
          windowClass: 'match-nomatch'
        })
      }

    } else {
      toastr.error('No player data to enter.', 'Error');
    }

  }
  // OPEN MATCH-NO MATCH MODAL
  // RESET RESULT POPUP
  $scope.resetResultPop = function () {
    $rootScope.modalInstance = $uibModal.open({
      animation: true,
      scope: $scope,
      templateUrl: 'views/modal/resetresult.html',
      windowClass: 'completematch-modal resetresult-modal'
    })
  }
  // RESET RESULT POPUP END
  // RESET MATCH RESULT
  $scope.resetMatchResult = function () {
    $scope.formData = {};
    $scope.matchResult = {
      matchId: $scope.matchData.matchId
    }
    switch ($scope.matchDetails.sportType) {
      case "Combat Sports":
        if ($scope.drawFormat == 'League cum Knockout') {
          $scope.matchResult.resultFencing = $scope.formData;
          if (!$scope.matchResult.resultFencing.status) {
            // $scope.matchResult.resultFencing.status = "IsPending";
          }
        } else {
          $scope.matchResult.resultsCombat = $scope.formData;
          if (!$scope.matchResult.resultsCombat.status) {
            // $scope.matchResult.resultsCombat.status = "IsPending";
          }
        }
        break;
      case "Racquet Sports":
        $scope.matchResult.resultsRacquet = $scope.formData;
        if (!$scope.matchResult.resultsRacquet.status) {
          // $scope.matchResult.resultsRacquet.status = "IsPending";
        }
        break;
      case "Team Sports":
        if ($scope.drawFormat == 'League cum Knockout') {
          $scope.matchResult.resultFencing = $scope.formData;
          if (!$scope.matchResult.resultFencing.status) {
            // $scope.matchResult.resultFencing.status = "IsPending";
          }
        } else {
          $scope.matchResult.resultsCombat = $scope.formData;
          if (!$scope.matchResult.resultsCombat.status) {
            // $scope.matchResult.resultsCombat.status = "IsPending";
          }
        }
        break;
    }
    if ($scope.drawFormat == 'League cum Knockout') {
      NavigationService.saveFencing($scope.matchResult, function (data) {
        if (data.value == true) {
          $state.go("scoreleague", {
            drawFormat: $stateParams.drawFormat,
            sport: $stateParams.sport,
            id: $scope.matchData.matchId
          });
        } else {
          toastr.error('Data save failed. Please try again or check your internet connection.', 'Save Error');
        }
      })
    } else {
      NavigationService.saveMatch($scope.matchResult, function (data) {
        if (data.value == true) {
          $rootScope.modalInstance.close('a');
          toastr.success('Match result has been successfully reset', 'Result Reset');
          if ($stateParams.drawFormat === 'Knockout') {
            if ($scope.matchDetails.sportType == 'Team Sports') {
              $state.go('knockout-team', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            } else {
              $state.go('knockout', {
                drawFormat: $stateParams.drawFormat,
                id: $stateParams.sport
              });
            }
          } else if ($stateParams.drawFormat === 'Heats') {
            $state.go('heats', {
              drawFormat: $stateParams.drawFormat,
              id: $stateParams.sport
            });
          }
        } else {
          toastr.error('Match result reset failed. Please try again', 'Result Reset Failed');
        }
      });
    }
  }
  // RESET MATCH RESULT
  // REMOVE RESET
  $scope.removeReset = function () {
    $scope.removeReset = false;
  }
  // REMOVE RESET END

})
