<template>
  <v-app-bar
    elevation="0"
  >
    <div class="d-flex justify-space-between w-100 align-center mx-auto my-0" style="max-width: 560px;">
      <div v-if="backButton">
        <v-btn :ripple="false" @click="handleBackButton()" icon="mdi-chevron-left"></v-btn>
      </div>
      <div class="w-100">
        <v-app-bar-title class="d-flex justify-center ml-0 w-100 text-h6">{{props.title}}</v-app-bar-title>
      </div>
      <div v-if="backButton" style="width: 48px;">
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();

  export interface Props {
    title: string;
    backButton?: string | boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    backButton: false
  });

  const handleBackButton = () => {

    if( typeof props.backButton === 'boolean' ) {
      router.go(-1);
    } else {
      router.replace({ path: props.backButton })
    }

  }

</script>
