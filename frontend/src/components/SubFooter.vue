<template>
  <div class="container">
    <div class="icons">
      <div v-if="subPlan">
        <div v-if="subPlan === 'Prime'">
          <v-img src="@/assets/prime.png" alt="" />
        </div>
        <div v-else-if="subPlan === '2000'">
          <img src="@/assets/silver_star.png" alt="" />
        </div>
        <div v-else-if="subPlan === '3000'">
          <v-img src="@/assets/gold_star.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubFooter",
  props: ['userstate'],
  computed: {
    subPlan() {
      return this.userstate['msg-param-sub-plan']
    }
  }
}
</script>

<style scoped>
.icons {
  position: absolute;
  bottom: 0;
  right: 3px;
}

.icons img {
  height: 18px;
}
</style>
