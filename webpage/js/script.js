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
    console.log(myPosition);
    let url = 'http://10.78.25.34:8080/patrols/?x='+myPosition.lat()+'&y='+myPosition.lng()+'&rad=100';
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
      console.log(response);

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

  }
  google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);
  });

  function placeMarker(position, map) {
    if(choosePoint){
      console.log("send post");
      sendPost(position);
      choosePoint=false;
    }
  }
}

function addBaguette(){
  console.log(myPosition);
    document.getElementById("AddBaguetteAlert").style.visibility="visible";
}
function sendAlert(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  sendPost(myPosition);
  console.log("Śle");
}
function chooseSpot(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  choosePoint = true;
}
function sendPost(position){
  var payload = {
    x: position.lat(),
    y: position.lng(),
    description: "blaa"
  };

  var data = JSON.stringify( payload );

console.log(data);
  fetch("http://10.78.25.34:8080/patrols/",
    {
      method: "POST",
      body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){  })
}


