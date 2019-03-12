<script>
  export default {
    methods: {
      initMode() {
        if (this.$auth.user()['is_admin']) {
          return 'admin';
        } else if (this.$auth.user().id === 22) {
          return 'whatsapp';
        } else {
          return 'user';
        }
      },
      allowDropUser(user) {
        if (user.id === this.$auth.user().id) {
          return 0;
        }
        if (!this.$auth.user()['is_admin']) {
          return 0;
        }
        return 1;
      },
      allowModifyPersonalData(user) {
        if (this.$auth.user()['is_admin']) {
          return false;
        }
        return true;
      },
      allowEditUser(user) {
        if (user.id === this.$auth.user().id) {
          return 1;
        }
        if (this.$auth.user()['is_admin']) {
          return 1;
        }
        return 0;
      },
      allowCreateUser() {
        if (this.$auth.user()['is_admin']) {
          return 1;
        }
        return 0;
      }
    }
  }
</script>
