<template>
  <app-bar
    back-button="/users"
    title="Buscar Usuário"/>

  <v-container>

    <v-row class="text-body-2 font-weight-medium">
      <v-col>
        <div v-if="query.terms">Buscando por “{{query.terms}}”</div>
        <div v-if="query.tipo">{{ (!!query.terms ? 'em:' : 'Buscando por') }} {{ userTipoFormated(query.tipo) }}</div>
      </v-col>
    </v-row>

    <v-row v-if="(!users || !users.length) && !isLoading" style="height: 300px;" class="d-flex align-center">
      <v-col>
        <div>
          <div class="text-center">
            <div class="text-body">Nenhum item encontrado.</div>
            <div class="pt-6">
              <v-btn @click="clearSearch()" color="primary" rounded elevation="0" size="small" prepend-icon="mdi-refresh">
                Tentar novamente
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="users && users.length">
      <v-col>
        <div v-for="(user, index) in users" :key="index">
          <v-card flat :link="true" variant="outlined" :to="`/users/${user.id}/editar`" class="mb-2">
            <v-card-text>
              <v-container fluid class="pa-0">
                <v-row>
                  <div class="text-subtitle-1 font-weight-medium">{{ user.nome }} {{ user.sobrenome }}</div>
                </v-row>
                <v-row>
                  <div class="text-secondary text-body-2 font-weight-medium mt-0">{{ user.email }}</div>
                </v-row>
                <v-row class="mt-5">
                  <span class="text-gray-lighten-1"> {{ user.tipo.titulo }}</span>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
        <div ref="marker"></div>
      </v-col>
    </v-row>



  </v-container>

</template>

<script lang="ts" setup>
  import AppBar from '@/components/AppBar.vue'
  import { ref, onMounted } from 'vue';
  import Api from '@/services/api';
  import { useEventListener } from '@vueuse/core'
  import { useRoute } from 'vue-router';
  const route = useRoute();

  const query = ref(route.query);
  const users = ref<any[]>([]);
  const marker = ref(null);
  const isLoading = ref(false);
  const page = ref(1);
  const canPaginate = ref(true);

  const clearSearch = async () => {
    page.value = 1;
    await fetchUsers(1);
  }

  const fetchUsers = async (localPage: number = 1) => {
    if( isLoading.value || (localPage !== 1 && !canPaginate.value)) { return; }

    isLoading.value = true;
    try {
      const res = await Api({ requiresAuth: true }).get<any,any>('/users', {
        params: {
          page: localPage,
          ...query.value
        }
      });

      if( localPage === 1 ) {
        users.value = res.users || [];
      } else if ( res.users && res.users.length ) {
        users.value = [...users.value, ...res.users];
      }

      canPaginate.value = res.users.length === 10;

      page.value = localPage;
    } catch (err) {
      console.error(err);
    }

    isLoading.value = false;
  }

  const userTipoFormated = (status) => {
    return {
      'editor': "Editor(a)",
      'gerente': "Gerente",
      'cliente': "Cliente",
    }[status ?? ''] ?? '';
  };


  onMounted(async () => {
    await fetchUsers(1);

    useEventListener(window, 'scroll', () => {
      const $el = marker.value;
      if(!$el){ return; }
      const dt = window.scrollX + ($el as HTMLElement).getBoundingClientRect().top;
      if (dt <= (window.innerHeight * 2) && !isLoading.value) {
        fetchUsers(page.value + 1);
      }
    })
  })


</script>
