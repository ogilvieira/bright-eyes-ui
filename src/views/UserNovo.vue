<template>
  <app-bar title="Cadastro Usuário" :back-button="true"/>
  <v-container class="pt-3" fluid>
    <FormUser
      :isLoading="isLoading"
      :message="message"
      v-model="userForm"
      :isUpdate="false"
      @submit="handleSubmit"
      :messageType="messageType"
      >
    </FormUser>
  </v-container>
</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue';
  import { ref } from 'vue';
  import { useRouter } from "vue-router";
  import FormUser from '@/components/FormUser.vue';
  import Api from "@/services/api";

  const router = useRouter();

  const userForm = ref({
    tipo: 'cliente',
    nome: '',
    sobrenome: '',
    nascimento: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    senharepete: ''
  });

  const isLoading = ref(false);
  const message = ref('');
  const messageType = ref('');

  const handleSubmit = async () => {
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).post<any, any>('/user', {
        tipo: userForm.value.tipo,
        nome: userForm.value.nome,
        sobrenome: userForm.value.sobrenome,
        cpf: userForm.value.cpf,
        nascimento: new Date(userForm.value.nascimento).toISOString().slice(0, 10),
        email: userForm.value.email,
        telefone: userForm.value.telefone,
        senha: userForm.value.senha
      });

      messageType.value = 'success';
      message.value = res?.message || "Cadastro realizado com sucesso!";
      const userID = res.data?.id;

      setTimeout(() => {
        router.push(`/user/${userID}/editar`)
      }, 1000);
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar realizar o cadastro.';
      isLoading.value = false;
    }

  };

</script>
