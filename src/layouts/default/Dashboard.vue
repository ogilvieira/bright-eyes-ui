<template>
  <v-app>
    <default-view />
    <footer-bar />
  </v-app>
</template>

<script lang="ts" setup>
  import FooterBar from './FooterBar.vue'
  import DefaultView from './View.vue'
  import { useUserStore } from '@/store/user';

  const user = useUserStore();
  user.init();
</script>
