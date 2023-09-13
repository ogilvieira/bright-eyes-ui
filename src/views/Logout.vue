<template>
  <p class="text-body-2">Realizando logout...</p>
</template>
<script lang="ts" setup>
  import { useAppStore } from '@/store/app';
  import { useUserStore } from '@/store/user';
  import { useRouter } from "vue-router";
  const appStore = useAppStore();
  const userData = useUserStore();
  const router = useRouter();

  appStore.setToken(null);
  userData.clear();

  router.push('/login');
</script>
