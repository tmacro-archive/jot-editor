<template>
	<!--<div class="ombar">
	</div>-->
	<!--<v-toolbar class="mb-3 teal lighten-3">
		<v-card-text>
			<v-text-field
				name="input-1-3"
				label="Jot something down..."
				v-model="query"
				@keyup.native="inputHandler"
				single-line
				class="search">
			</v-text-field>
		</v-card-text>
			<v-btn v-tooltip:top="{ html: 'Delete' }"
					icon
					class="white">
				<v-icon class="white red--text text--lighten-1" >search</v-icon>
			</v-btn>
	</v-toolbar>-->
	<v-toolbar class="teal lighten-3 mb-3">
		<!--<v-toolbar-side-icon></v-toolbar-side-icon>-->
		<!--<v-toolbar-title class="hidden-sm-and-down">-->
			<v-text-field
				name="input-1-3"
				label="Jot something down..."
				v-model="query"
				@keyup.native="inputHandler"
				single-line
				class="search mt-2 ml-2">
			</v-text-field>
		<!--</v-toolbar-title>-->
		<!--<v-spacer></v-spacer>-->
		<v-btn icon dark>
			<v-icon>search</v-icon>
		</v-btn>
		<v-btn icon>
			<v-icon>note_add</v-icon>
		</v-btn>
		<v-btn icon dark>
			<v-icon>settings</v-icon>
		</v-btn>
	</v-toolbar>

</template>

<script>
export default {
	name: 'ombar',
	data: function () {
		return {
			query: ''
		}
	},
	methods: {
		inputHandler: function (e) {
			if (e.keyCode === 13 && !e.shiftKey) {
				e.preventDefault();
				this.search();
			} else if (e.keyCode === 13 && e.shiftKey) {
				e.preventDefault();
				this.create();
			}
		},
		search: function (event) {
			console.log('searching for ' + this.query + '!')
			this.$emit('search', this.query)
		},
		create: function (event) {
			console.log('creating note ' + this.query + '!')
			this.$emit('create', {title: this.query, body: '', tags: []})
			this.query = ''
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ombar {
	padding-top: 0px;
	text-align: center;
}

.search {
	height: 100%;
	width: 75%;
	margin: auto;
	
}
input:focus {
}
</style>
