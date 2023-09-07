<template>
  <app-bar title="Perfil"/>

  <div v-if="user" class="d-flex justify-center align-center mt-5 mb-5 flex-wrap flex-column">
    <div>
      <v-avatar :color="avatarColor" size="100">
        <span class="text-h3">{{initials}}</span>
      </v-avatar>
    </div>
    <div class="mt-2 text-subtitle-1">{{user.nome}}</div>
  </div>

  <v-list :items="items"></v-list>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { useUserStore } from '@/store/user';
import { computed, ref } from "vue";

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
      title: 'Editar cadastro',
      value: '/editar',
      props: {
        appendIcon: 'mdi-chevron-right',
      }
    }
  ];

  if( userTipo === 'cliente') {
    obj.push({
      title: 'Histórico de Pedidos',
      value: '/pedidos',
      props: {
        appendIcon: 'mdi-chevron-right',
      }
    });
    obj.push({
      title: 'Suporte',
      value: '/suporte',
      props: {
        appendIcon: 'mdi-chevron-right',
      }
    })
  }

  if( userTipo === 'vendedor') {
    obj.push({
      title: 'Histórico de Vendas',
      value: '/vendas',
      props: {
        appendIcon: 'mdi-chevron-right',
      }
    })
  }

  if( userTipo === 'gerente') {
    obj.push({
      title: 'Gerenciar vendedores',
      value: '/users',
      props: {
        appendIcon: 'mdi-chevron-right',
      }
    })
  }

  [
    {
      title: 'Mudar Senha',
      value: '/mudar-senha',
      props: {
        appendIcon: 'mdi-chevron-right'
      }
    },
    {
      title: 'Privacidade e Segurança',
      value: '/privacidade',
      props: {
        appendIcon: 'mdi-chevron-right'
      }
    },
    {
      title: 'Sair',
      value: '/sair',
      props: {
        appendIcon: 'mdi-logout',
      }
    }
  ].forEach( item => {
    obj.push(item)
  });

  return obj;
});

</script>
