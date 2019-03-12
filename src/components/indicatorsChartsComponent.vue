<template>
  <div>
    <div class="wrapper-block no-coworkers" v-if="no_coworkers">
      <p>Нет сотрудников в данном отделе</p>
    </div>
    <div v-else>
      <div class="wrapper-block date-block u-mb-medium">
        <p>Дата: <date-picker v-model="day" lang="ru" :first-day-of-week="1" :clearable="false" :editable="false" format="DD-MM-YYYY" @change="updateDate($event)"/></p>
      </div>
      <div id="preloader" v-if="plansLoading">
        <div class="loading-content">
          <div class="m-loader"></div>
          <span class="u-text-dark">загрузка...</span>
        </div>
      </div>
      <div v-else>
        <div class="c-card profession-block u-mb-medium" v-for="profession in getShowProfessions()">
          <div class="c-card__header c-card__header--transparent o-line">
            <h5 class="c-card__title">Должность: {{ profession.title }}</h5>
          </div>
          <div class="blocks">
            <div class="left-block">
              <div class="title">Сотрудники</div>
              <table class="c-table u-border-zero">
                <tbody>
                <tr class="c-table__row" v-for="(item, index) in coworkers[profession.name]">
                  <td class="c-table__cell cell_id">{{ index + 1 }}</td>
                  <td class="c-table__cell">
                    <router-link :to="'/indicators/values?user_id=' + item.id + '&profession=' + profession.name + '&day=' + dayDisplay">
                      {{ item.first_name + ' ' + item.last_name }}
                    </router-link>
                  </td>
                  <td class="c-table__cell cell_plan u-text-right" v-if="item.plan[profession.selectedIndex]">
                    <router-link :to="'/indicators/values?user_id=' + item.id + '&profession=' + profession.name + '&day=' + dayDisplay">
                      <span :class="item.plan[profession.selectedIndex].value < item.plan[profession.selectedIndex].count ? 'red' : 'green'">
                        {{ item.plan[profession.selectedIndex].value }}/{{ item.plan[profession.selectedIndex].count }}
                      </span>
                    </router-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="right-block">
              <div v-if="plans[profession.name]">
                <ul class="plans">
                  <li v-for="(item, index) in plans[profession.name]"><button type="button" :class="profession.selectedIndex === index ? 'active' : ''" @click="switchPlan(profession.name, index, item.name, item.count)">{{ item.name }}</button></li>
                </ul>
                <v-chart :options="graphics[profession.name]"/>
              </div>
              <div class="no-plans-wrapper" v-else>
                <p class="no-plans">Планов нет</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dateMixin from '@/mixins/dateMixin.vue';
  import DatePicker from 'vue2-datepicker';
  import ECharts from 'vue-echarts/components/ECharts';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/polar';
  export default {
    mixins: [dateMixin],
    async created() {
      this.$store.dispatch('setComponentReady', false);
      await this.recalculateContent();
    },
    async mounted() {
      this.$store.dispatch('setComponentReady', true);
    },
    data() {
      return {
        day: '',
        dayDisplay: '',
        department_hr: [{
          name: 'director_hr',
          title: 'Руководитель отдела кадров',
          selectedIndex: 0
        }, {
          name: 'researcher',
          title: 'Ресёрчер',
          selectedIndex: 0
        }, {
          name: 'recruiter',
          title: 'Рекрутер',
          selectedIndex: 0
        }],
        department_sale: [{
          name: 'director_sale',
          title: 'Руководитель отдела продаж',
          selectedIndex: 0
        }, {
          name: 'sale_manager',
          title: 'Менеджер по продажам',
          selectedIndex: 0
        }, {
          name: 'metering',
          title: 'Специалист по замерам',
          selectedIndex: 0
        }, {
          name: 'lead_manager',
          title: 'Лид менеджер',
          selectedIndex: 0
        }],
        department: {},
        coworkers: [],
        no_coworkers: false,
        plans: [],
        plansLoading: false,
        values: [],
        graphics: [],
        defaultGraphic: {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data:['Sales']
          },
          color: ['#2da1f8', '#9d90e4', '#f8cf5d', '#3eb934', '#40557d', '#34bfa3', '#00c5dc'],
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            name: 'Sales',
            type: 'bar',
            data: []
          }],
          animationDuration: 1500
        }
      }
    },
    watch: {
      '$route'() {
        this.$store.dispatch('setComponentReady', false);
        this.recalculateContent();
        this.$store.dispatch('setComponentReady', true);
      }
    },
    methods: {
      async updateDate(event) {
        this.plansLoading = true;
        this.dayDisplay = DatePicker.methods.stringify(event, 'YYYY-MM-D');
        let array = this.dayDisplay.split('-');
        let year = array[0];
        let month = array[1];
        let day = array[2];
        let date = day + '-' + month + '-' + year;
        let dateInverse = this.dayDisplay;
        await this.getCoworkers(date, dateInverse);
        this.initGraphics();
        this.initAllValues();
        this.plansLoading = false;
      },
      async recalculateContent() {
        if (!this.switchDepartment()) {
          return false;
        }
        this.day = this.currentFullDateInverseDigitWithZero;
        this.dayDisplay = this.currentFullDateInverseDigit;
        await this.getCoworkers();
        this.initGraphics();
        this.initAllValues();
        this.no_coworkers = !this.getShowProfessions().length;
      },
      switchDepartment() {
        let path = this.$route.fullPath.split('/')[2];
        if (!path) {
          this.$router.push('/indicators/hr');
          this.department = this.department_hr;
          return false;
        }
        if (path === 'hr') {
          this.department = this.department_hr;
          return true;
        }
        if (path === 'sales') {
          this.department = this.department_sale;
          return true;
        }
      },
      getShowProfessions() {
        let array = [];
        this.department.forEach((el) => {
          if (this.coworkers[el.name]) {
            array.push(el);
          }
        });

        return array;
      },
      initDefaultPlan(profession) {
        let name, count;
        if (this.plans[profession]) {
          this.plans[profession].forEach((el) => {
            if (!name) {
              name = el.name;
              count = el.count;
            }
          });
        }
        return name + ' ' + count;
      },
      switchPlan(profession_name, index, name, count) {
        this.department.forEach((el) => {
          if (el.name === profession_name) {
            el.selectedIndex = index;
            this.initValues(el.name, name, count);
          }
        });
      },
      async getCoworkers(date = this.currentFullDateDigit, dateInverse = this.currentFullDateInverseDigit) {
        this.coworkers = [];
        this.plans = [];
        let resp = await axios.post('/getAllUsers');
        if (resp.data) {
          if (resp.data.users) {
            resp.data.users.forEach((el) => {
              var json_profs = JSON.parse(el.professions);
              json_profs.forEach((elem) => {
                if (!this.coworkers[elem]) {
                  this.$set(this.coworkers, elem, []);
                }
                this.coworkers[elem].push({
                  id: el.id,
                  first_name: el.first_name,
                  last_name: el.last_name,
                  patronymic: el.patronymic,
                  plan: []
                });
              });
            });
          }
        }
        resp = await axios.post('/getAllPlans', { weekday: this.currentWeekday, day: date });
        if (resp.data) {
          if (resp.data.plans) {
            resp.data.plans.forEach((el) => {
              let json_plan = JSON.parse(el.plan);
              json_plan.forEach((elem) => {
                this.coworkers[el.profession].forEach((element) => {
                  element.plan.push({
                    name: elem.name,
                    count: elem.count,
                    value: 0
                  });
                });
                if (!this.plans[el.profession]) {
                  this.$set(this.plans, el.profession, []);
                }
                this.plans[el.profession].push({
                  profession: el.profession,
                  name: elem.name,
                  count: elem.count
                });
              });
            });
          }
        }
        resp = await axios.post('/getValues', { date: dateInverse });
        if (resp.data) {
          if (resp.data.values) {
            this.values = resp.data.values;
            this.values.forEach((el) => {
              this.coworkers[el.profession].forEach((elem) => {
                elem.plan.forEach((element) => {
                  if (el.user_id === elem.id && el.plan_name === element.name) {
                    element.value++;
                  }
                });
              });
            });
          }
        }
      },
      initGraphics() {
        let array = this.getShowProfessions();
        array.forEach((el) => {
          this.$set(this.graphics, el.name, JSON.parse(JSON.stringify(this.defaultGraphic)));
        });
      },
      initAllValues() {
        let name_count = [];
        let array = this.getShowProfessions();
        array.forEach((el) => {
          name_count = this.initDefaultPlan(el.name).split(' ');
          this.initValues(el.name, name_count[0], name_count[1]);
        });
      },
      initValues(profession, plan_name, count) {
        this.graphics[profession].xAxis = {
          data: []
        };
        this.graphics[profession].yAxis = {
          max: count
        };
        this.graphics[profession].series = {
          name: '',
          type: 'bar',
          data: []
        };
        this.coworkers[profession].forEach((el) => {
          this.graphics[profession].xAxis.data.push(el.first_name + ' ' + el.last_name);
          el.plan.forEach((elem) => {
            if (elem.name === plan_name) {
              this.graphics[profession].series.data.push(elem.value);
            }
          });
        });
      }
    },
    components: {
      'v-chart': ECharts,
      DatePicker
    }
  }
</script>
