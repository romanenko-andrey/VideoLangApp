angular.module('MyApp')
  .controller('NavbarCtrl', function($scope, $rootScope, $auth) {
    
    $rootScope.activeTab = 0;
    
  //  $state.go('home');
  
    console.log($rootScope.activeTab );
  
    $scope.setActive = function(n){
      $rootScope.activeTab = n;
    }
  
    $scope.isActive = function(n){
      if ($rootScope.activeTab == n) 
        return true
      else 
        return false;
    }
  
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  })


 
