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
        <div class="wrapper-blocks amo-sales">
          <div class="stats-wrapper">
            <div class="stats-wrapper-left">
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Встречи</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Всего первичных встреч</p>
                  <span class="u-text-small u-text-mute">{{ data['firstMeet'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Первичные встречи в офисе</p>
                  <span class="u-text-small u-text-mute">{{ data['firstMeetOffice'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Первичные встречи на объекте</p>
                  <span class="u-text-small u-text-mute">{{ data['firstMeetObject'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Консультации с дизайнером</p>
                  <span class="u-text-small u-text-mute">{{ data['consult'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Всего повторных встреч</p>
                  <span class="u-text-small u-text-mute">{{ data['repeatMeet'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Повторные встречи в офисе</p>
                  <span class="u-text-small u-text-mute">{{ data['repeatMeetOffice'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Повторные встречи на объекте</p>
                  <span class="u-text-small u-text-mute">{{ data['repeatMeetObject'] }}</span>
                </div>
              </div>
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Сумма и маржа</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Сумма договоров</p>
                  <span class="u-text-small u-text-mute">{{ data['sum'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Маржа</p>
                  <span class="u-text-small u-text-mute">{{ data['margin'] }}</span>
                </div>
              </div>
            </div>
            <div class="stats-wrapper-right">
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Договоры</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Подписаны</p>
                  <span class="u-text-small u-text-mute">{{ data['contract'] }}</span>
                </div>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Не подписаны</p>
                  <span class="u-text-small u-text-mute" v-if="data['contractCancel'] === 0">{{ data['contractCancel'] }}</span>
                  <span class="u-text-small red" v-else>{{ data['contractCancel'] }}</span>
                </div>
              </div>
              <div class="c-card u-p-medium u-mb-small stats-block u-mt-small">
                <h4 class="u-h5">Конверсия</h4>
                <div class="o-line u-mb-xsmall">
                  <p class="u-text-small">Из встречи в договор</p>
                  <span class="u-text-small u-text-mute">{{ data['cv'] }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="graphics-wrapper">
            <div class="c-card wrapper-block amo-stats-block u-mt-small">
              <div class="c-card__header c-card__header--transparent o-line">
                <h5 class="c-card__title">Графики</h5>
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
      async showDeals(before, after) {
        let before_ms = this.getMilliseconds(before);
        let after_ms = this.getMilliseconds(after);

        let resp = await axios.post('/showNotes', { date: before });
        this.$set(this.data, 'firstMeet', 0);
        this.$set(this.data, 'firstMeetOffice', 0);
        this.$set(this.data, 'firstMeetObject', 0);
        this.$set(this.data, 'consult', 0);
        this.$set(this.data, 'repeatMeet', 0);
        this.$set(this.data, 'repeatMeetOffice', 0);
        this.$set(this.data, 'repeatMeetObject', 0);
        this.$set(this.data, 'contract', 0);
        this.$set(this.data, 'contractCancel', 0);
        this.$set(this.data, 'sum', 0);
        this.$set(this.data, 'margin', 0);
        this.$set(this.data, 'cv', 0);
        let arrProject = [];
        let arrConsult = [];
        let arrConsultCancel = [];
        if (resp.data) {
          resp.data.forEach((el) => {
            if (el.params && el.params['STATUS_OLD']) {
              //Проект готов
              if (el.params['STATUS_OLD'] === '20035582') {
                if (el['created_at'] > before_ms && el['created_at'] < after_ms) {
                  arrProject.push(el['element_id']);
                }
              }
              //Консультации с дизайнером
              if (el.params['STATUS_NEW'] === '21970669') {
                if (el['created_at'] > before_ms && el['created_at'] < after_ms) {
                  arrConsult.push(el['element_id']);
                }
              }

              //Отменённые консультации
              if (el.params['STATUS_NEW'] === '21970672') {
                arrConsultCancel.push(el['element_id']);
              }
            }
          });
        }
        arrProject = this.getUnique(arrProject);
        arrConsultCancel.forEach((el) => {
          for (let i = 0; i < arrConsult.length; i++) {
            if (arrConsult[i] === el) {
              arrConsult.splice(i, 1);
            }
          }
        });
        this.data['consult'] = arrConsult.length;

        let resp2 = await axios.post('/showDeals', { id: arrProject });
        let arrFirstMeetOffice = [];
        let arrFirstMeetObject = [];
        if (resp2.data) {
          resp2.data.forEach((el) => {
            let meet = false;
            //Проведённые встречи
            if (Array.isArray(el['custom_fields'])) {
              el['custom_fields'].forEach((elem) => {
                if (elem.name === 'Встреча проведена') {
                  if (elem.values[0].value === 'Да') {
                    meet = true;
                  }
                }
              });
              el['custom_fields'].forEach((elem) => {
                if (elem.name === 'Где проходит встреча') {
                  if (meet) {
                    this.data['firstMeet']++;
                    if (elem.values[0].value === 'В офисе') {
                      this.data['firstMeetOffice']++;
                      arrFirstMeetOffice.push(el.id);
                    } else if (elem.values[0].value === 'На объекте') {
                      this.data['firstMeetObject']++;
                      arrFirstMeetObject.push(el.id);
                    }
                  }
                }
              });
            }
          });
        }

        if (resp.data) {
          resp.data.forEach((el) => {
            if (el.params && el.params['STATUS_OLD']) {
              //Повторные встречи
              if (el.params['STATUS_OLD'] === '21970822' && el.params['STATUS_NEW'] !== '21811594') {
                arrFirstMeetOffice.forEach((elem) => {
                  if (el['element_id'] === elem) {
                    this.data['repeatMeetOffice']++;
                  }
                });
                arrFirstMeetObject.forEach((elem) => {
                  if (el['element_id'] === elem) {
                    this.data['repeatMeetObject']++;
                  }
                });
              }
            }
          });
        }
        this.data['repeatMeet'] = this.data['repeatMeetOffice'] + this.data['repeatMeetObject'];
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
