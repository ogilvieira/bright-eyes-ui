<template>
  <app-bar :back-button="true"/>
  <div v-if="produtoData">
    <v-img
      height="305"
      aspect-ratio="1/1"
      contain
      :lazy-src="produtoData.imagem"
      :src="produtoData.imagem"
    ></v-img>
    <v-divider></v-divider>

    <div>{{ produtoData.name }}</div>
    <div>{{ produtoData.fabricante }}</div>
    <div>{{ produtoData.price }}</div>
    <div>
      <v-btn to="/login" block color="primary" rounded elevation="0" size="large" append-icon="mdi-arrow-right">
        COMPRAR AGORA
      </v-btn>
    </div>
    <div>
      <div>Descrição:</div>
      <div style="white-space: pre-line">{{ produtoData.descricao }}</div>
    </div>


  </div>

</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue';
  import { onMounted, ref } from 'vue';
  import { useRoute } from "vue-router";
  import Api from '@/services/api';
  const route = useRoute();

  const produtoData = ref(null);

  const fetchProduct = async () => {
    const { id } = route.params;
    const res = await Api().get<any,any>(`/produto/${id}`);
    produtoData.value = res;
  }

  onMounted(async () => {
    await fetchProduct();
  })
</script>
