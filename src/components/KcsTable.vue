<template>
  <table class="kcs-table">
    <tr class="kcs-table-tr">
      <th class="kcs-table-th" v-for="(column, columnIndex) in columns" :key="'table_heard_' + columnIndex">
        <span class="kcs-table-th-cell">{{column.label}}</span>
      </th>
    </tr>
    <tr class="kcs-table-tr" v-for="(item, index) in data" :key="'table_row' + index">
      <td class="kcs-table-td" v-for="(column, columnIndex) in columns" :key="'table_col_' + columnIndex + index">
        <div class="kcs-table-td-cell">
          {{item[column.prop]}}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'KcsTable',
  props: {
    columns: {
      type: Array,
      default: () => {
        return [
          {
            prop: 'typeNumber',
            label: '数量'
          }, {
            prop: 'typeUnitName',
            label: '单位'
          }
        ]
      }
    },
    data: {
      type: Array,
      default: () => {
        return [
          { typeNumber: 10, typeUnitName: '双' }
        ]
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/style/common";
  .kcs-table {
    width: 100%;
    padding: .4rem;
    background-color: white;
    .kcs-table-tr {
      width: 100%;
      .kcs-table-th, .kcs-table-td {
        padding: .4rem;
        text-align: center;
        font-size:1em;
        border:1px solid @common-border-color;
      }
    }
  }
</style>
