<template>
  <div>
    <div class="amo-block">
      <div class="wrapper-block amo-date-block">
        <p>Выберите период:</p>
        <p>
          <span class="before-date">с <date-picker v-model="date.before" lang="ru" :first-day-of-week="1" :clearable="false" format="DD-MM-YYYY"/></span>
          <span class="after-date">по <date-picker v-model="date.after" lang="ru" :first-day-of-week="1" :clearable="false" format="DD-MM-YYYY"/></span>
          <button type="button" class="c-btn c-btn--success show-amo" @click="updateDate()">Показать</button>
        </p>
      </div>
      <div id="preloader" class="u-mt-small" v-if="amoLoading">
        <div class="loading-content">
          <div class="m-loader"></div>
          <span class="u-text-dark">загрузка...</span>
        </div>
      </div>
      <div v-else>
        <div class="wrapper-blocks amo-zamer">
          <div class="stats-wrapper">
            <div class="stats-wrapper-left">
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Замеры</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Выездов на замер</p>
                  <span class="u-text-small u-text-mute">{{ data['zamer'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Отменённые замеры</p>
                  <span class="u-text-small u-text-mute" v-if="data['zamerCancel'] === 0">{{ data['zamerCancel'] }}</span>
                  <span class="u-text-small red" v-else>-{{ data['zamerCancel'] }}</span>
                </div>
                <!--<div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Всего назначенных встреч</p>
                  <span class="u-text-small u-text-mute">{{ data['meet'] }}</span>
                </div>-->
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Назначенные встречи в офисе</p>
                  <span class="u-text-small u-text-mute">{{ data['office'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Назначенные встречи на объекте</p>
                  <span class="u-text-small u-text-mute">{{ data['object'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Отменённые встречи</p>
                  <span class="u-text-small u-text-mute" v-if="data['cancel'] === 0">{{ data['cancel'] }}</span>
                  <span class="u-text-small red" v-else>-{{data['cancel'] }}</span>
                </div>
              </div>
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Обмерные листы</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Корректный обмерный лист</p>
                  <span class="u-text-small u-text-mute">{{ data['obmer'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Обмерный лист не принят</p>
                  <span class="u-text-small u-text-mute" v-if="data['obmerCancel'] === 0">{{ data['obmerCancel'] }}</span>
                  <span class="u-text-small red" v-else>{{ data['obmerCancel'] }}</span>
                </div>
              </div>
            </div>
            <div class="stats-wrapper-right">
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <table class="c-table u-border-zero c-table-stats">
                  <thead>
                    <tr class="c-table__row u-border-top-zero">
                      <th class="c-table__cell cell_name cell_title">Пров. встречи</th>
                      <th class="c-table__cell cell_name u-text-mute cell_width25">В офисе</th>
                      <th class="c-table__cell cell_name u-border-right-zero u-text-mute cell_width25">На объекте</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="c-table__row">
                      <td class="c-table__cell cell_name">До 50 м<sup>2</sup></td>
                      <td class="c-table__cell cell_value u-text-mute">{{ this.data['office50'] }}</td>
                      <td class="c-table__cell cell_value u-text-mute">{{ this.data['object50'] }}</td>
                    </tr>
                    <tr class="c-table__row">
                      <td class="c-table__cell cell_name">От 50 м<sup>2</sup> до 80 м<sup>2</sup></td>
                      <td class="c-table__cell cell_value u-text-mute">{{ this.data['office50_80'] }}</td>
                      <td class="c-table__cell cell_value u-text-mute">{{ this.data['object50_80'] }}</td>
                    </tr>
                    <tr class="c-table__row">
                      <td class="c-table__cell cell_name">От 80 м<sup>2</sup></td>
                      <td class="c-table__cell cell_value u-text-mute">{{ this.data['office80'] }}</td>
                      <td class="c-table__cell cell_value u-text-mute">{{ this.data['object80'] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Конверсия</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Из замера в офис</p>
                  <span class="u-text-small u-text-mute">{{ data['cv-1'] }}%</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Из замера в объект</p>
                  <span class="u-text-small u-text-mute">{{ data['cv-2'] }}%</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Общая конверсия</p>
                  <span class="u-text-small u-text-mute">{{ data['cv-total'] }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="graphics-wrapper">
            <div class="c-card wrapper-block amo-stats-block u-mt-small">
              <div class="c-card__header c-card__header--transparent o-line">
                <h5 class="c-card__title">Графики</h5>
              </div>
              <carousel :per-page="1" :loop="true">
                <slide>
                  <div class="graphic-1"><v-chart :auto-resize="true" :options="graphic_1"></v-chart></div>
                </slide>
                <slide>
                  <div class="graphic-2"><v-chart :auto-resize="true" :options="graphic_2"></v-chart></div>
                </slide>
                <slide>
                  <div class="graphic-3"><v-chart :auto-resize="true" :options="graphic_3"></v-chart></div>
                </slide>
              </carousel>
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
  import { Carousel, Slide } from 'vue-carousel';
  import ECharts from 'vue-echarts/components/ECharts';
  import 'echarts/lib/component/polar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/chart/pie';
  export default {
    mixins: [dateMixin],
    data() {
      return {
        date: {
          after: '',
          before: ''
        },
        data: {},
        amoLoading: false,
        graphic_1: {
          title: {
            text: 'Замеры',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: []
          },
          color: ['#2da1f8', '#9d90e4', '#f8cf5d', '#3eb934', '#40557d', '#34bfa3', '#00c5dc'],
          xAxis: {
            data: []
          },
          yAxis: {
            minInterval: 1,
            type: 'value'
          },
          series: [{
            name: '',
            type: 'bar',
            data: []
          }],
          animationDuration: 1500
        },
        graphic_2: {
          title: {
            text: 'Замеры',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: []
          },
          color: ['#2da1f8', '#9d90e4', '#f8cf5d', '#3eb934', '#40557d', '#34bfa3', '#00c5dc'],
          xAxis: {
            data: []
          },
          yAxis: {
            minInterval: 1,
            type: 'value'
          },
          series: [{
            name: '',
            type: 'bar',
            data: []
          }],
          animationDuration: 1500
        },
        graphic_3: {
          title: {
            text: 'Конверсия',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: []
          },
          color: ['#2da1f8', '#9d90e4', '#f8cf5d', '#3eb934', '#40557d', '#34bfa3', '#00c5dc'],
          xAxis: {
            data: []
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            max: 100
          },
          series: [{
            name: '',
            type: 'bar',
            data: []
          }],
          animationDuration: 1500
        },
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      this.date.before = this.minusOneWeek;
      this.date.after = this.currentFullDateInverseDigitWithZero;
      await this.showDeals(this.date.before, this.date.after);
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      getUnique(arr) {
        let i = 0,
          current,
          length = arr.length,
          unique = [];
        for (; i < length; i++) {
          current = arr[i];
          if (!~unique.indexOf(current)) {
            unique.push(current);
          }
        }
        return unique;
      },
      showDeals: async function (before, after) {
        let before_ms = this.getMilliseconds(before);
        let after_ms = this.getMilliseconds(after);

        let resp = await axios.post('/showNotes', {date: before});
        this.$set(this.data, 'zamer', 0);
        this.$set(this.data, 'zamerCancel', 0);
        this.$set(this.data, 'meet', 0);
        this.$set(this.data, 'office', 0);
        this.$set(this.data, 'object', 0);
        this.$set(this.data, 'cancel', 0);
        this.$set(this.data, 'office50', 0);
        this.$set(this.data, 'office50_80', 0);
        this.$set(this.data, 'office80', 0);
        this.$set(this.data, 'object50', 0);
        this.$set(this.data, 'object50_80', 0);
        this.$set(this.data, 'object80', 0);
        this.$set(this.data, 'obmer', 0);
        this.$set(this.data, 'obmerCancel', 0);
        this.$set(this.data, 'cv-1', 0);
        this.$set(this.data, 'cv-2', 0);
        let objZamer = {};
        let objZamerCancel = {};
        let obmer = [];

        if (resp.data) {
          resp.data.forEach((el) => {
            if (el.params && el.params['STATUS_OLD']) {
              //Количество выездов на замер
              if (el.params['STATUS_OLD'] === '20035408' || (el.params['STATUS_OLD'] === '21809665' && el.params['STATUS_NEW'] === '20122861')) {
                if (el['created_at'] > before_ms && el['created_at'] < after_ms) {
                  if (!objZamer[el['element_id']] || objZamer[el['element_id']].time < el['created_at']) {
                    objZamer[el['element_id']] = {
                      time: el['created_at']
                    };
                  }
                }
              }
            }
          });

          resp.data.forEach((el) => {
            if (el.params && el.params['STATUS_NEW']) {
              //Отменённые замеры
              if (el.params['STATUS_NEW'] === '21812458' || el.params['STATUS_NEW'] === '21809665' || (el.params['STATUS_OLD'] === '20035408' && (el.params['STATUS_NEW'] === '20626423' ||
                el.params['STATUS_NEW'] === '20611690' || el.params['STATUS_NEW'] === '21654916' || el.params['STATUS_NEW'] === '20626450'))) {
                if (objZamer[el['element_id']] && (!objZamerCancel[el['element_id']] || objZamerCancel[el['element_id']].time < el['created_at'])) {
                  objZamerCancel[el['element_id']] = {
                    time: el['created_at']
                  };
                }
              }
            }
          });

          for (let key in objZamerCancel) {
            if (objZamer[key].time > objZamerCancel[key].time) {
              delete objZamerCancel[key];
            }
          }
          this.data['zamer'] = Object.keys(objZamer).length;
          this.data['zamerCancel'] = Object.keys(objZamerCancel).length;
          console.log('Замеры');
          console.log(objZamer);
          console.log('Отменённые');
          console.log(objZamerCancel);

          resp.data.forEach((el) => {
            if (el.params && el.params['STATUS_NEW']) {
              //Отменённые встречи
              if (el.params['STATUS_NEW'] === '21811594' && el.params['STATUS_OLD'] !== '21970822') {
                if (objZamer[el['element_id']]) {
                  this.data['cancel']++;
                }
              }

              //Обмерный лист не принят
              if (el.params['STATUS_NEW'] === '21850540') {
                if (objZamer[el['element_id']]) {
                  this.data['obmerCancel']++;
                }
              }
            }
          });
        }

        resp.data.forEach((el) => {
          if (el.params && el.params['STATUS_NEW']) {
            //Корректный обмерный лист
            if (el.params['STATUS_NEW'] === '21272077') {
              if (objZamer[el['element_id']]) {
                obmer.push(el['element_id']);
              }
            }
          }
        });

        obmer = this.getUnique(obmer);
        this.data['obmer'] = obmer.length;
        this.data['obmer'] = this.data['obmer'] - this.data['obmerCancel'];

        let arrZamer = [];
        for (let key in objZamer) {
          if (!objZamerCancel[key]) {
            arrZamer.push(key);
          }
        }

        //Назначенные первичные встречи
        let arrMeet = [];
        resp.data.forEach((el) => {
          if (el.params && el.params['STATUS_NEW']) {
            if (el.params['STATUS_NEW'] === '21811591') {
              if (objZamer[el['element_id']]) {
                arrMeet.push(el['element_id']);
              }
            }
          }
        });
        arrMeet = this.getUnique(arrMeet);
        this.data['meet'] = arrMeet.length;

        resp = await axios.post('/showDeals', {id: arrZamer});
        if (resp.data) {
          resp.data.forEach((el) => {
            let office = false;
            let object = false;
            let meet = false;
            //Назначенные первичные встречи в офисе или на объекте
            el['custom_fields'].forEach((elem) => {
              if (elem.name === 'Где проходит встреча') {
                if (elem.values[0].value === 'В офисе') {
                  this.data['office']++;
                  office = true;
                } else if (elem.values[0].value === 'На объекте') {
                  this.data['object']++;
                  object = true;
                }
              }
            });
            //Проведённые встречи
            el['custom_fields'].forEach((elem) => {
              if (elem.name === 'Встреча проведена') {
                if (elem.values[0].value === 'Да') {
                  meet = true;
                }
              }
            });
            el['custom_fields'].forEach((elem) => {
              if (elem.name === 'Точная площадь объекта') {
                if (meet) {
                  let number = elem.values[0].value;
                  number = number.replace(',', '.');
                  number = parseFloat(number);
                  if (number < 50) {
                    if (office) {
                      this.data['office50']++;
                    } else if (object) {
                      this.data['object50']++;
                    }
                  } else if (number > 50 && number < 80) {
                    if (office) {
                      this.data['office50_80']++;
                    } else if (object) {
                      this.data['object50_80']++;
                    }
                  } else if (number > 80) {
                    if (office) {
                      this.data['office80']++;
                    } else if (object) {
                      this.data['object80']++;
                    }
                  }
                }
              }
            });
          });
        }

        this.data['cv-1'] = Math.round((this.data['office50'] + this.data['office50_80'] + this.data['office80']) / (this.data['zamer'] - this.data['zamerCancel']) * 100);
        this.data['cv-2'] = Math.round((this.data['object50'] + this.data['object50_80'] + this.data['object80']) / (this.data['zamer'] - this.data['zamerCancel']) * 100);
        this.data['cv-total'] = this.data['cv-1'] + this.data['cv-2'];

        this.initGraphics();
      },
      initGraphics() {
        //graphic1
        this.graphic_1.xAxis = {
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            fontSize: 10,
            rotate: 35
          },
          data: ['Замеры', 'Отмен. замеры', 'Встр. в офисе', 'Встр. на объекте', 'Отмен. встречи']
        };
        this.graphic_1.series = {
          name: '',
          type: 'bar',
          data: [{
            name: 'Замеры',
            value: this.data['zamer'],
            itemStyle: {
              color: '#2da1f8'
            }
          }, {
            name: 'Отмен. замеры',
            value: this.data['zamerCancel'],
            itemStyle: {
              color: '#9d90e4'
            }
          }, {
            name: 'Встречи в офисе',
            value: this.data['office'],
            itemStyle: {
              color: '#f8cf5d'
            }
          }, {
            name: 'Встречи на объекте',
            value: this.data['object'],
            itemStyle: {
              color: '#3eb934'
            }
          }, {
            name: 'Отменённые встречи',
            value: this.data['cancel'],
            itemStyle: {
              color: '#40557d'
            }
          }]
        };

        //graphic2
        this.graphic_2.xAxis = {
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            fontSize: 10,
            rotate: 35
          },
          data: ['В офисе - до 50', 'В оф.-от 50 до 80', 'В офисе - от 80', 'На объекте - от 50', 'На об.-от 50 до 80', 'На объекте - от 80']
        };
        this.graphic_2.series = {
          name: '',
          type: 'bar',
          data: [{
            name: 'В офисе - до 50',
            value: this.data['office50'],
            itemStyle: {
              color: '#2da1f8'
            }
          }, {
            name: 'В офисе - от 50 до 80',
            value: this.data['office50_80'],
            itemStyle: {
              color: '#9d90e4'
            }
          }, {
            name: 'В офисе - от 80',
            value: this.data['office80'],
            itemStyle: {
              color: '#f8cf5d'
            }
          }, {
            name: 'На объекте - от 50',
            value: this.data['object50'],
            itemStyle: {
              color: '#3eb934'
            }
          }, {
            name: 'На объекте - от 50 до 80',
            value: this.data['object50_80'],
            itemStyle: {
              color: '#40557d'
            }
          }, {
            name: 'На объекте - от 80',
            value: this.data['object80'],
            itemStyle: {
              color: '#34bfa3'
            }
          }]
        };

        //graphic3
        this.graphic_3.xAxis = {
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            fontSize: 10,
            rotate: 35
          },
          data: ['Общ. конв.', 'Офис', 'Объект']
        };
        this.graphic_3.series = {
          name: '',
          type: 'bar',
          data: [{
            name: 'Общ. конв.',
            value: this.data['cv-total'],
            itemStyle: {
              color: '#2da1f8'
            }
          }, {
            name: 'Офис',
            value: this.data['cv-1'],
            itemStyle: {
              color: '#9d90e4'
            }
          }, {
            name: 'Объект',
            value: this.data['cv-2'],
            itemStyle: {
              color: '#f8cf5d'
            }
          }]
        };
      },
      async updateDate() {
        this.amoLoading = true;
        let before = DatePicker.methods.stringify(this.date.before, 'YYYY-MM-DD');
        let after = this.addOneDay(this.date.after);
        after = DatePicker.methods.stringify(after, 'YYYY-MM-DD');
        await this.showDeals(before, after);
        this.amoLoading = false;
      }
    },
    components: {
      'v-chart': ECharts,
      DatePicker,
      Carousel,
      Slide
    }
  }
</script>
