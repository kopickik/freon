(function ( $ ) {
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

}(jQuery));

;(function ($) {
  'use strict';
  var resultTemplate = _.template($('#resultTemplate').html());

  $.subscribe("/search/tags", function (e, tags) {
    $('#lastQuery').html('<p>Searched for: <strong>' + tags + '</strong></p>');
    console.log(e);
  });

  $.subscribe("/search/resultSet", function (e, results) {
    $("#searchResults").empty().append(resultTemplate(results));
  });

  $("#flickrSearch").submit(function (e) {
    e.preventDefault();
    var tags = $(this).find('#query').val();

    if (!tags) {
      return;
    }
    $.publish("/search/tags", [$.trim(tags)]);
  });

  $.subscribe("/search/tags", function (e, tags) {
    $.getJSON( "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
      tags: tags,
      tagmode: "any",
      format: "json"
    },
    function (data) {
      if (!data.items.length) {
        return;
      }
      $.publish("/search/resultSet", { items: data.items } );
    });
  });
}(jQuery));


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

        if (i == 5) {
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
