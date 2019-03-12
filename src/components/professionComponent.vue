<template>
  <div>
    <div class="c-toolbar u-mb-medium">
      <ul class="c-tabs__list nav nav-tabs">
        <li><router-link :to="basePath + 'co-workers' + query" :class="'c-tabs__link u-text-small ' + (tabActive === '1tab' ? 'active' : '')">Сотрудники</router-link></li>
        <li><router-link :to="basePath + 'weekplan' + query" :class="'c-tabs__link u-text-small ' + (tabActive === '2tab' ? 'active' : '')">План на неделю</router-link></li>
        <li><router-link :to="basePath + 'dayplan' + query" :class="'c-tabs__link u-text-small ' + (tabActive === '3tab' ? 'active' : '')">План на отдельный день</router-link></li>
      </ul>
    </div>
    <div :class="'tab ' + (closeTab ? 'closeTab' : '')" v-if="tabActive === '1tab'">
      <div class="c-card u-mb-medium n-mh-medium">
        <table id="userstable" class="c-table">
          <caption class="c-table__title" v-if="professionsReady">
            <div class="c-field u-mb-small search-input">
              <input type="text" placeholder="Поиск..." v-model="q" class="c-input" value="">
            </div>
          </caption>
          <thead class="c-table__head c-table__head--slim">
          <tr class="c-table__row">
            <th class="c-table__cell c-table__cell--head">№</th>
            <th class="c-table__cell c-table__cell--head">Имя</th>
          </tr>
          </thead>
          <tbody>
          <tr class="c-table__row" v-if="!total">
            <td class="c-table__cell" colspan="15">
              <div v-html="q ? 'Нет сотрудников соответствующих Вашему запросу' : 'Нет сотрудников с данной должностью'"></div>
            </td>
          </tr>
          <tr class="c-table__row" v-for="(user, key) in users">
            <td class="c-table__cell" v-html="key + 1"></td>
            <td class="c-table__cell user-link">
              <router-link :to="'/users/profile?user_id=' + user.id">
                <div v-html="renderUserName(user)"></div>
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="more-button-block" v-if="total && total > users.length">
          <button type="button" class="c-btn c-btn--info more-button" v-on:click="nextPage()">
            <div class="loading-content-items" v-if="loading"><div class="m-loader"></div></div>
            Показать ещё
          </button>
        </div>
      </div>
    </div>
    <div :class="'tab ' + (closeTab ? 'closeTab' : '')" v-if="tabActive === '2tab'">
      <div class="c-card u-mb-medium n-mh-medium">
        <div class="calendar" v-if="!constructorShow">
          <div class="fc-header">
            <h2 class="fc-header-title">Выберите день недели</h2>
          </div>
          <div class="js-calendar u-mb-large fc fc-unthemed fc-ltr">
            <div class="fc-view-container">
              <div class="fc-view fc-month-view fc-basic-view">
                <table>
                  <thead class="fc-head">
                  <tr class="fc-head-container fc-widget-header">
                    <th class="fc-day-header fc-widget-header" v-for="day in days"><span>{{ day.rus }}</span></th>
                  </tr>
                  </thead>
                  <tbody class="fc-body">
                  <tr class="fc-unthemed2">
                    <td class="fc-day fc-widget-content" v-for="plan in plans">
                      <div data-index="1">
                        <div class="shedule-date-item">
                          <div class="shedule-date-item-inner" @click="openConstructor(plan.index)">
                            <div class="shedule-date-item-value" v-if="!plan.list[0].name">Нет планов</div>
                            <div class="shedule-date-item-value" v-else>Планов: {{ plan.list.length }}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="constructor" v-if="constructorShow">
          <button type="button" class="back-button" @click="closeConstructor()">
            <svg x="0px" y="0px" viewBox="0 0 489 489" style="enable-background:new 0 0 489 489;" xml:space="preserve">
                <g><path d="M429.4,255.033c-35.4-43.1-102.1-94.4-219.7-98.8v-79.8c0-4.7-2.7-9.1-7-11.1s-9.4-1.4-13,1.6L4.5,219.633
                        c-2.8,2.3-4.5,5.8-4.5,9.4c0,3.7,1.6,7.1,4.4,9.4l185.2,153.3c3.7,3,8.7,3.7,13,1.6c4.3-2,7-6.3,7-11.1v-79.5
                        c76.8,0.3,194.2,6,256.5,115.9c2.2,3.9,6.3,6.2,10.7,6.2c1,0,2.1-0.1,3.1-0.4c5.4-1.4,9.1-6.3,9.1-11.8
                        C489.1,371.533,473.4,308.633,429.4,255.033z M197.4,278.233L197.4,278.233c-3.3,0-6.4,1.3-8.7,3.6s-3.6,5.4-3.6,8.7v65.7
                        l-153.5-127.1l153.6-126.7v65.7c0,6.7,5.4,12.2,12.1,12.3c176,1.7,241.6,109,260.7,184.4
                        C382.2,278.333,268.7,278.233,197.4,278.233z"/></g>
            </svg>
            Вернуться назад
          </button>
          <h2 class="selected-day">{{ selectedDay }}</h2>
          <div class="head-table">
            <div class="head-row">План</div>
            <div class="head-row">Количество</div>
            <div class="head-row">Название 1 колонки</div>
          </div>
          <div class="plan-block" v-for="(plan, index) in plans[selectedDayEng].list">
            <input type="text" name="name" placeholder="Название плана" class="c-input" v-model="plan.name">
            <input type="text" name="count" placeholder="Количество" class="c-input" v-model="plan.count">
            <input type="text" name="col1" placeholder="Название 1 колонки" class="c-input" v-model="plan.col1">
            <div class="delete-button-block">
              <button type="button" class="delete-button" title="Удалить" @click="deletePlan(index)" v-if="index !== 0">
                <i class="far fa-trash-alt u-text-mute"></i>
              </button>
            </div>
          </div>
          <div class="add-plans-block c-btn c-btn--success" @click="addPlan()">
            <i class="fas fa-plus u-opacity-medium"></i>
            <span class="text">Добавить поле</span>
          </div>
          <div class="submit-button-block">
            <button type="button" class="submit-button c-btn c-btn--success" @click="savePlan()">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    <div :class="'tab ' + (closeTab ? 'closeTab ' : '') + (tabActive === '3tab' ? '' : 'none')" v-if="parentReady">
      <div class="c-card u-mb-medium n-mh-medium">
        <calendarComponent :parentDayClickHandler="openSingleDayConstructor" :parentRecalculateCalendar="initCalendarValues" :class="calendarShow ? '' : 'none'" ref="calendar"></calendarComponent>
        <div class="constructor" v-if="!calendarShow">
          <button type="button" class="back-button" @click="closeSingleDayConstructor()">
            <svg x="0px" y="0px" viewBox="0 0 489 489" style="enable-background:new 0 0 489 489;" xml:space="preserve">
                <g><path d="M429.4,255.033c-35.4-43.1-102.1-94.4-219.7-98.8v-79.8c0-4.7-2.7-9.1-7-11.1s-9.4-1.4-13,1.6L4.5,219.633
                        c-2.8,2.3-4.5,5.8-4.5,9.4c0,3.7,1.6,7.1,4.4,9.4l185.2,153.3c3.7,3,8.7,3.7,13,1.6c4.3-2,7-6.3,7-11.1v-79.5
                        c76.8,0.3,194.2,6,256.5,115.9c2.2,3.9,6.3,6.2,10.7,6.2c1,0,2.1-0.1,3.1-0.4c5.4-1.4,9.1-6.3,9.1-11.8
                        C489.1,371.533,473.4,308.633,429.4,255.033z M197.4,278.233L197.4,278.233c-3.3,0-6.4,1.3-8.7,3.6s-3.6,5.4-3.6,8.7v65.7
                        l-153.5-127.1l153.6-126.7v65.7c0,6.7,5.4,12.2,12.1,12.3c176,1.7,241.6,109,260.7,184.4
                        C382.2,278.333,268.7,278.233,197.4,278.233z"/></g>
            </svg>
            Вернуться назад
          </button>
          <h2 class="selected-day">{{ selectedSingleDayDisplay }}</h2>
          <div class="head-table">
            <div class="head-row">План</div>
            <div class="head-row">Количество</div>
            <div class="head-row">Название 1 колонки</div>
          </div>
          <div class="plan-block" v-for="(plan, index) in plansSingleDay">
            <input type="text" name="name" placeholder="Название плана" class="c-input" v-model="plan.name">
            <input type="text" name="count" placeholder="Количество" class="c-input" v-model="plan.count">
            <input type="text" name="col1" placeholder="Название 1 колонки" class="c-input" v-model="plan.col1">
            <div class="delete-button-block">
              <button type="button" class="delete-button" title="Удалить" @click="deleteSingleDayPlan(index)" v-if="index !== 0">
                <i class="far fa-trash-alt u-text-mute"></i>
              </button>
            </div>
          </div>
          <div class="add-plans-block c-btn c-btn--success" @click="addSingleDayPlan()">
            <i class="fas fa-plus u-opacity-medium"></i>
            <span class="text">Добавить поле</span>
          </div>
          <div class="submit-button-block">
            <button type="button" class="submit-button c-btn c-btn--success" @click="saveSingleDayPlan()">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  import calendarComponent from '@/components/calendarComponent.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import dateMixin from '@/mixins/dateMixin.vue';
  export default {
    mixins: [Component, commonMixin, dateMixin],
    data() {
      return {
        basePath: '',
        query: '',
        users: [],
        total: 0,
        perPage: 0,
        q: '',
        p: 1,
        profession: '',
        professionsReady: false,
        tabActive: '1tab',
        closeTab: false,
        loading: false,
        selectedDay: '',
        selectedDayEng: '',
        constructorShow: false,
        calendarShow: true,
        plans: {},
        mainPlansSingleDay: [],
        plansSingleDay: [],
        selectedSingleDay: '',
        selectedSingleDayDisplay: '',
        parentReady: false
      }
    },
    async created() {
      this.$store.dispatch('setComponentReady', false);
      this.recalculateContent();
      await this.getProfessions();
      this.professionsReady = true;
      this.initProfession();
      await this.initPlan();
      await this.getUsers();
      await this.initSingleDayPlans();
      this.parentReady = true;
    },
    async mounted() {
      this.$store.dispatch('setComponentReady', true);
    },
    watch: {
      '$route'(t, f) {
        this.closeTab = true;
        setTimeout(() => {
          this.closeTab = false;
          this.recalculateContent();
        }, 300);
      },
      profession() {
        this.pageData = {
            title: 'Должность: ' + this.professions[this.profession].title,
            metaTitle: 'Должность: ' + this.professions[this.profession].title
        };
      },
      q() {
        this.p = 1;
        this.getUsers();
      }
    },
    methods: {
      recalculateContent() {
        let path = window.location.pathname;
        let query = this.$route.fullPath.split('?')[1];
        if (query) {
          this.query = '?' + query;
        }
        let arr = path.split('/');
        this.basePath = '/' + arr[1] + '/' + arr[2] + '/';
        if (arr[3] === 'co-workers') {
          this.tabActive = '1tab';
        } else if (arr[3] === 'weekplan') {
          this.tabActive = '2tab';
        } else if (arr[3] === 'dayplan'){
          this.tabActive = '3tab';
        }
      },
      initProfession() {
        if (this.$route.query.name) {
          this.profession = this.$route.query.name;
        } else {
          this.profession = 'admin';
        }
      },
      async getUsers() {
        const resp = await axios.post('/getUsers', { q: this.q, p: this.p, professions: this.profession });
        if (resp.data) {
          this.users = Array.isArray(resp.data.users) ? resp.data.users : [];
          this.users.forEach(function (item) {
            try {
              item.professions = JSON.parse(item.professions);
            } catch(e) {
              item.professions = [];
            }
          });
          this.total = parseInt(resp.data.total);
          this.perPage = parseInt(resp.data.perPage);
        }
      },
      async nextPage() {
        this.p++;
        this.loading = true;
        const resp = await axios.post('/getUsers', { q: this.q, p: this.p, professions: this.profession });
        if (resp.data) {
          resp.data.users.forEach((item) => {
            try {
              item.professions = JSON.parse(item.professions);
              this.users.push(item);
            } catch(e) {
              item.professions = [];
            }
          });
        }
        this.loading = false;
      },
      openConstructor(day) {
        this.selectedDay = this.days[day].rus;
        this.selectedDayEng = this.days[day].eng;
        this.constructorShow = true;
      },
      closeConstructor() {
        this.selectedDay = '';
        this.selectedDayEng = '';
        this.constructorShow = false;
      },
      async initPlan() {
        this.days.forEach((el, index) => {
          this.$set(this.plans, el.eng, {
            index: index,
            list: []
          });
        });
        const resp = await axios.post('/getPlan', { profession: this.profession });
        if (resp.data) {
          if (resp.data.plans) {
            resp.data.plans.forEach((el) => {
              let json_el = JSON.parse(el.plan);
              json_el.forEach((elem) => {
                this.plans[el.weekday].list.push(elem);
              });
            });
          }
        }
        this.days.forEach((el) => {
          if (!this.plans[el.eng].list.length) {
            this.plans[el.eng].list.push({
              name: '',
              count: '',
              col1: ''
            });
          }
        });
      },
      addPlan() {
        this.plans[this.selectedDayEng].list.push({
          name: '',
          count: '',
          col1: ''
        });
      },
      deletePlan(index) {
        this.plans[this.selectedDayEng].list.splice(index, 1);
      },
      async savePlan() {
        const resp = await axios.post('/savePlan', { profession: this.profession, weekday: this.selectedDayEng, plan: this.plans[this.selectedDayEng].list });
        if (resp.data) {
          if (resp.data.result) {
            toastr.success('Сохранено');
          } else {
            toastr.error(resp.data.display);
            return false;
          }
        }
      },
      openSingleDayConstructor(day, dayDisplay) {
        this.selectedSingleDay = day;
        this.selectedSingleDayDisplay = dayDisplay;
        this.calendarShow = false;
        this.openSingleDayPlans();
      },
      closeSingleDayConstructor() {
        this.calendarShow = true;
      },
      async initSingleDayPlans() {
        const resp = await axios.post('/getSingleDayPlan', { profession: this.profession });
        if (resp.data) {
          if (resp.data.plans) {
            this.mainPlansSingleDay = resp.data.plans;
          }
        }
      },
      openSingleDayPlans() {
        let plansSingleDay = [];
        let searched = false;
        this.mainPlansSingleDay.forEach((el) => {
          if (this.selectedSingleDay === el.day) {
            let json_el = '';
            if (typeof el.plan === 'string') {
              json_el = JSON.parse(el.plan);
            } else {
              json_el = el.plan;
            }
            json_el.forEach((elem) => {
              plansSingleDay.push(elem);
            });
            this.plansSingleDay = plansSingleDay;
            searched = true;
          }
        });
        if (!searched) {
          plansSingleDay.push({
            name: '',
            count: '',
            col1: ''
          });
          this.plansSingleDay = plansSingleDay;
        }
      },
      addSingleDayPlan() {
        this.plansSingleDay.push({
          name: '',
          count: '',
          col1: ''
        });
      },
      deleteSingleDayPlan(index) {
        this.plansSingleDay.splice(index, 1);
      },
      async saveSingleDayPlan() {
        const resp = await axios.post('/saveSingleDayPlan', { profession: this.profession, day: this.selectedSingleDay, plan: this.plansSingleDay });
        if (resp.data) {
          if (resp.data.result) {
            toastr.success('Сохранено');
            this.mainPlansSingleDay.forEach((el, index) => {
              if (el.day === this.selectedSingleDay) {
                this.mainPlansSingleDay.splice(index, 1);
              }
            });
            if (this.plansSingleDay[0]['name'] !== '') {
              this.mainPlansSingleDay.push({
                day: this.selectedSingleDay,
                plan: this.plansSingleDay
              });
            }
            this.$refs.calendar.recalculateValues();
          } else {
            toastr.error(resp.data.display);
            return false;
          }
        }
      },
      initCalendarValues(tableDays) {
        tableDays.forEach((el) => {
          el.forEach((elem) => {
            let writed = false;
            this.mainPlansSingleDay.forEach((element) => {
              if (elem.date === element.day) {
                if (typeof element.plan === 'string') {
                  elem.value = 'Планов: ' + JSON.parse(element.plan).length;
                } else {
                  elem.value = 'Планов: ' + element.plan.length;
                }
                writed = true;
              }
            });
            if (!writed) {
              elem.value = '';
            }
          });
        });
      }
    },
    components: {
      calendarComponent
    }
  }
</script>
