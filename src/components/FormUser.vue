<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-form v-model="isFormValid" :disabled="isLoading" @submit.prevent="handleSubmit();">
    <div v-for="(field, fieldIndex) in fields" :key="fieldIndex" >
      <v-row>
        <v-col v-if="field.type === 'select'">
          <v-select
            :name="field.key"
            :label="field.label"
            :items="field.items"
            :value="modelValue[field.key]"
            v-model="modelValue[field.key]"
            hide-details="auto"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col v-if="!['select'].includes(field.type || '')">
          <v-text-field
            :placeholder="field.label"
            variant="outlined"
            color="secondary"
            :type="field.type ?? 'input'"
            :rules="field?.rules ?? []"
            :value="modelValue[field.key]"
            v-model="modelValue[field.key]"
            hide-details="auto"
            autocomplete="off"
          />
        </v-col>
      </v-row>
    </div>

    <div class="pt-3" v-if="message">
      <v-alert :text="message" :color="messageType" :closable="true"></v-alert>
    </div>

    <div class="pt-3">
      <v-btn type="submit"
        :disabled="!isFormValid"
        :loading="props.isLoading"
        block color="primary"
        rounded
        elevation="0"
        size="large">
        {{props.isUpdate ? 'Salvar' : 'CRIAR NOVO USUÁRIO' }}
      </v-btn>
    </div>

    <div class="pt-3" v-if="isUpdate">
      <v-btn type="submit"
        block
        variant="outlined"
        @click="$emit('delete', form)"
        color="error"
        rounded
        elevation="0"
        size="large">
        Arquivar Usuário
      </v-btn>
    </div>

  </v-form>
</template>
<script setup lang="ts">
  import validator from 'validator';
  import validatorBrazil from "validator-brazil";
  import { ref } from 'vue';

  const emit = defineEmits(['update:modelValue', 'submit', 'delete'])

  export interface Props {
    isLoading?: boolean;
    isUpdate?: boolean;
    modelValue: any;
    message: string;
    messageType?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    messageType: "success"
  });

  type FieldType = {
    key: string;
    label: string;
    rules?: any[],
    type?: string,
    mask?: string,
    items?: any[],
  }

  const form = ref({
    tipo_key: '',
    nome: '',
    sobrenome: '',
    nascimento: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    senharepete: ''
  });

  const isFormValid = ref(false);

  const fields = ref<FieldType[]>([
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      items: [
        { value: '', title: 'Todos' },
        { value: 'editor', title: 'Editor(a)' },
        { value: 'gerente', title: 'Gerente' },
        { value: 'cliente', title: 'Cliente' },
      ]
    },
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
        value => (value && validatorBrazil.isCpf(value)) || 'CPF inválido.'
      ]
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
        value => (!value || (value && validator.isLength(value, { min: 6 }))) || 'Senha precisa ter 6 digitos.'
      ]
    },
    {
      key: 'senharepete',
      label: 'Repetir Senha',
      type: 'password',
      rules: [
        value => (!props.modelValue.senha || (value === props.modelValue.senha)) || "As senhas precisam ser idênticas."
      ]
    }
  ])

  const handleSubmit = () => {
    if(!isFormValid.value){ return; }
    emit('submit', form)
  }

</script>
