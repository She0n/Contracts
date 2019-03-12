<template>
  <div class="o-page__sidebar">
    <div class="c-sidebar">
      <div class="c-sidebar__brand">
        <img src="/static/images/logo.svg">
        <hr class="hr-line">
        <span class="description">Сервисы</span>
      </div>
      <ul class="c-sidebar__list">
        <li class="c-sidebar__item sidebar-root-item has-submenu">
          <router-link to="/contracts" class="c-sidebar__link menu-item-title trigger" event="" @click.native.prevent="toggleSidebarItem('contracts', $event)">
            <img src="/static/images/file.svg">Создание договоров
          </router-link>
          <ul class="c-sidebar__submenu collapse" id="contracts-submenu">
            <li><router-link to="/contracts/main" class="c-sidebar__link">Договор подряда + прил.</router-link></li>
          </ul>
        </li>
        <li class="c-sidebar__item sidebar-root-item has-submenu">
          <router-link to="/amocrm" class="c-sidebar__link menu-item-title trigger" event="" @click.native.prevent="toggleSidebarItem('amo', $event)">
            <img src="/static/images/amocrm.svg">Статистика amoCRM
          </router-link>
          <ul class="c-sidebar__submenu collapse" id="amo-submenu">
            <li><router-link to="/amocrm/call" class="c-sidebar__link">Call-центр</router-link></li>
            <li><router-link to="/amocrm/zamer" class="c-sidebar__link">Замерщики</router-link></li>
            <!--<li><router-link to="/amocrm/sales" class="c-sidebar__link">Продажи</router-link></li>-->
            <li><router-link to="/amocrm/requests" class="c-sidebar__link">Заявки</router-link></li>
          </ul>
        </li>
        <!--<li class="c-sidebar__item sidebar-root-item has-submenu" v-if="mode === 'admin'">
          <router-link to="/indicators" class="c-sidebar__link menu-item-title trigger" event="" @click.native.prevent="toggleSidebarItem('stats', $event)"><i class="fas fa-chart-pie u-mr-xsmall"></i>Показатели</router-link>
          <ul class="c-sidebar__submenu collapse" id="stats-submenu">
            <li><router-link to="/indicators/hr" class="c-sidebar__link">Отдел кадров</router-link></li>
            <li><router-link to="/indicators/sales" class="c-sidebar__link">Отдел продаж</router-link></li>
          </ul>
        </li>-->
        <li class="c-sidebar__item" v-for="menuItem in menu" v-if="!menuItem.mode || menuItem.mode === mode">
          <router-link class="c-sidebar__link menu-item-title" :to="menuItem.link"><i v-if="menuItem.icon" :class="menuItem.icon"></i>{{ menuItem.title }}</router-link>
        </li>
        <li class="c-sidebar__item">
          <a @click.prevent="$auth.logout()" class="c-sidebar__link menu-item-title">
            <img src="/static/images/sign-out.svg">Выход из системы
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  import usersMixin from '@/mixins/usersMixin.vue';
  export default {
    props: ['title'],
    mixins: [usersMixin],
    data() {
      return {
        menu: [
          /*{
            link: '/indicators',
            title: 'Показатели',
            icon: 'fas fa-chart-pie u-mr-xsmall',
            mode: 'user'
          },*/
          /*{
            link: '/users',
            title: 'Пользователи',
            icon: 'fas fa-users u-mr-xsmall'
          },*/
          /*{
            link: '/professions',
            title: 'Должности',
            icon: 'fas fa-briefcase u-mr-xsmall',
            mode: 'admin'
          },*/
          /*{
            link: '/whatsapp',
            title: 'WhatsApp',
            mode: 'whatsapp'
          }*/
        ],
        mode: ''
      }
    },
    created() {
      this.mode = this.initMode();
    },
    methods: {
      toggleSidebarItem(item, e) {
        e.preventDefault();
        let childs = $('#' + item + '-submenu');
        let parent = childs.closest('.sidebar-root-item');
        let rootItems = $('.sidebar-root-item');
        for(let i = 0; i < rootItems.length; i++) {
          let item = $(rootItems[i]);
          if(item.attr('id') === parent.attr('id')) { continue; }
          item.removeClass('is-open');
          item.find('.c-sidebar__submenu').removeClass('show').slideUp(200);
        }
        if(childs.hasClass('show')) {
          childs.slideUp(200, function() {
            childs.removeClass('show');
          });
          parent.removeClass('is-open');
        } else {
          childs.slideDown(200, function() {
            childs.addClass('show');
          });
          parent.addClass('is-open');
        }
      }
    }
  }
</script>
