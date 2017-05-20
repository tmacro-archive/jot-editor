<template>
	<v-chip
		:close="closable"
		@input="close"
		>
		<template v-if="edit">
			<input v-model="content"
				:placeholder="'New Tag'"
				v-autosize="content">
					<v-icon @click.native="save" class="grey--text text--darken-1">save</v-icon>
		</template>
		<template v-else>
			<template v-if="content === null">
				<v-icon @click.native="edit = true">add</v-icon>
			</template>
			<template v-else>
				{{content}}
			</template>
		</template>
	</v-chip>
</template>

<script>
export default {
  name: 'tag',
  props: ['content', 'edit', 'can_close'],
  methods: {
		save: function() {
			this.$emit('save', this.content)
			this.edit = false
		},
		close: function () {
			this.$emit('close', this.content)
		}
  },
	computed: {
		closable: function() {
			return (!this.edit && this.can_close)
		}
	}
}
</script>

<style scoped>

input:focus {
	outline: none;
}
</style>
