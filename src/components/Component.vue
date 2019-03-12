<script>
  export default {
    data() {
      return {
        pageData: {
          title: ''
        },
      };
    },
    watch: {
      'pageData.title'() {
        this.page();
      }
    },
    beforeMount() {
      this.page();
    },
    methods: {
      page() {
        this.$store.dispatch('setPageData', this.pageData);
        document.title = this.pageData.title ? this.pageData.title : this.getDefaultPageData().title;
      },
      getDefaultPageData() {
        return {
          title: 'Сервис статистики'
        }
      }
    }
  }
</script>
