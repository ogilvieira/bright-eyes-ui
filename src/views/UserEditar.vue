<template>
  <app-bar title="Editar Usuário" back-button="/users"/>
  <v-container class="pt-3" fluid v-if="userForm">
    <FormUser
      :isLoading="isLoading"
      :message="message"
      :messageType="messageType"
      v-model="userForm"
      :isUpdate="true"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
  </v-container>
  <v-container v-if="!userForm && !isLoading">
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
  import FormUser from '@/components/FormUser.vue';
  import Api from '@/services/api';

  const router = useRouter();

  const route = useRoute();
  const { id } = route.params;

  const userForm = ref();

  const isLoading = ref(true);
  const message = ref('');
  const messageType = ref('');

  const handleSubmit = async () => {
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).put<any, any>(`/user/${id}`, {
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
      const res = await Api({ requiresAuth: true }).delete<any, any>(`/user/${id}`);

      messageType.value = 'success';
      message.value = res?.message || "Usuário deletado com sucesso!";
      setTimeout(() => {
        router.push(`/users`)
      }, 1000);
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar deletar o usuario.';
      isLoading.value = false;
    }
  };

  const fethUser = async () => {
    try {
      const res = await Api({ requiresAuth: true }).get<any,any>(`/user/${id}`);
      const obj = {
        tipo: res.tipo.key,
        nome: res.nome,
        sobrenome: res.sobrenome,
        nascimento: res.nascimento,
        cpf: res.cpf,
        email: res.email,
        telefone: res.telefone,
        senha: '',
        senharepete: ''
      }
      console.info(obj);
      userForm.value = obj;
    } catch (err) {
      console.error(err);
    }
    isLoading.value = false;
  }

  onMounted(async () => {
    await fethUser();
  })

</script>
