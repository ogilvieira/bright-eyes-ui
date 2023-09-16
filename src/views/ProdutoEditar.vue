<template>
  <app-bar title="Editar Produto" :back-button="true"/>
  <v-container class="pt-3" fluid>
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
</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue';
  import { ref, onMounted } from 'vue';
  import { useRoute } from "vue-router";
  import FormProduto from '@/components/FormProduto.vue';
  import Api from '@/services/api';

  const route = useRoute();
  const { id } = route.params;

  const produtoForm = ref({
    nome: '',
    fabricante: '',
    preco: '',
    descricao: '',
    imagem: '',
  });

  const isLoading = ref(true);
  const message = ref('');
  const messageType = ref('');

  const handleSubmit = async () => {
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).put<any, any>(`/produto/${id}`, {
        nome: produtoForm.value.nome,
        fabricante: produtoForm.value.fabricante,
        preco: produtoForm.value.preco,
        descricao: produtoForm.value.descricao,
        imagem: produtoForm.value.imagem,
      });

      messageType.value = 'success';
      message.value = res?.message || "Produto atualizado com sucesso!";
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
    const res = await Api().get<IProduto,any>(`/produto/${id}`);
    produtoForm.value = res;
    isLoading.value = false;
  }

  onMounted(async () => {
    await fetchProduct();
  })

</script>
