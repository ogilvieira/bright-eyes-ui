<template>
  <app-bar
    backButton="/login"
    title="Cadastro"
  />
  <v-container fluid class="align-center justify-center d-flex flex-wrap" style="min-height: calc((100% - 64px) - 0px)">
    <div class="w-100" v-if="stage === 'form'">
      <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
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
                autocomplete="off"
              />
            </v-col>
          </v-row>
        </div>

        <div v-if="message" class="pt-6">
          <v-alert :text="message" :color="messageType" variant="tonal"></v-alert>
        </div>
        <div class="pt-6">
          <v-btn type="submit" :disabled="!isFormValid" :loading="isLoading" block color="primary" rounded elevation="0" size="large">
            Finalizar Cadastro
          </v-btn>
        </div>
      </v-form>
    </div>
    <div v-if="stage === 'success'" v-maska>

      <div class="text-center">
        <div class="text-h6 font-weight-medium text-primary">CADASTRO REALIZADO!</div>
        <div class="pt-2 text-body">Agora você já pode realizar o login.</div>
        <div class="pt-10">
          <v-btn to="/login" block color="primary" rounded elevation="0" size="large">
            LOGIN
          </v-btn>
        </div>
      </div>

    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import validator from "validator";
  import AppBar from '@/components/AppBar.vue'
  import Api from "@/services/api";
  import validatorBrazil from "validator-brazil";

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
    rules?: any[],
    type?: string,
    mask?: string
  }


  const isLoading = ref(false);
  const isFormValid = ref(false);
  const stage = ref('form');

  const form = ref({
    nome: '',
    sobrenome: '',
    nascimento: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    senharepete: ''
  });

  const message = ref('');
  const messageType = ref('error');

  const fields = ref<FieldType[]>([
    {
      key: 'nome',
      label: 'Nome',
      rules: [
        value => (validator.isLength(value, { min: 3 }) || 'Nome inválido.'),
        value => (!validator.contains(value, ' ') || 'Não pode conter espaços.'),
        value => (/^\D+$/.test(value)) || 'Não pode conter números.'
      ]
    },
    {
      key: 'sobrenome',
      label: 'Sobrenome',
      rules: [
        value => (validator.isLength(value, { min: 3 }) || 'Sobrenome inválido.'),
        value => (/^\D+$/.test(value)) || 'Não pode conter números.'
      ]
    },
    {
      key: 'nascimento',
      label: 'Nascimento',
      type: 'date',
      rules: [
        value => !isNaN(Date.parse(value)) || 'Data inválida.'
      ]
    },
    {
      key: 'cpf',
      label: 'CPF',
      type: 'phone',
      rules: [
        value => validatorBrazil.isCpf(value) || 'CPF inválido.'
      ],
      mask: "###.###.###-##"
    },
    {
      key: 'email',
      label: 'E-mail',
      rules: [
        value => validator.isEmail(value) || 'E-mail inválido.'
      ]
    },
    {
      key: 'telefone',
      label: 'Telefone',
      type: 'phone',
      rules: [
        value => (validator.isMobilePhone(value, "pt-BR") || 'Telefone inválido.'),
      ]
    },
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
      const res = await Api({ requiresAuth: true }).post<recoverAxiosTypeError, recoverAxiosType>('/account/register', {
        nome: form.value.nome,
        sobrenome: form.value.sobrenome,
        cpf: form.value.cpf,
        nascimento: new Date(form.value.nascimento).toISOString().slice(0, 10),
        email: form.value.email,
        telefone: form.value.telefone,
        senha: form.value.senha
      });

      messageType.value = 'success';
      message.value = res?.data?.message || "Cadastro realizado com sucesso!";
      stage.value='success';
    } catch (err: any) {
      console.error(err);
      messageType.value = 'error';
      message.value = err.message ?? 'Erro ao tentar realizar o cadastro.';
    }
    isLoading.value = false;

  };




</script>
