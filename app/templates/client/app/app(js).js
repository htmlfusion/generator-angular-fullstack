'use strict';

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  <% if(filters.ngroute) { %>.config(function ($routeProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %> <% if(filters.cca) { %>, deviceProvider<% } %>) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    <% if(filters.cca) {%>
      if(!deviceProvider.$get().isNative()){
        $locationProvider.html5Mode(true);
      }
    <% } else { %>
    $locationProvider.html5Mode(true);<% } %><% if(filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } %><% if(filters.uirouter) { %>.config(function ($stateProvider, $urlRouterProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %> <% if(filters.cca) { %>, deviceProvider<% } %>) {
    $urlRouterProvider
      .otherwise('/');

    <% if(filters.cca) {%>
    if(!deviceProvider.$get().isNative()){
      $locationProvider.html5Mode(true);
    }
    <% } else { %>
    $locationProvider.html5Mode(true);<% } %><% if(filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } %><% if(filters.auth) { %>

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
  <% if (filters.cca) { %>
  .factory('apiInterceptor', function (device) {
    return {
      //If its an api request and we're in phonegap convert it to an absolute url
      request: function (config) {
        var internalURL = config.url.indexOf('/api/')>-1;
        if(internalURL && device.isNative()){
          config.url = device.apiRoot+config.url;
        }
        return config;
      }
    };
  })<% } %>
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on(<% if(filters.ngroute) { %>'$routeChangeStart'<% } %><% if(filters.uirouter) { %>'$stateChangeStart'<% } %>, function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  })<% } %>;