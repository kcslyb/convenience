<template>
  <div class="tree-container">
    <div class="tree-content" :key="index + item[propObj.value]" v-for="(item, index) of options">
      <div :class="{'tree-content-box': true, 'node-active': item[propObj.value] === currentItem[propObj.value]}">
        <div
          :class="[
          'tree-content-icon',
          (item[propObj.children] && item[propObj.children].length > 0)
           ? (item.expanded ? 'tree-icon-left': 'tree-icon-bottom') : ''
        ]"
          @click="clickIcon(item)"></div>
        <div class="tree-content-label" @click="clickNode(item)">{{item[propObj.label]}}</div>
      </div>
      <div class="tree-option" v-show="!item.expanded">
        <div :key="index + optIndex + opt[propObj.value]" v-for="(opt, optIndex) of item[propObj.children] || []">
          <div
            v-if="!opt[propObj.children] || opt[propObj.children] === 0"
            :class="{'tree-option-item':true, 'node-active': opt[propObj.value] === currentItem[propObj.value]}"
            @click="clickNode(item)">
            {{opt[propObj.label]}}
          </div>
          <div v-else>
            <kcs-tree :options="opt[propObj.children]" @click-icon="clickIcon" @click-node="clickNode"></kcs-tree>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KcsTree',
  props: {
    propObj: {
      type: Object,
      default: () => {
        return {
          value: 'value',
          label: 'label',
          children: 'children'
        }
      }
    },
    options: {
      type: Array,
      default: () => [
        {
          value: '1',
          label: '罗湖市场部',
          children: [
            {
              value: '2',
              label: '北定区',
              children: [
                {
                  value: '3',
                  label: '罗湖区'
                },
                {
                  value: '4',
                  label: '罗湖教学部'
                },
                {
                  value: '5',
                  label: '罗湖销售部'
                }
              ]
            },
            {
              value: '6',
              label: '罗外'
            },
            {
              value: '7',
              label: '罗湖市场部'
            }
          ]
        },
        {
          value: '8',
          label: '福田区'
        },
        {
          value: '9',
          label: '嘉定区'
        }
      ]
    }
  },
  data () {
    return {
      currentItem: {}
    }
  },
  methods: {
    clickIcon (item) {
      this.$set(item, 'expanded', !item.expanded)
      console.info(item)
      this.$emit('click-icon', item)
    },
    clickNode (item) {
      console.info(item)
      this.currentItem = item
      this.$emit('click-node', item)
    }
  }
}
</script>

<style scoped lang="less">
  .tree-container {
    text-align: left;

    .tree-content {
      padding: .2rem;

      .tree-content-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        height: 1.6rem;
        cursor: pointer;

        .tree-content-icon {
          padding-right: .8rem;
          width: 4px;
        }

        .tree-content-label {
          width: 100%;
        }
      }

      .tree-option {
        padding-left: 1.8rem;

        .tree-option-item {
          height: 1.6rem;
        }
      }
    }

    .tree-icon-left::before {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-left: 6px solid #666666;
      border-bottom: 4px solid transparent;
    }

    .tree-icon-bottom::before {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #666666;
    }
  }
  .node-active {
    background-color: #A2BBBB;
    border-radius: 2px;
  }
</style>
