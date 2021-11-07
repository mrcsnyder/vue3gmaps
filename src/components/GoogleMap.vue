<template>

   <div>

      <button @click="getCurrentLocation()">Get Your GPS Starting Location</button>

      <br/>
      <br/>

      <button @click="calcRoute(this.directionsRenderer, this.directionsService)">Draw Route</button>

      <br/>
      <br/>

<div v-if="this.$store.state.google">

Starting Location: <StartEnd :start-or-end="'start'" @autocompleteLocation="setAutoCompleteLoc"/>

<br/>
<br/>

Ending Location: <StartEnd :start-or-end="'end'" @autocompleteLocation="setAutoCompleteLoc"/>

</div> 

<br/>
<br/>

      <div id="map"></div>
   </div>
</template>

<script>
import StartEnd from './StartEnd'

export default {
   name: 'GoogleMap',

   components: {
    StartEnd
    
  },

props: {

},
   data(){
    return {
      center: null,
      selfCentered: {},
      place: null,
      directionsService: null,
      directionsRenderer: null,
      destDetails: {},
      directionsRequest: false,
      map: null,
      starter: null,
      destination: null,
   }
},

//to draw route, first search for location, then gps location, then click draw route button.
   mounted() {
 
window.checkAndAttachMapScript(this.getShitLoaded);

   },

   methods: {

      getShitLoaded(){
     
     const self = this;

     self.$store.commit("initGoogle", window.google);
    

      },

//update parent
//setAutoCompleteLoc(place)
setAutoCompleteLoc({place, startOrEnd})

    {
        const self = this;
        self.place = place;
        console.log(startOrEnd);

        if (self.place && self.place.address_components) {
               
               self.updateLocation();
               self.focusMap(self.center);

               //set start or end
               if (startOrEnd == 'start')
               {
               self.starter = new self.$store.state.google.maps.LatLng(self.place.geometry.location.lat(), self.place.geometry.location.lng());
           }
           else {

            self.destination = new self.$store.state.google.maps.LatLng(self.place.geometry.location.lat(), self.place.geometry.location.lng());
           }

            }

    },

      updateLocation() {
         
         const self = this;

      if (self.place) {
        const marker = {
          lat: self.place.geometry.location.lat(),
          lng: self.place.geometry.location.lng(),
        };

        self.center = marker;
        
      }
      },

      focusMap(center) {
         const self = this;

         self.directionsService = new self.$store.state.google.maps.DirectionsService();

         self.directionsRenderer = new self.$store.state.google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "070ac9", strokeWeight: 6,strokeOpacity:.55 } });


self.map =  new self.$store.state.google.maps.Map(document.getElementById('map'), {
          // You configuration goes here
      zoom: 14,
      center: center,
        })


let marker = new self.$store.state.google.maps.Marker({
    position: center,
    title:"test this out"
});

   marker.setMap(self.map);

      },

      //geo location functions
    getLocation() {
    if(navigator.geolocation) {
navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },

    geoSuccess(position) {
    const self = this;
    self.selfCentered.lat = position.coords.latitude;
    self.selfCentered.lng = position.coords.longitude;

    self.focusMap(self.selfCentered);

    //set starting location if GPS is selected... develop this idea out more....
    // give them the option to use browser GPS as starting point or to type/autocomplete their starting location?

    self.starter = new self.$store.state.google.maps.LatLng(self.selfCentered.lat, self.selfCentered.lng);
},

    geoError() {
    alert("Geocoder failed.");
},

    getCurrentLocation(){
    this.getLocation();
      },


       //test adding the route calculation method for fun...
            calcRoute(directionsRenderer, directionsService) {

                const self = this;
                self.directionsRequest = true;
                //clear out the global directionsRenderer so that previous directions/map lines (if any) will be removed.
                directionsRenderer.setMap(null);

                directionsRenderer.setMap(self.map);

                //if suppressMarkers is set to false it will add an A and B marker from Start to Destination...
                directionsRenderer.setOptions({ suppressMarkers: true });

                //let start = self.searchLocation;
                let start = self.starter;
                
                //let end = destination;
                let end = self.destination;

                let request = {
                    origin: start,
                    destination: end,
                    travelMode: 'DRIVING'
                };
                directionsService.route(request, function(result, status) {
                    if (status == 'OK') {
                        directionsRenderer.setDirections(result);


                        //set the directions array to the results...
                        self.directions = result.routes[0].legs[0].steps;

                        self.directionsRequest= true;
                        self.destDetails.dest = result.routes[0].legs[0].end_address;
                        self.destDetails.distance = result.routes[0].legs[0].distance.text;
                        self.destDetails.duration = result.routes[0].legs[0].duration.text;
                    }
                });
            },
   }
};
</script>

<style>
#map
{
    position: fixed !important; 
    height: 400px !important;
    width: 100% !important;
}
</style>