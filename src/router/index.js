import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export const router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      meta: {
        requireAuth: true
      },
      component: resolve => require(['../components/pages/layout.vue'], resolve),
      children: [{
          path: '/',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['../components/pages/readme.vue'], resolve)
        },
        {
          path: '/paymentChannel',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['../components/pages/informationManager/paymentChannel.vue'], resolve)
        },
        {
          path: '/merchant',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['../components/pages/informationManager/merchant.vue'], resolve)
        },
        {
          path: '/application',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['../components/pages/informationManager/application.vue'], resolve)
        },
        // {
        //   path: '/merchantPaySetting',
        //   meta: {
        //     requireAuth: true
        //   },
        //   component: resolve => require(['../components/pages/settingManager/merchantPaySetting.vue'], resolve)
        // },
        // {
        //   path: '/paymentRecord',
        //   meta: {
        //     requireAuth: true
        //   },
        //   component: resolve => require(['../components/pages/reportManager/paymentRecord.vue'], resolve)
        // },
        // {
        //   path: '/refundsRecord',
        //   meta: {
        //     requireAuth: true
        //   },
        //   component: resolve => require(['../components/pages/reportManager/refundsRecord.vue'], resolve)
        // },
        // {
        //   path: '/tradingFlow',
        //   meta: {
        //     requireAuth: true
        //   },
        //   component: resolve => require(['../components/pages/reportManager/tradingFlow.vue'], resolve)
        // },
        // {
        //   path: '/reconciliation',
        //   meta: {
        //     requireAuth: true
        //   },
        //   component: resolve => require(['../components/pages/reportManager/reconciliation.vue'], resolve)
        // },
        // {
        //   path: '/systemUser',
        //   meta: {
        //     requireAuth: true
        //   },
        //   component: resolve => require(['../components/pages/systemManager/systemUser.vue'], resolve)
        // }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/pages/Login.vue'], resolve)
    }
  ]
});

router.beforeEach((to, from, next) => {
  let loginInfor = localStorage.getItem('loginInfor');
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (loginInfor) {
      next()
    } else {
      next('/login');
    }
  } else {
    next()
  }
})
