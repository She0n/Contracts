<template>
  <div>
    <div :class="'vue-select-wrapper '+cls" v-if="options" :id="id">
      <select :name="name" v-model="childValue" style="display: none">
        <option v-for="(option, index) in options" :value="Array.isArray(options) ? option[select_key] : index">{{ option.title }}</option>
      </select>
      <div class="vue-select-container">
        <div class="vue-select-placeholder c-input"  v-on:click="toggleDropdown()">
          <span v-html="renderPlaceholderValue()" class="vue-select-placeholder-span"></span>
        </div>
        <ul class="vue-select-dropdown">
          <li v-if="nullable" v-html="placeholderVal.length ? placeholderVal : 'Не выбрано'" v-on:click="selectOption(null)"></li>
          <li v-for="(option, index) in options" :class="renderOptionClass(option, Array.isArray(options) ? option[select_key] : index)" v-html="renderOptionHtml(option, Array.isArray(options) ? option[select_key] : index)" :data-index="Array.isArray(options) ? option[select_key] : index" v-on:click="selectOption(Array.isArray(options) ? option[select_key] : index)"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      options: {
        required: true,
        default: []
      },
      cls: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        required: true
      },
      select_key: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      placeholderVal: {
        default: 'Не выбрано'
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      value: {
        default: ''
      },
      nullable: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      console.log('doing s' +this.value);
      if(Array.isArray(this.options)) {
        if(this.optionsByIds[this.value]) {
          this.childValue = this.value;
        } else {
          if(this.multiple) {
            if(this.nullable) {
              this.childValue = [];
            } else {
              this.childValue = [this.options[0][this.select_key]];
            }
          } else {
            if(this.nullable) {
              this.childValue = 0;
            } else {
              this.childValue = this.options[0][this.select_key];
            }
          }
        }
      } else {
        if(this.options[this.value]) {
          this.childValue = this.value;
        } else {
          if(!this.nullable) {
            let keys = Object.keys(this.options);
            this.childValue = keys[0];
          }
        }
      }
    },
    computed: {
      optionsByIds() {
        let a = {};
        if(!Array.isArray(this.options)) { return a; }
        for(let i = 0; i < this.options.length; i++) {
          a[this.options[i][this.select_key]] = this.options[i];
        }
        return a;
      }
    },
    watch: {
      childValue(newVal, oldVal) {
        this.$emit('input', newVal)
      },
    },
    methods: {

      renderOptionHtml(option, index) {
        if(!this.multiple) { return option.title; }
        let active = Array.isArray(this.childValue) ? (this.childValue.indexOf(index) === -1 ? '' : 'active') : '';
        return '<span class="checkbox-simulator '+active+' u-mr-small"></span><span>'+option.title+'</span>';
      },
      renderOptionClass(option, index) {
        if(this.multiple) { return ''; }
        return (this.childValue === index ? 'active' : '');
      },
      selectOption (index) {
        console.log('selecting '+index);
        if(!this.multiple) {
          this.childValue = index;
          return;
        }
        if(index || index === 0) {
          if(!Array.isArray(this.childValue)) {
            this.childValue = [index];
          } else {
            let index2 = this.childValue.indexOf(index);
            let newval =  JSON.parse(JSON.stringify(this.childValue));
            if(index2 !== -1) {
              newval.splice(index2, 1);
            } else {
              newval.push(index);
            }
            this.childValue = newval;
          }
        } else {
          this.childValue = [];
        }
      },
      renderPlaceholderValue() {
        let string = this.placeholderVal;
        if(this.multiple) {
          if(Array.isArray(this.childValue)) {
            if(this.childValue.length) {
              string = '';
              let comma = '';
              for(let i = 0; i < this.childValue.length; i++) {
                string += comma + this.options[this.childValue[i]].title;
                comma = ', ';
              }
            }
          }
          return string;
        }

        if(!this.options) { return string; }
        if(Array.isArray(this.options)) {
          if(!this.optionsByIds[this.childValue]) {
            if(this.nullable) {
              return string;
            } else {
              this.selectOption(this.options[0][this.select_key]);
              return this.options[0].title;
            }
          }
          return this.optionsByIds[this.childValue].title;
        }

        if(!this.options[this.childValue]) {
          if(this.nullable) {
            return string;
          } else {
            let keys = Object.keys(this.options);
            if(!keys.length) { return ''; }
            this.selectOption(keys[0]);
            return this.options[keys[0]].title;
          }
        }



        return this.options[this.childValue].title;

      },
      closeDropdown () {
        let el = document.getElementById(this.id);
        if(!el) { return; }
        let ddContainer = el.getElementsByClassName('vue-select-container');
        if(!ddContainer.length) { return; }
        ddContainer = ddContainer[0];
        if(ddContainer.classList.contains('open')) {
          ddContainer.classList.remove('open');
        }
      },
      closeDropdown() {
        console.log('close');
        let el = document.getElementById(this.id);
        if(!el) { return; }
        let ddContainer = el.getElementsByClassName('vue-select-container');
        if(!ddContainer.length) { return; }
        ddContainer = ddContainer[0];
        let body = $('body');
        ddContainer.classList.remove('open');
        body.off('click.nselect'+this.id);
      },
      toggleDropdown () {
        let el = document.getElementById(this.id);
        if(!el) { return; }
        let ddContainer = el.getElementsByClassName('vue-select-container');
        if(!ddContainer.length) { return; }
        ddContainer = ddContainer[0];
        let body = $('body');
        if(!ddContainer.classList.contains('open')) {
          ddContainer.classList.add('open');
          body.off('click.nselect'+this.id);
          body.on('click.nselect'+this.id, (e) => {
            this.outsideClicks++;
            if(!this.multiple) {
              if(this.outsideClicks > 1) {
                this.outsideClicks = 0;
                this.closeDropdown();
              }
            } else {
              if(e.target.classList.contains('vue-select-placeholder') || e.target.classList.contains('vue-select-placeholder-span')) {
                if(this.outsideClicks > 1) {
                  this.outsideClicks = 0;
                  this.closeDropdown();
                  return;
                }
              }
              if((e.target.id === this.id) || e.target.closest('#'+this.id)) {
                return;
              }
              if(this.outsideClicks > 1) {
                this.outsideClicks = 0;
                this.closeDropdown();
              }
            }
          });
        }

      }
    },
    data () {
      return {
        outsideClicks: 0,
        childValue: 0
      }
    },
  }
</script>
