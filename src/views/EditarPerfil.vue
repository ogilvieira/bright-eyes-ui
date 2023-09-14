<template>
  <app-bar
    :back-button="true"
    title="Editar Perfil"
  />

<v-container fluid>
  <div class="w-100">
    <v-form @submit.prevent="handleSubmit" v-model="isFormValid" :disabled="isLoading">
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
                return-masked-value
                mask="###.###.###-##"
              />
            </v-col>
          </v-row>
        </div>

        <div v-if="message" class="pt-6">
          <v-alert :text="message" :color="messageType" :closable="true" variant="tonal"></v-alert>
        </div>
        <div class="pt-6">
          <v-btn type="submit" :disabled="!isFormValid" :loading="isLoading" block color="primary" rounded elevation="0" size="large">
            ATUALIZAR PERFIL
          </v-btn>
        </div>
      </v-form>
  </div>
</v-container>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { ref, onMounted } from 'vue';
import validator from 'validator';
import validatorBrazil from "validator-brazil";
import Api from "@/services/api";
import { useUserStore } from '@/store/user';

const userSore = useUserStore();

type FieldType = {
  key: string;
  label: string;
  rules?: any[],
  type?: string,
  mask?: string
}

const isLoading = ref(false);
const isFormValid = ref(false);

const message = ref('');
const messageType = ref('error');

const form = ref({
  nome: '',
  sobrenome: '',
  nascimento: '',
  cpf: '',
  email: '',
  telefone: ''
});

const fields = ref<FieldType[]>([
  {
    key: 'nome',
    label: 'Nome',
    rules: [
      value => validator.isLength(value, { min: 3 }) || 'Nome inválido.',
      value => !validator.contains(value, ' ') || 'Não pode conter espaços.',
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
  }
])

const fetchProfile = async () => {
  isLoading.value = true;

  try {
    const res = await Api({ requiresAuth: true }).get<any, any>('/account/profile');

    form.value = res;
    isLoading.value = false;

  } catch (err) {
    console.error(err);
  }
}



const handleSubmit = async () => {
  if(!isFormValid.value){ return; }
  isLoading.value = true;
  message.value = '';

  try {
    const res = await Api({ requiresAuth: true }).put<any, any>('/account/profile', {
      nome: form.value.nome,
      sobrenome: form.value.sobrenome,
      cpf: form.value.cpf,
      nascimento: new Date(form.value.nascimento).toISOString().slice(0, 10),
      email: form.value.email,
      telefone: form.value.telefone
    });

    await userSore.renew();

    messageType.value = 'success';
    message.value = res?.data?.message || "Perfil atualizado com sucesso!";
  } catch (err: any) {
    console.error(err);
    messageType.value = 'error';
    message.value = err.message ?? 'Erro ao tentar realizar o cadastro.';
  }
  isLoading.value = false;

};

onMounted(async () => {
  await fetchProfile();
});


</script>
