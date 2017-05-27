function initMap() {

  var markersToShow = [];



  var marker = new google.maps.Marker({
    position: {lat: 52.239802, lng: 21.011818},
    map: map,
    title: 'Hello World!'
  });

  const fetchMarkers = () => {
    fetch(url).then(response => {
      if (response.ok) {
      return response.json();
    } else {
      throw new Error('Fetching markers failed');
    }
  })
  .then(response => {

      return response.items;

  })
  .catch(error => {
      console.log('Fetching data error:', error);
  });
  };

  var myPosition =new google.maps.LatLng(52.229802,21.011818);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    console.log(position);
    myPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    console.log(myPosition);
    drawMap();

  }
  drawMap();
  getLocation();

  function drawMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: myPosition
    });

    var myCity = new google.maps.Circle({
      center: myPosition,
      radius: 150,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.4
    });
    myCity.setMap(map);
  }


}
