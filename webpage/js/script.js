var myPosition;
var choosePoint = false;
var map;
var parties=[];
var last_alert_time = 0;
// var flag_alert = true;
function initMap() {

  var markersToShow = [];
  myPosition = new google.maps.LatLng(52.229802,21.011818);
   map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 52.229802, lng: 21.011818},
    disableDefaultUI: true
  });

  const fetchMarkers = () => {
    let url = 'https://10.78.25.34:8080/patrols/?x='+myPosition.lat()+'&y='+myPosition.lng()+'&rad=100';
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

  const fetchAlerts = () => {
      // flag_alert = false;
      let url = 'https://10.78.25.34:8080/patrols/?x=' + myPosition.lat() + '&y=' + myPosition.lng() + '&rad=2';
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
              last_alert_time = Date.now();
            console.log('bagiety');
            fetchMarkers();

            const popup = document.getElementById('alertPopup');
            popup.style.display = 'block';
            const close = document.getElementById('close');

            close.addEventListener('click', () => {
                popup.style.display = 'none';
              });
          }
        });
    };
  // fetchAlerts();

  let refresherAlers = setInterval(() => {
      console.log("teraz: " + (Date.now()));
    console.log("ostatnio: " + last_alert_time);
        console.log("roznica: " + (Date.now() - last_alert_time));
          if (((Date.now() - last_alert_time) > 180000)) {
            fetchAlerts();
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
        center: myPosition,
        disableDefaultUI: true
      });

    var myCity = new google.maps.Marker({
        position: myPosition,
        animation: google.maps.Animation.DROP,
        icon: 'img/rafal.png',
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

function addBaguette() {
  document.getElementById("partyForm").style.visibility="hidden";
  document.getElementById('AddBaguetteAlert').style.visibility = 'visible';
}
function sendAlert(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  sendPostBaggeteu(myPosition);
}
function chooseSpot() {
  document.getElementById('AddBaguetteAlert').style.visibility = 'hidden';
  choosePoint = true;
}
function sendPostBaggeteu(position){
    var payload = {
      x: position.lat(),
      y: position.lng(),
      description: document.getElementById('description').value
    };

  var data = JSON.stringify( payload );

  fetch("https://10.78.25.34:8080/patrols/",
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
  fetch("https://10.78.25.34:8080/parties/",
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
function abortParty() {
  document.getElementById('partyForm').style.visibility = 'hidden';

}
function addParty(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  document.getElementById("partyForm").style.visibility="visible";
}
function showParty(){
  document.getElementById("AddBaguetteAlert").style.visibility="hidden";
  document.getElementById("partyForm").style.visibility="hidden";
  parties.forEach(function(e){
    e.setMap(null);
    e=null;
  })
  getParties();
}
const getParties = () => {
  let url = 'https://10.78.25.34:8080/parties/?x='+myPosition.lat()+'&y='+myPosition.lng()+'&rad=100';
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
      icon: 'img/kufel.png',
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
  fetch("https://10.78.25.34:8080/parties/"+name+"/people",
    {
      method: "POST",
      body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ showParty(); })
    // getParties();

}

