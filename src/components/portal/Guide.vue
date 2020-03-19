<template>
  <Row type="flex" justify="center">
    <i-col :xs="20" :sm="16" :lg="12" style="padding: 1rem">
      <Row type="flex" justify="center">
        <i-col span="10">
          <hr>
        </i-col>
        <i-col span="4">
          <p style="text-align: center;font-size: 1.5rem;margin-top: -1rem">新手导航</p>
        </i-col>
        <i-col span="10">
          <hr>
        </i-col>
      </Row>
    </i-col>
    <i-col :xs="24" :sm="24" :lg="18" style="padding: 1rem">
      <Row type="flex" justify="center">
        <i-col span="2" style="text-align: center">
            <Icon type="ios-person-add" size="56" style="color: #2d8cf0"></Icon>
          <p>注册</p>
        </i-col>
        <i-col span="1">
          <Icon type="ios-arrow-round-forward" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="md-trending-up" size="56" style="color: #2d8cf0"></Icon>
            <!--<Icon type="settings" ></Icon>-->
          <p>创建模型</p>
        </i-col>
        <i-col span="1">
           <Icon type="ios-arrow-round-forward" size="56"></Icon>
        </i-col>
        <!--<Icon type="ios-arrow-thin-right"></Icon>-->
        <i-col span="2" style="text-align: center">
          <Icon type="md-settings" size="56" style="color: #2d8cf0"></Icon>
            <!--<Icon type="laptop" size="56"></Icon>-->
         <p>回测</p>
        </i-col>
        <i-col span="1">
           <Icon type="ios-arrow-round-forward" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="ios-bookmark" size="56" style="color: #2d8cf0"></Icon>
          <p>保存模型</p>
        </i-col>
        <i-col span="1">
           <Icon type="ios-arrow-round-forward" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="ios-home" size="56" style="color: #2d8cf0"></Icon>
          <p>我的模型</p>
        </i-col>
        <i-col span="1">
           <Icon type="ios-arrow-round-forward" size="56"></Icon>
        </i-col>
        <i-col span="2" style="text-align: center">
          <Icon type="ios-paw" size="56" style="color: #2d8cf0"></Icon>
          <p>实盘跟踪</p>
        </i-col>
      </Row>
    </i-col>
  </Row>
</template>
<script>

  export default {}
</script>
<style rel="stylesheet" scoped>
  .icon {
    width: 5rem;
    height: 5rem;
    margin: auto;
  }
  p {
    font-size: 1.2rem;
  }
</style>
