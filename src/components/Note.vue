<template>
	<v-card class="mb-3">
		<v-card-row class="grey lighten-3">
			<v-card-title>
				<span class="teal--text mr-5">{{ title }}</span>
				<!--<v-spacer></v-spacer>-->
				
				
				</v-card-title>
				<v-spacer></v-spacer>
				<span class="grey--text text--lighten-1" >March 15, 2017 2:53 p.m.</span>
				<v-btn v-tooltip:top="{ html: 'Delete' }"
						icon
						class="">
					<v-icon class="teal--text text--lighten-3" >delete</v-icon>
				</v-btn>
				<template v-if="editing">
					<v-btn icon @click.native="save" v-tooltip:top="{ html: 'save' }" class="">
						<v-icon class="teal--text text--lighten-3">save</v-icon>
					</v-btn>
					<v-btn icon @click.native="discard" v-tooltip:top="{ html: 'Discard' }" class="">
						<v-icon class="teal--text text--lighten-3" >do_not_disturb</v-icon>
					</v-btn>
					<v-btn icon @click.native="close" v-tooltip:top="{ html: 'Discard & Close' }" class="">
						<v-icon class="teal--text text--lighten-3" >close</v-icon>
					</v-btn>
				</template>
				<template v-else>
					<v-btn icon @click.native="edit" v-tooltip:top="{ html: 'Edit' }" class="">
						<v-icon class="teal--text text--lighten-3">mode_edit</v-icon>
					</v-btn>
					<v-btn icon @click.native="close" v-tooltip:top="{ html: 'Close' }" class="">
						<v-icon class="teal--text text--lighten-3" >close</v-icon>
					</v-btn>
				</template>
		</v-card-row>
		<v-card-row>

			<v-chip v-for="tag in tags">{{ tag }}</v-chip>
			<v-chip v-if="adding_tag">
				<input></input>
				<v-icon right>check</v-icon>
			</v-chip>
			<v-btn v-tooltip:top="{ html: 'New Tag' }"
					icon
					class="teal--text teal lighten-5"
					@click.native="adding_tag=true"
					>
				<v-icon>add</v-icon>
			</v-btn>
		</v-card-row>
		<template v-if="editing">
			<v-card-row>
				<v-card-text>
					<jot-editor class="editor"
								:value="edited"
								:handle-change="update"
								v-on:change="update"
								v-on:save="save">
					</jot-editor>
				</v-card-text>
			</v-card-row>
		</template>
		<v-card-row>
			<v-card-text v-html="compiled" class="ma-3">
			</v-card-text>
		</v-card-row>
	</v-card>
</template>

<script>
import Compose from './Compose.vue'
import bus from './eventBus.js'
import { jotApi } from './storage.js'
var marked = require('marked');
var _ = require('lodash');
var axios = require('axios');
var autosizeInput = require('autosize-input');
var endpoints = {
	base: '//10.1.0.10:8081'
}
endpoints.note = endpoints.base + '/note'

export default {
	name: 'jot-note',
	props: ['id'],
	data: function () {
		return {
			title: '',
			body: '',
			tags: [],
			edited: false,
			editing: false,
			adding_tag: false,
		}
	},
	mounted: function () {
			// var v = this
			// axios.get(endpoints.note + '/' + this.id)
			// 		.then(function(resp){
			// 			// console.log('Loaded note ' + this.id)
			// 			console.log(resp.data)
			// 			var d = resp.data.results
			// 			v.title = d.title
			// 			v.body = d.body
			// 			v.tag = d.tags
			// 		})
			// 		.then(function(error){
			// 			console.log(error)
			// 		})
			jotApi.get(this.id, this.onLoad)
		},
	computed: {
		compiled: function () {
			if (this.edited == false) {
				console.log('setting edited to body')
				this.edited = this.body
			}
			console.log('rendering markdown')
			return marked(this.edited, { sanitize: true })
		}
	},
	methods: {
		update: _.debounce(function (e) {
			this.edited = e
		}, 300),
		edit: function () {
			this.editing = true
			this.edited = this.body
			this.$emit('edit', this.id)
		},
		save: function () {
			var v = this
			axios.patch(endpoints.note, {
				id: this.id,
				title: this.title,
				body: this.edited,
				tags: this.tags
			})
			.then(function(resp){
				// console.log('saved note ' + id)
				console.log(resp.data)
				v.editing = false
				v.$emit('save', v.id)
				bus.$emit('note:save', v.id)
			})
			.then(function(error){
				console.log(error)
			})
		},
		discard: function () {
			this.edited = ''
			this.editing = false
		},
		close: function () {
			this.$emit('remove', this.id)
		},
		onLoad: function (data) {
			var d = data.results
			console.log(data)
			this.title = d.title
			this.body = d.body
			this.tag = d.tags
		}
	},
	components: {
		'jot-editor': Compose,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input:focus {
	outline: 0px;
}
/*h1 {
	font-size: 20px;
	font-weight: 500;
	margin-bottom: 25px;
}

.card {
	background-color: #fff;
	border-radius: 2px;
	box-shadow: -1px 2px 4px rgba(0, 0, 0, .25), 1px 1px 3px rgba(0, 0, 0, .1);
	margin: 0 auto;
	max-width: 75%;
}

.card-content {
	width: 90%;
	height: 90%;
	margin: auto;
	padding-bottom: 1em;
	}

.card-head {
	width: 100%;
	font-weight: 400;
	font-size: 26px;
	margin-bottom: 15px;
	margin-left: 15px;
	text-align: left;
}

.card-body {
	width: 100%;
	padding: 5px 15px;
	text-align: left;
}

.card-action-button {
	border-radius: 2px;
	color: #FFAB40;
	cursor: pointer;
	display: inline-block;
	font-weight: 500;
	margin: 0;
	padding: 10px;
	text-decoration: none;
}

.card-action-button:hover {
	background-color: rgba(255, 168, 58, .2);
}

.editor {
	width: 100%;
}

.editor > textarea {
	width: 100%;
	border: 1px solid #C7C6CD;
}*/
</style>
