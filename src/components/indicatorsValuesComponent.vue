<template>
  <div>
    <div class="wrapper-block values-block u-mt-medium">
      <div class="caption-block">
        <div class="left-block">
          <p class="name">{{ first_name }} {{ last_name }} - </p>
          <p class="description">Должность: {{ profession }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  const pageData = { title: 'Список записей', metaTitle: 'Список записей' };
  export default {
    mixins: [Component, commonMixin],
    data() {
      return {
        pageData: pageData,
        first_name: '',
        last_name: '',
        profession: '',
        day: ''
      }
    },
    async created() {
      this.$store.dispatch('setComponentReady', false);
      await this.initValues();
    },
    mounted() {
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      async initValues() {
        let user_id = this.$route.query['user_id'];
        let profession = this.$route.query['profession'];
        let day = this.$route.query['day'];
        const resp = await axios.post('/getUser', { id: user_id });
        if (resp.data) {
          this.first_name = resp.data.first_name;
          this.last_name = resp.data.last_name;
        }
        await this.getProfessions();
        this.profession = this.professions[profession].title;
      }
    }
  }
</script>
