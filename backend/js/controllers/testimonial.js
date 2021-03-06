// TABLE CONTROLLER
myApp.controller('TestimonialCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal, crudService) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("player-registration/testimonial/tabletestimonial");
  $scope.menutitle = NavigationService.makeactive("Testimonial");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();

  // VAR
  $scope.formData = {};
  $scope.formData.page = 1;
  $scope.formData.type = '';
  $scope.formData.keyword = '';

  // SEARCHTABLE
  $scope.searchInTable = function (data) {
    $scope.formData.page = 1;
    if (data.length >= 2) {
      $scope.formData.keyword = data;
      $scope.viewTable();
    } else if (data.length == '') {
      $scope.formData.keyword = data;
      $scope.viewTable();
    }
  }

  // VIEW TABLE
  $scope.viewTable = function () {
    $scope.url = "Testimonial/search";
    $scope.formData.page = $scope.formData.page++;
    NavigationService.apiCall($scope.url, $scope.formData, function (data) {
      console.log("data.value", data);
      $scope.items = data.data.results;
      $scope.totalItems = data.data.total;
      $scope.maxRow = data.data.options.count;
    });
  }
  $scope.viewTable();
  // VIEW TABLE

  // DELETE
  $scope.crudService = crudService;
  var url = "Testimonial/delete";
  $scope.confirmDelete = function (data) {
    crudService.confirmDelete(data, url, $scope);
  }
  // DELETE END

});
// TABLE CONTROLLER END

// DETAIL CONTROLLER
myApp.controller('DetailTestimonialCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal, crudService) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("player-registration/testimonial/detailtestimonial");
  $scope.menutitle = NavigationService.makeactive("Testimonial");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  var url = 'Testimonial'

  $scope.formData = {};
  // GET ONE
  if ($stateParams.id) {
    $scope.title = 'Edit';
    var id = $stateParams.id;
    crudService.getOneData(url, id, function (data) {
      if (data) {
        $scope.formData = data;
      }
    })
  }
  // GET ONE END
  // SAVE FUNCTION
  var state = 'testimonial'
  $scope.saveData = function (data) {
    crudService.saveData(data, url, state);
  }
  // SAVE FUNCTION END
});
// DETAIL CONTROLLER END
