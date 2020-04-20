<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      isRouterAlive: true,
    }
  },
  created() {
  },
  provide() {
    return {
      reload: this.reload,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    }
  }
}

</script>

<style>
.el-form-item__content{
    display: block;
}
.el-form-item__label{
    text-align: right!important;
    width: 7vw
}
.el-form-item {
    margin-bottom: 1.5vh !important;
}

.el-header-app {
  height: 13vh !important;
  background: url(assets/header_bg1.jpg) center no-repeat;
  background-size: cover;
}

.logo_image {
  margin-top: 3.5vh; 
}

body {
  padding: 0;
  margin: 0;
}
</style>
