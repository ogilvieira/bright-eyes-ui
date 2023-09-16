<template>
  <app-bar title="Pedidos"/>
  <v-container>
    <v-row>
        <v-col>
          <v-form v-model="isFormValid">
            <div v-for="(field, fieldIndex) in fields" :key="fieldIndex">
              <v-row>
                <v-col v-if="field.type !== 'select'">
                  <v-text-field
                    :label="field.type === 'date' ? field.label : ''"
                    :placeholder="field.label"
                    variant="outlined"
                    :name="field.key"
                    color="secondary"
                    :type="field.type ?? 'input'"
                    :rules="field?.rules ?? []"
                    v-model="form[field.key]"
                    hide-details="auto"
                    autocomplete="off"
                  />
                </v-col>
                <v-col v-if="field.type === 'select'">
                  <v-select
                    :name="field.key"
                    :label="field.label"
                    :items="field.items"
                    v-model="form[field.key]"
                    hide-details="auto"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
            </div>

            <div class="pt-6">
              <v-btn @click="handleSearch()" :disabled="!isFormValid" color="primary" rounded block elevation="0">
                BUSCAR
              </v-btn>
            </div>

          </v-form>
        </v-col>
      </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue'
  import { ref } from 'vue';
  import router from '@/router';

  type FieldType = {
    key: string;
    label: string;
    rules?: any[],
    type?: string,
    mask?: string,
    items?: any[]
  }


  const isFormValid = ref(false);

  const form = ref({
    terms: '',
    status: '',
    data_inicial: '',
    data_final: ''
  });

  const fields = ref<FieldType[]>([
    {
      key: 'terms',
      label: 'Buscar'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      items: [
        { value: '', title: 'Todos' },
        { value: 'recebido', title: 'Recebido' },
        { value: 'aguardando', title: 'Aguardando' },
        { value: 'enviado', title: 'Enviado' },
        { value: 'cancelad', title: 'Cancelado' },
      ]
    },
    {
      key: 'data_inicial',
      label: 'Data Inicial',
      type: 'date'
    },
    {
      key: 'data_final',
      label: 'Data Final',
      type: 'date'
    },
  ])

  const handleSearch = () => {
    router.push({ path: '/pedidos/buscar', query: form.value })
  }
</script>
