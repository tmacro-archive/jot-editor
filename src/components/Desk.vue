<template>
	<v-container fluid="fluid">
		<v-row>
			<v-col xs12>
				<ombar @create="createNote" @search="searchNote"></ombar>
			</v-col>
			<template v-if="results.length != 0">
				<v-col xs1 offset-md1 class="mb-2">
					<div @click="results = []" class="close red lighten-3" v-tooltip:left="{ html: 'CLOSE RESULTS' }">
						<!--<v-icon class="white--text">close</v-icon>									-->
					</div>
				</v-col>
				<v-col xs11 md3  class="mb-1">
					<note-chip v-for="result in results" 
								:key="result.id" 
								:id="result.id" 
								:title="result.title"
								@open="openNote"
								>
					</note-chip>
				</v-col>
			</template>


			<template v-for="stack in stacks">
			<v-col xs12>
				<note-stack v-for="stack in stacks" :key="stack" :stack="stack">
				</note-stack>
			</v-col>
			</template>
		</v-row>
			<v-snackbar class="green"
				:timeout="3000"
				:bottom="true"
				:right="true"
				:absolute="true"
				v-model="snackbar">
				<!--<v-icon class="white--text">save</v-icon>-->
				<span>Note Saved</span>
				<v-btn icon class="white-text" @click.native="snackbar = false">
					<v-icon class="white--text">close</v-icon>				
				</v-btn>
			</v-snackbar>
	</v-container>
</template>

<script>
import Stack from './Stack.vue'
import NoteChip from './test/NoteChip.vue'
import bus from './eventBus.js'
var axios = require('axios');
var endpoints = {
	base: '//10.1.0.10:8081'
}
endpoints.note = endpoints.base + '/note'

import OmBar from './OmBar.vue'
export default {
	name: 'desk',
	data: function () {
		return {
			stacks: ['default'],
			snackbar: false,
			results: [],
			active_stack: 'default'
		}
	},
	created: function () {
	},
	mounted: function () {
		bus.$on('note:save', this.onSave)
		this.active_stack = this.stacks[0]
	},
	methods: {
		createNote: function ({ title = 'New Note', body = '', tags = [] } = 0) {
			console.log('Creating note with title ' + title)
			axios.put(endpoints.note, {
				title: title,
				body: body,
				tags: tags
			})
			.then(function (resp) {
				console.log('Created note ' + resp.data.results.id)
				bus.$emit('stack:push', 'default', resp.data.results.id)
				// v.notes.push(resp.data.results)
			})
			.then(function (error) {
				console.log(error)
			})
		},
		searchNote: function (query) {
			var v = this
			axios.get(endpoints.note, {
					params: {
						title: query,
						limit: 10
					}
				})
				.then(function(resp){
					// console.log('Loaded note ' + this.id)
					console.log(resp.data)
					v.results = resp.data.results
				})
				.then(function(error){
					console.log(error)
				})
		},
		onSave: function (id) {
			this.snackbar = true
		},
		openNote: function(id) {
			console.log('pushing ' + id + ' to ' + this.active_stack)
			bus.$emit('stack:push', this.active_stack, id)
			this.results = _.filter(this.results, function(cur) {
							return  cur.id != id;
						 })
		}
	},
	components: {
		'ombar': OmBar,
		'note-stack': Stack,
		'note-chip': NoteChip,
	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.close {
	height: 99%;
	width: 50%;
	margin-left: auto;
}
.close:hover {
	/*background-color: red;*/
}
</style>
