(function ( $ ) {
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
