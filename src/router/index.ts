// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

type RouteMetaType = {
  userTypeAccess?: boolean,
  userTypesAccess?: string[]
}

const routes = [
  {
    path: '/',
    redirect: { path: "/perfil" },
    component: () => import('@/layouts/default/Default.vue'),
    meta: {
      requiresAuth: true
    } as RouteMetaType,
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
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/Pedidos.vue'),
      },
      {
        path: '/compras',
        name: 'Compras',
        meta: { userTypesAccess: ['cliente'] } as RouteMetaType,
        component: () => import('@/views/Compras.vue'),
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

  if(to.meta.userTypesAccess){
    const userData = useUserStore();

    if(!userData.user) {
      return next({
        path: '/perfil'
      });
    }

    if(!(to.meta.userTypesAccess || []).includes(userData.user.tipo.key) ) {
      return next({
        path: '/perfil'
      });
    }
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
