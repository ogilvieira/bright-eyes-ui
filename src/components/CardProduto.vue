<template>
  <v-card flat :link="!!(props.to)" variant="outlined" :to="props.to" class="mb-2">
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col class="pa-0" cols="4">
            <v-img
              :width="126"
              aspect-ratio="1/1"
              contain
              :lazy-src="props.photo"
              :src="props.photo"
            ></v-img>
          </v-col>
          <v-col cols="8">
            <div class="text-subtitle-1 font-weight-medium">{{ props.title }}</div>
            <div class="text-body-2 font-weight-medium">{{ props.brand }}</div>
            <div class="mt-2 font-weight-black">{{ priceFormated }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { computed } from 'vue';

export interface Props {
  title: string;
  photo: string;
  price: number | string;
  brand: string;
  to?: string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  photo: '',
  price: 0,
  brand: ''
});

const priceFormated = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL'
  }).format(+props.price).replace(/^(\D+)/, '$1 ');
})



</script>
