<template>
  <v-bottom-navigation grow color="secondary">
    <v-btn to="/perfil" value="perfil">
      <v-icon>mdi-account-outline</v-icon>

      <span>Perfil</span>
    </v-btn>

    <v-btn to="/catalogo" value="catalogo">
      <v-icon>mdi-view-grid-outline</v-icon>

      <span>Catálogo</span>
    </v-btn>

    <v-btn to="/pedidos" value="pedidos">
      <v-icon>mdi-truck-outline</v-icon>
      <span>Pedidos</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
  //
</script>
