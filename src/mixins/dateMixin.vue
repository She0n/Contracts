<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        today: moment(),
        dateContext: moment(),
        months: [
          { var1: 'Январь', var2: 'января' },
          { var1: 'Февраль', var2: 'февраля' },
          { var1: 'Март', var2: 'марта' },
          { var1: 'Апрель', var2: 'апреля' },
          { var1: 'Май', var2: 'мая' },
          { var1: 'Июнь', var2: 'июня' },
          { var1: 'Июль', var2: 'июля' },
          { var1: 'Август', var2: 'августа' },
          { var1: 'Сентябрь', var2: 'сентября' },
          { var1: 'Октябрь', var2: 'октября' },
          { var1: 'Ноябрь', var2: 'ноября' },
          { var1: 'Декабрь', var2: 'декабря' }
        ],
        days: [
          { rus: 'Понедельник', eng: 'Monday' },
          { rus: 'Вторник', eng: 'Tuesday' },
          { rus: 'Среда', eng: 'Wednesday' },
          { rus: 'Четверг', eng: 'Thursday' },
          { rus: 'Пятница', eng: 'Friday' },
          { rus: 'Суббота', eng: 'Saturday' },
          { rus: 'Воскресенье', eng: 'Sunday' }
        ]
      }
    },
    computed: {
      year: function() {
        return this.dateContext.format('Y');
      },
      pastMonthYear: function() {
        if (this.month === '1') {
          return this.year - 1;
        } else {
          return this.year;
        }
      },
      nextMonthYear: function() {
        if (this.month === '12') {
          return +this.year + 1;
        } else {
          return this.year;
        }
      },
      month: function() {
        return this.dateContext.format('M');
      },
      pastMonth: function() {
        if (this.month === '1') {
          return 12;
        } else {
          return this.month - 1;
        }
      },
      nextMonth: function() {
        if (this.month === '12') {
          return 1;
        } else {
          return +this.month + 1;
        }
      },
      daysInMonth: function() {
        return this.dateContext.daysInMonth();
      },
      currentDate: function() {
        return this.dateContext.get('date');
      },
      firstDayOfMonth: function() {
        let firstDay = moment(this.dateContext).subtract((this.currentDate - 1), 'days');
        return firstDay.weekday();
      },
      minusOneWeek: function() {
        return moment(this.dateContext).subtract(1, 'week').format('YYYY-MM-DD');
      },
      initialDate: function() {
        return this.today.get('date');
      },
      initialMonth: function() {
        return this.today.format('M');
      },
      initialYear: function() {
        return this.today.format('Y');
      },
      currentWeekday: function() {
        return this.days[this.today.weekday() - 1].eng;
      },
      currentWeekdayRus: function() {
        return this.days[this.today.weekday() - 1].rus;
      },
      currentFullDate: function() {
        return this.currentDate + ' ' + this.months[this.month - 1].var2 + ' ' + this.year;
      },
      currentFullDateDigit: function() {
        return this.currentDate + '-' + this.month + '-' + this.year;
      },
      currentFullDateInverseDigit: function() {
        return this.year + '-' + this.month + '-' + this.currentDate;
      },
      currentFullDateInverseDigitWithZero: function() {
        let month = this.month;
        if (month < 10) {
          month = '0' + month;
        }

        let date = this.currentDate;
        if (date < 10) {
          date = '0' + date;
        }

        return this.year + '-' + month + '-' + date;
      },
      currentSlimDateWithZero: function () {
        return this.today.format('DD.MM.YY');
      }
    },
    methods: {
      getMilliseconds(date) {
        return moment(date).format('X');
      },
      addOneDay(date) {
        return moment(date).add(1, 'days');
      }
    }
  }
</script>
