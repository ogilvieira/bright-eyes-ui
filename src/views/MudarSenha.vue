<template>
  <app-bar
    :back-button="true"
    title="Mudar Senha"
  />

<v-container fluid>
  <div class="w-100">
    <v-form @submit.prevent="handleSubmit" v-model="isFormValid" autocomplete="off">
        <div v-for="(field, fieldIndex) in fields" :key="fieldIndex">
          <v-row>
            <v-col>
              <v-text-field
                :placeholder="field.label"
                variant="outlined"
                color="secondary"
                :type="field.type ?? 'input'"
                :rules="field?.rules ?? []"
                v-model="form[field.key]"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </div>

        <div v-if="message" class="pt-6">
          <v-alert :text="message" :color="messageType" variant="tonal"></v-alert>
        </div>
        <div class="pt-6">
          <v-btn type="submit" :disabled="!isFormValid" :loading="isLoading" block color="primary" rounded elevation="0" size="large">
            ATUALIZAR SENHA
          </v-btn>
        </div>
      </v-form>
  </div>
</v-container>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { ref } from 'vue';
import validator from 'validator';
import Api from "@/services/api";

type FieldType = {
  key: string;
  label: string;
  rules?: any[],
  type?: string,
  mask?: string
}


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
const isFormValid = ref(false);

const message = ref('');
const messageType = ref('error');

const form = ref({
  senha: '',
  senharepete: ''
});

const fields = ref<FieldType[]>([
  {
    key: 'senha',
    label: 'Senha',
    type: 'password',
    rules: [
      value => validator.isLength(value, { min: 6 }) || 'Senha precisa ter 6 digitos.'
    ]
  },
  {
    key: 'senharepete',
    label: 'Repetir Senha',
    type: 'password',
    rules: [
      value => (value === form.value.senha) || "As senhas precisam ser idênticas."
    ]
  }
])



const handleSubmit = async () => {
    if(!isFormValid.value){ return; }
    isLoading.value = true;
    message.value = '';

    try {
      const res = await Api({ requiresAuth: true }).put<recoverAxiosTypeError, recoverAxiosType>('/account/password', {
        senha: form.value.senha
      });

      form.value.senha = '';
      form.value.senharepete = '';

      messageType.value = 'success';
      message.value = res?.data?.message || "Senha atualizada com sucesso!";
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar realizar o cadastro.';
    }
    isLoading.value = false;

  };


</script>
