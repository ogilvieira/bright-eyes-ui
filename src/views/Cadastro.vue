<template>
  <v-container fluid>
    <app-bar
      backButton="/login"
      title="Cadastro"
    />

    <div>
      <v-form @submit.prevent="handleSubmit">
        <div v-for="(field, fieldIndex) in fields" :key="fieldIndex">
          <v-row>
            <v-text-field
              :placeholder="field.label"
              variant="outlined"
              color="secondary"
              type="input"
              :rules="field?.rules ?? []"
              v-model="form[field.key]"
            />
          </v-row>
        </div>

        <div v-if="message">
          <v-alert :text="message" :color="messageType" variant="tonal"></v-alert>
        </div>
        <div class="pt-6">
          <v-btn type="submit" :disabled="isLoading" block color="primary" rounded elevation="0" size="large">
            Finalizar Cadastro
          </v-btn>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import validator from "validator";
  import AppBar from '@/components/AppBar.vue'
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

  type FieldType = {
    key: string;
    label: string;
    rules?: any[]
  }


  const isLoading = ref(false);

  const form = ref({
    nome: '',
    sobrenome: '',
    nascimento: '',
    email: '',
    telefone: '',
    senha: '',
    senharepete: ''
  });

  const fields = ref<FieldType[]>([
    {
      key: 'nome',
      label: 'Nome',
      rules: [
        value => (!validator.isEmpty(value) || 'É requerido'),
        value => (!validator.contains(value, ' ') || 'Não póde contêr espaços')
      ]
    },
    {
      key: 'sobrenome',
      label: 'Sobrenome'
    },
    {
      key: 'nascimento',
      label: 'Nascimento'
    },
    {
      key: 'telefone',
      label: 'Telefone'
    },
    {
      key: 'senha',
      label: 'Senha'
    },
    {
      key: 'senharepete',
      label: 'Repetir Senha'
    }
  ])

  const message = ref('');
  const messageType = ref('error');



  const handleSubmit = () => {
    console.info(form.value)

  };




</script>
