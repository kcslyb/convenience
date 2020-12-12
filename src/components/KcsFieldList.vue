<script>
import moment from 'moment'
import KcsFileUpload from './KcsFileUpload.vue'
import { Form, Field, Cell, RadioGroup, Radio, CheckboxGroup, Checkbox, Icon, Popup, Picker, DatetimePicker, stepper } from 'vant'
export default {
  name: 'KcsFieldList',
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
    // field行参数数组 eg: [{name: 'prop', label: '参数名'}...]
    fieldProps: {
      type: Array,
      default: () => {
        return [
          {
            type: 'field', // field | select | cell ...
            name: 'prop',
            label: '参数名',
            nameType: 'datetimePicker', // actionSheet | datetimePicker
            showType: 'showActionSheet', // showActionSheet | showDatetimePicker | showCalendar
            dateType: 'dateTime' // year-month month-day | datetime | date | time
          }
        ]
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
          throw new Error(`KcsFieldList: 不存在对应类型${type}的方法`)
        }
      } else {
        return this.generateField(item)
      }
    },
    // 生成输入框 type: field 默认返回该组件
    generateField (item) {
      return (
        <van-field
          class={{
            'input-picker': true,
            'pointer-events-none': item.readonlyFixed
          }}
          autosize={true}
          label-width={item.labelWidth ? item.labelWidth : 'auto'}
          type={item.fieldType}
          label={item.label + ':'}
          readonly={item.readonlyFixed ? item.readonlyFixed : item.readonly}
          rules={item.rules}
          required={item.required}
          error-message-align="right"
          label-class="label-class"
          style="font-size: 0.8rem"
          rows={item.rows ? item.rows : 1}
          placeholder={item.readonly ? '' : (item.readonlyFixed ? item.placeholder : `请输入${item.label}`)}
          value={this.$attrs.value[item.name]}
          show-word-limit={item.showWordLimit}
          maxlength={item.maxlength ? item.maxlength : 100}
          input-align={item.inputAlign ? item.inputAlign : 'right'}
          onInput={(e) => {
            this.$set(this.$attrs.value, item.name, e.trim())
            const eventName = !item.event ? `on-${item.name}` : item.event
            this.$emit(eventName, item)
          }}/>
      )
    },
    // 生成输入框 type: cell
    generateCell (item) {
      return (
        <van-cell
          value={this.$attrs.value[item.name]}
          title={item.label + ':'}
          style="font-size: 0.8rem"
        />
      )
    },
    // 生成输入框 type: radio
    generateRadio (item) {
      if (item.option && item.option.length > 0) {
        return (
          <div class="nc-radio-container">
            <div class={{
              'label-class': true,
              'textarea-label': true,
              'van-cell--required': item.required
            }}>{item.label + ':'}</div>
            <van-radio-group
              class="nc-radio"
              disabled={item.readonly}
              value={this.$attrs.value[item.name]}
              direction="horizontal">
              {
                item.option.map(opt => {
                  return (
                    <van-radio
                      icon-size="1.6rem"
                      name={opt.value}
                      class="nc-radio-label"
                      onClick={() => {
                        if (!item.readonly) {
                          this.$set(this.$attrs.value, item.name, opt.value)
                          if (item.nameLabel) {
                            this.$set(this.$attrs.value, item.nameLabel, opt.label)
                          }
                        }
                      }}>
                      {opt.label}
                    </van-radio>
                  )
                })
              }
            </van-radio-group>
          </div>
        )
      } else {
        return (
          <div class="nc-radio-container">
            <div class={{ 'label-class': true, 'van-cell--required': item.required }}>
              {item.label + ':'}</div>
            <van-radio-group
              class="nc-radio"
              disabled={item.readonly}
              attrs={{ value: this.$attrs.value[item.name] }}
              direction="horizontal">
              <van-radio icon-size="1.6rem" name="1" class="label-class" onClick={() => {
                if (!item.readonly) {
                  this.$set(this.$attrs.value, item.name, '1')
                }
              }}>合格</van-radio>
              <van-radio icon-size="1.6rem" name="0" class="label-class" onClick={() => {
                if (!item.readonly) {
                  this.$set(this.$attrs.value, item.name, '0')
                }
              }}>不合格</van-radio>
            </van-radio-group>
          </div>
        )
      }
    },
    // 生成输入框 type: checkbox
    generateCheckbox (item) {
      if (!item.option || item.option.length === 0) {
        item.option = [
          { value: '1', label: '' }
        ]
      }
      return (
        <div class="nc-radio-container">
          <div class={{
            'label-class': true,
            'van-cell--required': item.required
          }}>
            {item.label + ':'}</div>
          <van-checkbox-group
            class="nc-radio"
            disabled={item.readonly}
            value={this.$attrs.value[item.name]}
            direction="horizontal"
            onInput={(checkedList) => {
              const temp = checkedList || []
              this.$set(this.$attrs.value, item.name, temp)
            }}>
            {
              item.option.map(opt => {
                return (
                  <van-checkbox
                    icon-size="1.5rem"
                    name={opt.value}
                    shape="square"
                    class="nc-radio-label">
                    {opt.label}
                  </van-checkbox>
                )
              })
            }
          </van-checkbox-group>
        </div>
      )
    },
    // 生成输入框 type: textarea
    generateTextarea (item) {
      return (
        <div class="nc-textarea">
          <div
            class={{
              'label-class': true,
              'textarea-label': true,
              'van-cell--required': item.required
            }}>{item.label + ':'}</div>
          <van-field
            autosize={true}
            type={'textarea'}
            rules={item.rules}
            readonly={item.readonly}
            label-width={item.labelWidth ? item.labelWidth : 'auto'}
            class="field-textarea"
            label-class="label-class"
            style="font-size: 0.8rem"
            rows={item.rows ? item.rows : 2}
            placeholder={item.readonly ? '' : (item.readonlyFixed ? item.placeholder : `请输入${item.label}`)}
            value={this.$attrs.value[item.name]}
            show-word-limit={item.showWordLimit ? !item.showWordLimit : true}
            maxlength={item.maxlength ? item.maxlength : 200}
            onInput={(e) => {
              this.$set(this.$attrs.value, item.name, e.trim())
            }}/>
        </div>
      )
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
          style="font-size: 0.8rem"
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
            style="font-size: 0.8rem"
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
        return (
          <div class="multiple-select">
            <div class="multiple-tmp">
              {names.map((name, index) => {
                return <div class="participant-item">
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
              })}
            </div>
          </div>
        )
      }
    },
    // 生成自定义回调事件field type: invoke 用于点击时引入其它页面
    generateInvoke (item) {
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
          style="font-size: 0.8rem"
          placeholder={item.readonly ? '' : (item.placeholder ? item.placeholder : `请选择${item.label}`)}
          attrs={{ value: this.$attrs.value[item.nameLabel] }}
          validate-trigger="onChange"
          show-word-limit={item.showWordLimit}
          maxlength={item.maxlength ? item.maxlength : 100}
          input-align={item.inputAlign ? item.inputAlign : 'right'}
          onClick={() => {
            // 通过readonlyFixed固定isCallback
            item.isCallback = item.readonlyFixed ? false : item.isCallback
            if (item.isCallback) {
              // 点击事件回调 item.event 为事件名, 前提是设置isCallback为true,默认事件名为on-{item.ame}
              const eventName = item.event ? item.event : `on-${item.name}`
              this.$emit(eventName, item)
            }
          }}
        />
      )
    },
    generateInvokeTmp (item) {
      const v = this.$attrs.value[item.nameLabel]
      const multipleTmpList = v ? v.split(',') : []
      const multipleTmp = () => {
        return (<div class="multiple-tmp">
          { multipleTmpList.map(t => {
            return <div class="participant-item">
              <span>{t}</span>
              {!item.readonlyFixed && !item.readonly &&
              <van-icon
                class="participant-item-i"
                name="clear"
                onClick={() => {
                  const ids = this.$attrs.value[item.name]
                  const idList = ids ? ids.split(',') : []
                  const labels = []; const names = []
                  for (let i = 0; i < multipleTmpList.length; i++) {
                    if (multipleTmpList[i] !== t) {
                      labels.push(multipleTmpList[i])
                      names.push(idList[i])
                    }
                  }
                  this.$set(this.$attrs.value, item.nameLabel, labels.join(','))
                  this.$set(this.$attrs.value, item.name, names.join(','))
                  this.$forceUpdate()
                }}
              />}
            </div>
          })}
        </div>)
      }
      return (
        <div class="multiple-select">
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
            style="font-size: 0.8rem"
            placeholder={item.readonly ? '' : (item.readonlyFixed ? item.placeholder : `请选择${item.label}`)}
            attrs={{ value: this.$attrs.value[item.nameLabel] }}
            validate-trigger="onChange"
            show-word-limit={item.showWordLimit}
            maxlength={item.maxlength ? item.maxlength : 100}
            input-align={item.inputAlign ? item.inputAlign : 'right'}
            onClick={() => {
              // 通过readonlyFixed固定isCallback
              item.isCallback = item.readonlyFixed ? false : item.isCallback
              if (item.isCallback) {
                // 点击事件回调 item.event 为事件名, 前提是设置isCallback为true,默认事件名为on-{item.ame}
                const eventName = item.event ? item.event : `on-${item.name}`
                this.$emit(eventName, item)
              }
            }}
          />
          {multipleTmpList.length ? multipleTmp() : ''}
        </div>
      )
    },
    // 生成输入框 type: date
    generateDate (item) {
      if (item.name) {
        let format = this.fieldItem.format ? this.fieldItem.format : 'YYYY-MM-DD HH:mm:ss'
        if (this.$attrs.value[item.name]) {
          let temp = ''
          const reg = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
          if (reg.test(this.$attrs.value[item.name])) {
            temp = this.$attrs.value[item.name]
          } else {
            format = format.replace(/-/g, '/')
            temp = moment(new Date(this.$attrs.value[item.name])).format(format)
            temp = temp.replace(/\//g, '-')
          }
          this.$set(this.$attrs.value, item.nameLabel, temp)
        } else {
          this.$set(this.$attrs.value, item.nameLabel, '')
        }
      }
      return (
        <van-field
          class={{ 'pointer-events-none': item.readonlyFixed }}
          readonly={true}
          required={item.required}
          rules={item.rules}
          right-icon={item.readonlyFixed ? '' : 'arrow'}
          name={item.nameType}
          label-width={item.labelWidth ? item.labelWidth : 'auto'}
          label={item.label + ':'}
          label-class="label-class"
          style="font-size: 0.8rem"
          placeholder={item.readonly ? '' : (item.readonlyFixed ? item.placeholder : `请选择${item.label}`)}
          attrs={{ value: this.$attrs.value[item.nameLabel] }}
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
    // 生成输入框 type: flag
    generateFlag (item) {
      if (item.name) {
        const tempObj = item.flagObj ? item.flagObj : { 0: '否', 1: '是' }
        if (this.$attrs.value[item.name]) {
          const temp = tempObj[this.$attrs.value[item.name]]
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
          right-icon={item.readonly ? '' : 'arrow'}
          name={item.nameType}
          label-width={item.labelWidth ? item.labelWidth : 'auto'}
          label={item.label + ':'}
          label-class="label-class"
          style="font-size: 0.8rem"
          placeholder={item.readonly ? '' : '点击选择'}
          value={this.$attrs.value[item.nameLabel]}
          input-align={item.inputAlign ? item.inputAlign : 'right'}
        />
      )
    },
    // 生成图片上传组件 type: img
    generateImg (item) {
      let temp = this.$attrs.value[item.name] || []
      if (!Array.isArray(temp)) {
        temp = temp.split(',')
      }
      return (
        <nc-file
          file-ids={temp}
          show-info={item.readonly}
          onOn-file-change={(fileList) => {
            this.$emit('onFileChange', item, fileList)
          }}/>
      )
    },
    // action-sheet 一般下拉选
    actionSheet () {
      if (!this.fieldItem.type || this.fieldItem.type !== 'select') {
        return ''
      }
      const option = this.fieldItem.optionProps ? this.fieldItem.optionProps : {
        label: 'label',
        value: 'value'
      }
      return (
        <van-popup
          position="bottom"
          value={this.showActionSheet}
          onClick-overlay={() => {
            this.showActionSheet = false
          }}>
          <van-picker
            show-toolbar={true}
            value-key={option.label}
            columns={this.fieldItem.options}
            onCancel={() => {
              this.showActionSheet = false
            }}
            onConfirm={(item) => {
              this.$set(this.$attrs.value, this.fieldItem.name, item[option.value])
              this.$set(this.$attrs.value, this.fieldItem.nameLabel, item[option.label])
              // 点击事件回调 item.event 为事件名, 前提是设置isCallback为true,默认事件名为on-{item.ame}
              const eventName = !this.fieldItem.event ? `on-${this.fieldItem.name}` : this.fieldItem.event
              this.$emit(eventName, item)
              this.showActionSheet = false
            }}
          />
        </van-popup>
      )
    },
    // datetime-picker 时间下拉选
    actionDatetimePicker () {
      if (!this.fieldItem.type || this.fieldItem.type !== 'date') {
        return ''
      }
      return (
        <van-popup
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
    },
    // actionSheetSelect 可多选动作面板
    actionSheetSelect () {
      if (!this.fieldItem.type || this.fieldItem.type !== 'selectMultiple') {
        return ''
      }
      const options = this.fieldItem.options || []
      const optionProps = this.fieldItem.optionProps ? this.fieldItem.optionProps : {
        label: 'label',
        value: 'value'
      }
      if (!this.tempCheckedList) {
        this.tempCheckedList = this.$attrs.value[this.fieldItem.name] || ''
      }
      return (
        <van-popup
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
    }
  },
  render () {
    return (
      <van-form
        show-error-message={this.showErrorMessage}
        ref="KcsFieldForm"
        onFailed={(errorInfo) => {
          const temp = [].concat(errorInfo.errors)
          const errorMsg = []
          temp.forEach(value => {
            value.message && errorMsg.push(value.message)
          })
          this.$notify({
            type: 'warning',
            message: errorMsg.length > 0 ? errorMsg.join('\n') : '存在必填项未填写！'
          })
        }}
        onSubmit={(e) => {
          this.$emit('on-submit')
        }}>
        {
          this.fieldProps.map(item => {
            return this.generate(item)
          })
        }
        { this.actionSheet() }
        { this.actionSheetSelect() }
        { this.actionDatetimePicker() }
      </van-form>
    )
  }
}
</script>

<style lang="less" scoped>
  .label-class {
    color: #6E7D93;
    font-size: 0.8rem;
  }
  .textarea-label {
    background-color: white;
    padding-left: 16px;
    padding-top: 10px;
  }
  .field-textarea {
    /deep/.van-field__body {
      background: #ffffff;
      padding: 1rem;
      border: .1rem solid #ebedf0;
      border-radius: .3rem;
    }
  }
  .nc-textarea {
    border-bottom: .0625rem solid #ebedf0;
  }
  .nc-radio-container{
    display: flex;
    align-items: center;
    padding: 0.625rem 1rem;
    background-color: white;
    justify-content: space-between;
    border-bottom: 0.0625rem solid #ebedf0;
    .textarea-label {
      background-color: white;
      padding-left: 0;
      padding-top: 10px;
    }
    .nc-radio {
      font-size: 1rem;
      line-height: 2.4rem;
      .nc-radio-label {
        color: #6E7D93;
        font-size: 1rem;
      }
    }
  }
  .van-cell--required::before {
    position: absolute;
    left: 8px;
    color: #ee0a24;
    font-size: 1rem;
    content: '*';
  }
  .multiple-select {
    background-color: #fff;

    .multiple-tmp {
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      padding: 0.6rem 0;

      .participant-item {
        padding: 0.4rem 2rem;
        margin: 0.2rem 1rem;
        box-sizing: border-box;
        background-color: #e1e9ff;
        color: #666666;
        position: relative;
        font-size: 1rem;

        .participant-item-i {
          position: absolute;
          right: .28rem;
          top: .28rem;
          color: #5289ff;
        }
      }
    }
  }
  .pointer-events-none {
    pointer-events: none;
  }
</style>
