var myPosition;
var choosePoint = false;
var map;
var parties=[];
function initMap() {

  var markersToShow = [];
  myPosition = new google.maps.LatLng(52.229802,21.011818);
   map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 52.229802, lng: 21.011818},
    disableDefaultUI: true
  });

  const fetchMarkers = () => {
    let url = 'http://10.78.16.243:8080/patrols/?x='+myPosition.lat()+'&y='+myPosition.lng()+'&rad=100';
    fetch(url).then(response => {
      if (response.ok) {
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
              content: marker.description
            });

       // infowindow.open(map, newMarker);
        newMarker.addListener('click', function() {
          infowindow.open(map,newMarker);
          }
        );
        markersToShow.push(newMarker);
      });

    })
    .catch(error => {
      console.log('Fetching data error:', error);
    });
  };

  fetchMarkers();

  let refresher = setInterval(() => {
    markersToShow.forEach(marker => {
      marker.setMap(null);
    });
    markersToShow = [];
    fetchMarkers();
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
    google.maps.event.addListener(map, 'click', function(e) {
      placeMarker(e.latLng, map);
    });
  }
  google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);
  });

  function placeMarker(position, map) {
    console.log(choosePoint);
    if(choosePoint){
      sendPostBaggeteu(position);
      choosePoint=false;
    }
  }
}

function addBaguette(){
    document.getElementById("AddBaguetteAlert").style.visibility="visible";
}
function sendAlert(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  sendPostBaggeteu(myPosition);
}
function chooseSpot(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  choosePoint = true;
}
function sendPostBaggeteu(position){
  var payload = {
    x: position.lat(),
    y: position.lng(),
    description: document.getElementById("description").value
  };

  var data = JSON.stringify( payload );

  fetch("http://10.78.16.243:8080/patrols/",
    {
      method: "POST",
      body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){  })
}

function sendPostParty(position){
  var payload = {
    x: position.lat(),
    y: position.lng(),
    name: document.getElementById("partyName").value,
    description: document.getElementById("partyDescription").value
  };

  var data = JSON.stringify( payload );
console.log(data);
  fetch("http://10.78.16.243:8080/parties/",
    {
      method: "POST",
      body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){  })
}
function makeParty(){
  document.getElementById("partyForm").style.visibility="hidden";
  sendPostParty(myPosition);


}
function abortParty(){
  document.getElementById("partyForm").style.visibility="hidden";

}
function addParty(){
  document.getElementById("partyForm").style.visibility="visible";
}
function showParty(){
  getParties();
}
const getParties = () => {
  let url = 'http://10.78.16.243:8080/parties/?x='+myPosition.lat()+'&y='+myPosition.lng()+'&rad=100';
  fetch(url).then(response => {
    if (response.ok) {
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
      icon: 'https://cdn1.iconfinder.com/data/icons/party-3/500/Party_2-128.png',
      map: map,
      title: 'Hello World!'
    });
  var peopleList=[];
  if (marker.people != null) {
    marker.people.forEach(function(e)
    {
      peopleList.push(e.name + " "+ e.surname+"<br/>");
      console.log(e.surname);
    });
  }
  var content = marker.name + '<br/>Opis:' + marker.description + '<br/>' + peopleList+
  '<br/><button id="' + marker.name + '" onclick="joinParty()">Dołącz</button><br/>';
  let infowindow = new google.maps.InfoWindow({
    content: content
  });

  // infowindow.open(map, newMarker);
  newMarker.addListener('click', function() {
      infowindow.open(map,newMarker);
    }
  );
  parties.push(newMarker);
});

})
.catch(error => {
    console.log('Fetching data error:', error);
});
};

function joinParty(){
  console.log(event.currentTarget);
  var name = event.currentTarget.id;
  var payload = {
    name:"rolf",
    surname:"blaa"
  };

  var data = JSON.stringify( payload );
  console.log(data);
  fetch("http://10.78.16.243:8080/parties/"+name+"/people",
    {
      method: "POST",
      body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){  })


}



