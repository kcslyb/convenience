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
import { ConvertApi, DictApi } from '../../api/resources'
import Operations from '../../utils/Operations'
import CommonMixin from '../mixins/CommonMixin'
export default {
  name: 'StatisticalAnalysisForm',
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
          name: 'oneTypeNumber',
          fieldType: 'digit',
          label: '类型一数量',
          required: true,
          rules: [{ required: true, message: '请输入类型一数量' }]
        }, {
          type: 'select',
          name: 'oneTypeUnit',
          nameLabel: 'oneTypeUnitName',
          label: '类型一',
          optionProps: {
            value: 'key',
            label: 'label'
          },
          options: [],
          required: true,
          rules: [{ required: true, message: '请选择类型一' }]
        }, {
          name: 'twoTypeNumber',
          fieldType: 'number',
          label: '类型二数量',
          required: true,
          rules: [{ required: true, message: '请输入类型二数量' }]
        }, {
          type: 'select',
          name: 'twoTypeUnit',
          nameLabel: 'twoTypeUnitName',
          label: '类型二',
          optionProps: {
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
        this.title = '类型池新增'
      } else {
        this.barCtrlList = []
        this.title = '类型池详情'
        this.fieldProps.map(value => {
          value.readonly = true
        })
        ConvertApi.queryById(this.$route.query.id).then(res => {
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
      const operation = new Operations(ConvertApi)
      console.info(this.fieldData)
      operation[this.action](this.fieldData, () => {
        this.$router.go(-1)
      })
    },
    handleEdit () {
      this.fieldProps.map(value => {
        value.readonly = false
      })
      this.isChange = true
      this.barCtrlList = ['edit']
      this.title = '类型池修改'
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
