<template>
	<v-card horizontal class="mb-2" hover @click="open">
		<v-card-row height="20px">
			<v-card-title class="mb-e">
				<span>{{ title }}</span>
			</v-card-title>
		</v-card-row>
		<v-spacer></v-spacer>
		<v-card-row>
			<v-spacer></v-spacer>
			<v-icon class="teal--text mr-2">open_in_new</v-icon>
		</v-card-row>
	</v-card>
</template>

<script>
export default {
  name: 'note-chip',
  props: ['id', 'title'],
  methods: {
	  open: function () {
		  console.log('opening ' + this.id)
		  this.$emit('open', this.id)
	  }
  }
}
</script>

<style scoped>
</style>
