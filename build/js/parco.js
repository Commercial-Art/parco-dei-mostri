(function() {

  var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
  var activate = (isTouch ? 'touchstart' : 'mouseover');
  var parcoEl = document.querySelector('.parco');
  var mapEl = document.querySelector('.map');
  var dummyEl = document.querySelector('.dummy');
  var infoEl = document.querySelector('.infos');
  var map = undefined;
  var initialZoom = 16;
  var tracks = [
    {lat: 42.49120105, lng: 12.24428882, title: 'Pegaso', url: 'https://www.youtube.com/embed/t-UT4VXK4WQ'},
    {lat: 42.49055232, lng: 12.24512567, title: 'Ninfeo', url: 'https://www.youtube.com/embed/WPzrVNxqS0A'},
    {lat: 42.49135927, lng: 12.24643459, title: 'Mostri', url: 'https://www.youtube.com/embed/LpwosTzPnMQ'},
    {lat: 42.49056815, lng: 12.24750747, title: 'marker 04', url: 'https://www.youtube.com/embed/sXvbYFdCIuI'}
  ];
  var markers = [];
  var infoWindows = [];

  function centerMap(lat, lng) {
    lat = lat || tracks[0].lat;
    lng = lng || tracks[0].lng;
    map.panTo({ lat: lat, lng: lng });
  }

  function zoomMap(zoom) {
    map.setZoom(zoom);
  }

  function createInfoWindow(marker, videoUrl) {
    var html = '<div class="video-wrapper"><iframe src="'+videoUrl+'" frameborder="0" allowfullscreen></iframe></div>'
    var infoWindow = {
      bubble: new google.maps.InfoWindow({
        maxWidth: 480,
        content: html
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

  function intro(speed) {
    var i = 0;
    var interval = setInterval(function() {
      if (i < tracks.length) {
        var track  = tracks[i];
        createMarker(track.lat, track.lng, track.title, track.url);
        i++;
      } else {
        markers[0].infoWindow.open();
        setTimeout(function() {
          centerMap(tracks[0].lat, tracks[0].lng);
        }, speed * .25);
        setTimeout(function() {
          zoomMap(initialZoom - 1);
        }, speed * .5);
        setTimeout(function() {
          centerMap(tracks[0].lat+.0015, tracks[0].lng);
        }, speed * .75);
        setTimeout(function() {
          infoEl.classList.add('active');
        }, speed);
        clearInterval(interval);
      }
    }, speed);
  }

  function toggleInfos() {
    infoEl.addEventListener(activate, function() {
      parcoEl.classList.add('expanded');
    });
    mapEl.addEventListener(activate, function() {
      parcoEl.classList.remove('expanded');
    });
  }

  function initMap() {
    map = new google.maps.Map(mapEl, {
      center: { lat: tracks[0].lat, lng: tracks[0].lng },
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
    intro(900);
    toggleInfos();
  }

  window.map = {
    init: initMap,
    center: centerMap,
    zoom: zoomMap
  }

})();
