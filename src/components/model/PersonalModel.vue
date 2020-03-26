<template>
  <div>
    <Modal v-model="state.myModelModal" :mask-closable="false" :closable="false" width="360">
      <Spin size="large">
        <Icon
          type="load-c"
          size="18"
          class="demo-spin-icon-load"
          style="line-height: 2rem;border-radius: 20px"
        ></Icon>
        <div>{{state.myModalModalInfo}}</div>
      </Spin>
      <div slot="footer"></div>
    </Modal>
    <Row
      type="flex"
      :gutter="16"
      v-show="state.modal"
      style="height:50rem;background:#e3e8ee;font-size: 0.875rem;border-radius:10px;padding:1rem"
    >
      <i-col
        span="3"
        style="height:100%;overflow:auto;background:#fff;border-radius:10px;padding: .5rem"
      >
        <Row
          type="flex"
          justify="center"
          v-if="state.myModels.length"
          style="text-align: center;font-size: 1rem;"
        >
          <i-col span="24">我的模型列表</i-col>
        </Row>
        <Row
          v-for="(model,index) in state.myModels"
          type="flex"
          justify="space-between"
          :key="index"
          style="box-sizing: border-box;padding: .3rem;line-height: 2"
        >
          <i-col span="24">
            <!--:style="trackInfo[index]['style']"-->
            <Button
              long
              :style="state.trackInfo[index]['style']"
              @click="getCurrentModelReport(index)"
            >{{model.modelName}}</Button>
          </i-col>
        </Row>
        <Row type="flex" justify="space-between" style="box-sizing: border-box;padding: .5rem">
          <i-col span="24">
            <Button type="dashed" long icon="plus-round" @click="createNewModel">创建新模型</Button>
          </i-col>
        </Row>
      </i-col>
      <i-col span="21" v-if="state.report" style="height:100%;overflow:auto">
        <Row
          type="flex"
          justify="center"
          style="background:#ffffff;padding: .5rem;border-radius: 10px 10px 0 0"
        >
          <i-col span="24" style="text-align: right">
            <span
              v-if="state.myModels[currentModelIndex].isTracking"
              style="font-size: 1rem;color: #ff0000;float: left"
            >已加入实盘跟踪</span>
            <span v-else style="font-size: 1rem;float: left">未加入实盘跟踪</span>
            <Button
              size="large"
              type="primary"
              icon="ios-paw"
              v-if="state.myModels[currentModelIndex].isTracking"
              @click="getTrack"
            >查看实盘跟踪报告</Button>
            <Button size="large" type="primary" icon="ios-paw" v-else @click="addTrack">加入实盘跟踪</Button>
            <Button size="large" type="success" icon="edit" @click="editModel">编辑</Button>
            <Button size="large" type="error" icon="trash-a" @click="deleteModel">删除</Button>
          </i-col>
        </Row>
        <!-- <AllReport :report="state.report" :modelName="state.modelName"></AllReport>-->
      </i-col>
    </Row>
  </div>
</template>
<script>
import { resolveIndicator, resolveParaLock } from "../../service/model";
import { reactive, computed } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      reportTemp: "",
      report: "",
      modal: true,
      myModelModal: false,
      myModalModalInfo: "",
      modelIndexToDes: [],
      isTracking: false,
      formValidate: {
        currentInputIndex: root.$store.state.currentInputIndex,
        selectedIndexs: root.$store.state.selectedIndexs,
        controller: root.$store.state.controller,
        holdDateCanRun: 1,
        lossCanRun: 1,
        profitCanRun: 1,
        feeCanRun: 1
      },
      myModels: root.$store.state.myModels,
      currentModelIndex: 0,
      chartSize: {
        width: "100%",
        height: "20rem"
      },
      clickTrack: "",
      reportTitle: computed(() => {
        return !state.clickTrack ? "单次回测报告" : "实盘跟踪报告";
      }),
      modelName: computed(() => {
        state.myModels[state.currentModelIndex].modelName;
      }),
      //      实盘信息
      trackInfo: computed(() => {
        let temp = [];
        for (let i = 0; i < this.myModels.length; i++) {
          temp.push({
            style: {
              overflow: "hidden",
              "text-overflow": "ellipsis",
              "white-space": "nowrap"
            },
            styleTrack: {}
          });
        }
        if (state.clickTrack !== "") {
          if (!state.clickTrack) {
            temp[state.currentModelIndex].style.background = "#f90";
            temp[state.currentModelIndex].style.color = "#fff";
            temp[state.currentModelIndex].styleTrack.background = "";
            temp[state.currentModelIndex].styleTrack.color = "";
          }
        }
        return temp;
      })
    });
    const changePage = current => {
      state.currentPage = current;
    };
    const getCurrentModelReport = () => {};
    // 创建新模型
    const createNewModel = () => {
      root.$store.state.selectedIndexs.splice(
        0,
        root.$store.state.selectedIndexs.length
      );
      root.$router.push("/model/selectStock");
    };
    // 编辑模型
    const editModel = () => {
      //          首先删除所有存在的指标
      root.$store.state.andOrNot = "customize";
      resolveIndicator(
        state.$store.state.selectedIndexs,
        state.myModels[state.currentModelIndex].modelPara,
        root.$store.state.controller,
        root.$store.state.symbol
      );
      resolveParaLock(
        state.myModels[this.currentModelIndex].modelPara,
        root.$store.state.selectedIndexs
      );
      root.$router.push("/model/selectStock");
    };
    function deleteModel() {}
    const addTrack = () => {};
    const cancelTrack = () => {};
    return {
      state,
      changePage,
      getCurrentModelReport,
      createNewModel,
      editModel,
      deleteModel,
      addTrack,
      cancelTrack
    };
  },
  components: {
    // AllReport
  }
};
</script>
<style lang="scss" rel="stylesheet" scoped>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
