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
            <div class="text-subtitle-1 font-weight-medium">#ID {{ props.id }}</div>
            <div class="text-body-2 font-weight-medium mt-0 text-grey-lighten-1">{{ dayjs(props.createdAt).format('DD/MM/YYYY HH:mm') }}</div>
            <div class="mt-2 font-weight-black">{{props.parcelas}} x de {{ priceFormated }}</div>
          </v-col>
        </v-row>
        <v-row v-if="props.status" class="pt-2">
          <span class="mr-2">Status:</span> <span class="text-secondary"> {{ statusFormated }}</span>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

export interface Props {
  id: number;
  parcelas: number;
  photo: string;
  createdAt: Date;
  total: number;
  status?: string;
  to?: string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
});

const statusFormated = computed(() => {
  return {
    'recebido': "Recebido",
    'aguardando': "Aguardando",
    'cancelado': "Cancelado",
    'enviado': "Enviado"
  }[props.status ?? ''] ?? '';
});

const priceFormated = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(props.total / props.parcelas).replace(/^(\D+)/, '$1 ');
})



</script>
