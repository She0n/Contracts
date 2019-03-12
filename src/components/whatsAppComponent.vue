<template>
  <div>
    <div class="contracts-block u-mt-medium">
      <button type="button" @click="sendMessages" class="c-btn">Отправить</button>
    </div>
  </div>
</template>

<script>
  import Component from '@/components/Component.vue';
  const pageData = { title: 'WhatsApp', metaTitle : 'WhatsApp' };
  export default {
    mixins: [Component],
    data() {
      return {
        pageData: pageData
      }
    },
    created() {
      this.$store.dispatch('setComponentReady', false);
    },
    async mounted() {
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      async sendMessages() {
        let resp = await axios.post('/showDeals', { 'status': '20103805&status%5B%5D=20103808&status%5B%5D=20103811&status%5B%5D=21809521&status%5B%5D=21809524&status%5B%5D=21809665' +
          '&status%5B%5D=22121506&status%5B%5D=22121506&status%5B%5D=20035585&status%5B%5D=21812458&status%5B%5D=21812461&status%5B%5D=21970669&status%5B%5D=21970672&status%5B%5D=21970675' +
          '&status%5B%5D=21843688&status%5B%5D=21971704&status%5B%5D=21971707&status%5B%5D=22188154&status%5B%5D=22299913&status%5B%5D=22299916&status%5B%5D=22125826&status%5B%5D=22125841' +
          '&status%5B%5D=21811591&status%5B%5D=21811594&status%5B%5D=21811597&status%5B%5D=21970816&status%5B%5D=21970819&status%5B%5D=21970822&status%5B%5D=21970825&status%5B%5D=22188733' +
          '&status%5B%5D=21812413&status%5B%5D=21812416&status%5B%5D=21812419'});
        let arr = [];
        if (resp.data) {
          resp.data.forEach((el) => {
            if (el.contacts && el.contacts.id) {
              arr.push(el.contacts.id[0]);
            }
          });
        }

        resp = await axios.post('/showContacts', { 'id': arr });
        let arr2 = [];
        if (resp.data) {
          resp.data.forEach((el) => {
            let number = el['custom_fields'][0].values[0].value;
            if (number.indexOf('@') + 1) {
            } else {
              number = number.replace('+', '');
              number = number.replace(new RegExp(' ', 'g'), '');
              number = number.replace('(', '');
              number = number.replace(')', '');
              number = number.replace(new RegExp('-', 'g'), '');
              if (number.charAt(0) === '8') {
                number = number.replace('8', '7');
              }
              arr2.push(number);
            }
          });
          console.log(arr2);
        }

        resp = await axios.post('/sendMessages', { 'phones': arr2 });
        if (resp.data) {
          if (resp.data.result) {
            console.log(resp.data.result);
            toastr.success('Отправлено');
          }
        }
      }
    }
  }
</script>
