// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

type RouteMetaType = {
  requiresAuth?: boolean,
  userTypesAccess?: string[]
}

const routes = [
  {
    path: '/',
    redirect: { path: "/perfil" },
    component: () => import('@/layouts/default/Dashboard.vue'),
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
        path: '/editar-perfil',
        name: 'Editar Perfil',
        component: () => import('@/views/EditarPerfil.vue'),
      },
      {
        path: '/mudar-senha',
        name: 'Mudar Senha',
        component: () => import('@/views/MudarSenha.vue'),
      },
      {
        path: '/catalogo',
        name: 'Catálogo',
        component: () => import('@/views/Catalogo.vue'),
      },
      {
        path: '/catalogo/:id',
        name: 'Detalhe do Produto',
        component: () => import('@/views/ProdutoDetalhe.vue'),
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
        path: '/recuperar',
        name: 'Recuperar Senha',
        component: () => import('@/views/Recuperar.vue'),
      }
    ],
  },
  {
    path: '/cadastro',
    name: 'Cadastro Wrap',
    meta: { onlyWithoutAuth: true },
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Cadastro',
        component: () => import('@/views/Cadastro.vue')
      }
    ]
  },
  {
    path: '/logout',
    component: () => import("@/views/Logout.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAppStore();
  const meta: RouteMetaType = to.meta;

  if(store.isAuthenticated && to.meta.onlyWithoutAuth) {
    return next({
      path: '/'
    });
  }

  if(meta.userTypesAccess){
    const userData = useUserStore();

    if(!userData.user) {
      return next({
        path: '/perfil'
      });
    }

    if(!(meta.userTypesAccess || []).includes(userData.user.tipo.key) ) {
      return next({
        path: '/perfil'
      });
    }
  }


  if (meta.requiresAuth && !store.isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    return next()
  }
});

export default router
