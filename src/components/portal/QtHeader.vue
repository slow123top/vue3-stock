<template>
  <Row type="flex" justify="space-between" style="height: 4rem;border-bottom: 1px solid #e3e8ee">
    <i-col :xs="1" :sm="3" :lg="4" offset="2">
      <router-link to="/portal">
      <!-- <img src="../../assets/img/logo.png" alt="千投量化" />-->
        
      </router-link>
    </i-col>
    <i-col :xs="17" :sm="16" :lg="12" style="padding: 1rem 0">
      <Row class="menu" type="flex" justify="end">
        <i-col span="3">
          <router-link to="/" style="color: #000000">首页</router-link>
        </i-col>
        <i-col span="3">
          <Dropdown trigger="click" @click="createModel">
            <a class="m-children" href="javascript:void(0)">
              创建模型
              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="once">单次回测</Dropdown-item>
              <Dropdown-item name="intelligent">智能回测</Dropdown-item>
              <Dropdown-item name="once-record">单次回测记录</Dropdown-item>
              <Dropdown-item name="intelligent-record">智能回测记录</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </i-col>
        <i-col span="3" style="color: #000000">
          <a class="m-children" @click="modelStorage">模型仓库</a>
        </i-col>
        <i-col span="3">
          <a class="m-children" @click="myModel">我的模型</a>
        </i-col>
        <i-col span="3">
          <a class="m-children" @click="getTrackModel">实盘跟踪</a>
        </i-col>
        <i-col span="3">
          <Dropdown trigger="click" @on-click="selectReacharge">
            <a class="m-children" href="javascript:void(0)">
              充值中心
              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="point">充值点数</Dropdown-item>
              <Dropdown-item name="card">购买回测卡</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </i-col>
        <i-col span="3">
          <Dropdown trigger="click" @on-click="selectHelp">
            <a class="m-children" href="javascript:void(0)">
              更多
              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <Dropdown-item name="guide">新手指南</Dropdown-item>
              <Dropdown-item name="intelligent">智能回测</Dropdown-item>
              <Dropdown-item name="question">常见问题</Dropdown-item>
              <Dropdown-item name="about">关于我们</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </i-col>
      </Row>
    </i-col>
    <i-col :xs="3" :sm="3" :lg="5" style="padding: .5rem 0">
      <Button type="primary" size="large" style="width: 5rem" @click="login">登录</Button>
      <Button size="large" style="width: 5rem" @click="register">注册</Button>
      <!--我的点数-->
      <Tooltip :content="'昵称：'" placement="right">
        <Dropdown
          trigger="click"
          @on-click="selectMenu"
          style="margin-left: 20px;font-size: 1rem;margin-top: .3rem;"
          v-if="state.isLogin"
        >
          <a href="javascript:void(0)" style="font-weight: bold">
            <!--{{$store.state.user.nickName}}-->
            <span
              style="display: inline-block;margin-bottom:-.5rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap"
            >{{''}}</span>
            <Icon type="arrow-down-b"></Icon>
          </a>
          <Dropdown-menu slot="list" style="z-index: 999">
            <Dropdown-item name="personal-main">个人主页</Dropdown-item>
            <Dropdown-item name="recharge">充值点数</Dropdown-item>
            <Dropdown-item name="buycard">购买回测卡</Dropdown-item>
            <Dropdown-item name="logout">注销</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </Tooltip>
    </i-col>
  </Row>
</template>
<script>
import { reactive } from "@vue/composition-api";
// import Login from "./user/Login";
export default {
  setup(props,{root}) {
    const state = reactive({
      logining: false,
      nickName: "",
      logiSrc: "../../assets/img/logo.png",
      isLogin: true
    });
    const createModel = (params) => {
      if (root.$store.state.user.isLogin) {
        switch (params) {
          case "once":
            root.$router.push("/model/selectStock");
            break;
          case "intelligent":
            root.$router.push("/model/selectStock");
            break;
          case "once-record":
            // root.$router.push("/model/history");
            break;
          case "intelligent-record":
            // this.$router.push("/model/genetictest");
            break;
          default:
            break;
        }
      } else {
        //
      }
    };
    const modelStorage = () => {
      // this.$router.push("/model/modelstorage");
    };
    const myModel = () => {
      // if (this.$store.state.user.isLogin) {
        root.$router.push("/model/personalModel");
      // } else {
      //   /*  */
      // }
    };
    const getTrackModel = () => {
      //          进入实盘跟踪
      // if (this.$store.state.user.isLogin) {
      //   this.$router.push("/model/trackmodel");
      // } else {
      //   //
      // }
    };
    const login = () => {
      //        this.logining = true;
      root.$router.push("/login");
    };
    const register = () => {
      root.$router.push("/register");
    };
    const useModel = name => {
      switch (name) {
        case "my-model":
          this.$router.push("/model/personalModel");
          break;
        case "model-storage":
          this.$router.push("/model/modelstorage");
          break;
        default:
          break;
      }
    };
    const selectReacharge = name => {
      switch (name) {
        case "point":
          root.$router.push("/personalInfo/recharge");
          break;
        case "card":
          root.$router.push("/personalInfo/buycard");
          break;
      }
    };
    const selectMenu = name => {
      switch (name) {
        case "personal-main":
          root.$router.push("/personalInfo");
          break;
        case "personal-model":
          root.$router.push("/model/personalModel");
          break;
        case "recharge":
          root.$router.push("/personalInfo/recharge");
          break;
        case "buycard":
          root.$router.push("/personalInfo/buycard");
          break;
        case "logout":
          //            注销
          // localStorage.clear();
          // this.$store.commit("ISLOGIN", {
          //   isLogin: false,
          //   email: "",
          //   nickName: "",
          //   points: "",
          //   myPoints: ""
          // });
          //            getRemoteReqTodo('/user/logout',[],[]);
          // location.href = "/user/logout";
          //            this.$router.push('/portal');
          break;
      }
    };
    const selectHelp = name => {
      switch (name) {
        case "question":
          root.$router.push("/help");
          break;
        case "guide":
          root.$router.push("/help/guide");
          break;
        case "intelligent":
          root.$router.push("/help/geneticdoc");
          break;
        case "about":
          root.$router.push("/help/about");
          break;
      }
    };
    return {
      state,
      createModel,
      modelStorage,
      myModel,
      getTrackModel,
      login,
      register,
      useModel,
      selectReacharge,
      selectMenu,
      selectHelp
    };
  },
  methods: {},
  components: {
    // Login
  }
};
</script>
<style rel="stylesheet" scoped>
.layout-header {
  height: 4rem;
  background-color: #ffffff;
}

.menu {
  font-size: 1rem;
  color: #000000;
}

a.m-children {
  color: #495060;
}

img {
  width: 12rem;
  height: 3.5rem;
}
</style>
