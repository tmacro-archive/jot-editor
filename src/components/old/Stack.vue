<template>
	<div>
		<template v-for="note in notes" >
			<v-row>
			<v-col xs12 md10 offset-md1>
				<jot-note	v-bind:key="note" 
							v-bind:id="note" 
							@save="onSave"
							@remove="pop">
				</jot-note>
			</v-col>
			</v-row>
		</template>
	</div>
</template>

<script>
import Note from './Note.vue'
import bus from './eventBus.js'
var axios = require('axios');
var _ = require('lodash');

export default {
	name: 'stack',
	data: function () {
		return {
			notes: []
		}
	},
	props: ['stack'],
	mounted: function () {
		this.loadStack(this.stack)
		var v = this
		bus.$on('stack:push',function (stack, id){
			console.log('got push ' + v.stack)
			if (stack === v.stack)
				v.push(id)
		})
	},
	methods: {
		loadStack: function (id) {
			console.log('Loading stack ' + id)
			var v = this
			axios.get('http://localhost:8081/stack/' + id)
				.then(function (resp) {
					console.log('Loaded notes')
					console.log(resp.data);
					v.notes = resp.data.results
				})
				.then(function (error) {
					// console.log(error);
				})
		},
		onSave: function (data) {
			this.$emit("save", data)
		},
		pop: function (id) {
			console.log('removing ' + id)
			this.notes = _.filter(this.notes, function(cur_id) {
							return  cur_id != id;
						 })
		},
		push: function (id) {
			console.log('pushing')
			this.notes.unshift(id)
		}
	},
	components: {
		'jot-note': Note,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
	  background-color: inherit;

}
</style>
