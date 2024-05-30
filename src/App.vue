<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  /* background: linear-gradient(to right, #6a11cb, #2575fc);*/
  background: url('/images/background.jpg') no-repeat center center fixed;
  background-size: cover;
  color: #333;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
