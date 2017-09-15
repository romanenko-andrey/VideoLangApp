angular.module('MyApp')

  .controller('VideoCtrl', function($scope, $rootScope, Video_Factory) {
    
    $rootScope.activeTab = 1;
  
    $scope.videos = Video_Factory.getContentList();
 
  })

 .controller('SerialCtrl', function($scope, $rootScope) {
    
    $rootScope.activeTab = 2;
 
  })
  .controller('MultCtrl', function($scope, $rootScope) {
    
    $rootScope.activeTab = 3;
  })