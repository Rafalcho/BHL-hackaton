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
    let url = 'http://10.78.25.34:8080/patrols/?x=52.239802&y=21.011818&rad=1000';
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

      function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].title === obj.id) {
            return true;
          }
        }
        console.log('dupa');
        return false;
      }

      function contains_remove(a, obj) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id === obj.title) {
            return true;
          }
        }
        console.log('dupa');
        return false;
      }
      console.log('wykonuje sie');
      for (let i = 0; i < markersToShow.length; i++) {
        if (!contains_remove(data, markersToShow[i])) {
          console.log('huj');
          markersToShow[i].setMap(null);
          let tmp = markersToShow[i];
          markersToShow[i] = markersToShow[markersToShow.length - 1];
          markersToShow[markersToShow.length - 1] = tmp;
          markersToShow.pop();
          --i;
        }
      }
      console.log(data.length);
      console.log(markersToShow.length);
      for (let i = 0; i < data.length; i++) {
        if (!contains(markersToShow, data[i])) {
          console.log('heheszki');
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

          infowindow.open(map, newMarker);

          markersToShow.push(newMarker);

        }
      }

      // data.forEach(marker => {
      //   let newMarker = new google.maps.Marker({
      //     position: {lat: marker.x, lng: marker.y},
      //     animation: google.maps.Animation.BOUNCE,
      //     icon: 'https://image.ibb.co/koRcQv/baguette1.png',
      //     map: map,
      //     title: 'Hello World!'
      //   });
      //
      //   let infowindow = new google.maps.InfoWindow({
      //         content: 'lol'
      //       });
      //
      //   infowindow.open(map, newMarker);
      //
      //   markersToShow.push(newMarker);
      // });

    })
    .catch(error => {
      console.log('Fetching data error:', error);
    });
  };

  fetchMarkers();

  let refresher = setInterval(() => {
    // console.log(markersToShow);
    // markersToShow.forEach(marker => {
    //   marker.setMap(null);
    // });
    // markersToShow = [];
    fetchMarkers();
    // console.log(markersToShow);
  }, 5000);


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
