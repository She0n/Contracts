<template>
  <div>
    <div class="calendar u-mt-medium">
      <div class="fc-header">
        <h2 class="fc-header-title">Календарь</h2>
      </div>
      <div class="js-calendar u-mb-large fc fc-unthemed fc-ltr">
        <div class="fc-toolbar fc-header-toolbar">
          <div class="fc-button-group">
            <button type="button" class="fc-prev-button fc-button fc-state-default fc-corner-left" @click="subtractMonth">
              <span class="fc-icon fc-icon-left-single-arrow"></span>
            </button>
            <button type="button" class="fc-next-button fc-button fc-state-default fc-corner-right" @click="addMonth">
              <span class="fc-icon fc-icon-right-single-arrow"></span>
            </button>
          </div>
          <div class="fc-center">
            <h2 class="u-text-capitalize">{{ months[month - 1].var1 }} {{ year }}</h2>
          </div>
        </div>
        <div class="fc-view-container">
          <div class="fc-view fc-month-view fc-basic-view">
            <table>
              <thead class="fc-head">
                <tr class="fc-head-container fc-widget-header">
                  <th class="fc-day-header fc-widget-header" v-for="day in days"><span>{{ day.rus }}</span></th>
                </tr>
              </thead>
              <tbody class="fc-body">
                <tr class="fc-unthemed2" v-for="mainIndex in 6">
                  <td class="fc-day fc-widget-content" v-for="index in 7">
                    <div :data-index="index">
                      <div class="shedule-date-item">
                        <div class="shedule-date-item-inner" @click="dayClickHandler(mainIndex, index)">
                          <div :class="'shedule-date-item-placeholder ' + (!tableDays[mainIndex - 1][index - 1].inactive ? '' : 'disabled-date') + ' ' + (!tableDays[mainIndex - 1][index - 1].current ? '' : 'current-date')" v-html="tableDays[mainIndex - 1][index - 1].day"></div>
                          <div class="shedule-date-item-value" v-html="tableDays[mainIndex - 1][index - 1].value"></div>
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
  </div>
</template>

<script>
  import moment from 'moment';
  import dateMixin from '@/mixins/dateMixin.vue';
  export default {
    mixins: [dateMixin],
    props: ['parentDayClickHandler', 'parentRecalculateCalendar'],
    data() {
      return {
        tableDays: [],
        calendarShow: true
      }
    },
    created() {
      this.recalculateCalendar();
    },
    methods: {
      dayClickHandler(mainIndex, index) {
        this.parentDayClickHandler(this.tableDays[mainIndex - 1][index - 1].date, this.tableDays[mainIndex - 1][index - 1].dateDisplay);
      },
      addMonth() {
        this.dateContext = moment(this.dateContext).add(1, 'month');
        this.recalculateCalendar();
      },
      subtractMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
        this.recalculateCalendar();
      },
      getDaysInPastMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
        let days = this.daysInMonth;
        this.dateContext = moment(this.dateContext).add(1, 'month');
        return days;
      },
      recalculateCalendar() {
        let tableDays = [];
        let m = 6, n = 7;
        for (let i = 0; i < m; i++) {
          tableDays.push([]);
          for (let j = 0; j < n; j++) {
            tableDays[i].push('');
          }
        }
        let tableWeek = 0;

        let tableWeekDay = this.firstDayOfMonth - 2;
        let tableDay = this.getDaysInPastMonth();
        tableDays[tableWeek][tableWeekDay] = {
          day: tableDay,
          date: tableDay + '-' + this.pastMonth + '-' + this.pastMonthYear,
          dateDisplay: tableDay + ' ' + this.months[this.pastMonth - 1].var2 + ' ' + this.pastMonthYear,
          inactive: true,
          data: [],
          value: ''
        };
        let exit = false;
        do {
          tableWeekDay--;
          tableDay--;
          if (tableWeekDay > -1) {
            tableDays[tableWeek][tableWeekDay] = {
              day: tableDay,
              date: tableDay + '-' + this.pastMonth + '-' + this.pastMonthYear,
              dateDisplay: tableDay + ' ' + this.months[this.pastMonth - 1].var2 + ' ' + this.pastMonthYear,
              inactive: true,
              data: [],
              value: ''
            };
          } else {
            exit = true;
          }
        } while(!exit);

        tableWeekDay = this.firstDayOfMonth - 1;
        tableDay = 1;
        tableDays[tableWeek][tableWeekDay] = {
          day: tableDay,
          date: tableDay + '-' + this.month + '-' + this.year,
          dateDisplay: tableDay + ' ' + this.months[this.month - 1].var2 + ' ' + this.year,
          inactive: false,
          data: [],
          value: ''
        };
        exit = false;
        do {
          if (tableWeekDay + 1 === 7) {
            tableWeek++;
            tableWeekDay = 0;
          } else {
            tableWeekDay++;
          }
          tableDay++;
          if (tableDay <= this.daysInMonth) {
            tableDays[tableWeek][tableWeekDay] = {
              day: tableDay,
              date: tableDay + '-' + this.month + '-' + this.year,
              dateDisplay: tableDay + ' ' + this.months[this.month - 1].var2 + ' ' + this.year,
              inactive: false,
              current: this.currentDate === tableDay && this.initialMonth === this.month && this.initialYear === this.year,
              data: [],
              value: ''
            };
          } else {
            exit = true;
          }
        } while(!exit);

        if (tableWeekDay + 1 === 7) {
          if (tableWeek + 1 === 6) {
            this.tableDays = tableDays;
            return;
          }
        }
        tableDay = 1;
        tableDays[tableWeek][tableWeekDay] = {
          day: tableDay,
          date: tableDay + '-' + this.nextMonth + '-' + this.nextMonthYear,
          dateDisplay: tableDay + ' ' + this.months[this.nextMonth - 1].var2 + ' ' + this.nextMonthYear,
          inactive: true,
          data: [],
          value: ''
        };

        exit = false;
        do {
          if (tableWeekDay + 1 === 7) {
            if (tableWeek + 1 === 6) {
              if (this.parentRecalculateCalendar) {
                this.parentRecalculateCalendar(tableDays);
              }
              this.tableDays = tableDays;
              exit = true;
              return;
            }
            tableWeek++;
            tableWeekDay = 0;
          } else {
            tableWeekDay++;
          }
          tableDay++;
          tableDays[tableWeek][tableWeekDay] = {
            day: tableDay,
            date: tableDay + '-' + this.nextMonth + '-' + this.nextMonthYear,
            dateDisplay: tableDay + ' ' + this.months[this.nextMonth - 1].var2 + ' ' + this.nextMonthYear,
            inactive: true,
            data: [],
            value: ''
          };
        } while(!exit);
      },
      recalculateValues() {
        let tableDays = this.tableDays;
        if (this.parentRecalculateCalendar) {
          this.parentRecalculateCalendar(tableDays);
        }
        this.tableDays = tableDays;
      }
    }
  }
</script>
