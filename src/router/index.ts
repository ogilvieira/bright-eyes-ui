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
        name: 'EditarPerfil',
        component: () => import('@/views/EditarPerfil.vue'),
      },
      {
        path: '/mudar-senha',
        name: 'MudarSenha',
        component: () => import('@/views/MudarSenha.vue'),
      },
      {
        path: '/catalogo',
        name: 'Catálogo',
        component: () => import('@/views/Catalogo.vue'),
      },
      {
        path: '/catalogo/novo',
        name: 'ProdutoNovo',
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/ProdutoNovo.vue'),
      },
      {
        path: '/catalogo/:id/editar',
        name: 'ProdutoEditar',
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/ProdutoEditar.vue'),
      },
      {
        path: '/catalogo/:id',
        name: 'ProdutoDetalhe',
        component: () => import('@/views/ProdutoDetalhe.vue'),
      },
      {
        path: '/pedidos',
        name: 'Pedidos',
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/Pedidos.vue'),
      },
      {
        path: '/pedidos/buscar',
        name: 'PedidosBuscar',
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/PedidosBuscar.vue'),
      },
      {
        path: '/pedidos/detalhe/:id',
        name: ' ',
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/PedidoDetalhe.vue'),
      },
      {
        path: '/compras',
        name: 'Compras',
        meta: { userTypesAccess: ['cliente'] } as RouteMetaType,
        component: () => import('@/views/Compras.vue'),
      },
      {
        path: '/compra/:id',
        name: 'CompraDetalhe',
        meta: { userTypesAccess: ['cliente'] } as RouteMetaType,
        component: () => import('@/views/CompraDetalhe.vue'),
      },
      {
        path: '/customer/:id',
        name: 'Customer',
        meta: { userTypesAccess: ['gerente', 'editor'] } as RouteMetaType,
        component: () => import('@/views/Customer.vue'),
      },
      {
        path: '/users',
        name: 'User',
        meta: { userTypesAccess: ['gerente'] } as RouteMetaType,
        component: () => import('@/views/Users.vue'),
      },
      {
        path: '/users/buscar',
        name: 'UserBuscar',
        meta: { userTypesAccess: ['gerente'] } as RouteMetaType,
        component: () => import('@/views/UsersBuscar.vue'),
      },
      {
        path: '/users/novo',
        name: 'UserNovo',
        meta: { userTypesAccess: ['gerente'] } as RouteMetaType,
        component: () => import('@/views/UserNovo.vue'),
      },
      {
        path: '/users/:id/editar',
        name: 'UserEditar',
        meta: { userTypesAccess: ['gerente'] } as RouteMetaType,
        component: () => import('@/views/UserEditar.vue'),
      }
    ],
  },
  {
    path: '/comprar/:id',
    name: 'ComprarProduto',
    component: () => import('@/layouts/default/Default.vue'),
    meta: { userTypesAccess: ['cliente'] } as RouteMetaType,
    children: [
      {
        path: '',
        name: 'ComprarProduto',
        component: () => import('@/views/ProdutoComprar.vue'),
      },
    ]
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
