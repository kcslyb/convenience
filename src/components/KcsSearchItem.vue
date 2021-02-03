<script>
import moment from 'moment'
import KcsFileUpload from './KcsFileUpload.vue'
import {
  Form,
  Field,
  Cell,
  Radio,
  Icon,
  Popup,
  Picker,
  Sticky,
  Stepper,
  Checkbox,
  CellGroup,
  RadioGroup,
  CheckboxGroup,
  DatetimePicker,
  TabbarItem,
  Tabbar
} from 'vant'

export default {
  name: 'KcsSearchItem',
  components: {
    VanForm: Form,
    VanCell: Cell,
    VanIcon: Icon,
    VanField: Field,
    VanPopup: Popup,
    VanRadio: Radio,
    VanSticky: Sticky,
    VanPicker: Picker,
    VanStepper: Stepper,
    VanCheckbox: Checkbox,
    VanCellGroup: CellGroup,
    VanRadioGroup: RadioGroup,
    VanCheckboxGroup: CheckboxGroup,
    VanDatetimePicker: DatetimePicker,
    VanBarItem: TabbarItem,
    VanBar: Tabbar,
    KcsFileUpload
  },
  props: {
    // eg: [{name: 'prop', label: '参数名'}...]
    filterItems: {
      type: Array,
      default: () => {
        return [
          {
            type: 'date',
            name: 'startTimeStamp',
            nameLabel: 'startTime',
            label: '开始时间'
          }, {
            type: 'date',
            name: 'endTimeStamp',
            nameLabel: 'endTime',
            label: '结束时间'
          }, {
            type: 'selectMultiple',
            name: 'name',
            nameLabel: 'nameLabel',
            label: '多选逗号隔开'
          }, {
            type: 'select',
            name: 'nameName',
            nameLabel: 'nameLabelLabel',
            label: '单选'
          }
        ]
      }
    },
    filterTitle: {
      type: String,
      default: '高级搜索'
    }
  },
  data () {
    return {
      fieldItem: {},
      tempCheckedList: '',
      showActionSheet: false,
      showDatetimePicker: false,
      showActionSheetSelect: false,
      boxList: [
        { value: '11', label: '测试选项一' },
        { value: '12', label: '测试选项二' },
        { value: '13', label: '测试选项三' }
      ]
    }
  },
  watch: {
    showActionSheetSelect () {
      if (this.showActionSheetSelect && this.$attrs.value[this.fieldItem.name]) {
        this.tempCheckedList = this.$attrs.value[this.fieldItem.name] || ''
      }
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
          rules={item.rules}
          name={item.nameType}
          required={item.required}
          label={item.label + ':'}
          label-class="label-class"
          style="font-size: 1rem"
          value={this.$attrs.value[item.nameLabel]}
          right-icon={item.readonlyFixed ? '' : 'arrow'}
          label-width={item.labelWidth ? item.labelWidth : 'auto'}
          placeholder={item.readonly ? '' : `点击选择${item.label}`}
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
    // 生成输多选选择动作面板 type: selectMultiple
    generateSelectMultiple (item) {
      return (
        <div>
          <van-field
            readonly={true}
            class={{
              'input-picker': true,
              'pointer-events-none': item.readonlyFixed
            }}
            required={item.required}
            rules={item.rules}
            error-message-align="right"
            right-icon="arrow"
            name={item.nameType}
            disabled={item.disabled}
            label-width={item.labelWidth ? item.labelWidth : 'auto'}
            type={item.fieldType}
            label={item.label + ':'}
            label-class="label-class"
            style="font-size: 1rem"
            placeholder={item.readonly ? '' : (item.readonlyFixed ? item.placeholder : `请选择${item.label}`)}
            attrs={{ value: this.$attrs.value[item.nameLabel] }}
            validate-trigger="onChange"
            show-word-limit={item.showWordLimit}
            maxlength={item.maxlength ? item.maxlength : 100}
            input-align={item.inputAlign ? item.inputAlign : 'right'}
            onClick={() => {
              this.fieldItem = item
              // 通过readonlyFixed固定readonly
              item.readonly = item.readonlyFixed ? item.readonlyFixed : item.readonly
              if (!item.readonly) {
                this.showActionSheetSelect = !item.readonly
              }
            }}
          />
          { this.multipleTmp(item, this.$attrs.value[item.name], this.$attrs.value[item.nameLabel]) }
        </div>
      )
    },
    multipleTmp (item, idStr, nameStr) {
      const names = !nameStr ? [] : nameStr.split(',')
      if (item.readonlyFixed) {
        return (
          <div class="multiple-tmp">
            {
              names.map(name => {
                return (
                  <div class="participant-item">
                    <span>{name}</span>
                  </div>
                )
              })
            }
          </div>
        )
      } else {
        if (!item.optionProps) {
          item.optionProps = {
            value: 'value',
            label: 'label'
          }
        }
        if (!item.options) {
          item.options = this.boxList
        }
        return (
          <div class="multiple-select">
            <div class="multiple-tmp">
              {names.map((name, index) => {
                return <div class="participant-item">
                  <div class="multiple-item">
                    <span>{name}</span>
                    {!item.readonly &&
                    <van-icon
                      name="clear"
                      class="participant-item-i"
                      onClick={() => {
                        names.splice(index, 1)
                        const labelTemps = item.options.filter(value => names.includes(value[item.optionProps.label]))
                        const ids = []
                        labelTemps.forEach(value => {
                          ids.push(value[item.optionProps.value])
                        })
                        this.$set(this.$attrs.value, item.name, ids.join(','))
                        this.$set(this.$attrs.value, item.nameLabel, names.join(','))
                      }}
                    />}
                  </div>
                </div>
              })}
            </div>
          </div>
        )
      }
    },
    // 生成输入框 type: select
    generateSelect (item) {
      return (
        <van-field
          readonly={true}
          class={{
            'input-picker': true,
            'pointer-events-none': item.readonlyFixed
          }}
          required={item.required}
          rules={item.rules}
          error-message-align="right"
          right-icon="arrow"
          name={item.nameType}
          disabled={item.disabled}
          label-width={item.labelWidth ? item.labelWidth : 'auto'}
          type={item.fieldType}
          label={item.label + ':'}
          label-class="label-class"
          style="font-size: 1rem"
          placeholder={item.readonly ? '' : (item.readonlyFixed ? item.placeholder : `请选择${item.label}`)}
          attrs={{ value: this.$attrs.value[item.nameLabel] }}
          validate-trigger="onChange"
          show-word-limit={item.showWordLimit}
          maxlength={item.maxlength ? item.maxlength : 100}
          input-align={item.inputAlign ? item.inputAlign : 'right'}
          onClick={() => {
            this.fieldItem = item
            // 通过readonlyFixed固定readonly
            item.readonly = item.readonlyFixed ? item.readonlyFixed : item.readonly
            if (!item.readonly) {
              this.showActionSheet = !item.readonly
            }
          }}
        />
      )
    },
    // action-sheet 一般下拉选
    actionSheet () {
      if (!this.fieldItem.type || this.fieldItem.type !== 'select') {
        return ''
      }
      const optionProps = this.fieldItem.optionProps ? this.fieldItem.optionProps : {
        label: 'label',
        value: 'value'
      }
      const options = this.fieldItem.options || this.boxList
      return (
        <van-popup
          get-container="body"
          position="bottom"
          value={this.showActionSheet}
          onClick-overlay={() => {
            this.showActionSheet = false
          }}>
          <van-picker
            show-toolbar={true}
            value-key={optionProps.label}
            columns={options}
            onCancel={() => {
              this.showActionSheet = false
            }}
            onConfirm={(item) => {
              this.$set(this.$attrs.value, this.fieldItem.name, item[optionProps.value])
              this.$set(this.$attrs.value, this.fieldItem.nameLabel, item[optionProps.label])
              // 点击事件回调 item.event 为事件名, 前提是设置isCallback为true,默认事件名为on-{item.ame}
              const eventName = !this.fieldItem.event ? `on-${this.fieldItem.name}` : this.fieldItem.event
              this.$emit(eventName, item)
              this.showActionSheet = false
            }}
          />
        </van-popup>
      )
    },
    // actionSheetSelect 可多选动作面板
    actionSheetSelect () {
      if (!this.fieldItem.type || this.fieldItem.type !== 'selectMultiple') {
        return ''
      }
      const options = this.fieldItem.options || this.boxList
      const optionProps = this.fieldItem.optionProps ? this.fieldItem.optionProps : {
        label: 'label',
        value: 'value'
      }
      if (!this.tempCheckedList) {
        this.tempCheckedList = this.$attrs.value[this.fieldItem.name] || ''
      }
      return (
        <van-popup
          get-container="body"
          position="bottom"
          value={this.showActionSheetSelect}
          onClick-overlay={() => {
            this.showActionSheetSelect = false
          }}>
          <van-sticky>
            <div class="van-picker__toolbar" style="background-color: #F2F2F2">
              <button type="button" class="van-picker__cancel" onClick={() => {
                this.tempCheckedList = ''
                this.showActionSheetSelect = false
              }}>取消</button>
              <button type="button" class="van-picker__confirm" onClick={() => {
                const temp = this.tempCheckedList.split(',')
                this.$set(this.$attrs.value, this.fieldItem.name, this.tempCheckedList)
                if (this.fieldItem.nameLabel) {
                  const labelTemps = options.filter(value => temp.includes(value[optionProps.value]))
                  const labels = []
                  labelTemps.forEach(value => {
                    labels.push(value[optionProps.label])
                  })
                  this.$set(this.$attrs.value, this.fieldItem.nameLabel, labels.join(','))
                }
                this.showActionSheetSelect = false
              }}>确认</button>
            </div>
          </van-sticky>
          <van-checkbox-group
            value={!this.tempCheckedList ? [] : this.tempCheckedList.split(',')}
            onInput={(checkedList) => {
              this.tempCheckedList = checkedList.join(',')
            }}>
            <van-cell-group>
              {
                options.map((value, index) => {
                  return (
                    <van-cell
                      title={value[optionProps.label]}
                      key={'sheet_select_' + index}
                      clickable={true}
                      onClick={() => {
                        this.$refs['check' + this.fieldItem.name + index].toggle()
                      }}
                      {...{
                        scopedSlots: {
                          'right-icon': () => {
                            return (
                              <van-checkbox
                                name={value[optionProps.value]}
                                ref={'check' + this.fieldItem.name + index} />
                            )
                          }
                        }
                      }}/>
                  )
                })
              }
            </van-cell-group>
          </van-checkbox-group>
        </van-popup>
      )
    },
    // datetime-picker 时间下拉选
    actionDatetimePicker () {
      return (
        <van-popup
          get-container="body"
          position="bottom"
          value={this.showDatetimePicker}
          onClick-overlay={() => {
            this.showDatetimePicker = false
          }}>
          <van-datetime-picker
            type={this.fieldItem.dateType ? this.fieldItem.dateType : 'datetime'}
            attrs={{ value: this.getDate }}
            min-date={this.fieldItem.minDate}
            max-date={this.fieldItem.maxDate}
            onCancel={() => {
              this.showDatetimePicker = false
            }}
            onConfirm={(item) => {
              this.$set(this.$attrs.value, this.fieldItem.name, +new Date(item))
              let format = this.fieldItem.format ? this.fieldItem.format : 'YYYY-MM-DD HH:mm:ss'
              format = format.replace(/-/g, '/')
              const seconds = new Date().getSeconds()
              const temp = moment(new Date(item)).format(format)
              const result = temp.substring(0, temp.length - 2) + seconds
              this.$set(this.$attrs.value, this.fieldItem.nameLabel, result.replace(/\//, '-'))
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
        <div class="search-item-title">
          <div class="title-label">{this.filterTitle}</div>
        </div>
        {
          this.filterItems.map(value => {
            return this.generate(value)
          })
        }
        {
          this.actionDatetimePicker()
        }
        {
          this.actionSheetSelect()
        }
        {
          this.actionSheet()
        }
        <van-bar>
          <van-bar-item name="reset" icon="close" onClick={() => {
            this.$emit('cancel-click')
          }}>重置</van-bar-item>
          <van-bar-item name="confirm" icon="passed" onClick={() => {
            this.$emit('confirm-click')
          }}>确定</van-bar-item>
        </van-bar>
      </div>
    )
  }
}
</script>

<style scoped lang="less">
  @import "../assets/style/common";
  .search-item-container {
    .search-item-title {
      padding: .8rem 0;
      color: @common-color;
      background: @common-background-color;
      display: flex;
      justify-content: center;
      align-items: center;
      .title-label {
        font-size: 1rem;
      }
      .title-left {
        font-size: 1rem;
        display: flex;
        justify-content: left;
        align-items: center;
        padding: 0 .4rem;
        .title-left-back {
          font-size: 1rem;
          line-height: 1.5rem;
        }
      }
      .title-right {
        font-size: 1rem;
        padding: 0 .4rem;
      }
    }
  }
  .multiple-tmp {
    text-align: left;
    .participant-item {
      display: inline-block;
      margin-left: .8rem;
      .multiple-item {
        padding: 0.5rem 0;
        border: 1px solid @common-border-color;
        .participant-item-i {
          transform: translateY(-.4rem);
        }
      }
    }
  }
</style>
