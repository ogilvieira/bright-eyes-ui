<template>
  <v-app-bar
    elevation="0"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon v-if="showBackButton" class="text-secondary"></v-app-bar-nav-icon>
    </template>

    <v-spacer />
    <v-app-bar-title class="d-flex justify-center ml-0">{{props.title}}</v-app-bar-title>
    <v-spacer />
    <template v-slot:append>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  export interface Props {
    title: string;
    showBackButton?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    showBackButton: false
  });

</script>
