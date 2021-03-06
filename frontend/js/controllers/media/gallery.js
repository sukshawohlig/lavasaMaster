myApp.controller('MediaGalleryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $http, $log, configService, $stateParams) {
    //Used to name the .html file

    $scope.template = TemplateService.getHTML("content/media-gallery.html");
    TemplateService.title = "Media Gallery"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
    $scope.flags = {};
    $scope.flags.openGallery = false;
    $scope.flag = {};
    $scope.classes = {};
    $scope.filter = {};
    $scope.folders = [];
    $scope.flag.openGallerys = false;
    //configService
    configService.getDetail(function (data) {
        $scope.state = data.state;
        $scope.year = data.year;
        $scope.eventYear = data.eventYear;
        $scope.sfaCity = data.sfaCity;
        $scope.isCollege = data.isCollege;
        $scope.type = data.type;
    });
    // if ($stateParams.name) {
    //     console.log($stateParams);
    //     $scope.flags.openGallery = true
    // }
    // if ($stateParams.name) {
    //     console.log($stateParams);
    //     $scope.flag.openGallerys = true
    // }

    $scope.tab = 'photos';
    $scope.classa = 'active-list';
    $scope.classb = '';
    $scope.classc = '';
    $scope.classd = '';


    $scope.tabchange = function (tab, a) {
        //console.log(tab);
        $scope.tab = tab;
        if (a == 1) {

            $scope.classa = "active-list";
            $scope.classb = '';
            $scope.classc = '';
            $scope.classd = '';

        } else if (a == 2) {

            $scope.classa = '';
            $scope.classb = "active-list";
            $scope.classc = "";
            $scope.classd = '';


        } else if (a == 3) {

            $scope.classa = '';
            $scope.classb = '';
            $scope.classd = '';
            $scope.classc = "active-list";

        } else {

            $scope.classa = '';
            $scope.classb = '';
            $scope.classc = '';
            $scope.classd = "active-list";

        }
    };
    $scope.tabchanges = function (tabs, a) {
        $scope.tabs = tabs;
        // console.log(tabs);
        if (tabs === 'photo') {

            $scope.classes.classp = "active-list";
            $scope.classes.classv = '';
            $scope.classes.classpc = '';

        } else if (tabs == 'video') {

            $scope.classes.classp = '';
            $scope.classes.classv = "active-list";
            $scope.classes.classpc = '';
        } else if (tabs == 'press-photo') {
            $scope.classes.classp = "";
            $scope.classes.classv = '';
            $scope.classes.classpc = 'active-list';
            $scope.classes.classpcp = 'active-list';

        } else if (tabs == 'press-video') {
            $scope.classes.classp = "";
            $scope.classes.classv = '';
            $scope.classes.classpc = 'active-list';
            $scope.classes.classpcv = 'active-list';
        }

    };
    $scope.getMediaFolders = function () {
        $scope.folders = undefined;
        NavigationService.getFolders($scope.filter, function (response) {
            if (response.data !== 'Folders Not Found') {
                // console.log(response);
                $scope.folders = response.data;
                _.each($scope.folders, function (key) {
                    key.medialink = key.media;
                    key.thumbnail = "../img/media-video-thumb.jpg";
                });
                NavigationService.getVideoThumbnail($scope.folders);
            } else {
                // console.log("No data found");
                $scope.folders = [];
            }
        });
    };
    $scope.loadMedia = function (year) {
        if (year == '2015' || year == '2016') {
            if ($stateParams.type && $stateParams.folder) {
                window.open("https://mumbai.sfanow.in/media-gallery/" + $stateParams.type + "/" + $stateParams.folder, '_self');
            } else {
                window.open("https://mumbai.sfanow.in/media-gallery", '_self');
            }

        }
        $scope.mediaArr = undefined;
        NavigationService.getLimitedMedia($scope.filter, function (response) {
            if (response.value) {
                // console.log("get limited media : ", response);
                $scope.mediaArr = response.data;
                $scope.totalCount = $scope.mediaArr.options.count;
                if ($scope.filter.mediatype == 'video') {
                    _.each($scope.mediaArr.results, function (n) {
                        n.thumbnail = "../img/media-video-thumb.jpg";
                    })
                    NavigationService.getVideoThumbnail($scope.mediaArr.results);
                }
            } else {
                // console.log("No data found");
                $scope.mediaArr.results = [];
            }
        });
    };
    //console.log($stateParams);
    if (!$stateParams.type && !$stateParams.folder) {
        $scope.filter.mediatype = "photo";
        $scope.flags.openGallery = false;
        $scope.tabchanges('photo', 1);
        $scope.getMediaFolders();
    } else {
        if ($stateParams.type && $stateParams.folder) {
            $scope.filter.mediatype = $stateParams.type;
            $scope.filter.folder = $stateParams.folder;
            $scope.filter.year = "2017";
            // $scope.filter.pagenumber = 1;
            $scope.filter.page = 1;
            $scope.loadMedia();
            $scope.tabchanges($scope.filter.mediatype, 1);
            $scope.flags.openGallery = true;
        } else if ($stateParams.type) {
            $scope.filter.mediatype = $stateParams.type;
            $scope.flags.openGallery = false;
            $scope.tabchanges($stateParams.type, 1);
            // console.log($scope.filter);
            $scope.getMediaFolders();
        }
    }
    $scope.tabs = 'photo';
    $scope.classp = 'active-list';
    $scope.classv = '';

    $scope.folder = [
        'img/m1.jpg',
        'img/m2.jpg',
        'img/m3.jpg',
        'img/m1.jpg',
        'img/m2.jpg',
        'img/m3.jpg',
        'img/m3.jpg',
        'img/m3.jpg'

    ];



});