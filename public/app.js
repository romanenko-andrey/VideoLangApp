angular.module('MyApp', ['ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'satellizer',
            "ngSanitize",
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
            "com.2fdevs.videogular.plugins.buffering",
			"com.2fdevs.videogular.plugins.overlayplay",
			"com.2fdevs.videogular.plugins.poster"            
  ])
  .config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'templates/home.html'
      })
    
    .state('video', {
        url: '/video',
        controller: 'VideoCtrl',
        templateUrl: 'templates/video.html'
      })
    
    
    .state('videoplayer', {
        url: '/video/:id',
        controller: 'VideoPlayerCtrl',
        templateUrl: 'templates/videoplayer.html'
     })
  
    
    .state('serial', {
        url: '/serial',
        controller: 'SerialCtrl',
        templateUrl: 'templates/serial.html'
      })
    
    .state('mult', {
        url: '/mult',
        controller: 'MultCtrl',
        templateUrl: 'templates/mult.html'
      })
    
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      });

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '1176623675728269'
    });

    $authProvider.google({
      clientId: '526174509484-rs5f9brmbaqegh14h9srg5mbhsek5dmt.apps.googleusercontent.com'
      
    });

    $authProvider.github({
      clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
      clientId: '77cw786yignpzj'
    });

    $authProvider.instagram({
      clientId: '799d1f8ea0e44ac8b70e7f18fcacedd1'
    });

    $authProvider.yahoo({
      clientId: 'dj0yJmk9OWtXdlJzQ05aZlVwJmQ9WVdrOU0yWjVZa2hJTm0wbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1jYw--'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.live({
      clientId: '000000004C12E68D'
    });

    $authProvider.twitch({
      clientId: 'qhc3lft06xipnmndydcr3wau939a20z'
    });

    $authProvider.bitbucket({
      clientId: '7jVUGppM2YabSdbdx8'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
  });
