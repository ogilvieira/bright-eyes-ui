<template>
  <div class="pt-6">
    <div class="text-subtitle-2 pb-4">Nosso Cliente?</div>
  </div>
  <div>
    <form @submit.prevent="handleSubmit">
      <v-text-field
        placeholder="Usuário"
        variant="outlined"
        color="secondary"
        type="input"
        v-model="email"
      >
        <template v-slot:prepend-inner>
          <v-icon
            icon="mdi-email-outline"
          />
        </template>
      </v-text-field>

      <v-text-field
        placeholder="Senha"
        variant="outlined"
        color="secondary"
        type="password"
        v-model="password"
      >
        <template v-slot:prepend-inner>
          <v-icon
            icon="mdi-lock-outline"
          />
        </template>
      </v-text-field>

      <div class="pb-6">
        <router-link to="/recuperar" class="text-secondary">
          <div class="text-subtitle-2">Recuperar senha?</div>
        </router-link>
      </div>
      <div v-if="message && messageType">
        <v-alert :text="message" variant="tonal" :color="messageType"></v-alert>
      </div>
      <div class="pt-6">
        <v-btn type="submit" :disabled="isLoading" block color="primary" rounded elevation="0" size="large">
          Login
        </v-btn>
      </div>
      <div class="pt-6">
        <v-btn type="button" to="/cadastro" :disabled="isLoading" block variant="outlined" color="primary" rounded elevation="0" size="large">
          Cadastro
        </v-btn>
      </div>


    </form>
  </div>

</template>

<script lang="ts" setup>
  import Api from "@/services/api";
  import { ref } from 'vue';
  import validator from "validator";
  import { useAppStore } from '@/store/app';
  import { useRouter } from "vue-router";
  import { useUserStore } from "@/store/user";
  const router = useRouter()
  const appStore = useAppStore();
  const userStore = useUserStore();


  type recoverAxiosTypeError = {
    data: {
      message?: string;
    }
  }

  type recoverAxiosType = {
    token: string;
  }

  const isLoading = ref(false);
  const email = ref('');
  const password = ref('');
  const message = ref('');
  const messageType = ref('error');

  const handleSubmit = async () => {

    if(!validator.isEmail(email.value)){
      messageType.value = 'error';
      message.value = "E-mail inválido.";
      return;
    }

    if(!validator.isLength(password.value, { min: 6, max: undefined })){
      messageType.value = 'error';
      message.value = "Senha inválida.";
      return;
    }

    message.value = '';
    isLoading.value = true;

    try {
      const res = await Api().post<recoverAxiosTypeError, recoverAxiosType>('/account/oauth', {
        email: email.value,
        senha: password.value
      });

      messageType.value = 'success';
      message.value = "Login realizado com sucesso...";
      appStore.setToken(res?.token || '');
      await userStore.init();

      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (err: any) {
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar realizar o login.';
    }
  };
</script>
