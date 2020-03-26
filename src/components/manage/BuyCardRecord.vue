<template>
  <Row type="flex" justify="center" style="padding: 1rem;height: 100%">
    <i-col span="24">
      <p>购买(续费)回测卡消费记录</p>
      <i-table :columns="state.columns" :data="state.tableData"></i-table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="state.data.length" :current="1" @on-change="changePage" show-total></Page>
        </div>
      </div>
    </i-col>
  </Row>
</template>
<script>
import { reactive, computed } from "@vue/composition-api";
export default {
  setup() {
    const state = reactive({
      modal: false,
      dataTemp: [],
      pageSize: 10,
      currentPage: 1,
      showHeader: false,
      columns: [
        {
          title: "创建时间",
          key: "create_time",
          align: "center"
          //            sortable: true,
        },
        {
          title: "编号",
          key: "order_number",
          align: "center"
          //            ellipsis: true
        },
        {
          title: "卡名",
          key: "card_name",
          align: "center"
        },
        {
          title: "购卡类型",
          key: "type",
          align: "center"
          //            width: 100
        },
        {
          title: "购买量",
          key: "quantity",
          align: "center"
        },
        {
          title: "支付点数",
          key: "pay_points",
          align: "center"
        }
      ],
      data: computed(() => {
        return state.dataTemp;
      }),
      tableData: computed(() => {
        return state.dataTemp.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        );
      })
    });
    const changePage = current => {
      state.currentPage = current;
    };
    return {
      state,
      changePage
    };
  }
};
</script>
<style>
</style>
