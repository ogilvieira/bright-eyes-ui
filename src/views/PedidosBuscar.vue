<template>
  <app-bar
    back-button="/pedidos"
    title="Buscar Pedido"/>

  <v-container>

    <v-row class="text-body-2 font-weight-medium">
      <v-col>
        <div v-if="query.terms">Buscando por “{{query.terms}}”</div>
        <div v-if="query.status">Status: {{ statusFormated(query.status) }}</div>
        <div v-if="query.data_inicial">Depois de:  {{ dayjs(''+query.data_inicial).format('DD/MM/YYYY') }}</div>
        <div v-if="query.data_final">Antes de: {{ dayjs(''+query.data_final).format('DD/MM/YYYY') }}</div>
      </v-col>
    </v-row>

    <v-row v-if="(!compras || !compras.length) && !isLoading" style="height: 300px;" class="d-flex align-center">
      <v-col>
        <div>
          <div class="text-center">
            <div class="text-body">Nenhum item encontrado.</div>
            <div class="pt-6">
              <v-btn @click="clearSearch()" color="primary" rounded elevation="0" size="small" prepend-icon="mdi-arrow-left">
                Voltar
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="compras && compras.length">
      <v-col>
        <div v-for="(compra, index) in compras" :key="index">
          <v-card flat :link="true" variant="outlined" :to="`/pedidos/detalhe/${compra.id}`" class="mb-2">
            <v-card-text>
              <v-container fluid class="pa-0">
                <v-row>
                  <div class="text-subtitle-1 font-weight-medium">#ID {{ compra.id }}</div>
                </v-row>
                <v-row>
                  <div class="text-body-2 font-weight-medium mt-0 text-grey-lighten-1">{{ dayjs(compra.createdAt).format('DD/MM/YYYY HH:mm') }}</div>
                </v-row>
                <v-row>
                  <span class="mr-2">Status:</span> <span class="text-secondary"> {{ statusFormated(compra.status) }}</span>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
        <div ref="marker"></div>
      </v-col>
    </v-row>



  </v-container>

</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue'
  import { ref, onMounted } from 'vue';
  import Api from '@/services/api';
  import { useEventListener } from '@vueuse/core'
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  const route = useRoute();

  interface IProduto {
    imagem: string;
  }

  interface IPedido {
    id: number,
    createdAt: Date,
    total: number,
    parcelas: number,
    produto: IProduto,
    data_entrega: Date,
    status: "recebido" | "aguardando" | "enviado" | "cancelado"
  }

  const query = ref(route.query);
  const compras = ref<IPedido[]>([]);
  const marker = ref(null);
  const isLoading = ref(false);
  const page = ref(1);
  const canPaginate = ref(true);

  const clearSearch = async () => {
    page.value = 1;
    await fetchPedidos(1);
  }

  const fetchPedidos = async (localPage: number = 1) => {
    if( isLoading.value || (localPage !== 1 && !canPaginate.value)) { return; }

    isLoading.value = true;
    try {
      const res = await Api({ requiresAuth: true }).get<any,any>('/pedidos', {
        params: {
          page: localPage,
          ...query.value
        }
      });

      if( localPage === 1 ) {
        compras.value = res.pedidos || [];
      } else if ( res.pedidos && res.pedidos.length ) {
        compras.value = [...compras.value, ...res.pedidos];
      }

      canPaginate.value = res.pedidos.length === 10;

      page.value = localPage;
    } catch (err) {
      console.error(err);
    }

    isLoading.value = false;
  }

  const statusFormated = (status) => {
    return {
      'recebido': "Recebido",
      'aguardando': "Aguardando",
      'cancelado': "Cancelado",
      'enviado': "Enviado"
    }[status ?? ''] ?? '';
  };


  onMounted(async () => {
    await fetchPedidos(1);

    useEventListener(window, 'scroll', () => {
      const $el = marker.value;
      if(!$el){ return; }
      const dt = window.scrollX + ($el as HTMLElement).getBoundingClientRect().top;
      if (dt <= (window.innerHeight * 2) && !isLoading.value) {
        fetchPedidos(page.value + 1);
      }
    })
  })


</script>
