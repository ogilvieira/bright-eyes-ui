<template>
  <app-bar title="Novo Produto" :back-button="true"/>
  <v-container class="pt-0" fluid>
    <FormProduto
      :isLoading="isLoading"
      :message="message"
      v-model="produtoForm"
      :isUpdate="false"
      @submit="handleSubmit"
      :messageType="messageType"
      >
    </FormProduto>
  </v-container>
</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue';
  import { ref } from 'vue';
  import { useRouter } from "vue-router";
  import FormProduto from '@/components/FormProduto.vue';
  import Api from "@/services/api";

  const router = useRouter();

  const produtoForm = ref({
    nome: '',
    fabricante: '',
    preco: '',
    descricao: '',
    imagem: '',
  });

  const isLoading = ref(false);
  const message = ref('');
  const messageType = ref('');

  const handleSubmit = async () => {
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).post<any, any>('/produto', {
        nome: produtoForm.value.nome,
        fabricante: produtoForm.value.fabricante,
        preco: produtoForm.value.preco,
        descricao: produtoForm.value.descricao,
        imagem: produtoForm.value.imagem,
      });

      messageType.value = 'success';
      message.value = res?.message || "Cadastro realizado com sucesso!";
      const produtoID = res.data?.id;

      setTimeout(() => {
        router.push(`/produto/${produtoID}/editar`)
      }, 1000);
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar realizar o cadastro.';
      isLoading.value = false;
    }

  };

</script>
