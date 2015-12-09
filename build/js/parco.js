(function() {

  var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
  var parcoEl = document.querySelector('.parco');
  var dummyEl = document.querySelector('.dummy');
  var titleEl = document.querySelector('.title');
  var map = undefined;
  var initialZoom = 17;
  var tracks = [
    {lat: 42.49093649, lng: 12.24605709, title: 'Pegaso', url: 'https://www.youtube.com/embed/t-UT4VXK4WQ'},
    {lat: 42.49030358, lng: 12.24529803, title: 'Ninfeo', url: 'https://www.youtube.com/embed/WPzrVNxqS0A'},
    {lat: 42.4916599, lng: 12.2475933, title: 'Mostri', url: 'https://www.youtube.com/embed/LpwosTzPnMQ'},
    {lat: 42.49022447, lng: 12.2473231, title: 'marker 04', url: 'https://www.youtube.com/embed/sXvbYFdCIuI'}
  ];
  var markers = [];
  var infoWindows = [];

  function centerMap(lat, lng) {
    lat = lat || 42.49093649;
    lng = lng || 12.24605709;
    map.panTo({ lat: lat, lng: lng });
  }

  function zoomMap(zoom) {
    map.setZoom(zoom);
  }

  function createInfoWindow(marker, videoUrl) {
    var iframe = '<iframe style="min-width: 480px; min-height: 270px;" src="'+videoUrl+'" frameborder="0" allowfullscreen></iframe>'
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
    return infoWindow;
  }

  function createMarker(lat, lng, title, videoUrl) {
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
    });
    var marker = {
      marker: marker,
      position: position,
      infoWindow: infoWindow
    }
    markers.push(marker);
    centerMap(lat, lng);
    return marker;
  }

  function intro() {
    var i = 0;
    var interval = setInterval(function() {
      if (i < tracks.length) {
        var track  = tracks[i];
        createMarker(track.lat, track.lng, track.title, track.url);
        i++;
      } else {
        zoomMap(initialZoom - 1);
        setTimeout(function() {
          centerMap(tracks[0].lat, tracks[0].lng);
          markers[0].infoWindow.open();
        }, 500);
        setTimeout(function() {
          titleEl.classList.add('active');
        }, 1000);
        clearInterval(interval);
      }
    }, 1000);
  }

  function initMap() {
    map = new google.maps.Map(parcoEl, {
      center: { lat: 42.49093649, lng: 12.24605709 },
      zoom: initialZoom,
      disableDefaultUI: true,
      // zoomControl: true,
      // zoomControlOptions: {
      //   style: google.maps.ZoomControlStyle.SMALL
      // },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    intro();
  }

  window.map = {
    init: initMap,
    center: centerMap,
    zoom: zoomMap
  }

})();
