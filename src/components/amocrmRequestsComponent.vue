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
        <div class="wrapper-blocks amo-requests">
          <div class="stats-wrapper">
            <div class="stats-wrapper-left">
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Заявки</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Всего заявок</p>
                  <span class="u-text-small u-text-mute">{{ data['total'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Целевых заявок</p>
                  <span class="u-text-small u-text-mute">{{ data['goal'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Нецелевых заявок</p>
                  <span class="u-text-small u-text-mute">{{ data['nogoal'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Передано партнёрам</p>
                  <span class="u-text-small u-text-mute">{{ data['partners'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Порекомендовали друзья</p>
                  <span class="u-text-small u-text-mute">{{ data['friends'] }}</span>
                </div>
              </div>
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Отложенный спрос</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">2 недели - 1 месяц</p>
                  <span class="u-text-small u-text-mute">{{ data['os-1'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">1 - 2 месяца</p>
                  <span class="u-text-small u-text-mute">{{ data['os-2'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">3 - 6 месяцев</p>
                  <span class="u-text-small u-text-mute">{{ data['os-3'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">6 - 9 месяцев</p>
                  <span class="u-text-small u-text-mute">{{ data['os-4'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">9 - 12 месяцев</p>
                  <span class="u-text-small u-text-mute">{{ data['os-5'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Более 12 месяцев</p>
                  <span class="u-text-small u-text-mute">{{ data['os-6'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Всего</p>
                  <span class="u-text-small u-text-mute">{{ data['os-total'] }}</span>
                </div>
              </div>
            </div>
            <div class="stats-wrapper-right">
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <table class="c-table u-border-zero c-table-stats">
                  <thead>
                  <tr class="c-table__row u-border-top-zero">
                    <th class="c-table__cell cell_name cell_title">Итерации</th>
                    <th class="c-table__cell cell_name u-text-mute cell_width25">Назначено</th>
                    <th class="c-table__cell cell_name u-border-right-zero u-text-mute cell_width25">Отменено</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">Замеров</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['zamer'] }}</td>
                    <td class="c-table__cell cell_value">
                      <span class="u-text-mute" v-if="data['zamerCancel'] === 0">{{ data['zamerCancel'] }}</span>
                      <span class="red" v-else>-{{ data['zamerCancel'] }}</span>
                    </td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">Приёмок</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['priem'] }}</td>
                    <td class="c-table__cell cell_value">
                      <span class="u-text-mute" v-if="data['priemCancel'] === 0">{{ data['priemCancel'] }}</span>
                      <span class="red" v-else>-{{ data['priemCancel'] }}</span>
                    </td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">Встреч в офисе</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['office'] }}</td>
                    <td class="c-table__cell cell_value">
                      <span class="u-text-mute" v-if="data['officeCancel'] === 0">{{ data['officeCancel'] }}</span>
                      <span class="red" v-else>-{{ data['officeCancel'] }}</span>
                    </td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">Консульт. с дизайнером</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['consult'] }}</td>
                    <td class="c-table__cell cell_value">
                      <span class="u-text-mute" v-if="data['consultCancel'] === 0">{{ data['consultCancel'] }}</span>
                      <span class="red" v-else>-{{ data['consultCancel'] }}</span>
                    </td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">Первых касаний</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['first'] }}</td>
                    <td class="c-table__cell cell_value">
                      <span class="u-text-mute" v-if="data['firstCancel'] === 0">{{ data['firstCancel'] }}</span>
                      <span class="red" v-else>-{{ data['firstCancel'] }}</span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <table class="c-table u-border-zero c-table-stats">
                  <thead>
                  <tr class="c-table__row u-border-top-zero">
                    <th class="c-table__cell cell_name cell_title">Конверсия</th>
                    <th class="c-table__cell cell_name u-text-mute cell_width25">Из заявки</th>
                    <th class="c-table__cell cell_name u-border-right-zero u-text-mute cell_width25">Из целевых</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">В замер</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv-1'] }}%</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv2-1'] }}%</td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">В приёмку</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv-2'] }}%</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv2-2'] }}%</td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">Во встречу в офисе</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv-3'] }}%</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv2-3'] }}%</td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">В консульт. дизайнеру</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv-4'] }}%</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv2-4'] }}%</td>
                  </tr>
                  <tr class="c-table__row">
                    <td class="c-table__cell cell_name">В первое касание</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv-total'] }}%</td>
                    <td class="c-table__cell cell_value u-text-mute">{{ data['cv2-total'] }}%</td>
                  </tr>
                  </tbody>
                </table>
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
                <slide>
                  <div class="graphic-4"><v-chart :auto-resize="true" :options="graphic_4"></v-chart></div>
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
  import 'echarts/lib/component/legend';
  import 'echarts/lib/component/title';
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
            text: 'Заявки',
            x:'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius : '40%',
              center: ['50%', '50%'],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        graphic_2: {
          title: {
            text: 'Итерации',
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
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              showMinLabel: true,
              showMaxLabel: true
            }
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
            text: 'Отложенный спрос',
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
            data: [],
            axisTick: {
              alignWithLabel: true
            }
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
        graphic_4: {
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
            data: [],
            axisTick: {
              alignWithLabel: true
            }
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
        }
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      this.date.after = this.currentFullDateInverseDigitWithZero;
      let after = this.addOneDay(this.date.after);
      let before = this.date.after.split('-');
      before[2] = '01';
      this.date.before = before[0] + '-' + before[1] + '-' + before[2];
      await this.showDeals(this.date.before, after);
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
      async showDeals(before, after) {
        let before_ms = this.getMilliseconds(before);
        let after_ms = this.getMilliseconds(after);

        /*let resp = await axios.post('/showPipelines');
        console.log(resp);*/
        let resp = await axios.post('/showDeals', { create_from: before_ms, create_to: after_ms });

        let data = [];
        if (resp.data) {
          data = resp.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i]['status_id'] === 20626417 || data[i]['status_id'] === 20626429 || data[i]['status_id'] === 20626432 || data[i]['status_id'] === 20626435 ||
              data[i]['status_id'] === 20626438 || data[i]['status_id'] === 20626441 || data[i]['status_id'] === 20626447 || data[i]['status_id'] === 20626450 ||
              data[i]['status_id'] === 23162857 || data[i]['status_id'] === 23162860) {
              data.splice(i, 1);
              i--;
            }
          }
          this.$set(this.data, 'total', data.length);
        }

        resp = await axios.post('/showNotes', { date: before });
        let arrData = ['zamer', 'priem', 'office', 'consult', 'osZamer', 'first', 'goal', 'nogoal', 'partners', 'zamerCancel', 'priemCancel', 'officeCancel', 'consultCancel', 'firstCancel', 'os-1', 'os-2',
                       'os-3', 'os-4', 'os-5', 'os-6', 'os-total', 'cv-1', 'cv-2', 'cv-3', 'cv-4', 'cv-total', 'cv2-1', 'cv2-2', 'cv2-3', 'cv2-4', 'cv2-total', 'friends'];
        arrData.forEach((el) => {
          this.$set(this.data, el, 0);
        });
        if (resp.data) {
          let arrGoal = [];
          let arrNoGoal = [];
          let arrZamer = [];
          let arrZamerCancel = [];

          resp.data.forEach((el) => {
            if (el.params && el.params['STATUS_NEW']) {
              //Замер/приёмка
              if (el.params['STATUS_NEW'] === '20035408') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    elem['custom_fields'].forEach((element) => {
                      if (element.name === 'Тип встречи') {
                        if (element.values[0].value === 'Замер') {
                          arrZamer.push(elem.id);
                        } else if (element.values[0].value === 'Приемка') {
                          this.data['priem']++;
                        }
                      }
                    });
                  }
                });
              }
              //Встреча в офисе/консультация
              if (el.params['STATUS_NEW'] === '21970669') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    elem['custom_fields'].forEach((element) => {
                      if (element.name === 'Тип встречи') {
                        if (element.values[0].value === 'Встреча в офисе') {
                          this.data['office']++;
                        } else if (element.values[0].value === 'Встреча с дизайнером') {
                          this.data['consult']++;
                        }
                      }
                    });
                  }
                });
              }
              //Целевые заявки
              if (el.params['STATUS_NEW'] === '21809302' || el.params['STATUS_NEW'] === '20611690' || el.params['STATUS_NEW'] === '20122243' || el.params['STATUS_NEW'] === '20122246' ||
                el.params['STATUS_NEW'] === '21809524' || el.params['STATUS_NEW'] === '20626420' || el.params['STATUS_NEW'] === '20626423' || el.params['STATUS_NEW'] === '20038813' ||
                el.params['STATUS_NEW'] === '20035408' || el.params['STATUS_NEW'] === '21970669' || el.params['STATUS_NEW'] === '20103811' || el.params['STATUS_NEW'] === '20103808') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    if (elem['status_id'] !== 21809521) {
                      arrGoal.push(elem.id);
                    }
                  }
                });
              }
              //Нецелевые заявки
              if (el.params['STATUS_NEW'] === '20626414' || el.params['STATUS_NEW'] === '20626417' || el.params['STATUS_NEW'] === '20626426' || el.params['STATUS_NEW'] === '20626429' ||
                el.params['STATUS_NEW'] === '20626432' || el.params['STATUS_NEW'] === '20626435' || el.params['STATUS_NEW'] === '20626438' || el.params['STATUS_NEW'] === '20626441' ||
                el.params['STATUS_NEW'] === '20626444' || el.params['STATUS_NEW'] === '20626447' || el.params['STATUS_NEW'] === '20626450' || el.params['STATUS_NEW'] === '21654916' ||
                el.params['STATUS_NEW'] === '21883150' || el.params['STATUS_NEW'] === '23107141' || el.params['STATUS_NEW'] === '20482048' || el.params['STATUS_NEW'] === '20482045' ||
                el.params['STATUS_NEW'] === '143') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    arrNoGoal.push(elem.id);
                  }
                });
              }
              //Передано партнёрам
              if (el.params['STATUS_NEW'] === '20482048') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    this.data['partners']++;
                  }
                });
              }
              //Отменённые замеры/приёмки
              if (el.params['STATUS_NEW'] === '21809665') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    elem['custom_fields'].forEach((element) => {
                      if (element.name === 'Тип встречи') {
                        if (element.values[0].value === 'Замер') {
                          arrZamerCancel.push(elem.id);
                        } else if (element.values[0].value === 'Приемка') {
                          this.data['priemCancel']++;
                        }
                      }
                    });
                  }
                });
              }
              //Отменённые встречи в офисе/консультации
              if (el.params['STATUS_NEW'] === '21970672') {
                data.forEach((elem) => {
                  if (el['element_id'] === elem.id) {
                    if (elem['custom_fields'].length) {
                      elem['custom_fields'].forEach((element) => {
                        if (element.name === 'Тип встречи') {
                          if (element.values[0].value === 'Встреча в офисе') {
                            this.data['officeCancel']++;
                          } else if (element.values[0].value === 'Встреча с дизайнером') {
                            this.data['consultCancel']++;
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          });

          data.forEach((el) => {
            if (el['custom_fields'].length) {
              el['custom_fields'].forEach((elem) => {
                if (elem.name === 'Откуда узнали?') {
                  if (elem.values[0].value === 'Порекомендовали друзья') {
                    arrGoal.push(el.id);
                    this.data['friends']++;
                  }
                }
              });
            }
          });

          data.forEach((el) => {
            if (el['status_id'] === 21809302) {
              this.data['os-1']++;
            } else if (el['status_id'] === 20611690) {
              this.data['os-2']++;
            } else if (el['status_id'] === 20122243) {
              this.data['os-3']++;
            } else if (el['status_id'] === 20122246) {
              this.data['os-4']++;
            } else if (el['status_id'] === 20122249) {
              this.data['os-5']++;
            } else if (el['status_id'] === 20152585) {
              this.data['os-6']++;
            }
          });
          this.data['os-total'] = this.data['os-1'] + this.data['os-2'] + this.data['os-3'] + this.data['os-4'] + this.data['os-5'] + this.data['os-6'];

          arrGoal = this.getUnique(arrGoal);
          arrNoGoal = this.getUnique(arrNoGoal);

          for (let i = 0; i < arrGoal.length; i++) {
            let deleteEl = false;
            for (let j = 0; j < arrNoGoal.length; j++) {
              if (arrGoal[i] === arrNoGoal[j]) {
                arrGoal.splice(i, 1);
                deleteEl = true;
                break;
              }
            }
            if (deleteEl) {
              i--;
            }
          }

          /*let data1 = data;
          for (let i = 0; i < data1.length; i++) {
            let deleteEl = false;
            for (let j = 0; j < arrGoal.length; j++) {
              if (data1[i].id === arrGoal[j]) {
                data1.splice(i, 1);
                deleteEl = true;
                break;
              }
            }
            if (deleteEl) {
              i--;
            } else {
              for (let j = 0; j < arrNoGoal.length; j++) {
                if (data1[i].id === arrNoGoal[j]) {
                  data1.splice(i, 1);
                  deleteEl = true;
                  break;
                }
              }
              if (deleteEl) {
                i--;
              }
            }
          }
          console.log(data1);*/

          for (let i = 0; i < arrZamer.length; i++) {
            let j = i + 1;
            for (; j < arrZamer.length; j++) {
              if (arrZamer[i] === arrZamer[j]) {
                for (let k = 0; k < arrZamerCancel.length; k++) {
                  if (arrZamer[i] === arrZamerCancel[k]) {
                    arrZamerCancel.splice(k, 1);
                    break;
                  }
                }
                arrZamer.splice(j, 1);
                j--;
              }
            }
          }
          this.data['zamer'] = arrZamer.length;
          this.data['zamerCancel'] = arrZamerCancel.length;

          this.data['goal'] = arrGoal.length;
          this.data['nogoal'] = arrNoGoal.length;

          //Первые касания
          this.data['first'] = this.data['zamer'] + this.data['priem'] + this.data['office'] + this.data['consult'];

          //Отменённые первые касания
          this.data['firstCancel'] = this.data['zamerCancel'] + this.data['priemCancel'] + this.data['officeCancel'] + this.data['consultCancel'];

          //CV
          //Из заявки в замер
          let zamer = this.data['zamer'] - this.data['zamerCancel'];
          let priem = this.data['priem'] - this.data['priemCancel'];
          let office = this.data['office'] - this.data['officeCancel'];
          let consult = this.data['consult'] - this.data['consultCancel'];
          if (this.data['total'] === 0) {
            this.data['cv-1'] = 0;
            this.data['cv-2'] = 0;
            this.data['cv-3'] = 0;
            this.data['cv-4'] = 0;
            this.data['cv-total'] = 0;
          } else {
            this.data['cv-1'] = parseInt(zamer / this.data['total'] * 100);
            this.data['cv-2'] = parseInt(priem / this.data['total'] * 100);
            this.data['cv-3'] = parseInt(office / this.data['total'] * 100);
            this.data['cv-4'] = parseInt(consult / this.data['total'] * 100);
            this.data['cv-total'] = parseInt((zamer + priem + office + consult) / this.data['total'] * 100);
          }
          if (this.data['goal'] === 0) {
            this.data['cv2-1'] = 0;
            this.data['cv2-2'] = 0;
            this.data['cv2-3'] = 0;
            this.data['cv2-4'] = 0;
            this.data['cv2-total'] = 0;
          } else {
            this.data['cv2-1'] = parseInt(zamer / this.data['goal'] * 100);
            this.data['cv2-2'] = parseInt(priem / this.data['goal'] * 100);
            this.data['cv2-3'] = parseInt(office / this.data['goal'] * 100);
            this.data['cv2-4'] = parseInt(consult / this.data['goal'] * 100);
            this.data['cv2-total'] = parseInt((zamer + priem + office + consult) / this.data['goal'] * 100);
          }

          this.initGraphics();
        }
      },
      initGraphics() {
        //graphic1
        let other = this.data['total'] - (this.data['goal'] + this.data['nogoal']);
        this.graphic_1.series[0].data = [];
        if (this.data['goal']) {
          this.graphic_1.series[0].data.push({
            name: 'Целевые',
            value: this.data['goal'],
            itemStyle: {
              color: '#2da1f8'
            }
          });
        }
        if (this.data['nogoal']) {
          this.graphic_1.series[0].data.push({
            name: 'Нецелевые',
            value: this.data['nogoal'],
            itemStyle: {
              color: '#9d90e4'
            }
          });
        }
        if (other) {
          this.graphic_1.series[0].data.push({
            name: 'Неопределено',
            value: other,
            itemStyle: {
              color: '#40557d'
            }
          });
        }

        //graphic2
        this.graphic_2.xAxis = {
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            fontSize: 10,
            rotate: 45
          },
          data: ['1 касания', 'Замеры', 'Приёмки', 'Встречи в оф.', 'Конс. с дизайн.']
        };
        this.graphic_2.series = {
          name: '',
          type: 'bar',
          data: [{
            name: 'Первые касания',
            value: this.data['first'],
            itemStyle: {
              color: '#2da1f8'
            }
          }, {
            name: 'Замеры',
            value: this.data['zamer'],
            itemStyle: {
              color: '#9d90e4'
            }
          }, {
            name: 'Приёмки',
            value: this.data['priem'],
            itemStyle: {
              color: '#f8cf5d'
            }
          }, {
            name: 'Встречи в офисе',
            value: this.data['office'],
            itemStyle: {
              color: '#3eb934'
            }
          }, {
            name: 'Консультации с дизайнером',
            value: this.data['consult'],
            itemStyle: {
              color: '#40557d'
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
            rotate: 45
          },
          data: ['2 нед.-1 мес.', '1-2 мес.', '3-6 мес.', '6-9 мес.', '9-12 мес.', 'Более 12 мес.']
        };
        this.graphic_3.series = {
          name: '',
          type: 'bar',
          data: [{
            name: '2 недели - 1 месяц',
            value: this.data['os-1'],
            itemStyle: {
              color: '#2da1f8'
            }
          }, {
            name: '1 - 2 месяца',
            value: this.data['os-2'],
            itemStyle: {
              color: '#9d90e4'
            }
          }, {
            name: '3 - 6 месяцев',
            value: this.data['os-3'],
            itemStyle: {
              color: '#f8cf5d'
            }
          }, {
            name: '6 - 9 месяцев',
            value: this.data['os-4'],
            itemStyle: {
              color: '#3eb934'
            }
          }, {
            name: '9 - 12 месяцев',
            value: this.data['os-5'],
            itemStyle: {
              color: '#40557d'
            }
          }, {
            name: 'Более 12 месяцев',
            value: this.data['os-6'],
            itemStyle: {
              color: '#34bfa3'
            }
          }]
        };

        //graphic4
        this.graphic_4.xAxis = {
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            fontSize: 10,
            rotate: 45
          },
          data: ['В 1 кас.', 'В замер', 'В приёмку', 'Во встр. в оф.', 'В конс. дизайн.']
        };
        this.graphic_4.series = {
          name: '',
          type: 'bar',
          data: [{
            name: 'В первое касание',
            value: this.data['cv2-total'],
            itemStyle: {
              color: '#2da1f8'
            }
          }, {
            name: 'В замер',
            value: this.data['cv2-1'],
            itemStyle: {
              color: '#9d90e4'
            }
          }, {
            name: 'В приёмку',
            value: this.data['cv2-2'],
            itemStyle: {
              color: '#f8cf5d'
            }
          }, {
            name: 'Во встречу в офисе',
            value: this.data['cv2-3'],
            itemStyle: {
              color: '#3eb934'
            }
          }, {
            name: 'В консульт. дизайнеру',
            value: this.data['cv2-4'],
            itemStyle: {
              color: '#40557d'
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
