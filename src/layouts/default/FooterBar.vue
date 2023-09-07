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

    <v-btn to="/pedidos" value="pedidos" v-if="userData.user.tipo.key === 'cliente'">
      <v-icon>mdi-truck-outline</v-icon>
      <span>Pedidos</span>
    </v-btn>

    <v-btn to="/vendas" value="vendas" v-if="userData.user.tipo.key === 'vendedor'">
      <v-icon>mdi-truck-outline</v-icon>
      <span>Vendas</span>
    </v-btn>

    <v-btn to="/relatorio" value="relatorio" v-if="userData.user.tipo.key === 'gerente'">
      <v-icon>mdi-chart-timeline-variant-shimmer</v-icon>
      <span>Relatório</span>
    </v-btn>

  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';
const userData = useUserStore();

</script>
