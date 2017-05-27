function initMap() {

  var markersToShow = [];

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 52.229802, lng: 21.011818},
    disableDefaultUI: true
  });


  // var marker = new google.maps.Marker({
  //   position: {lat: 52.239802, lng: 21.011818},
  //   animation: google.maps.Animation.BOUNCE,
  //   map: map,
  //   title: 'Hello World!'
  // });

  const fetchMarkers = () => {
    let url = 'https://10.78.25.34:8080/patrols/?x=52.239802&y=21.011818&rad=1000';
    fetch(url).then(response => {
      if (response.ok) {
        // console.log(response);
        return response.json();
      } else {
        throw new Error('Fetching markers failed');
      }
    })
    .then(response => {
      const data = JSON.parse(response);

      data.forEach(marker => {
        let newMarker = new google.maps.Marker({
          position: {lat: marker.x, lng: marker.y},
          animation: google.maps.Animation.BOUNCE,
          icon: 'https://image.ibb.co/koRcQv/baguette1.png',
          map: map,
          title: 'Hello World!'
        });

        let infowindow = new google.maps.InfoWindow({
              content: 'lol'
            });

        infowindow.open(map, newMarker);

        markersToShow.push(newMarker);
      });

    })
    .catch(error => {
      console.log('Fetching data error:', error);
    });
  };

  fetchMarkers();

  let refresher = setInterval(() => {
    console.log(markersToShow);
    markersToShow.forEach(marker => {
      marker.setMap(null);
    });
    markersToShow = [];
    fetchMarkers();
    console.log(markersToShow);
  }, 30000);


  ///------------your position renerding--------------

  var myPosition = new google.maps.LatLng(52.229802,21.011818);

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
    fetchMarkers();

  }
  // drawMap();
  getLocation();

  function drawMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myPosition,
      disableDefaultUI: true
    });

    var myCity = new google.maps.Circle({
      center: myPosition,
      radius: 150,
      strokeColor: '#0000FF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0000FF',
      fillOpacity: 0.4
    });
    myCity.setMap(map);
  }
}
