<template>
	<v-card class="mb-3 white">
		<v-card-row class="grey lighten-3">
			<v-card-title class="title">
				<template v-if="editing">
					<v-text-field
						name="input-1-3"
						:label="title"
						v-model="title"
						single-line
						class="search mr-5">
					</v-text-field>
				</template>
				<template v-else>
					<span class="teal--text mr-5 mb-3">{{ title }}</span>
				</template>
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

			<note-tag v-for="tag in tags"
				:content="tag"
				:key="tag"
				:can_close="editing"
				:edit="false"
				@close="removeTag"
			></note-tag>
			<note-tag v-if="editing"
				:content="null"
				:edit="false"
				@save="addTag">
			</note-tag>
			<!--<v-chip v-if="adding_tag">
				<input></input>
				<v-icon right>check</v-icon>
			</v-chip>
			<v-btn v-tooltip:top="{ html: 'New Tag' }"
					icon
					class="teal--text teal lighten-5"
					@click.native="adding_tag=true"
					>
				<v-icon>add</v-icon>
			</v-btn>-->
		</v-card-row>
			<!--<v-card-row>
			</v-card-row>-->
		<v-card-row>
			<template v-if="editing">
				<v-col xs12 md6>
					<v-card-text>
						<jot-editor class="editor"
									:value="edited"
									:handle-change="update"
									v-on:change="update"
									v-on:save="save">
						</jot-editor>
					</v-card-text>
				</v-col>
			</template>
				<v-col xs12 md6>
					<v-card-text v-html="compiled" class="ma-3">
					</v-card-text>
				</v-col>
		</v-card-row>
	</v-card>
</template>

<script>
import Compose from './Compose.vue'
import bus from './eventBus.js'
import { jotApi } from './storage.js'
import Tag from './bits/Tag.vue'
var marked = require('marked');
var _ = require('lodash');
var axios = require('axios');
// var Remarkable = require('remarkable');
// var md = new Remarkable();
// import md from './markd.js'

var Remarkable = require('remarkable');

var md = new Remarkable();

const expr = {
	task: /^\s*\[([xX\s])?\]\s?(.+)/
}

var parseTask = function (state, check) {
	var match = expr.task.exec(state.src.slice(state.pos))
	if (!match) return false
	console.log(match)
	console.log(state)
	debugger;
	if (!check) {
		state.push({
			type: 'task',
			level: state.level,
			content: match[2]
			// complete: match[1] == 'x' || match[1] == 'X'
		})
	}
	state.pos += match[0].length
}

var renderTask = function (tokens, id, options, env) {
	if (tokens[id] == 'task') {
		console.log('rendering task')
		console.log(env)
		return '<input type="checkbox" value="true"></input>'
	}
}

var jotPlugin = function (md, options) {
	md.inline.ruler.push('jotTask', parseTask)
	md.renderer.rules.parsTask = renderTask
	// md.renderer.rules.push('task', renderTask, {})
}

