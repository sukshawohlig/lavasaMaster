myApp.controller('athleteAccountCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, crudService, $state, toastr, $uibModal) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("accounts/athlete/athleteaccount");
  $scope.menutitle = NavigationService.makeactive("Athletes Account");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();

  // ACCORDIAN

  $scope.oneAtATime = true;
  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
  // END ACCORDIAN

  // VARIABLE
  $scope.formData = {};
  $scope.athleteformData = {};
  // $scope.formData.packageData = [];
  $scope.formData.transactions = [];
  $scope.formData.transaction = [];
  $scope.athleteformData.page = 1;
  $scope.athleteformData.keyword = '';

  // SEARCHTABLE
  $scope.searchInTable = function (data) {
    $scope.athleteformData.page = 1;
    if (data.length >= 2) {
      $scope.athleteformData.keyword = data;
      $scope.viewTable();
    } else if (data.length == '') {
      $scope.athleteformData.keyword = data;
      $scope.viewTable();
    }
  };

  // VIEW TABLE
  $scope.viewTable = function () {
    $scope.url = "Accounts/getAthleteAccount";
    $scope.athleteformData.page = $scope.athleteformData.page++;
    $scope.athleteformData.filter = {};
    // $scope.formData.filter.pageType = '';
    $scope.athleteformData.page = $scope.athleteformData.page++;
    NavigationService.apiCall($scope.url, $scope.athleteformData, function (data) {
      console.log("data.value", data);
      $scope.items = data.data.results;
      $scope.totalItems = data.data.total;
      $scope.maxRow = data.data.options.count;
      _.each($scope.items, function (key) {
        // console.log(key.athlete, "key in array");
        key.athleteData = {};
        $scope.athletePackage = key.athlete.package;
        key.currentAthletePackage = _.find(key.transaction, ['package', $scope.athletePackage])
        // console.log($scope.currentAthletePackage, "check this");
        // key.athleteData = $scope.getAthleteAccountDetails(key._id)
        $scope.getOneUrl = "Accounts/getAccount";
        $scope.getOneConstraints = {}
        $scope.getOneConstraints._id = {}
        $scope.getOneConstraints._id = key._id;
        NavigationService.apiCall($scope.getOneUrl, $scope.getOneConstraints, function (data) {
          // console.log(data, "new api call")
          key.athleteData = data.data;
          if (data.data.display) {
            data.data.display.payuId = _.uniq(data.data.display.payuId);
            data.data.display.receiptId = _.uniq(data.data.display.receiptId);
            key.displayData = data.data.display;
          }
        });
      })
      console.log($scope.items, "after each");
    });
  }
  $scope.viewTable();
  // VIEW TABLE


  // GET ATHLETE DATA
  $scope.getAthleteAccountDetails = function (athleteAccountId) {
    console.log(athleteAccountId, "after function");
    $scope.url = "Accounts/getAccount";
    $scope.constraints = {}
    $scope.constraints._id = {}
    $scope.constraints._id = athleteAccountId;
    NavigationService.apiCall($scope.url, $scope.constraints, function (data) {
      console.log(data, "new api call")
      $scope.athleteData = data.data;
    });
  }
  // GET ATHLETE DATA END


  // MODAL
  $scope.editAccountModal = function (player) {
    console.log("athlete", player);

    // ASSIGN VALUE IN MODAL
    if (player.athlete.coupon) {
      $scope.athleteCouponCode = player.athlete.coupon.code;
    }
    $scope.formData.athleteId = player.athlete._id;
    $scope.formData._id = player._id;
    $scope.formData.cgst = player.athleteData.cgst;
    $scope.formData.sgst = player.athleteData.sgst;
    $scope.formData.igst = player.athleteData.igst;
    $scope.formData.refundAmount = player.athleteData.refundAmount;
    $scope.formData.outstandingAmount = player.athleteData.outstandingAmount;
    $scope.formData.discount = player.athleteData.discount;
    $scope.formData.netTotal = player.athleteData.totalPaid;
    $scope.formData.paymentMode = player.athleteData.paymentMode;
    $scope.formData.remarks = player.athleteData.remarks;
    $scope.formData.transactions = player.athleteData.transaction;
    $scope.upgradePaymentstatus = player.athleteData.upgradePaymentStatus;
    var upgradePackage = player.athlete.package;
    $scope.shouldCallApi = false;
    console.log(upgradePackage, "check for package");


    if (player.athleteData.transaction.length) {
      _.each(player.athleteData.transaction, function (key) {
        if (key.package._id == upgradePackage) {
          // console.log("key i am in value")
          key.currentAthletePackage = true;
        } else {
          key.currentAthletePackage = false;
        }
      })
    }

    $scope.modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modal/manualaccount.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      scope: $scope,
      windowClass: 'accounts-modal'
    });

    // console.log($scope.modalInstance, "modal");
  }
  // MODAL END


  // ADD ROW FUNCTION

  $scope.manualPackageEntry = function (formData) {
    if (!formData) {
      $scope.formData.transactions.push({
        "dateOfTransaction": '',
        "finalPrice": '',
        "package": '',
        "receiptId": '',
        "checkNo": '',
        "isDelete": false
      })
    } else {
      formData.transactions.push({
        "dateOfTransaction": '',
        "finalPrice": '',
        "package": '',
        "receiptId": '',
        "checkNo": '',
        "isDelete": false
      })
    }
  }
  // ADD ROW FUNCTION END

  // DELETE ROW
  $scope.deleteRow = function (formData, index, status) {
    // formData.transactions[index].isDelete = !status;
    formData.transactions.splice(index, 1);
    // formData.transactions.push(isDelete = status)
  }
  // DELETE ROW END



  // PACKAGES
  $scope.packageData = function () {
    $scope.url = "Package/getAllPackages";
    $scope.formData.param = 'athlete';
    NavigationService.apiCall($scope.url, $scope.formData, function (data) {
      // console.log("packageNameData", data);
      $scope.packageNameData = data.data;
    });
  }
  $scope.packageData();
  // PACKAGES END

  // SAVE
  $scope.saveTable = function (data) {
    if (data.sgst == '' || data.sgst == 0 || !data.sgst) {
      data.sgst = 0;
    }
    if (data.igst == '' || data.isgt == 0 || !data.igst) {
      data.igst = 0;
    }
    if (data.cgst == '' || data.cgst == 0 || !data.cgst) {
      data.cgst = 0;
    }
    if (data.discount == '' || data.discount == 0 || !data.discount) {
      data.discount = 0;
    }
    if (data.outstandingAmount == '' || data.outstandingAmount == 0 || !data.outstandingAmount) {
      data.outstandingAmount = 0;
    }
    if (data.netTotal == '' || data.netTotal == 0 || !data.netTotal) {
      data.netTotal = 0;
    }
    console.log(data, "save data");
    $scope.url = "Transaction/saveCashTransaction";
    NavigationService.apiCall($scope.url, data, function (data) {
      console.log("data saved", data);
      $scope.modalInstance.close();

    });
    $scope.viewTable();
  }
  // SAVE END

  // GENERATE EXCEL
  $scope.generateExcel = function () {
    $scope.url = "Accounts/generateAthleteExcel";
    $scope.constraints = {};
    $scope.constraints.file = "Athleteaccount"
    NavigationService.generateExcelWithoutData($scope.url, $scope.constraints, function (data) {
      console.log(data, "excel");
      $state.reload();
    });
  }
  // GENERATE EXCEL END

  // DELETE TRANSACTION
  $scope.deleteTransaction = function (data, transactionID, index) {
    // console.log(index, "index value");

    $scope.formData.transactions.splice(index, 1);
    $scope.url = "Accounts/removeTransactionAndUpdateAthlete"
    $scope.transactionData = {};
    $scope.transactionData.athlete = data;
    $scope.transactionData.transactionId = transactionID;
    NavigationService.apiCall($scope.url, $scope.transactionData, function (data) {
      if (data.value) {
        $scope.shouldCallApi = true;
        toastr.success('Deleted success', 'Deleted');
      } else {
        toastr.error('Something went wrong', 'Error');
      }
    });
    // $scope.modalInstance.rendered();
    // $scope.viewTable();
  }

  $scope.closeAccount = function () {
    console.log($scope.shouldCallApi, "close button");
    if ($scope.shouldCallApi === true) {
      $scope.modalInstance.close();
      $scope.viewTable();
    } else {
      $scope.modalInstance.close();
    }

  }

  // DELETE TRANSACTION END
  $scope.athleteAccountData = {
    payementMode: 'Online,Cash,Online,Cash',
    packagea: '2000',
    packageb: '5000',
    packagec: '5000',
    packaged: '5000',
    sgst: '9%',
    cgst: '8%',
    discount: '5000',
    nettotal: '50000',
    modepay: 'cash',
    chaqtransctionno: '5a21034562bcd',
    receiptno: '1234567891',
    remark: 'check the Receipt',
  }




})