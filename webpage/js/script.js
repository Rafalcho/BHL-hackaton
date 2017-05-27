var myPosition;
var choosePoint = false;
function initMap() {

  var markersToShow = [];
  myPosition = new google.maps.LatLng(52.229802,21.011818);
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 52.229802, lng: 21.011818},
    disableDefaultUI: true
  });

  const fetchMarkers = () => {
    let url = 'http://10.78.25.34:8080/patrols/?x=' + myPosition.lat() + '&y=' + myPosition.lng() + '&rad=100';
    fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Fetching markers failed');
      }
    })
    .then(response => {
      const data = JSON.parse(response);

      function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].title === obj.id) {
            return true;
          }
        }
        return false;
      }

      function contains_remove(a, obj) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id === obj.title) {
            return true;
          }
        }
        return false;
      }
      for (let i = 0; i < markersToShow.length; i++) {
        if (!contains_remove(data, markersToShow[i])) {
          markersToShow[i].setMap(null);
          let tmp = markersToShow[i];
          markersToShow[i] = markersToShow[markersToShow.length - 1];
          markersToShow[markersToShow.length - 1] = tmp;
          markersToShow.pop();
          --i;
        }
      }

      for (let i = 0; i < data.length; i++) {
        if (!contains(markersToShow, data[i])) {

          // markersToShow[i].setMap(null);

          // console.log(markersToShow[i].title);

          let newMarker = new google.maps.Marker({
            position: {lat: data[i].x, lng: data[i].y},
            animation: google.maps.Animation.BOUNCE,
            icon: 'https://image.ibb.co/koRcQv/baguette1.png',
            map: map,
            title: data[i].id
          });

          let infowindow = new google.maps.InfoWindow({
                content: data[i].description
              });

          newMarker.addListener('click', function() {
              infowindow.open(map, newMarker);
            }
          );
          markersToShow.push(newMarker);
        }
      }
    })
    .catch(error => {
      console.log('Fetching data error:', error);
    });
  };

  fetchMarkers();

  let last_alert_time = Date.now();

  const fetchAlerts = () => {
    let url = 'http://10.78.25.34:8080/patrols/?x=' + myPosition.lat() + '&y=' + myPosition.lng() + '&rad=2';
    fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Fetching markers failed');
      }
    })
    .then(response => {
      const data = JSON.parse(response);
      if (data.length) {
        console.log('bagiety');
        fetchMarkers();

        const popup = document.getElementById('alertPopup');
        popup.style.visibility = 'visible';
        const close = document.getElementById('close');

        close.addEventListener('click', () => {
          popup.style.visibility = 'hidden';
        });
      }
    });
  };

  fetchAlerts();

  let refresherAlers = setInterval(() => {
    if ((Date.now() - last_alert_time) > 180000) {
      fetchAlerts();
      last_alert_time = Date.now();
    }
  }, 10000);

  let refresherMarkers = setInterval(() => {

    fetchMarkers();

    // console.log(markersToShow);
  }, 30000);


  ///------------your position renerding--------------

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  function showPosition(position) {
    myPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    drawMap();
    markersToShow.forEach((x) => x.setMap(null));
    markersToShow = [];
    fetchMarkers();

  }
  // drawMap();
  getLocation();

  function drawMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myPosition
    });

    var myCity = new google.maps.Marker({
      position: myPosition,
      animation: google.maps.Animation.DROP,
      icon: 'http://www.i2clipart.com/cliparts/a/8/d/0/128135a8d0f0b984c0e1830d8c92ba2e6f6487.png',
      map: map,
      title: 'Hello World!'
    });
    myCity.setMap(map);

    google.maps.event.addListener(map, 'click', function(e) {
      placeMarker(e.latLng, map);
    });
  }

  google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);
  });

  function placeMarker(position, map) {

    if (choosePoint) {
      sendPost(position);
      choosePoint = false;
    }
  }
}

function addBaguette() {
  document.getElementById('AddBaguetteAlert').style.visibility = 'visible';
}
function sendAlert() {
  document.getElementById('AddBaguetteAlert').style.visibility = 'hidden';
  sendPost(myPosition);
}
function chooseSpot() {
  document.getElementById('AddBaguetteAlert').style.visibility = 'hidden';
  choosePoint = true;
}
function sendPost(position) {
  var payload = {
    x: position.lat(),
    y: position.lng(),
    description: document.getElementById('description').value
  };

  var data = JSON.stringify(payload);

  fetch('http://10.78.25.34:8080/patrols/',
    {
      method: 'POST',
      body: data
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {  });
}
