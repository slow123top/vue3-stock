<template>
  <Row type="flex" justify="center" style="padding: 1rem;height: 100%">
    <i-col span="24">
      <i-table :columns="state.columns" :data="state.tableData"></i-table>
      <div style="margin-top: 10px">
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
      pageSize: 10,
      currentPage: 1,
      columns: [
        {
          title: "创建时间",
          key: "create_time",
          align: "center"
          //            sortable: true
        },
        {
          title: "编号",
          key: "number",
          align: "center"
          //            ellipsis: true
        },
        {
          title: "详细信息",
          key: "action",
          align: "center"
        },

        {
          title: "消费点数",
          key: "deduction_points",
          align: "center"
        }
      ],
      dataTemp: [],
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
.demo-spin-col {
  height: 3rem;
  position: relative;
  /*border: 1px solid #eee;*/
}
</style>
