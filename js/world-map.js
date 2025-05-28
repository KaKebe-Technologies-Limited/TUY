// World Map with Project Locations
let mapInitialized = false;

// Callback function for Google Maps API
function initMaps() {
    // Check if the world map element exists
    if (document.getElementById('world_map_canvas') && !mapInitialized) {
        initializeWorldMap();
        mapInitialized = true;
    }
}

// Fallback initialization if the callback doesn't work
document.addEventListener('DOMContentLoaded', function() {
    // Check if the world map element exists and hasn't been initialized yet
    if (document.getElementById('world_map_canvas') && !mapInitialized) {
        // Wait a bit to ensure Google Maps API is loaded
        setTimeout(() => {
            if (!mapInitialized) {
                initializeWorldMap();
                mapInitialized = true;
            }
        }, 1000);
    }
});

function initializeWorldMap() {
    // Define project locations
    const projectLocations = [
        {
            position: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
            title: "Urban Greening & Coding Bootcamps",
            description: "Gardens and tech skills for youth."
        },
        {
            position: { lat: 19.0760, lng: 72.8777 }, // Mumbai, India
            title: "Renewable Energy & Entrepreneurship",
            description: "Solar training and startup support."
        }
    ];

    // Create map centered between the two locations
    const mapCenter = { lat: 12.7996, lng: 38.1285 }; // Roughly centered between Lagos and Mumbai

    const mapOptions = {
        center: mapCenter,
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"visibility": "on"}, {"color": "#f2f2f2"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"visibility": "on"}, {"color": "#b3d1ff"}]
            }
        ]
    };

    const mapElement = document.getElementById('world_map_canvas');
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, mapOptions);

    // Create markers for each project location
    projectLocations.forEach(location => {
        try {
            // Check if AdvancedMarkerElement is available
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
                // Create advanced marker
                const markerContent = document.createElement('div');
                markerContent.style.width = '20px';
                markerContent.style.height = '20px';
                markerContent.style.borderRadius = '50%';
                markerContent.style.backgroundColor = '#4CAF50';
                markerContent.style.border = '2px solid white';

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: location.position,
                    map: map,
                    title: location.title,
                    content: markerContent
                });

                // Create info window with project details
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div style="padding: 10px;">
                                <h4 style="margin-top: 0;">${location.title}</h4>
                                <p>${location.description}</p>
                              </div>`
                });

                // Add click functionality (hover not supported in AdvancedMarkerElement)
                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });
            } else {
                // Fallback to regular marker if AdvancedMarkerElement is not available
                const marker = new google.maps.Marker({
                    position: location.position,
                    map: map,
                    title: location.title,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#4CAF50',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                        scale: 10
                    }
                });

                // Create info window with project details
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div style="padding: 10px;">
                                <h4 style="margin-top: 0;">${location.title}</h4>
                                <p>${location.description}</p>
                              </div>`
                });

                // Add hover functionality
                marker.addListener('mouseover', function() {
                    infoWindow.open(map, marker);
                });

                marker.addListener('mouseout', function() {
                    infoWindow.close();
                });

                // Also open on click for mobile devices
                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });
            }
        } catch (error) {
            console.error("Error creating marker:", error);
        }
    });
}
