<template>
  <app-bar title="Editar Produto" :back-button="`/catalogo/${id}`"/>
  <v-container class="pt-3" fluid v-if="produtoForm">
    <FormProduto
      :isLoading="isLoading"
      :message="message"
      :messageType="messageType"
      v-model="produtoForm"
      :isUpdate="true"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
  </v-container>
  <v-container v-if="!produtoForm && !isLoading">
    <v-row style="height: 300px;" class="d-flex align-center">
      <v-col>
        <div>
          <div class="text-center">
            <div class="text-body">Item não encontrado.</div>
            <div class="pt-6">
              <v-btn @click="router.push('/catalogo')" color="primary" rounded elevation="0" size="small" prepend-icon="mdi-arrow-left">
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
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from "vue-router";
  import FormProduto from '@/components/FormProduto.vue';
  import Api from '@/services/api';

  const router = useRouter();

  const route = useRoute();
  const { id } = route.params;

  const produtoForm = ref();

  const isLoading = ref(true);
  const message = ref('');
  const messageType = ref('');

  const handleSubmit = async () => {
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).put<any, any>(`/produto/${id}`, {
        name: produtoForm.value.name,
        fabricante: produtoForm.value.fabricante,
        preco: produtoForm.value.preco,
        descricao: produtoForm.value.descricao,
        imagem: produtoForm.value.imagem,
      });

      messageType.value = 'success';
      message.value = res?.message || "Produto atualizado com sucesso!";
      isLoading.value = false;
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar atualizar o produto.';
      isLoading.value = false;
    }

  };

  const handleDelete = async () => {
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).delete<any, any>(`/produto/${id}`);

      messageType.value = 'success';
      message.value = res?.message || "Produto atualizado com sucesso!";
      setTimeout(() => {
        router.push(`/catalogo`)
      }, 1000);
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar deletar o produto.';
      isLoading.value = false;
    }

  };

  interface IProduto {
    name: string;
    fabricante: string;
    preco: string | number;
    imagem: string;
    descricao: string;
  }

  const fetchProduct = async () => {
    try {
      const res = await Api().get<IProduto,any>(`/produto/${id}`);
      produtoForm.value = res;
    } catch (err) {
      console.error(err);
    }
    isLoading.value = false;
  }

  onMounted(async () => {
    await fetchProduct();
  })

</script>
