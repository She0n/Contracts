import Vue from 'vue'
import Router from 'vue-router'
import indicatorsComponent from '@/components/indicatorsComponent.vue';
import indicatorsValuesComponent from '@/components/indicatorsValuesComponent.vue';
import UsersComponent from '@/components/UsersComponent.vue';
import profileComponent from '@/components/profileComponent.vue';
import calendarComponent from '@/components/calendarComponent.vue';
import professionsComponent from '@/components/professionsComponent.vue';
import professionComponent from '@/components/professionComponent.vue';
import amocrmComponent from '@/components/amocrmComponent.vue';
import contractsComponent from '@/components/contractsComponent.vue';
import whatsAppComponent from '@/components/whatsAppComponent.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/contracts/main'
    },
    {
      path: '/indicators',
      component: indicatorsComponent
    },
    {
      path: '/indicators/hr',
      component: indicatorsComponent
    },
    {
      path: '/indicators/sales',
      component: indicatorsComponent
    },
    {
      path: '/indicators/values',
      component: indicatorsValuesComponent
    },
    {
      path: '/users',
      component: UsersComponent
    },
    {
      path: '/users/profile/edit',
      component: profileComponent
    },
    {
      path: '/users/profile',
      component: profileComponent
    },
    {
      path: '/profile',
      component: profileComponent
    },
    {
      path: '/profile/edit',
      component: profileComponent
    },
    {
      path: '/calendar',
      component: calendarComponent
    },
    {
      path: '/professions',
      component: professionsComponent
    },
    {
      path: '/professions/profession/co-workers',
      component: professionComponent
    },
    {
      path: '/professions/profession/weekplan',
      component: professionComponent
    },
    {
      path: '/professions/profession/dayplan',
      component: professionComponent
    },
    {
      path: '/amocrm',
      redirect: '/amocrm/call'
    },
    {
      path: '/amocrm/call',
      component: amocrmComponent
    },
    {
      path: '/amocrm/zamer',
      component: amocrmComponent
    },
    {
      path: '/amocrm/sales',
      component: amocrmComponent
    },
    {
      path: '/amocrm/requests',
      component: amocrmComponent
    },
    {
      path: '/contracts',
      redirect: '/contracts/main'
    },
    {
      path: '/contracts/main',
      component: contractsComponent
    },
    {
      path: '/whatsapp',
      component: whatsAppComponent
    }
  ],
  mode: 'history'
});
