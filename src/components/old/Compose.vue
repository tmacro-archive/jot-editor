<template>
	<codemirror
		:code="value"
		:options="options"
		@change="changed"
		class="cm">
	</codemirror>
</template>

<script>
import { codemirror, CodeMirror } from 'vue-codemirror'
export default {
	name: 'jot-editor',
	props: ['handle-change', 'value'],
	computed: {
		options: function () {
			return {
				mode: 'text/x-markdown',
				tabSize: 2,
				lineNumbers: true,
				lineWrapping: true,
				indentWithTabs: true,
				theme: 'elegant',
				extraKeys: {'Shift-Enter': this.save},
				height: 'auto',
				viewportMargin: Infinity
			}
		}
	},
	methods: {
		inputHandler: function (e) {
			if (e.keyCode === 13 && e.shiftKey) {
				e.preventDefault();
				this.$emit('save');
			}
		},
		changed: function(e) {
			console.log(e)
			this.$emit('change', e)
		},
		save: function() {
			this.$emit('save', this.value)
		}
	},
	components: {
		codemirror: codemirror
	}
}

</script>

<style>

</style>
