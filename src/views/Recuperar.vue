<template>
  <div>
    <div class="pb-6 text-subtitle-2 text-center">
      Para recuperar sua senha, por favor<br/>
      digite o e-mail cadastrado
    </div>
  </div>
  <div>
    <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
      <v-row>
        <v-col>
          <v-text-field
            placeholder="digite seu e-mail"
            variant="outlined"
            color="secondary"
            type="input"
            v-model="email"
            :rules="[value => validator.isEmail(value) || 'E-mail inválido.']"
            :disabled="isSuccess"
            hide-details="auto"
          >
            <template v-slot:prepend-inner>
              <v-icon
                icon="mdi-email-outline"
              />
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <div v-if="message" class="mb-2">
        <v-alert :text="message" :color="messageType" variant="tonal"></v-alert>
      </div>
      <div class="pb-6">
        <router-link to="/login" class="text-secondary">
          <div class="text-subtitle-2">
            Realizar Login.
          </div>
        </router-link>
      </div>
      <div class="pt-6" v-if="!isSuccess">
        <v-btn type="submit" :disabled="!isFormValid" :loading="isLoading" block color="primary" rounded elevation="0" size="large">
          Recuperar
        </v-btn>
      </div>
      <div class="pt-6" v-if="!isSuccess">
        <v-btn type="button" to="/login" :disabled="isLoading" block variant="outlined" color="primary" rounded elevation="0" size="large">
          Cancelar
        </v-btn>
      </div>
    </v-form>
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
    message: string;
  }


  const isLoading = ref(false);
  const email = ref('');
  const message = ref('');
  const messageType = ref('error');
  const isSuccess = ref(false);
  const isFormValid = ref(false);

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
      messageType.value = 'success';
      message.value = res?.message ?? 'Recuperação de senha realizada com sucesso. Verifique seu e-mail.';
      isSuccess.value = true;
    }).catch(err => {
      console.error(err);
      messageType.value = 'error';
      message.value = err?.message;
    }).then(() => {
      isLoading.value = false;
    })

  };




</script>
