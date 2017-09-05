myApp.controller('ChampionshipScheduleCtrl', function ($scope, TemplateService, $state, NavigationService, $stateParams, toastr, $timeout, errorService, loginService, selectService, $rootScope, $uibModal) {
    $scope.template = TemplateService.getHTML("content/draws-schedule/championship-schedule.html");
    TemplateService.title = "Direct Final"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();

    $scope.sportList = ['football', 'Basketball', 'tennis', 'chess'];
    $scope.genderList = ['male', 'female', 'mixed'];
    $scope.data = [1, 2, 3, 4, 5, 6, 7, 8];
    $scope.schedulelist = [{
        sport: 'Archery',
        date1: '15',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Athletics',

    }, {
        sport: 'Badminton',
        date1: '6',
        date2: '13',
        month: 'Dec'
    }, {
        sport: 'Basketball',
        date1: '6',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Boxing',
        date1: '13',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Carrom',
        date1: '13',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Chess',
        date1: '13',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Fencing',
        date1: '14',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Football',
        date1: '6',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Handball',
        date1: '6',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Hockey',
    }, {
        sport: 'Judo',
        date1: '16',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Kabaddi',
        date1: '6',
        date2: '12',
        month: 'Dec'
    }]

    $scope.schedulelist2 = [{
        sport: 'Karate',
        date1: '8',
        date2: '10',
        month: 'Dec'
    }, {
        sport: 'Kho Kho',
        date1: '7',
        date2: '10',
        month: 'Dec'


    }, {
        sport: 'Sport MMA',
        date1: '11',
        date2: '12',
        month: 'Dec'
    }, {
        sport: 'Shooting',
        date1: '13',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Squash',
        date1: '12',
        date2: '14',
        month: 'Dec'
    }, {
        sport: 'Swimming',
        date1: '9',
        date2: '10',
        month: 'Dec'
    }, {
        sport: 'Table Tennis',
        date1: '6',
        date2: '11',
        month: 'Dec'
    }, {
        sport: 'Taekwondo',
        date1: '6',
        date2: '7',
        month: 'Dec'
    }, {
        sport: 'Tennis',
        date1: '7',
        date2: '13',
        month: 'Dec'
    }, {
        sport: 'Throwball',
        date1: '14',
        date2: '17',
        month: 'Dec'
    }, {
        sport: 'Volleyball',
        date1: '6',
        date2: '17',
        month: 'Dec'

    }, {
        sport: 'Water Polo',
        date: '11',
        month: 'Dec'
    }, {
        sport: '',
        date: '',
        month: ''
    }];
    $scope.formData = {};


    NavigationService.getAllSpotsList(function (data) {
        errorService.errorCode(data, function (allData) {
            if (!allData.message) {
                if (allData.value) {
                    $scope.sportList = allData.data;
                    console.log("$scope.sportList", $scope.sportList);
                }
            } else {
                toastr.error(allData.message, 'Error Message');
            }
        });
    });
    NavigationService.getAllAgeGroups(function (data) {
        errorService.errorCode(data, function (allData) {
            if (!allData.message) {
                if (allData.value) {
                    $scope.ageGroups = allData.data;
                }
            } else {
                toastr.error(allData.message, 'Error Message');
            }
        });
    });
    NavigationService.getAllWeights(function (data) {
        errorService.errorCode(data, function (allData) {
            if (!allData.message) {
                if (allData.value) {
                    $scope.allWeights = allData.data;
                }
            } else {
                toastr.error(allData.message, 'Error Message');
            }
        });
    });
    $scope.nameOfSport = {};
    $scope.requestObj = {};
    $scope.sportName = function (sportName, sportId) {
        console.log("sportId", sportId);
        $scope.nameOfSport = sportName;
        console.log("$scope.nameOfSport", $scope.nameOfSport);
        if (sportName === 'Boxing' || sportName === 'Judo' || sportName === 'Kumite' || sportName === 'Taekwondo' || sportName === 'Sport MMA') {
            $scope.showWeight = true;
        } else {
            $scope.showWeight = false;
        }
        $scope.requestObj._id = sportId;
        NavigationService.getAllBySport($scope.requestObj, function (data) {

            errorService.errorCode(data, function (allData) {
                if (!allData.message) {
                    if (allData.value) {
                        console.log("  allData.data;", allData.data);
                        $scope.getAllBySport = allData.data;
                    }
                } else {
                    toastr.error(allData.message, 'Error Message');
                }
            });

        });

    };

    $scope.viewDraw = function (formData) {
        console.log("$scope.viewDraw", $scope.nameOfSport);
        NavigationService.getQuickSportId(formData, function (data) {
            errorService.errorCode(data, function (allData) {
                if (!allData.message) {
                    if (allData.value) {
                        $scope.drawDetails = allData.data;
                        if ($scope.drawDetails === 'No Data Found') {
                            toastr.error('No Event Found', 'Error Message');
                        }
                        console.log($scope.drawDetails, " $scope.drawDetails");
                        if ($scope.drawDetails.drawFormat === 'Knockout') {
                            $state.go('knockout', {
                                id: $scope.drawDetails.sport
                            });
                        } else if ($scope.drawDetails.drawFormat === 'Heats') {
                            console.log("$scope.nameOfSport", $scope.nameOfSport);
                            if ($scope.nameOfSport === '50m Freestyle' || $scope.nameOfSport === '50m Backstroke' || $scope.nameOfSport === '50m Breaststroke' || $scope.nameOfSport === '50m Butterfly' || $scope.nameOfSport === '100m Freestyle' || $scope.nameOfSport === '100m Backstroke' || $scope.nameOfSport === '100m Breaststroke' || $scope.nameOfSport === '100m Butterfly' || $scope.nameOfSport === '200m Individual Medley' || $scope.nameOfSport === 'Swimming 4x50m Freestyle Relay' || $scope.nameOfSport === 'Swimming 4x50m Medley Relay') {
                                $state.go('time-trial', {
                                    id: $scope.drawDetails.sport,
                                    name: $scope.nameOfSport

                                });
                            } else {
                                console.log("im in else");
                                $state.go('heats', {
                                    id: $scope.drawDetails.sport
                                });
                            }

                        } else if ($scope.drawDetails.drawFormat === 'Qualifying Round') {
                            $state.go('qf-final', {
                                id: $scope.drawDetails.sport,
                                name: $scope.nameOfSport

                            });
                        }
                    }
                } else {
                    toastr.error(allData.message, 'Error Message');
                }
            });
        });
    };



    // MODAL
    var modal;
    $scope.matchCenter = function () {
        modal = $uibModal.open({
            animation: true,
            scope: $scope,
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'views/modal/matchcenter.html',
            size: 'lg',
            windowClass: 'matchcenter-modal'
        })
    }
    // MODAL END
    $scope.oneAtATime = true;
    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };

});