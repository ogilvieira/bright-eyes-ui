<template>
  <app-bar title="Compras"/>

  <v-container>

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
          <card-pedido
            :id="compra.id"
            :parcelas="compra.parcelas"
            :createdAt="compra.created_at"
            :photo="compra.produto.imagem"
            :total="compra.total"
            :status="compra.status"
            :to="`/compra/${compra.id}`"
          />
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
  import CardPedido from '@/components/CardPedido.vue';
  import { useEventListener } from '@vueuse/core'

  interface IPedido {
    id: number,
    created_at: Date,
    total: number,
    parcelas: number,
    data_entrega: Date,
    status: "recebido" | "aguardando" | "enviado" | "cancelado"
  }

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
          page: localPage
        }
      });

      if( localPage === 1 ) {
        compras.value = res.pedidos || [];
      } else if ( res.pedidos && res.pedidos.length ) {
        compras.value = [...compras.value, ...res.pedidos];
      }

      canPaginate.value = res.compras.length === 10;

      page.value = localPage;
    } catch (err) {
      console.error(err);
    }

    isLoading.value = false;
  }

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
