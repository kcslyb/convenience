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
    <kcs-label title="基本信息"></kcs-label>
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
import KcsLabel from '../../components/KcsLabel'
import CommonPage from '../../components/CommonPage'
import KcsFieldList from '../../components/KcsFieldList'
import { DayLogApi } from '../../api/resources'
import Operations from '../../utils/Operations'
import CommonMixin from '../mixins/CommonMixin'
export default {
  name: 'EntityRelevanceForm',
  mixins: [CommonMixin],
  components: {
    KcsLabel,
    KcsFieldList,
    CommonPage,
    VanIcon: Icon
  },
  data () {
    return {
      showChoose: false,
      fieldData: {},
      convertProducts: [],
      baseConvertNumber: 0,
      dataList: [],
      fieldProps: [
        {
          name: 'title',
          label: '标题',
          required: true,
          rules: [{ required: true, message: '请输入标题' }]
        }, {
          type: 'date',
          name: 'happenTime',
          nameLabel: 'happenTimeLabel',
          label: '发生时间',
          required: true,
          rules: [{ required: true, message: '请选择发生时间' }]
        }, {
          type: 'textarea',
          name: 'remark',
          label: '备注'
        }
      ]
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      const idNotExit = !this.$route.query.id
      this.fieldProps.map(value => {
        value.readonly = !idNotExit
      })
      if (idNotExit) {
        this.barCtrlList = ['add']
        this.title = '事件记录新增'
        this.fieldData.happenTime = +new Date()
      } else {
        this.title = '事件记录详情'
        this.fieldProps.map(value => {
          value.readonly = true
        })
        DayLogApi.queryById(this.$route.query.id).then(res => {
          console.info(res.data)
          this.fieldData = res.data
          this.convertProducts = res.data.convertProducts || []
          this.convertProducts.map(value => {
            value.typeNumber = value.typeNumber.toFixed(3)
          })
        })
      }
    },
    onLeftClick () {
      this.handleRightClick()
    },
    onBarItemClick (action) {
      this.action = action
      this.$refs.statistical.$refs.KcsFieldForm.submit()
    },
    onBarItemClickCallback () {
      console.info(this.fieldData)
      const operation = new Operations(DayLogApi)
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
      this.title = '记事本修改'
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
