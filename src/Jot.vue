<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-size: 12px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50; 
}
body {
  background-color: #ededed;
}
.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  font-family: monospace;
  height: auto;
  color: black;
}
h1 {
  /*font-size: 75px;*/
}
</style>
