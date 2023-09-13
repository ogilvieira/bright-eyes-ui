<template>
  <v-bottom-navigation v-if="userData.user" grow color="secondary">
    <v-btn to="/perfil" value="perfil">
      <v-icon>mdi-account-outline</v-icon>

      <span>Perfil</span>
    </v-btn>

    <v-btn to="/catalogo" value="catalogo">
      <v-icon>mdi-view-grid-outline</v-icon>

      <span>Catálogo</span>
    </v-btn>

    <v-btn to="/compras" value="compras" v-if="userData.user.tipo.key === 'cliente'">
      <v-icon>mdi-eye-outline</v-icon>
      <span>Compras</span>
    </v-btn>

    <v-btn to="/pedidos" value="pedidos" v-if="['gerente', 'editor'].includes(userData.user.tipo.key)">
      <v-icon>mdi-truck-outline</v-icon>
      <span>Pedidos</span>
    </v-btn>

  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
const userData = useUserStore();

</script>
