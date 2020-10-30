<template>
  <common-page
    :title="title"
    :show-bar="true"
    :bar-ctrl-list="barCtrlList"
    @on-left-click="onLeftClick"
    @on-Bar-item-click="onBarItemClick">
    <template slot="title-right">
      <van-icon v-show="fieldData.id && !isChange" class="ico-default" size="20" name="edit" @click="handleEdit" />
    </template>
    <kcs-field-list
      ref="statistical"
      v-model="fieldData"
      :field-props="fieldProps"
      @on-submit="onBarItemClickCallback">
    </kcs-field-list>
  </common-page>
</template>

<script>
import { Icon } from 'vant'
import CommonPage from '../../components/CommonPage'
import KcsFieldList from '../../components/KcsFieldList'
import { ConvertApi, DictApi, ProductWorkApi } from '../../api/resources'
import Operations from '../../utils/Operations'
import CommonMixin from '../mixins/CommonMixin'
export default {
  name: 'EntityRelevanceForm',
  mixins: [CommonMixin],
  components: {
    KcsFieldList,
    CommonPage,
    VanIcon: Icon
  },
  data () {
    return {
      fieldData: {},
      fieldProps: [
        {
          name: 'minNumber',
          fieldType: 'digit',
          label: '类型一数量',
          required: true,
          rules: [{ required: true, message: '请输入类型一数量' }]
        }, {
          type: 'select',
          name: 'minUnit',
          nameLabel: 'minUnitName',
          label: '类型一',
          propObj: {
            value: 'key',
            label: 'label'
          },
          options: [],
          required: true,
          rules: [{ required: true, message: '请选择类型一' }]
        }, {
          name: 'resultNumber',
          fieldType: 'number',
          label: '类型二数量',
          required: true,
          rules: [{ required: true, message: '请输入类型二数量' }]
        }, {
          type: 'select',
          name: 'resultUnit',
          nameLabel: 'resultUnitName',
          label: '类型二',
          propObj: {
            value: 'key',
            label: 'label'
          },
          options: [],
          required: true,
          rules: [{ required: true, message: '请选择类型二' }]
        }
      ]
    }
  },
  created () {
    this.initData()
    this.queryDictOptions()
  },
  methods: {
    initData () {
      const idNotExit = !this.$route.query.id
      this.fieldProps.map(value => {
        value.readonly = !idNotExit
      })
      if (idNotExit) {
        this.barCtrlList = ['add']
        this.title = '实体关联关系新增'
      } else {
        this.barCtrlList = []
        this.title = '实体关联关系详情'
        this.fieldProps.map(value => {
          value.readonly = true
        })
        ProductWorkApi.queryById(this.$route.query.id).then(res => {
          debugger
          this.fieldData = res.data
        })
      }
    },
    queryDictOptions () {
      DictApi.queryByDictGroupLabel('unitType').then(res => {
        console.info(res.data)
        this.fieldProps[1].options = res.data
        this.fieldProps[3].options = res.data
      })
    },
    handleClick () {
      console.info('handleClick')
    },
    handleAddRecord () {
      console.info('handleAddRecord')
    },
    handleTouch () {
      console.info('handleTouch')
    },
    onLeftClick () {
      this.handleRightClick()
    },
    onBarItemClick (action) {
      this.action = action
      this.$refs.statistical.$refs.KcsFieldForm.submit()
    },
    onBarItemClickCallback () {
      const operation = new Operations(ProductWorkApi)
      operation[this.action](this.fieldData)
    },
    handleEdit () {
      this.fieldProps.map(value => {
        value.readonly = false
      })
      this.isChange = true
      this.barCtrlList = ['edit']
      this.title = '实体关联关系修改'
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../assets/style/common";
  .ico-default {
    color: @common-color;
  }
</style>
