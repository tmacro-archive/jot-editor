var axios = require('axios');

var endpoints = {
	base: '//localhost:8081'
}

endpoints.note = endpoints.base + '/note'
endpoints.stack = endpoints.base + '/stack'
endpoints.search = endpoints.note

var buildep = function (ep, id){ return ep + '/' + id}
// localStorage persistence
var STORAGE_KEY = 'todos-vuejs-2.0'

var cacheStorage = {
	get: function (id) {
		return JSON.parse(localStorage.getItem(STORAGE_KEY + id) || 'null')

	},
	set: function (id, value) {
		localStorage.setItem(STORAGE_KEY + id, JSON.stringify(value))
	}
}

var jotApi = {
	create: function (id) {},
	get: function (id, callback) {
		axios.get(buildep(endpoints.note, id))
			.then(function (resp) {
				console.log(resp)
				callback(resp.data)
			})
	},
	update: function (note, callback) {
		axios.patch(endpoints.note, note)
			.then(function (resp){
				console.log(resp)
				callback(resp.data)
			})
	},
	search: function () {}
}

var noteStorage = {
	create: function (id) {},
	get: function (id) {},
	update: function () {},
	search: function () {}
}
export { jotApi }
// export default bus
