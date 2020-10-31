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
    <kcs-label title="初始数据"></kcs-label>
    <kcs-field-list
      ref="statistical"
      v-model="fieldData"
      :field-props="fieldProps"
      @on-submit="onBarItemClickCallback">
    </kcs-field-list>
    <kcs-label title="计算完成数据">
      <span v-show="!fieldData.id || isChange" class="btn-calculate" @click="startCalculate">数据分析</span>
    </kcs-label>
    <kcs-table :data="convertProducts"></kcs-table>
  </common-page>
</template>

<script>
import { Icon } from 'vant'
import KcsLabel from '../../components/KcsLabel'
import KcsTable from '../../components/KcsTable'
import CommonPage from '../../components/CommonPage'
import KcsFieldList from '../../components/KcsFieldList'
import { ConvertApi, DictApi, ProductWorkApi } from '../../api/resources'
import Operations from '../../utils/Operations'
import CommonMixin from '../mixins/CommonMixin'
export default {
  name: 'EntityRelevanceForm',
  mixins: [CommonMixin],
  components: {
    KcsLabel,
    KcsTable,
    KcsFieldList,
    CommonPage,
    VanIcon: Icon
  },
  data () {
    return {
      showChoose: false,
      fieldData: {},
      convertProducts: [],
      dataList: [],
      fieldProps: [
        {
          name: 'minNumber',
          fieldType: 'digit',
          label: '成品数量',
          required: true,
          rules: [{ required: true, message: '请输入成品数量' }]
        }, {
          type: 'select',
          name: 'minUnit',
          nameLabel: 'minUnitName',
          label: '成品数量类型',
          optionProps: {
            value: 'key',
            label: 'label'
          },
          options: [],
          required: true,
          rules: [{ required: true, message: '请选择成品数量类型' }]
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
        this.title = '类型转换关系新增'
      } else {
        this.barCtrlList = []
        this.title = '类型转换关系详情'
        this.fieldProps.map(value => {
          value.readonly = true
        })
        ProductWorkApi.queryById(this.$route.query.id).then(res => {
          console.info(res.data)
          this.fieldData = res.data
          this.convertProducts = res.data.convertProducts || []
        })
      }
    },
    queryDictOptions () {
      DictApi.queryByDictGroupLabel('unitType').then(res => {
        this.fieldProps[1].options = res.data
      })
    },
    startCalculate () {
      ConvertApi.queryPager({ oneTypeUnit: this.fieldData.minUnit }).then(res => {
        console.info(res.data.list)
        const temp = res.data.list || []
        if (temp.length) {
          const convert = temp[0]
          const number = (this.fieldData.minNumber * convert.twoTypeNumber / convert.oneTypeNumber).toFixed(3)
          const tempObj = {}
          tempObj.typeNumber = number
          tempObj.typeUnit = convert.twoTypeUnit
          tempObj.typeUnitName = convert.twoTypeUnitName
          this.convertProducts.push(tempObj)
          console.info(this.convertProducts)
        }
      })
    },
    onLeftClick () {
      this.handleRightClick()
    },
    onBarItemClick (action) {
      this.action = action
      this.$refs.statistical.$refs.KcsFieldForm.submit()
    },
    onBarItemClickCallback () {
      this.fieldData.convertProducts = this.convertProducts
      console.info(this.fieldData)
      const operation = new Operations(ProductWorkApi)
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
      this.title = '类型转换关系修改'
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../assets/style/common";
  .ico-default {
    color: @common-color;
  }
  .opt-btn {
    color: @common-color;
    margin-top: .8rem;
    padding: .7rem;
    cursor: pointer;
    border-radius: .3rem;
    border: .1rem solid @common-border-color;
  }
  .btn-calculate {
    color: @common-color;
    font-size: .8rem;
    cursor: pointer;
    padding: .4rem .2rem;
    border-radius: .5rem;
    border: .1rem solid @common-border-color;
  }
</style>
