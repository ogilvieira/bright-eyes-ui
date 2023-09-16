<template>
  <app-bar
  :back-button="true"
  title="Detalhe do Pedido"/>
  <v-container v-if="pedidoData">
    <div class="py-6">
      <card-pedido
        :id="pedidoData.id"
        :parcelas="pedidoData.parcelas"
        :createdAt="pedidoData.created_at"
        :photo="pedidoData.produto.imagem"
        :total="pedidoData.total"
      />
    </div>

    <div v-if="pedidoData.status === 'recebido'" class="bg-orange-lighten-4 text-orange-darken-3 font-weight-bold text-uppercase text-center mb-3 px-12 py-2 text-body-1 rounded">
      Recebido
    </div>
    <div v-if="pedidoData.status === 'aguardando'" class="bg-blue-lighten-4 text-blue-darken-3 font-weight-bold text-uppercase text-center mb-3 px-12 py-2 text-body-1 rounded">
      Aguardando
    </div>
    <div v-if="pedidoData.status === 'enviado'" class="bg-green-lighten-4 text-green-darken-3 font-weight-bold text-uppercase text-center mb-3 px-12 py-2 text-body-1 rounded">
      Enviado
    </div>
    <div v-if="pedidoData.status === 'cancelado'" class="bg-red-lighten-4 text-red-darken-3 font-weight-bold text-uppercase text-center mb-3 px-12 py-2 text-body-1 rounded">
      Cancelado
    </div>

    <div v-if="pedidoData.status !== 'cancelado' && pedidoData.data_entrega" class="pb-3">
      <div class="text-body-2 font-weight-medium text-secondary mb-1">Prazo de Entrega:</div>
      <div class="text-body-1 font-weight-medium">
        {{ dayjs(pedidoData.data_entrega).format('DD/MM/YYYY HH:mm') }}
      </div>
    </div>
    <div v-if="pedidoData.status !== 'cancelado'" class="pb-3">
      <div class="text-body-2 font-weight-medium text-secondary mb-1">Pagamento:</div>
      <div class="text-body-1 font-weight-medium">
        Cartão de Crédito
      </div>
    </div>
    <div v-if="pedidoData.rastreio" class="pb-3">
      <div class="text-body-2 font-weight-medium text-secondary mb-1">Rastreio:</div>
      <div class="text-body-1 font-weight-medium">
        {{ pedidoData.rastreio }}
      </div>
    </div>
    <div v-if="pedidoData.endereco" class="pb-3">
      <div class="text-body-2 font-weight-medium text-secondary mb-1">Endereço:</div>
      <div class="text-body-1 font-weight-medium">
        {{ pedidoData.endereco.cep }}<br/>
        {{ pedidoData.endereco.logradouro }}, {{ pedidoData.endereco.numero }}<br/>
        {{ pedidoData.endereco.complemento }}<br/>
        {{ pedidoData.endereco.bairro }}<br/>
        {{ pedidoData.endereco.cidade }} - {{ pedidoData.endereco.uf }}
      </div>
    </div>
    <div v-if="pedidoData.receita" class="pt-4">
      <v-btn block rounded variant="outlined" color="primary" elevation="0" @click="handleOpenReceita(pedidoData.receita)">
        VISUALIZAR RECEITA
      </v-btn>
    </div>
    <v-row class="mt-5 mb-5">
      <v-card :link="true" :to="`/customer/${pedidoData.user.id}`" v-if="pedidoData.user" variant="outlined" rounded="0" class="w-100 px-2 py-2">
        <div class="text-body-2 font-weight-medium">{{ pedidoData.user.nome }} {{ pedidoData.user.sobrenome }}</div>
        <div class="text-body-2 text-blue-darken-3">{{ pedidoData.user.email }}</div>
      </v-card>
    </v-row>


    <div v-if="pedidoData.status === 'recebido'">
      <v-btn block color="primary" elevation="0" class="mb-5" rounded>
        APROVAR PEDIDO
      </v-btn>

      <v-btn block color="error" elevation="0" rounded>
        CANCELAR PEDIDO
      </v-btn>
    </div>

    <div v-if="pedidoData.status === 'aguardando'">
      <v-form>




        <div>
          <v-btn block color="primary" elevation="0" class="mb-5" rounded>
            APROVAR PEDIDO
          </v-btn>

          <v-btn block color="error" elevation="0" rounded>
            CANCELAR PEDIDO
          </v-btn>
        </div>
      </v-form>
    </div>



  </v-container>

</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue'
  import CardPedido from "@/components/CardPedido.vue"
  import Api from '@/services/api';
  import { ref, onMounted } from 'vue';
  import { useRoute } from "vue-router";
  import dayjs from 'dayjs';

  const route = useRoute();
  const { id } = route.params;
  const isLoading = ref(true);

  type Produto = {
    imagem: string;
  }

  type Endereco = {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  }

  interface IPedido {
    id: number,
    created_at: Date,
    produto: Produto,
    total: number,
    parcelas: number,
    data_entrega: Date,
    endereco: Endereco,
    rastreio?: string,
    receita?: string,
    status: "recebido" | "aguardando" | "enviado" | "cancelado",
    user?: any
  }

  const pedidoData = ref<IPedido>();

  const fetchPedido = async () => {
    isLoading.value = true;
    try {
      const res = await Api({ requiresAuth: true }).get<IPedido,any>(`/pedido/${id}`);
      pedidoData.value = res;
    } catch (err) {
      console.error(err);
    }

    isLoading.value = false;
  }

  const handleOpenReceita = ( data ) => {
    const w = window.open('about:blank');
    setTimeout(() => {
        if(!w){ return; }
        w.document.body.appendChild(w.document.createElement('iframe')).src = data;
        w.document.getElementsByTagName("iframe")[0].style.width = '100%';
        w.document.getElementsByTagName("iframe")[0].style.height = '100%';
    }, 0);
  }

  onMounted(async () => {
    await fetchPedido();
  })

</script>
