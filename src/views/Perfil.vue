<template>
  <app-bar title="Perfil"/>

  <div v-if="user" class="d-flex justify-center align-center mt-5 mb-5 flex-wrap flex-column">
    <div>
      <v-avatar :color="avatarColor" size="100">
        <span class="text-h3">{{initials}}</span>
      </v-avatar>
    </div>
    <div class="mt-2 mb-0 text-h6">{{user.nome}}</div>
    <div class="mb-2 text-body-2">{{user.tipo.titulo}}</div>
  </div>

  <v-list lines="one">
    <v-divider></v-divider>
    <div v-for="(item, n) in items" :key="n">
      <v-list-item
        :link="true"
        :to="item.to"
        :title="item.title"
      ></v-list-item>
      <v-divider></v-divider>
    </div>
  </v-list>

</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { useUserStore } from '@/store/user';
import { computed } from "vue";

const { user } = useUserStore();

const initials = computed(() => {
  return (user && `${user.nome} ${user.sobrenome}` || '').split(" ").map(a => a.charAt(0).toUpperCase()).join('').slice(0, 2)
});

const avatarColor = computed(() => {
  const firstAlphabet = (user?.nome || '').charAt(0).toLowerCase();
  const asciiCode = firstAlphabet.charCodeAt(0);
  const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();

  var num = Math.round(0xffffff * parseInt(colorNum));
  var r = num >> 16 & 255;
  var g = num >> 8 & 255;
  var b = num & 255;

  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
})

const items = computed(() => {
  const userTipo = user?.tipo.key;

  const obj = [
    {
      title: 'Editar Perfil',
      to: '/editar-perfil'
    }
  ];

  if( userTipo === 'cliente') {
    obj.push({
      title: 'Histórico de Compras',
      to: '/compras'
    });
  }

  if( userTipo === 'gerente') {
    obj.push({
      title: 'Gerenciar Usuários',
      to: '/users'
    })
  }

  [
    {
      title: 'Mudar Senha',
      to: '/mudar-senha'
    },
    {
      title: 'Sair',
      to: '/logout'
    }
  ].forEach( item => {
    obj.push(item)
  });

  return obj;
});

</script>
