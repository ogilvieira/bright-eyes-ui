<template>
  <app-bar
  :back-button="true"
  title="Detalhe do Usuário"/>

  <v-container v-if="!user && !isLoading">
    <v-row style="height: 300px;" class="d-flex align-center">
      <v-col>
        <div>
          <div class="text-center">
            <div class="text-body">Usuário não encontrado.</div>
            <div class="pt-6">
              <v-btn @click="router.go(-1)" color="primary" rounded elevation="0" size="small" prepend-icon="mdi-arrow-left">
                Voltar
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>


  <div v-if="user" class="d-flex justify-center align-center mt-5 mb-5 flex-wrap flex-column">
    <div>
      <v-avatar :color="avatarColor" size="100">
        <span class="text-h3">{{initials}}</span>
      </v-avatar>
    </div>
    <div class="mt-2 mb-0 text-h6">{{user.nome}}</div>
    <div class="mb-2 text-body-2">{{user.tipo.titulo}}</div>

    <v-container>
      <v-row>
        <v-col v-if="user.telefone" class="pb-3">
          <div class="text-body-2 font-weight-medium text-secondary mb-1">Telefone:</div>
          <div class="text-body-1 font-weight-medium">
            {{ user.telefone }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="user.email" class="pb-3">
          <div class="text-body-2 font-weight-medium text-secondary mb-1">E-mail:</div>
          <div class="text-body-1 font-weight-medium">
            {{ user.email }}
          </div>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { onMounted } from 'vue';
import { computed, ref } from "vue";
import Api from '@/services/api';
import { useRoute, useRouter } from 'vue-router';

const initials = computed(() => {
  return (user.value && `${user.value.nome} ${user.value.sobrenome}` || '').split(" ").map(a => a.charAt(0).toUpperCase()).join('').slice(0, 2)
});

const avatarColor = computed(() => {
  const firstAlphabet = (user.value?.nome || '').charAt(0).toLowerCase();
  const asciiCode = firstAlphabet.charCodeAt(0);
  const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();

  var num = Math.round(0xffffff * parseInt(colorNum));
  var r = num >> 16 & 255;
  var g = num >> 8 & 255;
  var b = num & 255;

  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
})

const user = ref();
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const { id } = route.params;

const fetchUser = async () => {
  isLoading.value = true;
  try {
    const res = await Api({ requiresAuth: true }).get<any,any>(`/user/${id}`);
    user.value = res;
  } catch (err) {
    console.error(err);
  }

  isLoading.value = false;
}


onMounted(() => {
  fetchUser();
})



</script>
