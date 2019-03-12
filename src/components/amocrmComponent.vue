<template>
  <div>
    <amocrmCall v-if="mode === 'call'"></amocrmCall>
    <amocrmZamer v-if="mode === 'zamer'"></amocrmZamer>
    <amocrmSales v-if="mode === 'sales'"></amocrmSales>
    <amocrmRequests v-if="mode === 'requests'"></amocrmRequests>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  import amocrmCall from '@/components/amocrmCallComponent.vue';
  import amocrmZamer from '@/components/amocrmZamerComponent.vue';
  import amocrmSales from '@/components/amocrmSalesComponent.vue';
  import amocrmRequests from '@/components/amocrmRequestsComponent.vue';
  const pageData = { title: 'Статистика amoCRM', metaTitle : 'Статистика amoCRM'};
  export default {
    mixins: [Component],
    data() {
      return {
        mode: ''
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
      this.initMode();
    },
    watch: {
      '$route'() {
        this.initMode();
      }
    },
    methods: {
      initMode() {
        this.mode = this.$route.fullPath.split('/')[2];
        if (this.mode === 'call') {
          this.pageData = {
            title: 'Статистика amoCRM - Call-центр',
            metaTitle: 'Статистика amoCRM - Call-центр'
          };
        } else if (this.mode === 'zamer') {
          this.pageData = {
            title: 'Статистика amoCRM - Замерщики',
            metaTitle: 'Статистика amoCRM - Замерщики'
          };
        } else if (this.mode === 'sales') {
          this.pageData = {
            title: 'Статистика amoCRM - Продажи',
            metaTitle: 'Статистика amoCRM -  Продажи'
          };
        } else if (this.mode === 'requests') {
          this.pageData = {
            title: 'Статистика amoCRM - Заявки',
            metaTitle: 'Статистика amoCRM - Заявки'
          };
        }
      }
    },
    components: {
      amocrmCall, amocrmZamer, amocrmSales, amocrmRequests
    }
  }
</script>
