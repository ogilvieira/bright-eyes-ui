<template>
  <v-container v-if="produtoData">
    <div class="py-6" v-if="step <= 1">
      <card-produto
        :title="produtoData.name"
        :photo="produtoData.imagem"
        :price="produtoData.preco"
        :brand="produtoData.fabricante"
      />
    </div>


    <section v-if="step === 0" style="min-height: 300px;" class="d-flex align-center">
      <v-row>
        <v-col>
          <div>
            <div class="text-center">

              <div class="text-body">Para continuar é necessário anexar sua receita:</div>

              <div class="pt-6">
                <v-btn @click="handleCancel()" color="secondary" variant="outlined" rounded block elevation="0" size="small">
                  CANCELAR
                </v-btn>
              </div>
              <div class="pt-6">
                <v-btn color="primary" @click="handleGoToStep(1)" rounded block elevation="0" append-icon="mdi-arrow-right">
                  ANEXAR RECEITA
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </section>

    <section v-if="step === 1" style="min-height: 300px;" class="d-flex align-center">
      <v-row>
        <v-col>
          <v-form @submit.prevent="handleGoToStep(2)" v-model="isFormAnexoValid">
            <div v-for="(field, fieldIndex) in fieldsAnexo" :key="`step-${step}-${fieldIndex}`">
              <v-row>
                <v-col>
                  <v-file-input
                    accept="application/pdf"
                    :name="field.key"
                    prepend-icon="mdi-file-document-plus-outline"
                    hint="Arquivos .pdf até 2 MB."
                    v-model="form[field.key]"
                    variant="outlined"
                    :rules="field.rules ?? []"
                    :label="field.label"
                  ></v-file-input>
                </v-col>
              </v-row>
            </div>

            <div class="pt-6">
              <v-btn @click="handleCancel()" color="secondary" variant="outlined" rounded block elevation="0" size="small">
                CANCELAR
              </v-btn>
            </div>
            <div class="pt-6">
              <v-btn color="primary" :disabled="!isFormAnexoValid" type="submit" rounded block elevation="0" append-icon="mdi-arrow-right">
                ENDEREÇO
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </section>

    <section v-if="step === 2" style="min-height: 300px;" class="py-12 d-flex align-center">
      <v-row>
        <v-col>
          <v-form @submit.prevent="handleGoToStep(3)" v-model="isFormEnderecoValid" :disabled="isFetchingCEP">
            <div v-for="(field, fieldIndex) in fieldsEndereco" :key="fieldIndex">
              <v-row>
                <v-col>
                  <v-text-field
                    :placeholder="field.label"
                    variant="outlined"
                    :name="field.key"
                    color="secondary"
                    :type="field.type ?? 'input'"
                    :rules="field?.rules ?? []"
                    @change="(ev) => {
                      (typeof field?.onChange === 'function') && field?.onChange(ev);
                    }"
                    v-model="form[field.key]"
                    hide-details="auto"
                    autocomplete="off"
                  />
                </v-col>
              </v-row>
            </div>

            <div class="pt-6">
              <v-btn @click="handleGoToStep(1)" color="secondary" variant="outlined" rounded block elevation="0" size="small" prepend-icon="mdi-arrow-left">
                ANEXO
              </v-btn>
            </div>
            <div class="pt-6">
              <v-btn color="primary" :disabled="!isFormEnderecoValid" type="submit" rounded block elevation="0" append-icon="mdi-arrow-right">
                PAGAR
              </v-btn>
            </div>

          </v-form>
        </v-col>
      </v-row>
    </section>

    <section v-if="step === 3" style="min-height: 300px;" class="py-12 d-flex align-center">
      <v-row>
        <v-col>
          <v-form @submit.prevent="fetchOrder" v-model="isFormCartaoValid">
            <div v-for="(field, fieldIndex) in fieldsCartao" :key="fieldIndex">
              <v-row>
                <v-col v-if="field.type !== 'select'">
                  <v-text-field
                    :placeholder="field.label"
                    variant="outlined"
                    :name="field.key"
                    color="secondary"
                    :type="field.type ?? 'input'"
                    :rules="field?.rules ?? []"
                    @change="(ev) => {
                      (typeof field?.onChange === 'function') && field?.onChange(ev);
                    }"
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
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
            </div>

            <div class="pt-6">
              <v-btn @click="handleGoToStep(2)" :disabled="isFetchingOrder" color="secondary" variant="outlined" rounded block elevation="0" size="small" prepend-icon="mdi-arrow-left">
                Endereço {{ form.parcelas }}
              </v-btn>
            </div>
            <div class="pt-6">
              <v-btn color="primary" :loading="isFetchingOrder" :disabled="!isFormCartaoValid" type="submit" rounded block elevation="0" append-icon="mdi-arrow-right">
                PAGAR
              </v-btn>
            </div>

            <v-alert v-if="errorMessage" :text="errorMessage" color="error" variant="tonal"></v-alert>

          </v-form>
        </v-col>
      </v-row>
    </section>

    <section v-if="step === 4" style="min-height: 100vh;" class="py-12 mx-auto d-flex align-center">
      <div class="text-center w-100">
        <div class="text-h6 font-weight-medium text-primary">Compra Realizada!</div>
        <div class="pt-10">
          <v-btn :to='`/compra/${idPedido}`' block color="primary" rounded elevation="0" size="large">
            ACOMPANHAR COMPRA
          </v-btn>
        </div>
      </div>
    </section>

  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';
  import { useRoute, useRouter } from "vue-router";
  import Api from '@/services/api';
  import CardProduto from '@/components/CardProduto.vue';
  import validator from 'validator';
  import validatorBrazil from 'validator-brazil';
  import toBase64 from '@/utils/toBase64';

  const router = useRouter();
  const route = useRoute();
  const { id } = route.params;

  const isFetchingOrder = ref(false);
  const idPedido = ref(0);
  const step = ref(0);
  const errorMessage = ref('');
  const form = ref({
    anexo: [],
    cep: '02611001',
    logradouro: 'av parada pinto',
    numero: '12',
    complemento: '',
    bairro: 'VL NV CACHOEIRINHA',
    cidade: 'São Paulo',
    uf: 'SP',
    cc_numero: '4304-1380-5478-7364',
    cc_nome: 'Gil VIeira',
    cc_data_expiracao: '02/30',
    cc_cvv: '123',
    parcelas: 1
  });

  interface IProduto {
    id: number;
    name: string;
    fabricante: string;
    preco: string | number;
    imagem: string;
    descricao: string;
  }

  const produtoData = ref<IProduto>();

  type FieldType = {
    key: string;
    label: string;
    rules?: any[],
    type?: string,
    onChange?: any,
    items?: any
  }

  const isFormAnexoValid = ref(false);
  const fieldsAnexo = ref<FieldType[]>([
    {
      key: 'anexo',
      label: 'Receita',
      rules: [
        value => (value && !!value.length) || 'Arquivo é requerido.',
        value => (!value || !value.length || value[0].type === 'application/pdf') || 'Precisa ser um arquivo .pdf',
        value => !value || !value.length || value[0].size < 2000000 || 'O tamanho do darquivo precisa ser menor que 2 MB!'
      ]
    }
  ]);

  const isFormEnderecoValid = ref(false);
  const isFetchingCEP = ref(false);
  const fieldsEndereco = ref<FieldType[]>([
    {
      key: 'cep',
      label: 'CEP',
      rules: [
        value => value && validatorBrazil.isCep(value) || 'Cep inválido.'
      ],
      onChange: () => {
        fetchCEP();
      }
    },
    {
      key: 'logradouro',
      label: 'Logradouro',
      rules: [
        value => (validator.isLength(value, { min: 3 }) || 'Logradouro inválido.'),
      ]
    },
    {
      key: 'numero',
      label: 'Número',
      rules: [
        value => (validator.isLength(value, { min: 1 }) || 'Número inválido.'),
      ]
    },
    {
      key: 'complemento',
      label: 'Complemento',
      rules: []
    },
    {
      key: 'bairro',
      label: 'Bairro',
      rules: [
        value => (validator.isLength(value, { min: 2 }) || 'Bairro inválido.'),
      ]
    },
    {
      key: 'cidade',
      label: 'Cidade',
      rules: [
        value => (validator.isLength(value, { min: 2 }) || 'Bairro inválido.'),
      ]
    },
    {
      key: 'uf',
      label: 'UF',
      rules: [
        value => (validator.isLength(value, { min: 2, max: 2 }) || 'UF inválido.'),
      ]
    }
  ]);

  const itemsParcelamento = computed(() => {

    const parcelasMax: number = 12;
    const total: number = +(produtoData.value?.preco || 0);

    const arr = Array(parcelasMax).fill('').map((_, index) => {
      return {
        value: index+1,
        title: `${index+1} x de ${(total/(index+1)).toFixed(2)}`
      }
    });

    return arr;
  });

  const isFormCartaoValid = ref(false);
  const fieldsCartao = ref<FieldType[]>([
    {
      key: 'cc_numero',
      label: 'Número',
      rules: [
        value => validator.isCreditCard(value) || "Cartão inválido"
      ]
    },
    {
      key: 'cc_nome',
      label: 'Nome no Cartão',
      rules: [
        value => (value.split(' ').filter(a => !!a).length > 1) || "Nome no cartão é requerido."
      ]
    },
    {
      key: 'cc_cvv',
      label: 'CVV',
      rules: [
        value => (validator.isNumeric(value) && validator.isLength(value, { min: 3, max: 4 })) || 'CVV invalido.'
      ]
    },
    {
      key: 'cc_data_expiracao',
      label: 'MM/AA',
      rules: [
        value => validator.contains(value, '/') || "Expiração inválida.",
        value => validator.isLength(value, { min: 5, max: 5 }) || "Expiração inválida.",
        value => {
          const [mes, ano] = value.split('/');
          if(!validator.isNumeric(mes)) return "Mês inválido";
          if(!validator.isNumeric(ano)) return "Ano inválido";
          if(!Date.parse(`20${ano}-${mes}-01`)) return "Data de expiração inválida.";
          if(Date.parse(`20${ano}-${mes}-01`) < Date.now()) return "Data de expiração inválida.";
          return true;
        }
      ]
    },
    {
      key: 'parcelas',
      label: 'Parcelamento',
      type: 'select',
      items: itemsParcelamento,
      rules: []
    },
  ]);

  const handleCancel = () => {
    router.push(`/catalogo/${id}`)
  }

  const handleGoToStep = ( newStep: number ) => {
    step.value = newStep;
  }

  const fetchCEP = async () => {
    const cep = form.value.cep ?? '';
    if(!cep || !validatorBrazil.isCep(cep)){ return; }
    isFetchingCEP.value = true;

    fetch(`https://viacep.com.br/ws/${cep}/json`)
      .then( async (res) => {
        const dataCEP = await res.json();
        form.value.logradouro = dataCEP.logradouro;
        form.value.bairro = dataCEP.bairro;
        form.value.cidade =dataCEP.localidade;
        form.value.uf = dataCEP.uf;
      })
      .catch(err => {
        console.info(err);
      })
      .then(() => {
        isFetchingCEP.value = false;
      })
  }

  const fetchProduct = async () => {
    const res = await Api().get<IProduto,any>(`/produto/${id}`);
    produtoData.value = res;
  }

  const fetchOrder = async () => {
    if(!isFormAnexoValid.value || !isFormEnderecoValid.value || !isFormCartaoValid.value || !produtoData.value?.id){ return; }
    isFetchingOrder.value = true;
    try {
      const anexoBase64 = await toBase64(form.value.anexo[0]);

      const objOrder = {
        produtoId: produtoData.value.id,
        receita: anexoBase64,
        cep: (form.value.cep || '').replace(/\D/, ''),
        cc_numero: (form.value.cc_numero || '').replace(/\D/, ''),
      }

      const listFields: string[] = [
        'parcelas',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf',
        'cc_nome',
        'cc_data_expiracao',
        'cc_cvv'
      ]

      listFields.forEach( key => {
        objOrder[key] = form.value[key] ?? null;
      });
      const res = await Api({ requiresAuth: true }).post<any,any>('/compra', objOrder);
      if( !res.id ) {
        throw Error("Pedido não realizado.")
      }
      idPedido.value = res.id;
      handleGoToStep(4);
      isFetchingOrder.value = false;
    } catch (err: any) {
      errorMessage.value = err?.errorMessage || 'Erro ao tentar realizar o pedido.';
    }
    isFetchingOrder.value = false;
  }

  onMounted(async () => {
    await fetchProduct();
  })
</script>
