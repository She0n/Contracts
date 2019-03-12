<template>
  <div>
    <div class="admin-block u-mt-medium" v-if="mode === 'admin'">
      <indicatorsChartsComponent></indicatorsChartsComponent>
    </div>
    <div class="user-block" v-if="mode === 'user'">
      <div class="c-toolbar u-mb-medium">
        <ul class="c-tabs__list nav nav-tabs">
          <li><span v-for="(item, index) in plan" :class="'c-tabs__link u-text-small ' + (tabActive === (index + 1) + 'tab' ? 'active' : '')" @click="switchTab(index, item.name)">{{ item.name }}</span></li>
        </ul>
      </div>
      <div class="user-inner-block">
        <div v-for="(item, index) in plan" :class="'content-block u-mt-medium tab ' + (closeTab ? 'closeTab' : '')" v-if="tabActive === (index + 1) + 'tab'">
          <div class="caption-block">
            <div class="left-block">
              <p class="plan">Выполнение плана: <span :class="total < item.count ? 'red' : 'green'">{{ total }}/{{ item.count }}</span></p>
              <p class="description">Для редактирования значения нажмите на него</p>
            </div>
            <div class="right-block">
              <button type="button" class="c-btn c-btn--success create-button" @click="addValue()">Новая запись</button>
            </div>
          </div>
          <table id="indicatorstable" class="c-table">
            <thead class="c-table__head c-table__head--slim">
              <tr class="c-table__row">
                <th class="c-table__cell c-table__cell--head">№</th>
                <th class="c-table__cell c-table__cell--head">{{ item.col1 }}</th>
                <th class="c-table__cell c-table__cell--head">Комментарий</th>
                <th class="c-table__cell c-table__cell--head">Время</th>
                <th class="c-table__cell c-table__cell--head u-text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr class="c-table__row" v-if="!total">
                <td class="c-table__cell" colspan="15">
                  <div>Нет записей</div>
                </td>
              </tr>
              <tr class="c-table__row" v-for="(value, index) in displayValues">
                <td class="c-table__cell" v-html="index + 1"></td>
                <td class="c-table__cell" @mouseover="updateMouseMove('col1', index)" @mouseout="updateMouseMove('', '')"><input type="text" :ref="'col1-' + index" class="c-input" :placeholder="item.col1" v-if="value.col1.input" v-model="value.col1.value" @keyup.enter="value.newRow ? saveNewValue(index, item.name) : saveValue()"><span v-else>{{ value.col1.value }}</span></td>
                <td class="c-table__cell" @mouseover="updateMouseMove('comment', index)" @mouseout="updateMouseMove('', '')"><input type="text" :ref="'comment-' + index" class="c-input" placeholder="Комментарий" v-if="value.comment.input" v-model="value.comment.value" @keyup.enter="value.newRow ? saveNewValue(index, item.name) : saveValue()"><span v-else>{{ value.comment.value }}</span></td>
                <td class="c-table__cell">{{ value.created_at }}</td>
                <td class="c-table__cell u-text-right">
                  <button type="button" class="submit-button" title="Сохранить" @click="saveNewValue(index, item.name)" v-if="value.newRow">
                    <i class="fas fa-check"></i>
                  </button>
                  <button type="button" class="delete-button" title="Удалить" @click="deleteNewValue(index)" v-if="value.newRow">
                    <i class="far fa-trash-alt u-text-mute"></i>
                  </button>
                  <button type="button" class="delete-button" title="Удалить" @click="deleteValue(value.row_id, index)" v-if="!value.newRow">
                    <i class="far fa-trash-alt u-text-mute"></i>
                  </button>
                  <!--<div class="dropdown c-dropdown" v-if="!value.newRow">
                    <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle clear-btn">
                      <i aria-hidden="true" class="fa fa-ellipsis-v trigger table-drop-icon u-text-mute"></i>
                    </button>
                    <ul class="dropdown-menu c-dropdown__menu">
                      <li class="c-dropdown__item dropdown-item trigger" @click="deleteValue(value.row_id, index)">удалить</li>
                    </ul>
                  </div>-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  import indicatorsChartsComponent from '@/components/indicatorsChartsComponent.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import dateMixin from '@/mixins/dateMixin.vue';
  const pageData = { title: 'Показатели', metaTitle : 'Показатели' };
  export default {
    mixins: [Component, usersMixin, dateMixin],
    data() {
      return {
        mode: this.initMode(),
        tabActive: '1tab',
        closeTab: false,
        fullDate: '',
        profession: '',
        plan: [],
        total: 0,
        values: [],
        displayValues: [],
        newRow: false,
        mouseMove: {
          cell: '',
          index: ''
        },
        enterCell: {
          cell: '',
          index: ''
        }
      };
    },
    async created() {
      this.$store.dispatch('setComponentReady', false);
      this.fullDate = this.currentFullDate;
      this.profession = JSON.parse(this.$auth.user().professions)[0];
      await this.getPlan();
      if (this.plan[0]) {
        await this.initValues(this.plan[0].name);
      }
      window.addEventListener('mousedown', () => {
        this.updateMouseDown();
      });
    },
    mounted() {
      this.$store.dispatch('setComponentReady', true);
    },
    watch: {
      fullDate() {
        if (this.mode === 'user') {
          this.pageData = {
            title: 'Показатели - ' + this.currentWeekdayRus.toLowerCase() + ', ' + this.fullDate,
            metaTitle: 'Показатели - ' + this.currentWeekdayRus.toLowerCase() + ', ' + this.fullDate
          };
        } else if (this.mode === 'admin') {
          this.pageData = {
            title: 'Показатели',
            metaTitle: 'Показатели'
          };
        }
      }
    },
    methods: {
      updateMouseMove(cell, index) {
        this.mouseMove = {
          cell: cell,
          index: index
        };
      },
      async updateMouseDown() {
        if (this.enterCell.index === this.mouseMove.index && this.enterCell.cell === this.mouseMove.cell) {
          return false;
        }
        if (this.displayValues[this.enterCell.index]) {
          if (!this.displayValues[this.enterCell.index].newRow) {
            this.displayValues[this.enterCell.index][this.enterCell.cell].input = false;
            let submitArr = {
              row_id: this.displayValues[this.enterCell.index].row_id,
              col1: this.displayValues[this.enterCell.index].col1.value,
              comment: this.displayValues[this.enterCell.index].comment.value
            };
            const resp = await axios.post('/saveValue', submitArr);
            if (resp.data) {
              if (resp.data.result) {
                this.values.forEach((el) => {
                  if (el.row_id === this.displayValues[this.enterCell.index].row_id) {
                    el.col1 = this.displayValues[this.enterCell.index].col1.value;
                    el.comment = this.displayValues[this.enterCell.index].comment.value;
                  }
                });
              }
            }
            this.enterCell = {
              cell: this.mouseMove.cell,
              index: this.mouseMove.index
            };
          }
        }
        if (this.displayValues[this.mouseMove.index]) {
          this.displayValues[this.mouseMove.index][this.mouseMove.cell].input = true;
          setTimeout(() => {
            this.$refs[this.mouseMove.cell + '-' + this.mouseMove.index][0].focus();
          }, 0);
          this.enterCell = {
            cell: this.mouseMove.cell,
            index: this.mouseMove.index
          };
        }
      },
      async saveValue() {
        this.displayValues[this.enterCell.index][this.enterCell.cell].input = false;
        let submitArr = {
          row_id: this.displayValues[this.enterCell.index].row_id,
          col1: this.displayValues[this.enterCell.index].col1.value,
          comment: this.displayValues[this.enterCell.index].comment.value
        };
        const resp = await axios.post('/saveValue', submitArr);
        if (resp.data) {
          if (resp.data.result) {
            this.values.forEach((el) => {
              if (el.row_id === this.displayValues[this.enterCell.index].row_id) {
                el.col1 = this.displayValues[this.enterCell.index].col1.value;
                el.comment = this.displayValues[this.enterCell.index].comment.value;
              }
            });
          }
        }
        this.enterCell = {
          cell: '',
          index: ''
        };
      },
      async getPlan() {
        const resp = await axios.post('/getUserPlan', { profession: this.profession, weekday: this.currentWeekday, day: this.currentFullDateDigit });
        if (resp.data) {
          if (resp.data.plans[0]) {
            this.plan = JSON.parse(resp.data.plans[0].plan);
          }
          if (resp.data.planssd[0]) {
            let json_plan = JSON.parse(resp.data.planssd[0].plan);
            json_plan.forEach((el) => {
              let searched = false;
              this.plan.forEach((elem) => {
                if (el.name === elem.name) {
                  elem.count = el.count;
                  if (el.col1) {
                    elem.col1 = el.col1;
                  }
                  searched = true;
                }
              });
              if (!searched) {
                this.plan.push({
                  name: el.name,
                  count: el.count,
                  col1: el.col1
                });
              }
            });
          }
        }
      },
      switchTab(index, plan_name) {
        if (this.tabActive === ((index + 1) + 'tab')) {
          return false;
        }
        this.closeTab = true;
        setTimeout(() => {
          this.closeTab = false;
          this.showValues(plan_name);
          this.tabActive = (index + 1) + 'tab';
        }, 300);
      },
      async initValues(plan_name) {
        let names = [];
        this.plan.forEach((el) => {
          names.push(el.name);
        });
        const resp = await axios.post('/getUserValues', { plan_name: names, profession: this.profession, date: this.currentFullDateInverseDigit });
        if (resp.data) {
          if (resp.data.values) {
            this.values = resp.data.values;
            this.showValues(plan_name);
          } else {
            toastr.error(resp.data.display);
            return false;
          }
        }
      },
      showValues(plan_name) {
        this.displayValues = [];
        this.total = 0;
        this.newRow = false;
        this.values.forEach((el) => {
          if (el.plan_name === plan_name) {
            this.displayValues.push({
              row_id: el.row_id,
              col1: {
                value: el.col1,
                input: false
              },
              comment: {
                value: el.comment,
                input: false
              },
              created_at: el.created_at.split(' ')[1],
              newRow: false
            });
            this.total++;
          }
        });
      },
      addValue() {
        if (!this.newRow) {
          this.displayValues.unshift({
            row_id: '',
            col1: {
              value: '',
              input: true
            },
            comment: {
              value: '',
              input: true
            },
            created_at: '',
            newRow: true
          });
          this.total++;
          this.newRow = true;
          this.$nextTick(() => {
            this.$refs['col1-0'][0].focus();
          });
        }
      },
      async deleteValue(row_id, index) {
        const resp = await axios.post('/deleteValue', { row_id: row_id });
        if (resp.data) {
          if (resp.data.result) {
            toastr.success('Удалено');
            this.displayValues.splice(index, 1);
            this.values.forEach((el) => {
              if (el.row_id === row_id) {
                this.values.splice(this.values.indexOf(el), 1);
              }
            });
          }
        }
      },
      async saveNewValue(index, name) {
        let submitArr = {
          col1: this.displayValues[index].col1.value,
          profession: this.profession,
          plan_name: name,
          comment: this.displayValues[index].comment.value
        };
        const resp = await axios.post('/saveValue', submitArr);
        if (resp.data) {
          if (resp.data.result) {
            toastr.success('Сохранено');
            this.newRow = false;
            let displayValues = this.displayValues[index];
            displayValues.row_id = resp.data.id;
            displayValues.col1.input = false;
            displayValues.comment.input = false;
            displayValues.newRow = false;
            displayValues.created_at = resp.data.created_at.split(' ')[1];
            this.displayValues[index] = displayValues;
            this.values.unshift({
              col1: this.displayValues[index].col1.value,
              comment: this.displayValues[index].comment.value,
              created_at: resp.data.created_at,
              plan_name: name,
              profession: this.profession,
              row_id: resp.data.id,
              user_id: this.$auth.user().id
            });
          } else {
            toastr.error(resp.data.display);
            return false;
          }
        }
      },
      deleteNewValue(index) {
        this.displayValues.splice(index, 1);
        this.total--;
        this.newRow = false;
      }
    },
    components: {
      indicatorsChartsComponent
    }
  }
</script>
