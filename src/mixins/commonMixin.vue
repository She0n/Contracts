<script>
  export default {
    data() {
      return {
        professions: [],
        professionsLength: 0
      }
    },
    methods: {
      renderUserProfessions(profs) {
        let a = Array.isArray(profs) ? profs : [];
        if(!a.length) { return ''; }
        let st = '';
        let comma = '';
        a.forEach((item) => {
          let name = this.$store.state.professions[item];
          if(!name) { return; }
          st += comma+name.title;
          comma = ', ';
        });
        return st;
      },
      renderUserName(user) {
        let s = '';
        if(!user.first_name) { return user.username; }
        s += user.first_name;
        if(user.last_name) {
          s += ' '+user.last_name;
        }
        return s;
      },
      async getProfessions() {
        this.professions = await this.$store.dispatch('getProfessions');
        this.professionsLength = Object.keys(this.professions).length;
      }
    }
  }
</script>
