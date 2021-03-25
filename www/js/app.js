var app = angular.module('myApp', ['ui.bootstrap','ngRoute']);

app.controller('MyCtrl', function($scope, $window, $http, $uibModal) {
    var vm = this;

    vm.korisnikPrijavljen = false;

    vm.searchText = "";
    vm.svi_proizvodi = [];
    vm.proizvodi = [];
    
    vm.ocena = -1;
    vm.filterOcene = function(el){
        vm.ocena = el;
        vm.proizvod = null;
        if(vm.kategorija != null){
            vm.proizvodi = vm.kategorijeProizvoda[vm.kategorija];
        }else{
            vm.proizvodi = vm.svi_proizvodi;
        }
        if(vm.ocena != -1){
            var lista = vm.proizvodi;
            var rez = [];
            for(var i in lista){
                if(vm.ocena== 1 && lista[i].ocena>0 && lista[i].ocena<3){
                    rez.push(lista[i]);
                }
                if(vm.ocena == 2 && lista[i].ocena==3){
                  rez.push(lista[i]);
                }
                if (vm.ocena == 3 && lista[i].ocena>3) {
                  rez.push(lista[i]);
                }
            }
            vm.proizvodi = rez;
        }
    }


    vm.username = 'sale@singimail.rs';

    vm.listaKategorija = [];
    vm.kategorijeProizvoda = {};
    vm.korpa = [];

    vm.kategorija = null;
    vm.proizvod = null;

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    vm.currentPage = 1;
    vm.itemsPerPage = 6;
    vm.totalItems = 10;
    vm.maxSize = 5;

    vm.login = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: function($uibModalInstance, parent){
            var $ctrl = this;

            $ctrl.stanje = 'Login';

            $ctrl.username = parent.username;
            $ctrl.password = '';
            $ctrl.poruka = '';


            $ctrl.login = function(){
                if($ctrl.password == '123'){
                    $uibModalInstance.close($ctrl.username);
                    parent.korisnikPrijavljen = true;
                }else{
                    $ctrl.poruka = 'Pogresna lozinka';
                }
            }

            $ctrl.register = function(){
              $uibModalInstance.close($ctrl.username);
            }

            $ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
        },
        controllerAs: '$ctrl',
        resolve: {
          parent: function () {
            return vm;
          }
        }
      });
      modalInstance.result.then(function (username) {
        console.log(username);
      }, function () {
        console.log('modal-component dismissed at: ' + new Date());
      });
    };


    vm.editProizvoda = function(el){
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'editArtikla.html',
        controller: function($uibModalInstance, movie){
            var $ctrl = this;

            $ctrl.ocena = proizvod.ocena;

            $ctrl.save = function(){
              $uibModalInstance.close($ctrl.ocena);
            }

            $ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
        },
        controllerAs: '$ctrl',
        resolve: {
          proizvod: function () {
            return el;
          }
        }
      });

      modalInstance.result.then(function (title) {
        el.ocena = ocena;
      }, function () {
        console.log('modal-component dismissed at: ' + new Date());
      });
    }

    vm.home = function(){
      vm.kategorija = null;
      vm.proizvod = null;
      vm.proizvodi = vm.svi_proizvodi;
      vm.totalItems = vm.proizvodi.length;
    }
    vm.filterKategorije = function(kategorija){
      vm.kategorija = kategorija;
      vm.proizvod = null;
      vm.proizvodi = vm.kategorijeProizvoda[kategorija];
      vm.totalItems = vm.proizvodi.length;
      vm.ocena = -1;
    }
    vm.selektujProizvod = function(el){
      vm.kategorija = el.kategorija;
      vm.proizvod = el;
    }

    vm.init = function(){
      var req = {
          method: "GET",
          url: "/kol2-HCI.json"
      }
      $http(req).then(
          function(resp){
            console.log(resp);
            var lista = [];
            vm.svi_proizvodi = resp.data;
            vm.kategorijeProizvoda = {};
            vm.listaKategorija = [];
            for(var i in vm.svi_proizvodi){
              var proizvod = vm.svi_proizvodi[i];
              if(!(proizvod.kategorija in vm.kategorijeProizvoda)){
                vm.listaKategorija.push(proizvod.kategorija);
                vm.kategorijeProizvoda[proizvod.kategorija] = [proizvod];
              }else{
                vm.kategorijeProizvoda[proizvod.kategorija].push(proizvod);
              }
              if(proizvod.naziv.toLowerCase().indexOf(vm.searchText.toLowerCase())!=-1){
                lista.push(proizvod);
              }
            }
            vm.totalItems = lista.length;
            vm.proizvodi = lista;
          }, function(resp){
              vm.message = 'error';
          });
    };

    vm.kupi = function(el){
        if(vm.korisnikPrijavljen){
            if(vm.kolicina<=el.kolicina){
              vm.korpa.push({proizvod: el, kolicina: vm.kolicina});
              $scope.alerts.push({ type: 'success', msg: 'Proizvod prebacen u korpu' } )
            }else{
              $scope.alerts.push({ type: 'warning', msg: 'Naruceno vise od raspolozivog' } )
            }
        }else{
            vm.login();
        }

    };

    vm.init();



});

  app.controller("istorijaCtrl", [ function($scope) {
    var vm = this;
  vm.title = "istorija";
}]);
  app.controller("porudzbineCtrl", ['$scope', function($scope) {
  $scope.title = "porudzbine";
}]);

  app.config(function($routeProvider) {
      $routeProvider
      .when("/", {
        templateUrl: "home.html",
        controller: 'MyCtrl'

      })
      .when("/istorija", {
          templateUrl : "istorija.html",
          controller :   "MyCtrl"
      })
      .when("/porudzbine", {
          templateUrl : "porudzbine.html" ,
          controller : "porudzbineCtrl"
      });
  });
