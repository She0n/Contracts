<template>
  <div class="settings">
    <div class="block">
      <h2 class="title">Основные настройки</h2>
      <div class="hr-line"></div>
      <div class="input-block">
        <label for="title" class="c-field__label">Название сайта:</label>
        <input type="text" name="title" v-model="ws.title" id="title" class="c-input" placeholder="Введите название сайта">
      </div>
      <div class="input-block">
        <label for="keywords" class="c-field__label">Ключевые слова:</label>
        <input type="text" name="keywords" v-model="ws.keywords" id="keywords" class="c-input" placeholder="Введите ключевые слова">
      </div>
      <div class="input-block">
        <label for="description" class="c-field__label">Описание сайта:</label>
        <input type="text" name="description" v-model="ws.description" id="description" class="c-input" placeholder="Введите описание сайта">
      </div>
    </div>
    <div class="block">
      <h2 class="title">Контактные данные</h2>
      <div class="hr-line"></div>
      <div class="input-block">
        <label for="phone" class="c-field__label">Телефон:</label>
        <input type="text" name="phone" v-model="ws.phone" id="phone" class="c-input" placeholder="Введите телефон">
      </div>
      <div class="input-block">
        <label for="email" class="c-field__label">Почта:</label>
        <input type="text" name="email" v-model="ws.email" id="email" class="c-input" placeholder="Введите почту">
      </div>
      <div class="input-block">
        <label for="address" class="c-field__label">Адрес:</label>
        <input type="text" name="address" v-model="ws.address" id="address" class="c-input" placeholder="Введите адрес">
      </div>
      <button type="button" class="c-btn c-btn--info" v-on:click="saveConfigs">Сохранить</button>
    </div>
    <div class="block">
      <h2 class="title">Интеграционные настройки</h2>
      <div class="hr-line"></div>
      <div class="input-block">
        <label for="email_order" class="c-field__label">Почта для заявок:</label>
        <input type="text" name="email_order" v-model="ws.email_order" id="email_order" class="c-input" placeholder="Введите почту для заявок">
      </div>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  const pageData = { title: 'Главная', metaTitle : 'Главная'};
  export default {
    mixins: [Component],
    data() {
      return {
        pageData: pageData,
        users: [],
        ws: {
          title: '',
          keywords: '',
          description: '',
          phone: '',
          email: '',
          address: '',
          email_order: ''
        }
      };
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      this.getConfigs();
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      async saveConfigs() {
        const resp = await axios.post('/saveConfigs', this.ws);
        if(resp.data) {
          if(resp.data.result) {
            console.log('Сохранено!');
          }
        }
      },

      async getConfigs() {
        const resp = await axios.post('/getConfigs');
        if (resp.data) {
          this.ws = resp.data;
        }
      }
    }
  }
</script>
