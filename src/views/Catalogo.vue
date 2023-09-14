<template>
  <app-bar title="Catálogo"/>

  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          placeholder="Buscar"
          type="input"
          clearable
          @keyup="handleSearch"
          @click:clear="handleSearch"
          v-model="terms"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="(!produtos || !produtos.length) && !isLoading" style="height: 300px;" class="d-flex align-center">
      <v-col>
        <div>
          <div class="text-center">
            <div class="text-body">Nenhum item encontrado.</div>
            <div class="pt-6">
              <v-btn @click="clearSearch()" color="primary" rounded elevation="0" size="small" prepend-icon="mdi-arrow-left">
                Voltar
              </v-btn>
            </div>
          </div>
        </div>
        <div ref="marker"></div>
      </v-col>
    </v-row>

    <v-row v-if="produtos && produtos.length">
      <v-col>
        <div v-for="(produto, index) in produtos" :key="index">
          <card-produto
            :id="produto.id"
            :title="produto.name"
            :photo="produto.imagem"
            :price="produto.preco"
            :brand="produto.fabricante"
            :show-actions="showEditOption"
          />
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
  import CardProduto from '@/components/CardProduto.vue';
  import { useUserStore } from "@/store/user";
  import { useRoute, useRouter } from 'vue-router';
  import { useEventListener } from '@vueuse/core'

  const userStore = useUserStore();
  const route = useRoute();
  const router = useRouter();


  const showEditOption = ref(['gerente', 'editor'].includes(userStore.user?.tipo?.key ?? ''));
  const terms = ref('');
  const timeoutSearch = ref(null);
  const produtos = ref<IProduto[]>([]);
  const marker = ref(null);
  const isLoading = ref(false);
  const page = ref(1);
  const canPaginate = ref(true);

  const handleSearch = async () => {
    if( !terms.value || terms.value.length > 3) {
      if(timeoutSearch.value) {
        clearTimeout(timeoutSearch.value);
      }

      setTimeout(() => {
        fetchProducts(1, terms.value);
      }, 500)
    }
  }

  const clearSearch = async () => {
    terms.value = '';
    page.value = 1;
    await fetchProducts(1);
  }

  interface IProduto {
    id: number;
    name: string;
    fabricante: string;
    preco: string | number;
    imagem: string;
    descricao: string;
  }

  const fetchProducts = async (localPage: number = 1, terms: string | null = null) => {
    if( isLoading.value || (localPage !== 1 && !canPaginate.value)) { return; }

    isLoading.value = true;
    try {
      const res = await Api().get<any,any>('/produtos', {
        params: {
          page: localPage,
          terms
        }
      });

      if( localPage === 1 ) {
        produtos.value = res.produtos || [];
      } else if ( res.produtos && res.produtos.length ) {
        produtos.value = [...produtos.value, ...res.produtos];
      }

      canPaginate.value = res.produtos.length === 10;

      page.value = localPage;

      router.push({ path: route.path,
        query: {
          ...route.query,
          terms: terms
        }
      });
    } catch (err) {
      console.error(err);
    }

    isLoading.value = false;
  }

  onMounted(async () => {
    await fetchProducts(1, ''+(route.query?.terms || ''));

    useEventListener(window, 'scroll', () => {
      const $el = marker.value;
      if(!$el){ return; }
      const dt = window.scrollX + ($el as HTMLElement).getBoundingClientRect().top;
      if (dt <= (window.innerHeight * 2) && !isLoading.value) {
        fetchProducts(page.value + 1, terms.value);
      }
    })
  })


</script>
