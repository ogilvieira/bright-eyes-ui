// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/perfil',
        name: 'Perfil',
        component: () => import('@/views/Perfil.vue'),
      },
      {
        path: '/catalogo',
        name: 'Catálogo',
        component: () => import('@/views/Catalogo.vue'),
      },
      {
        path: '/pedidos',
        name: 'Pedidos',
        component: () => import('@/views/Pedidos.vue'),
      },
      {
        path: '/vendas',
        name: 'Vendas',
        component: () => import('@/views/Vendas.vue'),
      }
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/auth/Auth.vue'),
    meta: { onlyWithoutAuth: true },
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: 'recuperar',
        name: 'Recuperar Senha',
        component: () => import('@/views/Recuperar.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAppStore();

  if(store.isAuthenticated && to.meta.onlyWithoutAuth) {
    return next({
      path: '/'
    });
  }

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    return next()
  }
});

export default router
