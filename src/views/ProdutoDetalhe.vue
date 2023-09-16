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
      <v-container class="pt-0" fluid>
        <div class="text-h4 pt-6 font-weight-black">{{ produtoData.name }}</div>
        <div class="text-subtitle-1 font-weight-regular text-grey-lighten-1">{{ produtoData.fabricante }}</div>
        <div class="pt-6 pb-6 text-right" v-if="produtoData.preco">
          <div class="text-h6 font-weight-black">{{ priceFormated((+produtoData.preco)) }}</div>
          <div class="text-grey-darken-1">ou até 12x de {{ priceFormated((+produtoData.preco) / 12) }}</div>
        </div>

        <div v-if="user?.tipo.key === 'cliente'">
          <v-btn :to="`/comprar/${id}`" block color="primary" rounded elevation="0" size="large" append-icon="mdi-arrow-right">
            COMPRAR AGORA
          </v-btn>
        </div>

        <div v-if="['gerente', 'editor'].includes(user?.tipo?.key ?? '')">
          <v-btn :to="`/catalogo/${id}/editar`" block color="secondary" rounded elevation="0" size="large" append-icon="mdi-arrow-right">
            EDITAR
          </v-btn>
        </div>

        <div class="text-body-2 pt-6 pb-6">
          <div class="font-weight-black">Descrição:</div>
          <div style="white-space: pre-line" v-html="produtoData.descricao"></div>
        </div>
      </v-container>
    </div>
    <v-container v-if="!produtoData && !isLoading">
    <v-row style="height: 300px;" class="d-flex align-center">
      <v-col>
        <div>
          <div class="text-center">
            <div class="text-body">Item não encontrado.</div>
            <div class="pt-6">
              <v-btn @click="router.go(-1)" color="primary" rounded elevation="0" size="small" prepend-icon="mdi-arrow-left">
                Voltar
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>


</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from "vue-router";
  import Api from '@/services/api';
  import { useUserStore } from '@/store/user';

  const { user } = useUserStore();

  const route = useRoute();
  const router = useRouter();
  const { id } = route.params;

  interface IProduto {
    name: string;
    fabricante: string;
    preco: string | number;
    imagem: string;
    descricao: string;
  }

  const produtoData = ref<IProduto>();
  const isLoading = ref(true);

  const fetchProduct = async () => {
    try {
      const res = await Api().get<IProduto,any>(`/produto/${id}`);
      produtoData.value = res;
    } catch (err) {
      console.error(err);
    }
    isLoading.value = false;
  }

  const priceFormated = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BRL'
    }).format(+value).replace(/^(\D+)/, '$1 ');
  };

  onMounted(async () => {
    await fetchProduct();
  })
</script>
