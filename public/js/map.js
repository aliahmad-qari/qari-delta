mapboxgl.accessToken = mapToken;

const coordinates = listing.geometry.coordinates;

if (!Array.isArray(coordinates) || coordinates.length !== 2) {
  console.error("Invalid coordinates:", coordinates);
} else {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: coordinates, // Use the dynamic coordinates
    zoom: 9,
  });

  
  new mapboxgl.Marker({color: "#FF0000"})
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.location}</h4><h6>Exact location after booking</h6>`
      )
    )
    .addTo(map);
}