md.use(jotPlugin)

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
			// return marked(this.edited, { sanitize: true })
			return md.render(this.edited)
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
			jotApi.update({
				id: this.id,
				title: this.title,
				body: this.edited,
				tags: this.tags
			}, this.onSave)
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
			this.tags = d.tags
		},
		onSave: function (data) {
			console.log(data)
			this.editing = false
			this.$emit('save', this.id)
			bus.$emit('note:save', this.id)
		},
		removeTag: function (tag) {
			this.tags = _.filter(this.tags, function(t) {
								return  t != tag;
							})
			// this.save()
		},
		addTag: function(tag) {
			this.tags.push(tag)
			// this.save()
		}
	},
	components: {
		'jot-editor': Compose,
		'note-tag': Tag
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input:focus {
	outline: 0px;
}

.search {
	padding: 0;
	margin-top: 0;
	margin-bottom: 0;
}

.title {
	padding-bottom: 0;
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
/*
   This document has been created with Marked.app <http://marked2app.com>
   Please leave this notice in place, along with any additional credits below.
   ---------------------------------------------------------------
   Title: Kult
   Author: Peter Sziebig - @bigpe
   Description: Easy to read
*/

@font-face {
    font-family: "Ubuntu";
    font-style: normal;
    font-weight: 300;
    src: local("Ubuntu Light"), local("Ubuntu-Light"), url("http://themes.googleusercontent.com/static/fonts/ubuntu/v4/WtcvfJHWXKxx4x0kuS1kobO3LdcAZYWl9Si6vvxL-qU.woff") format("woff");
}
@font-face {
    font-family: "Ubuntu";
    font-style: normal;
    font-weight: 400;
    src: local("Ubuntu"), url("http://themes.googleusercontent.com/static/fonts/ubuntu/v4/CGXpU_uR_FUfdeyCjAWgZ-vvDin1pK8aKteLpeZ5c0A.woff") format("woff");
}
@font-face {
    font-family: "Ubuntu";
    font-style: normal;
    font-weight: 500;
    src: local("Ubuntu Medium"), local("Ubuntu-Medium"), url("http://themes.googleusercontent.com/static/fonts/ubuntu/v4/gMhvhm-nVj1086DvGgmzB7O3LdcAZYWl9Si6vvxL-qU.woff") format("woff");
}
@font-face {
    font-family: "Ubuntu";
    font-style: normal;
    font-weight: 700;
    src: local("Ubuntu Bold"), local("Ubuntu-Bold"), url("http://themes.googleusercontent.com/static/fonts/ubuntu/v4/nsLtvfQoT-rVwGTHHnkeJrO3LdcAZYWl9Si6vvxL-qU.woff") format("woff");
}
@font-face {
    font-family: "Ubuntu";
    font-style: italic;
    font-weight: 300;
    src: local("Ubuntu Light Italic"), local("Ubuntu-LightItalic"), url("http://themes.googleusercontent.com/static/fonts/ubuntu/v4/DZ_YjBPqZ88vcZCcIXm6VqfTCPadK0KLfdEfFtGWCYw.woff") format("woff");
}



html {
    font-size: 100%;
}
html, button, input, select, textarea {
    font-family: sans-serif;
}

html, body, button, input, select, textarea {
    color: #57534A;
    font-family: "Ubuntu","Myriad Pro","Myriad",sans-serif;
    font-size: 18px;
	font-weight: 300;
}

body{
    margin: 0 auto;
    background-color: #FFFFFF;
}

body, textarea {
    line-height: 1.4;
}


body:after {
    clear: both;
    content: "";
    display: table;
}

body {
    padding-left: 6rem;
    padding-right: 6rem;
    margin-left: auto;
    margin-right: auto;
    max-width: 42rem;
    display: block;
}



h1, h2, h3, dt {
    color: #423F37;
    font-weight: 700;
}

h1 {
    font-size: 2em;
    margin: 0.67em 0;
}
h2, .article-list .article-title {
    font-size: 1.5em;
    margin: 0.83em 0;
}
h3, dt {
    font-size: 1.17em;
    margin: 1em 0;
}
h4 {
    font-size: 1em;
    margin: 1.33em 0;
}
h5 {
    font-size: 0.83em;
    margin: 1.67em 0;
}
h6 {
    font-size: 0.75em;
    margin: 2.33em 0;
}


a {
    color: #8DB359;
    cursor: pointer;
    outline: 0 none;
    text-decoration: underline;
}

a:hover {
    outline: 0 none;
    color: #739544;
}


p, pre {
    margin: 1em 0;
}
code, kbd, pre, samp {
    font-family: monospace,serif;
    font-size: 1em;
    margin: 0;
    padding: 0;

}
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}

pre {
    background-color: #F8F5F0;
    font-size: 0.7rem;
    overflow-x: auto;
    padding: 1.3rem;
    position: relative;
    white-space: pre;
    word-wrap: normal;
}
pre, code, kbd, samp {
    margin: 0;
}
code, kbd, pre, samp {
    font-family: monospace,serif;
}

code {
    color: #423F37;
}


aside {
    display: block;
    float: right;
    width: 390px;
}


b, strong {
    font-weight: bold;
    color: #423F37;
    font-weight: 700;
}

blockquote {
    color: #423F37;
    font-size: 1.25em;
    font-weight: 700;
	margin: 1em 40px;
}

blockquote {
    margin-bottom: 2em;
    margin-top: 2em;
}

figure {
	margin-left: -4.5rem;
    margin-right: -4.5rem;
    margin-bottom: 2em;
    margin-top: 2em;
}


hr {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    border-color: -moz-use-text-color -moz-use-text-color #ECE6DA;
    border-image: none;
    border-style: none none solid;
    border-width: medium medium 1px;
    margin: 3em 6em;
}


img {
    max-width: 100%;
    display: block;
    border: 0 none;
}


ol > li:before {
    color: #423F37;
    content: counter(ol, decimal) ".";
    counter-increment: ol;
    font-weight: 700;
    margin-right: 0.333em;
    position: absolute;
    right: 100%;
}

ul > li:before {
    background-color: #423F37;
    border-radius: 14px 14px 14px 14px;
    content: "";
    height: 6px;
    margin-right: 0.333em;
    margin-top: 0.55em;
    position: absolute;
    right: 100%;
    width: 6px;
}

ol, ul, dl {
    margin-left: 2rem;
    padding: 0;
}
ol {
    counter-reset: ol;
}
li + li, dd + dt {
    margin-top: 0.5em;
}

ul > li {
    position: relative;
}

ol > li {
    position: relative;
}
li {
    list-style: none outside none;
}


figure > figcaption {
    margin-top: 0.5em;
}
small, dd, figcaption {
    color: #A19C91;
    display: block;
    font-size: 0.8rem;
    font-style: italic;
    line-height: 1.2;
}


tbody{display:table-row-group}
tfoot{display:table-footer-group}
table{margin-bottom:2em;font-size: 0.8em;padding:0;border-collapse:collapse;-webkit-box-shadow:1px 1px 2px rgba(0,0,0,.35);width:80%;margin:0 auto 2em auto}
table th,table td{padding:10px 10px 9px;line-height:18px;text-align:left}
table th{
padding-top:9px;text-transform:uppercase;vertical-align:middle}
table td{vertical-align:top;border-top:1px solid #ddd;}
table tbody th{border-top:1px solid #ddd;vertical-align:top}
table{border:1px solid #ddd;border-collapse:separate;*border-collapse:collapse;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}
table th+th,table td+td,table th+td{border-left:1px solid #ddd}
table thead tr:first-child th:first-child,table tbody tr:first-child td:first-child{-webkit-border-radius:4px 0 0 0;-moz-border-radius:4px 0 0 0;border-radius:4px 0 0 0}
table thead tr:first-child th:last-child,table tbody tr:first-child td:last-child{-webkit-border-radius:0 4px 0 0;-moz-border-radius:0 4px 0 0;border-radius:0 4px 0 0}
table tbody tr:last-child td:first-child{-webkit-border-radius:0 0 0 4px;-moz-border-radius:0 0 0 4px;border-radius:0 0 0 4px}
table tbody tr:last-child td:last-child{-webkit-border-radius:0 0 4px 0;-moz-border-radius:0 0 4px 0;border-radius:0 0 4px 0}
tbody tr:nth-child(odd){background-color:rgba(0,0,0,0.03)}

caption{display:table-caption;font-weight:300;font-size:1.3em;text-transform:uppercase;letter-spacing:2px;word-spacing:.2em;background:rgba(0,0,0,.75);color:#EEE;padding:4px;-webkit-border-radius:4px;margin:4px 0;-webkit-box-shadow:2px 2px 2px rgba(0,0,0,.35)}

/* grey out placeholders */
:-moz-placeholder {
  color: #bfbfbf;
}
::-webkit-input-placeholder {
  color: #bfbfbf;
}


.article-date {
    color: #C7C2B8;
    display: block;
    font-size: 0.8rem;
}


</style>
