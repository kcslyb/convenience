<script>
import moment from 'moment'
import KcsFileUpload from './KcsFileUpload.vue'
import { Form, Field, Cell, RadioGroup, Radio, CheckboxGroup, Checkbox, Icon, Popup, Picker, DatetimePicker, stepper } from 'vant'
export default {
  name: 'KcsSearchItem',
  components: {
    VanForm: Form,
    VanCell: Cell,
    VanIcon: Icon,
    VanField: Field,
    VanPopup: Popup,
    VanRadio: Radio,
    VanPicker: Picker,
    VanCheckbox: Checkbox,
    VanRadioGroup: RadioGroup,
    VanCheckboxGroup: CheckboxGroup,
    VanDatetimePicker: DatetimePicker,
    VanStepper: stepper,
    KcsFileUpload
  },
  props: {
    // eg: [{name: 'prop', label: '参数名'}...]
    filterItem: {
      type: Object,
      default: () => {
        return {
          type: 'date', // select | cell ...
          name: 'prop',
          label: '参数名',
          nameType: 'datetimePicker', // actionSheet | datetimePicker
          showType: 'showActionSheet', // showActionSheet | showDatetimePicker | showCalendar
          dateType: 'dateTime' // year-month month-day | datetime | date | time
        }
      }
    },
    showErrorMessage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fieldItem: {},
      showActionSheet: false,
      showDatetimePicker: false,
      boxList: [
        { value: '132456', label: '测试选项一' }, { value: '1', label: '测试选项二' }, { value: '1', label: '测试选项三' }
      ]
    }
  },
  computed: {
    getDate () {
      const temp = this.$attrs.value[this.fieldItem.nameLabel]
      return temp ? new Date(temp) : new Date()
    }
  },
  methods: {
    generate (item) {
      if (item.type) {
        const reg = /\b(\w)|\s(\w)/g
        const type = item.type.replace(reg, m => m.toUpperCase())
        if (Object.prototype.hasOwnProperty.call(this, `generate${type}`)) {
          return this[`generate${type}`](item)
        } else {
          throw new Error(`KcsSearchItem: 不存在对应类型${type}的方法`)
        }
      } else {
        return this.generateDate(item)
      }
    },
    // type: date 时间下拉选
    generateDate (item) {
      if (item.name) {
        const format = this.fieldItem.format ? this.fieldItem.format : 'YYYY-MM-DD HH:mm:ss'
        if (this.$attrs.value[item.name]) {
          const temp = moment(parseInt(this.$attrs.value[item.name])).format(format)
          this.$set(this.$attrs.value, item.nameLabel, temp)
        } else {
          this.$set(this.$attrs.value, item.nameLabel, '')
        }
      }
      return (
        <van-field
          readonly={true}
          required={item.required}
          rules={item.rules}
          right-icon={item.readonlyFixed ? '' : 'arrow'}
          name={item.nameType}
          label-width={item.labelWidth ? item.labelWidth : 'auto'}
          label={item.label + ':'}
          label-class="label-class"
          style="font-size: 0.8rem"
          placeholder={item.readonly ? '' : '点击选择'}
          value={this.$attrs.value[item.nameLabel]}
          input-align={item.inputAlign ? item.inputAlign : 'right'}
          onClick={() => {
            this.fieldItem = item
            // 通过readonlyFixed固定readonly
            item.readonly = item.readonlyFixed ? item.readonlyFixed : item.readonly
            if (!item.readonly) {
              this.showDatetimePicker = true
            }
          }}
        />
      )
    },
    // type: datetime 时间段下拉选
    generateDateRange () {
      return (
        <div>
          <div>
            {
              this.generateDate()
            }
          </div>
          <div>
            {
              this.generateDate()
            }
          </div>
        </div>
      )
    },
    // type: select
    generateSelect () {
      return (
        <div>
          <div>
            23232
          </div>
        </div>
      )
    },
    // datetime-picker 时间下拉选
    actionDatetimePicker () {
      return (
        <van-popup
          position="bottom"
          value={this.showDatetimePicker}
          onClick-overlay={() => {
            this.showDatetimePicker = false
          }}>
          <van-datetime-picker
            style="font-size: 0.8rem"
            type={this.fieldItem.dateType ? this.fieldItem.dateType : 'datetime'}
            attrs={{ value: this.getDate }}
            min-date={this.fieldItem.minDate}
            max-date={this.fieldItem.maxDate}
            onCancel={() => {
              this.showDatetimePicker = false
            }}
            onConfirm={(item) => {
              const format = this.fieldItem.format ? this.fieldItem.format : 'YYYY-MM-DD HH:mm:ss'
              const seconds = +new Date().getSeconds()
              const temp = moment(+new Date(item)).format(format)
              const result = temp.substring(0, temp.length - 2) + seconds
              this.$set(this.$attrs.value, this.fieldItem.nameLabel, result)
              this.$set(this.$attrs.value, this.fieldItem.name, +new Date(result))
              this.showDatetimePicker = false
            }} />
        </van-popup>
      )
    }
  },
  render () {
    return (
      <div class="search-item-container">
        <div class="item-label">{this.filterItem.label}</div>
        {
          this.generate(this.filterItem)
        }
      </div>
    )
  }
}
</script>

<style scoped lang="less">
.search-item-container {

}
</style>
