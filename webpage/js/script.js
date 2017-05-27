function initMap() {

  var markersToShow = [];

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 52.229802, lng: 21.011818}
  });

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

}
