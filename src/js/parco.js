(function() {

  var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
  var parcoEl = document.getElementById('parco');
  var map = undefined;
  var mapProperties = {
    center: { lat: 42, lng: 12 },
    zoom: 16
  };
  var tracks = [];
  var infoWindows = [];

  function centerMap() {
    map.panTo({ lat: tracks[0].position.lat, lng: tracks[0].position.lng });
  }

  function zoomMap(zoom) {
    map.setZoom(zoom);
  }

  function createInfoWindow(marker, videoUrl) {
    var iframe = '<iframe style="min-width: 480px; min-height: 320px;" src="'+videoUrl+'" frameborder="0" allowfullscreen></iframe>'
    var infoWindow = {
      bubble: new google.maps.InfoWindow({
        maxWidth: 480,
        content: iframe
      }),
      open: function() {
        // close all other windows before opening a new one
        infoWindows.forEach(function(info) { info.bubble.close() });
        this.bubble.open(map, marker);
      }
    }
    infoWindows.push(infoWindow);
    // infoWindow.bubble.open(map, marker);
    return infoWindow;
  }

  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function createTrack(lat, lng, title, videoUrl) {
    var position = { lat: lat, lng: lng };
    var marker = new google.maps.Marker({
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      position: position
    });
    var infoWindow = createInfoWindow(marker, videoUrl);
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open();
      toggleBounce(marker);
    });
    var track = {
      marker: marker,
      position: position,
      infoWindow: infoWindow
    }
    tracks.push(track);
    return track;
  }

  function initMap() {

    map = new google.maps.Map(parcoEl, mapProperties);

    var track01 = createTrack(42.4915061, 12.24431098, 'Pegaso', 'https://www.youtube.com/embed/t-UT4VXK4WQ');
    var track02 = createTrack(42.49030358, 12.24529803, 'Ninfeo', 'https://www.youtube.com/embed/WPzrVNxqS0A');
    var track03 = createTrack(42.4916599, 12.2475933, 'Track 03', 'https://www.youtube.com/embed/sXvbYFdCIuI');
    var track04 = createTrack(42.49022447, 12.2473231, 'Track 04', 'https://www.youtube.com/embed/sXvbYFdCIuI');

    // google.maps.event.addListener(track01.marker, 'click', function() { createInfoWindow(track01.marker, track01.video) });
    // google.maps.event.addListener(marker1, 'click', function() { createInfoWindow(marker2) });

    // var windowTest = createInfoWindow(track01.marker, track01.video);
    // windowTest.open();
    track01.infoWindow.open();
    console.log(track01);
    centerMap();

  }

  window.map = {
    init: initMap,
    center: centerMap,
    zoom: zoomMap
  }

})();
