<template>
  <div>
    <div class="pb-6 text-subtitle-2 text-center">
      Para recuperar sua senha, por favor<br/>
      digite o e-mail cadastrado
    </div>
  </div>
  <div>
    <form @submit.prevent="handleSubmit">
      <v-text-field
        placeholder="digite seu e-mail"
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
      <div class="pb-6">
        <router-link to="/login" class="text-secondary">
          <div class="text-subtitle-2">
            Realizar Login.
          </div>
        </router-link>
      </div>
      <div v-if="message">
        <v-alert :text="message" :color="messageType" variant="tonal"></v-alert>
      </div>
      <div class="pt-6">
        <v-btn type="submit" :disabled="isLoading" block color="primary" rounded elevation="0" size="large">
          Recuperar
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import validator from "validator";
  import Api from "@/services/api";

  type recoverAxiosTypeError = {
    data: {
      message?: string;
    }
  }

  type recoverAxiosType = {
    data: {
      message: string;
    }
  }


  const isLoading = ref(false);
  const email = ref('');
  const message = ref('');
  const messageType = ref('error');

  const handleSubmit = () => {
    if(!validator.isEmail(email.value)){
      messageType.value = 'error';
      message.value = "E-mail inválido.";
      return;
    }

    message.value = '';
    isLoading.value = true;
    Api().post<recoverAxiosTypeError, recoverAxiosType>('/account/recuperar', {
      email: email.value
    }).then(res => {
      console.info(res);
      messageType.value = 'success';
      message.value = res?.data?.message;
    }).catch(err => {
      console.error(err);
      messageType.value = 'error';
      message.value = err?.message;
    }).then(() => {
      isLoading.value = false;
    })

  };




</script>
