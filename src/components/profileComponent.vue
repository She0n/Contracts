<template>
  <div>
    <div class="profile u-mt-medium">
      <div class="left-block">
        <div class="user-block">
          <img src="/static/images/user.svg" width="100" height="100" class="avatar">
          <p class="username">Новый пользователь</p>
        </div>
      </div>
      <div class="right-block">
        <div class="head-block">
          <router-link :to="basePath + query" class="profile-title" v-if="user.id !== ''">Профиль</router-link>
          <div class="profile-title" v-else>Профиль</div>
          <router-link :to="basePath + '/edit' + query" tag="div" class="config-button-block" v-if="allowEditUser(user)">
            <button type="button" class="config-button"><i class="fa fa-cog"></i></button>
          </router-link>
        </div>
        <div class="center-block">
          <div v-if="mode === 'general'">
            <div class="profile-data">
              <div class="c-field u-mb-small">
                <label class="c-field__label">Фамилия:</label>
                <div class="c-field__value" v-html="user.last_name"></div>
              </div>
              <div class="c-field u-mb-small">
                <label class="c-field__label">Имя:</label>
                <div class="c-field__value" v-html="user.first_name"></div>
              </div>
              <div class="c-field u-mb-small">
                <label class="c-field__label">Отчество:</label>
                <div class="c-field__value" v-html="user.patronymic"></div>
              </div>
              <div class="c-field u-mb-small">
                <label class="c-field__label" v-html="(user.professions.length < 2 ? 'Должность' : 'Должности') + ':'"></label>
                <div class="c-field__value" v-html="renderUserProfessions(user.professions)"></div>
              </div>
            </div>
          </div>
          <div v-if="mode === 'edit'">
            <div class="profile-title">Данные для входа</div>
            <div class="c-field u-mb-small">
              <label for="username" class="c-field__label u-text-right">Логин: </label>
              <input type="text" name="username" id="username" class="c-input" placeholder="Введите логин" v-model="edit_user.username">
            </div>
            <div class="c-field u-mb-small">
              <label for="password" class="c-field__label u-text-right">Пароль: </label>
              <input type="password" name="password" id="password" class="c-input" placeholder="Введите пароль" v-model="edit_user.password">
            </div>
            <div class="c-field u-mb-small">
              <label for="password_confirm" class="c-field__label u-text-right">Повторите пароль: </label>
              <input type="password" name="password_confirm" id="password_confirm" class="c-input" placeholder="Повторите пароль" v-model="password_confirm">
            </div>
            <div class="profile-title">Персональные данные</div>
            <div class="c-field u-mb-small">
              <label for="last_name" class="c-field__label u-text-right">Фамилия: </label>
              <input type="text" name="last_name" id="last_name" :disabled="allowModifyPersonalData(edit_user)" :data-a="allowModifyPersonalData(edit_user)" class="c-input" placeholder="Введите фамилию" v-model="edit_user.last_name">
            </div>
            <div class="c-field u-mb-small">
              <label for="first_name" class="c-field__label u-text-right">Имя: </label>
              <input type="text" name="first_name" id="first_name" :disabled="allowModifyPersonalData(edit_user)" class="c-input" placeholder="Введите имя" v-model="edit_user.first_name">
            </div>
            <div class="c-field u-mb-small">
              <label for="patronymic" class="c-field__label u-text-right">Отчество: </label>
              <input type="text" name="patronymic" id="patronymic" :disabled="allowModifyPersonalData(edit_user)" class="c-input" placeholder="Введите отчество" v-model="edit_user.patronymic">
            </div>
            <div class="c-field u-mb-small" v-if="professionsLength">
              <label for="professions" class="c-field__label u-text-right">Должность(и): </label>
              <nselect2 id="professions" :class="{ disabledProfessions: allowModifyPersonalData(edit_user) }" :options="professions" v-model="edit_user.professions" :nullable="true" :placeholderVal="'Не выбран'" :multiple="true"></nselect2>
            </div>
            <button type="button" class="c-btn c-btn--success" v-on:click="updateUser">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  const pageData = { title: 'Профиль', metaTitle : 'Профиль' };
  import nselect2 from '@/components/nselect2.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  const profileRoutes = ['/profile', '/profile/edit'];
  export default {
    mixins: [Component, commonMixin, usersMixin],
    data() {
      return {
        user_id: 0,
        pageData: pageData,
        user: this.getClearUser(),
        edit_user: this.getClearUser(),
        password_confirm: '',
        basePath: '',
        query: '',
        mode: 'general'
      }
    },
    watch: {
      '$route'() {
        this.recalculateContent();
      },
      user_id() {
        this.getUser();
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      await this.init();
      this.recalculateContent();
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      async init() {
        await this.getProfessions();
        this.user_id = +this.$route.query.user_id;
        if (window.location.pathname.indexOf('/users') !== -1) {
          if (this.user_id && (this.user_id === this.$auth.user().id)) {
            this.$router.replace('/profile');
          }
        }
      },
      recalculateContent() {
        let path = window.location.pathname;
        this.basePath = path.replace('/edit', '');
        let query = this.$route.fullPath.split('?')[1];
        if (query) {
          this.query = '?' + query;
        }
        if (path.indexOf('edit') !== -1) {
          this.mode = 'edit';
        } else {
          this.mode = 'general';
        }
        if(this.isSelfRoute()) {
          this.user_id = this.$auth.user().id;
          return;
        }
        this.user_id = window.location.getParameter('user_id');
      },
      isSelfRoute() {
        return profileRoutes.indexOf(window.location.pathname) !== -1;
      },
      getClearUser() {
        return {
          id: '',
          username: '',
          password: '',
          first_name: '',
          last_name: '',
          patronymic: '',
          professions: []
        };
      },
      async getUser() {
        let path = window.location.pathname;
        if (!(path.indexOf('users') !== -1)) {
          this.user = JSON.parse(JSON.stringify(this.$auth.user()));
          this.user.professions = JSON.parse(this.user.professions);
          this.user.password = '';
          this.edit_user = JSON.parse(JSON.stringify(this.$auth.user()));
          this.edit_user.professions = JSON.parse(this.edit_user.professions);
          this.edit_user.password = '';
          return;
        }
        if (this.$route.query.user_id) {
          const resp = await axios.post('/getUser', {id: this.$route.query.user_id});
          if (resp.data) {
            this.user = JSON.parse(JSON.stringify(resp.data));
            this.user.professions = JSON.parse(this.user.professions);
            this.user.password = '';
            this.edit_user = JSON.parse(JSON.stringify(resp.data));
            this.edit_user.professions = JSON.parse(this.edit_user.professions);
            this.edit_user.password = '';
          }
        }
      },
      async updateUser() {
        if (this.edit_user.password !== this.password_confirm) {
          toastr.error('Пароли не совпадают');
          return false;
        }
        const resp = await axios.post('/updateUser', this.edit_user);
        if (resp.data) {
          if (resp.data.result) {
            toastr.success('Сохранено');
            setTimeout(() => {
              this.$router.push('/users');
            }, 1000);
          } else {
            toastr.error(resp.data.display);
            return false;
          }
        }
      }
    },
    components: {
      nselect2
    }
  }
</script>
