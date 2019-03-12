<template>
  <div>
    <div class="positions-block">
      <ul class="department-blocks">
        <li class="c-card department-block" v-for="department in departments">
          <div class="c-card__header c-card__header--transparent o-line">
            <h5 class="c-card__title">Отдел кадров</h5>
          </div>
          <ul class="position-items">
            <li class="block-inner" v-for="item in returnArray(department)">
              <div class="position-item">
                <router-link :to="'/professions/profession/co-workers?name=' + item.name">{{ item.title }}</router-link>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  const pageData = { title: 'Должности', metaTitle: 'Должности' };
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    props: ['usertypes'],
    mixins: [Component, commonMixin],
    data() {
      return {
        pageData: pageData,
        departments: ['department_hr', 'department_sale'],
        department_hr: [{
          title: 'Руководитель отдела кадров',
          name: 'director_hr'
        }, {
          title: 'Ресёрчер',
          name: 'researcher'
        }, {
          title: 'Рекрутер',
          name: 'recruiter'
        }],
        department_sale: [{
          title: 'Руководитель отдела продаж',
          name: 'director_sale'
        }, {
          title: 'Менеджер по продажам',
          name: 'sale_manager'
        }, {
          title: 'Специалист по замерам',
          name: 'metering'
        }, {
          title: 'Лид менеджер',
          name: 'lead_manager'
        }]
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      await this.getProfessions();
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      returnArray(array) {
        return this[array];
      }
    }
  }
</script>
