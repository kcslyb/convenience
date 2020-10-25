<template>
  <div class="select-container" :style="'width:' + width +'rem'">
    <div class="select-content">
      <input
        :class="{'select-content-input': true, 'select-disabled': disabled }"
        v-model="$attrs.value[prop]"
        @blur="onblur"
        @focus="onfocus"
        @click="onclick"
        @change="onchange"
      />
      <div class="select-content-box"></div>
    </div>
    <div class="select-option" v-show="showOption">
      <div
        class="select-option-item"
        v-for="(item, index) in options"
        :key="'select-item-' + index"
        @click.stop="clickOptionItem(item)"> {{item[propObj.label]}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KcsSelect',
  props: {
    propObj: {
      type: Object,
      default: () => {
        return {
          value: 'value',
          label: 'label'
        }
      }
    },
    options: {
      type: Array,
      default: () => [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        }
      ]
    },
    prop: {
      type: String,
      default: 'value'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 4
    }
  },
  data () {
    return {
      showOption: false
    }
  },
  methods: {
    onchange (value) {
      this.$set(this.$attrs.value, this.prop, value)
      this.$emit('on-change', this.$attrs.value[this.prop])
    },
    onclick () {
      this.$emit('on-click')
    },
    onfocus () {
      this.showOption = true
    },
    onblur () {
      setTimeout(() => {
        this.showOption = false
      }, 100)
    },
    clickOptionItem (item) {
      this.showOption = false
      this.$set(this.$attrs.value, this.prop, item[this.propObj.value])
    }
  }
}
</script>

<style scoped lang="less">
  .select-container {
    position: relative;
    display: inline-block;

    .select-content {
      width: 100%;
      padding: .1rem;
      text-align: right;
      box-sizing: border-box;

      .select-content-input {
        display: inline-block;
        width: 100%;
      }

      .select-content-box {
        display: inline-block;
        position: absolute;
        cursor: pointer;
        top: .7rem;
        right: -.2rem;
        height: 2rem;
        border-width: .4rem;
        border-style: solid;
        border-color: #666666 transparent transparent transparent
      }
    }

    .select-option {
      z-index: 20;
      width: 100%;
      position: absolute;
      transform: translateX(-2rem);
      background-color: white;
      padding: .1rem;
      max-height: 10rem;
      overflow-y: scroll;
      overflow-x: hidden;
      display: inline-block;
      border: .1rem solid #F2F2F2;
      border-bottom: none;

      .select-option-item {
        width: 100%;
        display: inline-block;
        padding: .2rem;
        cursor: pointer;
        border-bottom: .1rem solid #F2F2F2;
      }
    }
  }

  .select-disabled {
    pointer-events: none;
  }
</style>
