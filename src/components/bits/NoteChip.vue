<template>
	<v-card horizontal class="mb-2" hover @click="open">
		<v-card-row height="50px">
			<v-card-title class="mb-e">
				<span class="title">{{ title }}</span>
			</v-card-title>
		</v-card-row>
		<v-spacer></v-spacer>
		<v-card-row>
			<note-tag v-for="tag in tags"
				:content="tag"
				>
			</note-tag>
			<v-spacer></v-spacer>
			<v-icon class="teal--text mr-2">open_in_new</v-icon>
		</v-card-row>
	</v-card>
</template>

<script>
import Tag from './Tag.vue'
export default {
  name: 'note-chip',
  props: ['id', 'title', 'tags'],
  methods: {
	  open: function () {
		  console.log('opening ' + this.id)
		  this.$emit('open', this.id)
	  }
  },
	components: {
		"note-tag": Tag
	}
}
</script>

<style scoped>
.title {
	display: inline-block;
}
</style>
