(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    // Utilizar Provider y Geocoder
    const geocoderService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Pin
    marker = new L.marker([lat, lng],{
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);

    // Detectar movimiento de Pin
    marker.on('moveend', function(e){
        marker = e.target
        const position = marker.getLatLng()
        console.log(position);
        mapa.panTo(new L.LatLng(position.lat, position.lng))

        // Obtener información de las calles
        geocoderService.reverse().latlng(position, 13).run(function(error, resultado){
            console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel);

            // Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ??  '';
            document.querySelector('#calle').value = resultado?.address?.Address ??  '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ??  '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ??  '';
        })
    })


})()