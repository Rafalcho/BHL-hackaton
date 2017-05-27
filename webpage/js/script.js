function initMap() {

  var markersToShow = [];

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 52.229802, lng: 21.011818}
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

      data.forEach(marker => {
        let newMarker = new google.maps.Marker({
          position: {lat: marker.x, lng: marker.y},
          animation: google.maps.Animation.BOUNCE,
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

}
