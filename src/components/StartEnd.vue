<template>

	<div>

		<input
         type="text"
         ref="search"
         placeholder="Search Your Starting Location"
         v-model="location"
        />
	
	</div>

</template>

<script>

	export default {
   name: 'StartEnd',

   props: [

'startOrEnd',

],
   data(){

    return {

      location: null,
      autocomplete: null,
   }
},

   mounted(){

    this.initLocationSearch();

   },

   methods: {

      initLocationSearch() {
      const self = this;
      
      const options = {
  fields: ['geometry', 'address_components', 'place_id'] 
};
self.autocomplete = new self.$store.state.google.maps.places.Autocomplete(self.$refs.search, options);
         self.autocomplete.addListener("place_changed", function() {

            //set searched place back to parent component to update map (if starting location)
            //TODO: also set start place if start, and set end place if end
            self.$emit('autocompleteLocation', {place: self.autocomplete.getPlace(), startOrEnd: self.startOrEnd});
            
         }.bind(self));

        
      },

      

            },
   
};
</script>