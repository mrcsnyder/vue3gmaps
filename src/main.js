import { createApp } from 'vue'
import App from './App.vue'
import store from "./store";



// Add google map script if not exist; if already exist, return true
window.checkAndAttachMapScript = function (callback) {
   let scriptId = "map-api-script";
   let mapAlreadyAttached = !!document.getElementById(scriptId);

   if (mapAlreadyAttached) {
      if (window.google) // Script attached but may not finished loading; so check for 'google' object.
         callback();
   }
   else {
      window.mapApiInitialized = callback;

      let script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDzYarFEpNwFH1lIDWdeH4BDbEVSR7TUSE&libraries=places,geometry&callback=mapApiInitialized';
      document.body.appendChild(script);
   }

   return mapAlreadyAttached;
}



createApp(App).use(store).mount('#app')
