myApp.controller('ResultsCtrl', function ($scope, TemplateService, $state, NavigationService, $stateParams, toastr, $rootScope, $uibModal, $timeout, knockoutService, configService) {
  $scope.template = TemplateService.getHTML("content/results.html");
  TemplateService.title = "Direct Final"; //This is the Title of the Website
  $scope.navigation = NavigationService.getNavigation();

  // FILTER OPTIONS
  $scope.getFilterOptions = function (n) {
    if (n.type == 'school') {
      if (n.sfaCity == 'Mumbai') {
        $scope.filterOptions = [{
          name: 'Archery'
        }, {
          name: 'Athletics'
        }, {
          name: 'Badminton'
        }, {
          name: 'Basketball'
        }, {
          name: 'Boxing'
        }, {
          name: 'Carrom'
        }, {
          name: 'Chess'
        }, {
          name: 'Fencing'
        }, {
          name: 'Football'
        }, {
          name: 'Handball'
        }, {
          name: 'Hockey'
        }, {
          name: 'Judo'
        }, {
          name: 'Kabaddi'
        }, {
          name: 'Karate'
        }, {
          name: 'Kho Kho'
        }, {
          name: 'Sport MMA'
        }, {
          name: 'Shooting'
        }, {
          name: 'Squash'
        }, {
          name: 'Swimming'
        }, {
          name: 'Table Tennis'
        }, {
          name: 'Taekwondo'
        }, {
          name: 'Tennis'
        }, {
          name: 'Throwball'
        }, {
          name: 'Volleyball'
        }, {
          name: 'Water Polo'
        }, {
          name: 'Wrestling'
        }];
      } else {
        $scope.filterOptions = [{
          name: 'Archery'
        }, {
          name: 'Athletics'
        }, {
          name: 'Badminton'
        }, {
          name: 'Basketball'
        }, {
          name: 'Boxing'
        }, {
          name: 'Carrom'
        }, {
          name: 'Chess'
        }, {
          name: 'Fencing'
        }, {
          name: 'Football'
        }, {
          name: 'Handball'
        }, {
          name: 'Hockey'
        }, {
          name: 'Judo'
        }, {
          name: 'Kabaddi'
        }, {
          name: 'Karate'
        }, {
          name: 'Kho Kho'
        }, {
          name: 'Shooting'
        }, {
          name: 'Swimming'
        }, {
          name: 'Table Tennis'
        }, {
          name: 'Taekwondo'
        }, {
          name: 'Tennis'
        }, {
          name: 'Throwball'
        }, {
          name: 'Volleyball'
        }, {
          name: 'Water Polo'
        }];
      }
    } else {
      $scope.filterOptions = [{
        name: 'Archery'
      }, {
        name: 'Basketball'
      }, {
        name: 'Boxing'
      }, {
        name: 'Carrom'
      }, {
        name: 'Chess'
      }, {
        name: 'Fencing'
      }, {
        name: 'Handball'
      }, {
        name: 'Hockey'
      }, {
        name: 'Judo'
      }, {
        name: 'Kabaddi'
      }, {
        name: 'Shooting'
      }, {
        name: 'Swimming'
      }, {
        name: 'Taekwondo'
      }, {
        name: 'Tennis'
      }, {
        name: 'Volleyball'
      }, {
        name: 'Water Polo'
      }, {
        name: 'Wrestling'
      }];
    }
  };
  // FILTER OPTIONS END
  // MEDAL FILTER OPTIONS
  $scope.medalFilter = {
    gender: "",
    ageGroup: "",
    event: ""
  }
  // MEDAL FILTER OPTIONS END

  configService.getDetail(function (data) {
    $scope.state = data.state;
    $scope.year = data.year;
    $scope.eventYear = data.eventYear;
    $scope.sfaCity = data.sfaCity;
    $scope.isCollege = data.isCollege;
    $scope.type = data.type;
    $scope.getFilterOptions(data);
  });

  // VARIABLE INITITALISE
  $scope.showEventFilter = false;
  $scope.defaultEvent = "sfa mumbai 2015-16";
  $scope.showAllMedalWinner = false;
  $scope.sportFilter = {
    name: "Archery"
  };
  // VARIABLE INITITALISE END

  // FUNCTIONS
  $scope.log = function () {
    console.log($scope.sportFilter, 'filter');
  };
  // SELECT CITY FILTER
  $scope.viewEvent = function () {
    if ($scope.showEventFilter == false) {
      $scope.showEventFilter = true;
    } else {
      $scope.showEventFilter = false;
    }
  }
  $scope.selectEvent = function (event) {
    $scope.selectEvent = event;
    $scope.defaultEvent = event;
    $scope.viewEvent();
    console.log($scope.selectEvent, 'selected event');
  }
  // SELECT CITY FILTER END
  // VIEW MEDAL WINNER
  $scope.showMedalWinner = function () {
    if ($scope.showAllMedalWinner == true) {
      $scope.showAllMedalWinner = false;
    } else {
      $scope.showAllMedalWinner = true;
    }
  }
  // VIEW MEDAL WINNER END
  $scope.closeAllOpen = function (index, detail) {
    _.each($scope.rankTable, function (n, nindex) {
      if (n.rowDetail == true && nindex != index) {
        $scope.addMedalDetail(nindex, n);
      }
    });
    $scope.addMedalDetail(index, detail);
  };

  $scope.addMedalDetail = function (index, detail) {
    console.log(detail, 'detail');
    console.log(index, 'indexS');
    var id = "#rank" + index;
    var demo = "";
    if (detail.rowDetail == true) {
      detailId = "#rankDetail" + index;
      console.log(detailId, 'det');
      $(detailId).remove();
      detail.rowDetail = false;
      // $(id).after(demo);
    } else {
      var detailTable = "";
      _.each(detail.sportData, function (n) {
        n.goldMedal = 0;
        n.silverMedal = 0;
        n.bronzeMedal = 0;
        if (n.medals) {
          if (n.medals.gold) {
            n.goldMedal = n.medals.gold.count;
          }
          if (n.medals.silver) {
            n.silverMedal = n.medals.silver.count;
          }
          if (n.medals.bronze) {
            n.bronzeMedal = n.medals.bronze.count;
          }
        }
        console.log('sport', n);
        // <td colspan="3"> <div> </div> </td>
        detailTable = detailTable + '<tr>   <td class="dd-sportname">' + n.name + ' </td> <td > <div class="detail-resultholder"> ' + n.goldMedal + ' </div> </td> <td > <div class="detail-resultholder">' + n.silverMedal + ' </div> </td> <td > <div class="detail-resultholder">' + n.bronzeMedal + ' </div> </td> <td > <div class="detail-resultholder">' + n.totalPoints + ' </div> </td> </tr>';
      });
      $scope.rankDetail = detail;
      demo = '<tr id="rankDetail' + index + '"> <td class = "pad-clear" colspan = "6"> <div class="schoolrank-details"> <table class = "table"> ' + detailTable + '</table> </div> </td> </tr>'
      detail.rowDetail = true;
      $(id).after(demo);
    }
  };

  // VIEW MORE / LESS FUNCTIONS
  // SCHOOL RANKING TABLE
  $scope.viewMoreRanking = function (bool) {
    if (bool) {
      $scope.rankTable.showTable = false;
      $scope.rankTable.tableLimit = $scope.rankTable.length;
    } else {
      $scope.rankTable.showTable = true;
      $scope.rankTable.tableLimit = 20;
      TemplateService.scrollTo('schoolRankTable', 'id');
    }
  }
  // SCHOOL RANKING TABLE END
  // SPORT RANKING TABLE
  $scope.viewMoreSport = function (bool) {
    if (bool) {
      $scope.sportTable.showTable = false;
      $scope.sportTable.tableLimit = $scope.sportTable.length;
    } else {
      $scope.sportTable.showTable = true;
      $scope.sportTable.tableLimit = 5;
      TemplateService.scrollTo('sportRankingTable', 'id');
    }
  }
  // SPORT RANKING TABLE END
  // VIEW MORE / LESS FUNCTIONS END
  // FUNCTIONS END

  // APIS
  // GENERATE RANKING TABLE
  // $scope.generateTable = function(){
  //   NavigationService.getSchoolRank(function(data){
  //     if (data.data = true)7 {
  //       console.log("table GENERATED");
  //     }
  //   });
  // };
  // GENERATE RANKING TABLE END
  // GET RANKING TABLE
  $scope.getSchoolByRanks = function(){
    NavigationService.getSchoolByRanks(function (data) {
      console.log('rankingTable', data);
      if (data.value == true) {
        $scope.rankTable = data.data;
        $scope.rankTable.tableLimit = 20;
        $scope.rankTable.showTable = true;
        _.each($scope.rankTable, function (n,nkey) {
          n.rowDetail = false;
          n.goldCount = 0;
          n.silverCount = 0;
          n.bronzeCount = 0;
          if (n.medal) {
            if (n.medal.gold) {
              n.goldCount = n.medal.gold.count;
            }
            if (n.medal.silver) {
              n.silverCount = n.medal.silver.count;
            }
            if (n.medal.bronze) {
              n.bronzeCount = n.medal.bronze.count;
            }
          }
          if(!n.totalPoints){
            n.totalPoints = 0;
          }
        });
      } else {
        toastr.error('Ranking Table Error', 'Error');
      }
    });
  }
  $scope.getSchoolByRanks();

  // GET RANKING TABLE END
  // GET MEDAL FILTER
  $scope.getMedalFilter = function(){
    NavigationService.getAgeGroupsAndEvents($scope.sportFilter, function(data){
      // console.log('getAgeGroupsAndEvents',data);
      if (data.value = true) {
        var data = data.data;
        $scope.medalFilterList = {
          ageGroups: data.ageGroups,
          events: data.events,
          gender: data.gender
        }
        console.log('medalFilterList',$scope.medalFilterList);
      } else{
        console.log("getAgeGroupsAndEvents Failed", data);
      }
    });
  }

  $scope.medalList = function(){
    console.log("medalFilter", $scope.medalFilter);
  }
  // GET MEDAL FILTER END
  // GET MEDAL WINNER
  $scope.getMedalWinners = function(){
    NavigationService.getMedalWinners($scope.sportFilter, function(data){
      console.log('getMedalWinners',data);
    });
  }
  // GET MEDAL WINNER END
  // GET SPORT RANKING TABLE
  $scope.getSchoolBySport = function () {
    NavigationService.getSchoolBySport($scope.sportFilter, function (data) {
      var data = data.data;
      if (data.value == true) {
        $scope.sportTable = data.data.table;
        $scope.risingAthletes = data.data.risingAthletes;
        if(data.data.medalWinners){
          $scope.medalWinners = data.data.medalWinners;
          $scope.medalWinners = _.groupBy($scope.medalWinners, 'name');
        }
        $scope.sportTable.tableLimit = 5;
        $scope.sportTable.showTable = true;
        _.each($scope.risingAthletes, function (n) {
          n.fullName = n.athleteProfile.firstName + n.athleteProfile.surname;
          // n.goldCount = n.medalData
        });
        $scope.showAllMedalWinner = false;
        console.log('School Table', $scope.sportTable);
        console.log('rising', $scope.risingAthletes);
      } else {
        toastr.error('Sport Ranking Error', 'Error');
      }
    });
    $scope.getMedalFilter();
    // $scope.getMedalWinners();
  };
  $scope.getSchoolBySport();
  // GET SPORT RANKING TABLE END
  // APIS END

  // JSONS
  $scope.eventList = ['sfa mumbai 2015-16', 'sfa ahmedabad 2015-16', 'sfa hyderabad 2015-16'];

  // ALL MEDAL WINNERS
  $scope.medalWinners = [{
    sport: "Athletics",
    eventName: "50m",
    age: "U-6",
    winners: [{
      gender: "male",
      list: [{
        name: "Anwar Hatela",
        school: "jamnabai high school",
        medal: 'gold'
      }, {
        name: "Dawood Ibrahim",
        school: "jamnabai high school",
        medal: 'silver'
      }, {
        name: "Chota Shakeel",
        school: "jamnabai high school",
        medal: 'bronze'
      }]
    }, {
      gender: "female",
      list: [{
        name: "Anwar Hatela",
        school: "jamnabai high school",
        medal: 'gold'
      }, {
        name: "Dawood Ibrahim",
        school: "jamnabai high school",
        medal: 'silver'
      }, {
        name: "Chota Shakeel",
        school: "jamnabai high school",
        medal: 'bronze'
      }]
    }]
  }, {
    sport: "Athletics",
    eventName: "100m",
    age: "U-12",
    winners: [{
      gender: "male",
      list: [{
        name: "Anwar Hatela",
        school: "jamnabai high school",
        medal: 'gold'
      }, {
        name: "Dawood Ibrahim",
        school: "jamnabai high school",
        medal: 'silver'
      }, {
        name: "Chota Shakeel",
        school: "jamnabai high school",
        medal: 'bronze'
      }]
    }, {
      gender: "female",
      list: [{
        name: "Anwar Hatela",
        school: "jamnabai high school",
        medal: 'gold'
      }, {
        name: "Dawood Ibrahim",
        school: "jamnabai high school",
        medal: 'silver'
      }, {
        name: "Chota Shakeel",
        school: "jamnabai high school",
        medal: 'bronze'
      }]
    }]
  }, {
    sport: "Athletics",
    eventName: "200m",
    age: "U-16",
    winners: [{
      gender: "male",
      list: [{
        name: "Anwar Hatela",
        school: "jamnabai high school",
        medal: 'gold'
      }, {
        name: "Dawood Ibrahim",
        school: "jamnabai high school",
        medal: 'silver'
      }, {
        name: "Chota Shakeel",
        school: "jamnabai high school",
        medal: 'bronze'
      }]
    }, {
      gender: "female",
      list: [{
        name: "Anwar Hatela",
        school: "jamnabai high school",
        medal: 'gold'
      }, {
        name: "Dawood Ibrahim",
        school: "jamnabai high school",
        medal: 'silver'
      }, {
        name: "Chota Shakeel",
        school: "jamnabai high school",
        medal: 'bronze'
      }]
    }]
  }];
  // ALL MEDAL WINNERS END
  // JSONS END

  //
})
