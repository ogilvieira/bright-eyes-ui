<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-form v-model="isFormValid" :disabled="isLoading" @submit.prevent="handleSubmit();">
    <div v-for="(field, fieldIndex) in fields" :key="fieldIndex" >
      <v-row v-if="field.type === 'image'" class="mb-6">
        <v-sheet
          width="300"
          height="300"
          class="justify-center align-center bg-grey-lighten-3 w-100 position-relative rounded"
          @mouseover="showOverlay = true"
          @mouseleave="showOverlay = false"
        >
          <v-img
            class="position-relative z-index-0"
            height="300"
            aspect-ratio="1/1"
            contain
            :lazy-src="modelValue[field.key]"
            :src="modelValue[field.key]"
          ></v-img>
          <input
            type="hidden"
            v-model="modelValue[field.key]"
          />
          <input class="d-none" type="file" :id="`file-${field.key}`" accept="image/png, image/jpeg" @change="(ev) => pickFile(ev, field.key)">
          <div v-if="showOverlay" class="w-100 h-100 z-index-1 d-flex align-center justify-center" style="background-color: rgba(0, 0, 0, 0.1); position: absolute; top: 0; left: 0; pointer-events: none;"></div>

          <v-btn v-if="showOverlay && modelValue[field.key]" rounded elevation="0" @click="modelValue[field.key] = ''" color="error" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
            Remover imagem
          </v-btn>
          <v-btn v-if="!modelValue[field.key]" @click="() => openPickFile(field.key)" rounded elevation="0" color="secondary" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
            Adicionar Foto
          </v-btn>
        </v-sheet>
      </v-row>
      <v-row>
        <v-col v-if="!['textarea', 'image'].includes(field.type || '')">
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
        <v-col v-if="field.type === 'textarea'">
          <v-textarea
            :placeholder="field.label"
            variant="outlined"
            color="secondary"
            :type="field.type ?? 'input'"
            :rules="field?.rules ?? []"
            :value="modelValue[field.key]"
            v-model="modelValue[field.key]"
            counter="3000"
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
        {{props.isUpdate ? 'Salvar' : 'CRIAR NOVO PRODUTO' }}
      </v-btn>
    </div>

    <div class="pt-3" v-if="isFormValid">
      <v-btn type="submit"
        :loading="props.isLoading"
        block
        variant="outlined"
        @click="$emit('delete', form)"
        color="error"
        rounded
        elevation="0"
        size="large">
        Excluir
      </v-btn>
    </div>

  </v-form>
</template>
<script setup lang="ts">
  import validator from 'validator';
  import { ref, defineProps } from 'vue';
  import toBase64 from '@/utils/toBase64';

  const emit = defineEmits(['update:modelValue', 'submit', 'delete'])

  export interface Props {
    isLoading?: boolean;
    isUpdate?: boolean;
    modelValue: any;
    message: string;
    messageType?: "error" | "success"
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
    mask?: string
  }

  const form = ref({
    nome: '',
    fabricante: '',
    preco: '',
    descricao: '',
    imagem: '',
    isUpdate: false
  });

  const isFormValid = ref(false);
  const showOverlay = ref(false);

  const fields = ref<FieldType[]>([
    {
      key: 'imagem',
      label: 'Imagem',
      type: 'image'
    },
    {
      key: 'name',
      label: 'Nome',
      rules: [
        value => (value && validator.isLength(value, { min: 3 }) || 'Nome inválido.'),
        value => (/^\D+$/.test(value)) || 'Não pode conter números.'
      ]
    },
    {
      key: 'fabricante',
      label: 'Fabricante',
      rules: [
        value => (value && validator.isLength(value, { min: 3 }) || 'Nome inválido.'),
        value => (/^\D+$/.test(value)) || 'Não pode conter números.'
      ]
    },
    {
      key: 'preco',
      label: 'Preço',
      rules: [
        value => !!value || "Preço é requerido",
        value => validator.isCurrency(value, { allow_negatives: false, require_decimal: true }) || 'Valor inválido, utilize o formato "0.00" para os números.',
        value => value > 0 || 'O preço precisa ser maior que 0.'
      ]
    },
    {
      key: 'descricao',
      label: 'Descrição',
      type: "textarea",
      rules: [
        value => (value && validator.isLength(value, { min: 3, max: 3000 }) || 'Descrição inválida.'),
      ]
    },
  ])

  const openPickFile = ( key ) => {
    const $el = document?.querySelector(`#file-${key}`) as HTMLElement;
    $el && $el.click();
  }

  const pickFile = async (ev, key) => {
    console.info(props.modelValue.imagem);
    try {
      const file = ev.target.files[0];
      if(file.size > 2 * 1024 * 1024) {
        ev.target.value = '';
        throw Error("Arquivo maior que 2 MB");
      }
      const base = await toBase64(file);
      form.value[key] = base;
       emit('update:modelValue', {
        ...props.modelValue,
        imagem: base
      })
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  const handleSubmit = () => {
    if(!isFormValid.value){ return; }
    emit('submit', form)
  }

</script>
