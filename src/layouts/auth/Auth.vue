<template>
  <v-app>
    <v-container fluid class="align-center justify-center d-flex flex-wrap" style="min-height: 100vh;">
      <div style="width: 100%; max-width: 327px;">
        <div class="justify-center d-flex">
          <v-img
            :width="289"
            :height="114"
            contain
            src="/public/logo.svg"
          ></v-img>
        </div>
        <default-view />
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultView from '../default/View.vue'
</script>
