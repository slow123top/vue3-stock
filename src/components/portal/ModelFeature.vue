<template>
  <Row type="flex" justify="center" style="padding: 1rem;margin-bottom: 1rem;margin-top: 3rem">
    <i-col span="4" style="border-right: 1px solid;">
      <div class="model" @click="$router.push('model')">
        <div class="icon">
          <Icon type="md-plane" size="48" color="#5b9dde"></Icon>
        </div>
        <p>
          单次回测
          <br />
          <span>
            验证特定模型在历史上的表现
            <br />允许设计试验新的模型
            <br />提供多种初始模型，可直接回测
          </span>
        </p>
      </div>
    </i-col>
    <i-col span="4" style="border-right: 1px solid;">
      <div class="model" @click="createModel">
        <div class="icon">
          <Icon type="ios-jet" size="48" color="#5b9dde"></Icon>
        </div>
        <p class="t-name">
          智能回测
          <br />
          <span>使用先进算法自动优化模型</span>
        </p>
      </div>
    </i-col>
    <i-col span="4" style="border-right: 1px solid;">
      <div class="model" @click="modelStorage">
        <div class="icon">
          <Icon type="md-cloudy" size="48" color="#5b9dde"></Icon>
        </div>
        <p class="t-name">
          模型仓库
          <br />
          <span>持续更新可供改进和组装的基础模型</span>
        </p>
      </div>
    </i-col>
    <i-col span="4">
      <div class="model" @click="myModel">
        <div>
          <Icon type="ios-home" size="48" color="#5b9dde"></Icon>
        </div>
        <p>
          我的模型
          <br />
          <span>
            便捷存储
            <br />灵活操作自存量化模型
          </span>
        </p>
      </div>
    </i-col>
  </Row>
</template>
<script>
export default {
  setup(props, { root }) {
    // const state = reactive({
    //   router: useRoute()
    // });
    function createModel() {
      root.$router.push("/model/newModel");
    }
    const myModel = () => {
      root.$router.push("/model/myModel");
    };
    const modelStorage = () => {
      root.$router.push("/model/modelstorage");
    };

    return {
      createModel,
      myModel,
      modelStorage
    };
  }
};
</script>
<style rel="stylesheet" scoped>
.model {
  /*background-color: #3f913f;*/
  margin: auto;
  width: 100%;
  height: 16rem;
  float: left;
  cursor: pointer;
  text-align: center;
  transition: 500ms;
}
.model:hover {
  background-color: #e5e5e5;
}
.model div {
  width: 3rem;
  height: 3rem;
  margin: auto;
}

.model .t-name {
  margin-top: 2rem;
}
.model p {
  height: 10rem;
  vertical-align: bottom;
  text-align: center;
  font-size: 1.5rem;
  color: #000000;
}
.model p span {
  font-size: 1rem;
  color: #657180;
}
</style>
