<template>
  <app-bar title="Usuários"/>
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
      <v-row>
        <v-col class="text-center text-body-2 py-8">
          Preencha os campos para buscar
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center text-body-2 py-8">
          <v-btn to="/users/novo" color="primary" rounded block elevation="0">
            NOVO USUÁRIO
          </v-btn>
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
    tipo: ''
  });

  const fields = ref<FieldType[]>([
    {
      key: 'terms',
      label: 'Buscar'
    },
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
    }
  ])

  const handleSearch = () => {
    router.push({ path: '/users/buscar', query: form.value })
  }
</script>
