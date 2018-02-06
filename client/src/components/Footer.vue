<template>
  <mu-paper id="footer">
      <mu-bottom-nav :value="bottomNav" @change="handleChange">
        <mu-bottom-nav-item class="bottom-item" value="Search" title="Search" to="/search" icon="search"/>
        <mu-bottom-nav-item class="bottom-item" value="Home" title="Home" to="/" icon="home"/>
        <mu-bottom-nav-item class="bottom-item" value="Topic" title="Topic" to="/topic/list" icon="language"/>
        <mu-bottom-nav-item class="bottom-item" value="Explore" title="Explore" to="/explore" icon="explore"/>
        <mu-bottom-nav-item class="bottom-item" value="Setting" title="Setting" to="/setting" icon="build"/>
      </mu-bottom-nav>
  </mu-paper>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: this.$route.name
    }
  },
  mounted() {
    console.log(this.$route.name);
  },
  methods: {
    handleChange (val) {
      this.bottomNav = val
    }
  }
}
</script>


<style lang="scss" scoped>
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
