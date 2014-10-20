require(['jquery', 'underscore'], function ($, _) {
  //(function ( $ ) {
    'use strict';
    var o = $({});

    $.subscribe = function() {
      o.on.apply(o, arguments);
    };

    $.unsubscribe = function() {
      o.on.apply(o. arguments);
    };

    $.publish = function() {
      o.trigger.apply(o, arguments);
    };
      var resultTemplate = _.template($('#resultTemplate').html());

    $.subscribe('/search/tags', function (e, tags) {
      $('#lastQuery').html('<p>Searched for: <strong>' + tags + '</strong></p>');
      console.log(e);
    });

    $.subscribe('search/resultSet', function (e, results) {
      $('#searchResults').empty().append(resultTemplate(results));
    });

    $('#flickrSearch').submit(function (e) {
      e.preventDefault();
      var tags = $(this).find('#query').val();

      if (!tags) {
        return;
      }
      $.publish('/search/tags', [$.trim(tags)]);
    });

    $.subscribe('/search/tags', function (e, tags) {
      $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?', {
        tags: tags,
        tagmode: 'any',
        format: 'json'
      },
      function (data) {
        if (!data.items.length) {
          return;
        }
        $.publish('/search/resultSet', { items: data.items } );
      });
    });
});

require(['angular'], function (angular) {
  'use strict';
  angular.module('mainApp', [])
  .controller('MainController', ['$scope', '$q', '$interval', function($scope, $q, $interval) {
    // we will use $q here
    'use strict';
    $scope.getPromise = function() {
      var i = 0;
      var deferred = $q.defer();

      var timer = $interval(function() {
        if ( !!$scope.cancelRequested) {
          deferred.reject('Promise Rejected due to cancellation.');
          $interval.cancel(timer);
        }

        i = i+1;

        if (i === 5) {
          deferred.resolve('Counter has reached 5.');
          $interval.cancel(timer);
        } else {
          deferred.notify('Counter has reached ' + i);
        }
      }, 1000);
      return deferred.promise;
    }
    $scope.getAsyncMessage = function() {
      var promise = $scope.getPromise();

      promise.then(function (message) {
        $scope.status = 'Resolved: ' + message;
      }, function (message) {
        $scope.status = 'Rejected: ' + message;
      }, function (message) {
        $scope.status = 'Notifying: ' + message;
      });
    }
  }]);

  angular.module('mainApp').factory('WeatherService', function($http) {
    return {
      getWeather: function(city, country) {
        var query = city + ',' + country;
        return $http.get('http://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: query,
          }
        }).then(function (response) {
          return response.data.weather[0];
        });
      }
    }
  });

  angular.module('mainApp').controller('WeatherController', function($scope, WeatherService) {
    $scope.getWeather = function() {
      $scope.weatherDescription = 'Fetching...';
      WeatherService.getWeather($scope.city, $scope.country).then(function(data) {
        $scope.weatherDescription = data//.description;
        $scope.weatherIcon = data.icon;
      }, function() {
        $scope.weatherDescription = 'Could not obtain data.';
      });
    }
  });

  angular.module('mainApp').factory('IPService', function ($http) {
    return {
      getIp: function() {
        return $http.get('http://www.telize.com/geoip?callback=', function (data) {
          console.log('The IP address is ' + data.ip);
          console.log('Latitude: ' + data.latitude);
          console.log('Longitude: ' + data.longitude);
        }).then(function (response) {
          return response.data;
        });
      }
    }
  });

  angular.module('mainApp').controller('IPController', function($scope, IPService) {
    $scope.getIp = function() {
      $scope.ipAddress = 'Fetching...';
      IPService.getIp().then(function (data) {
        $scope.ipAddress = data.ip//.description;
        $scope.latitude = data.latitude + '˚';
        $scope.longitude = data.longitude + '˚';
      }, function() {
        $scope.ipAddress = 'Could not obtain data.';
      });
    }
  });

  //http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml

});

