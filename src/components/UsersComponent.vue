<template>
  <div>
    <div class="table-block u-mt-medium">
      <div class="table-block-inner">
        <table id="userstable" class="c-table">
          <caption class="c-table__title">
            <div class="c-field search-input">
              <input type="text" placeholder="Поиск..." v-model="q" class="c-input" value="">
            </div>
            <span class="u-text-xsmall u-text-mute subtitle">Должности:</span>
            <nselect2 id="professions-search" :options="professions" v-model="selectProfs" :nullable="true" :placeholderVal="'Все'" :multiple="true"></nselect2>
            <router-link to="/users/profile/edit" class="c-btn c-btn--success create u-text-right" v-if="allowCreateUser()">Создать нового</router-link>
          </caption>
          <thead class="c-table__head c-table__head--slim">
          <tr class="c-table__row">
            <th class="c-table__cell c-table__cell--head">№</th>
            <th class="c-table__cell c-table__cell--head">Имя</th>
            <th class="c-table__cell c-table__cell--head u-text-right">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr class="c-table__row" v-if="!total">
            <td class="c-table__cell" colspan="15">
              <div v-html="q ? 'Нет пользователей соответствующих вашему запросу' : 'В системе пока нет пользователей'"></div>
            </td>
          </tr>
          <tr class="c-table__row" v-for="(user, key) in users">
            <td class="c-table__cell" v-html="key + 1"></td>
            <td class="c-table__cell user-link">
              <router-link :to="'/users/profile?user_id=' + user.id">
                <div v-html="renderUserName(user)"></div>
                <small class="u-text-xsmall u-text-mute" v-html="renderUserProfessions(user.professions)"></small>
              </router-link>
            </td>
            <td class="c-table__cell u-text-right"><button type="button" class="delete-button" title="Удалить" v-if="allowDropUser(user)" v-on:click="deleteUser(user.id, key)"><i class="far fa-trash-alt u-text-mute"></i></button></td>
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
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  const pageData = { title: 'Пользователи', metaTitle: 'Пользователи' };
  import nselect2 from '@/components/nselect2.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  export default {
    props: ['usertypes'],
    mixins: [Component, commonMixin, usersMixin],
    data() {
      return {
        pageData: pageData,
        users: [],
        total: 0,
        perPage: 0,
        q: '',
        p: 1,
        loading: false,
        selectProfs: []
      };
    },
    watch: {
      q() {
        this.p = 1;
        this.getUsers();
      },
      selectProfs() {
        this.p = 1;
        this.getUsers();
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      this.getUsers();
      this.getProfessions();
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      async getUsers() {
        const resp = await axios.post('/getUsers', { q: this.q, p: this.p, professions: this.selectProfs });
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
        const resp = await axios.post('/getUsers', { q: this.q, p: this.p, professions: this.selectProfs });
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
      async deleteUser(id, key) {
        const resp = await axios.post('/deleteUser', {id: id});
        if (resp.data) {
          if(resp.data.result) {
            toastr.success('Удалено');
            this.users.splice(key, 1);
          }
        }
      }
    },
    components: {
      nselect2
    }
  }
</script>
