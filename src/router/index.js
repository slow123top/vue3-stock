/**
 * Created by Hu_2015 on 2017/2/26.
 */
import Vue from 'vue'
import Route from 'vue-router'
// import HomePage from '../components/article/HomePage'


// import Article from '../components/backstage/Article'
// import Official from '../components/backstage/Officialannounce'
// import store from '../vuex/store'
// //门户
import Portal from '../components/portal/Portal'
// //登录和注册
import Login from '../components/user/Login'
import Register from '../components/user/Register'
import ForgetPasswd from '../components/user/ForgetPasswd'
// import NotFound from '../components/NotFound'

//模型模块
import Model from '../components/stock/Stock'
import SelectStock from '../components/stock/StockParameter'

// import Result from '../components/stock/Result'
import PersonalModel from '../components/model/PersonalModel'
// import Track from '../components/stock/Track'
// import History from '../components/stock/History'
// import ModelStorage from '../components/stock/ModelStroage.vue'
// import RuleTalk from '../components/stock/RuleTalk.vue'
// import GeneticTest from '../components/stock/GeneticTest'

//个人信息
import PersonalInfo from '../components/manage/PersonalInfo'
import Recharge from '../components/manage/Recharge'
import BuyCard from '../components/manage/BuyCard'
import MyWallet from '../components/manage/MyWallet'
import BuyCardRecord from '../components/manage/BuyCardRecord'
import RechargeRecord from '../components/manage/RechargeRecord'
import DeducPoints from '../components/manage/DeducPoints'
import UpdatePasswd from '../components/manage/UpdatePasswd'
import Phone from '../components/manage/Phone'
import Email from '../components/manage/Email'
//说明文档模块
import Document from '../components/about/Document'
import CompanyState from '../components/about/CompanyState'
import Question from '../components/about/Question'
import Guide from '../components/about/Guide'
import About from '../components/about/About'
import GeneticDoc from '../components/about/GeneticDoc'
Vue.use(Route)
export const router = new Route({
  //创建路由
  // mode: 'history',
  routes: [
    {
      name: 'portal',
      path: '/portal',
      title: '首页',
      meta: {
        title: '用户中心'
      },
      component: Portal
    },
    {
      path: '/',
      redirect: '/portal'
    },
    {
      path: '/model',
      component: Model,
      children: [{
        //创建新模型
        name: 'selectStock',
        path: 'selectStock',
        component: SelectStock
      },
      {
        //我的模型
        name: 'personalModel',
        path: 'personalModel',
        component: PersonalModel
      }
      ]
    },
    {
      path: '/help',
      component: Document,
      children: [
        {
          name: 'companystate',
          path: 'companystate',
          component: CompanyState
        },
        {
          name: 'question',
          path: 'question',
          component: Question
        }, {
          path: '/help',
          redirect: '/help/question'
        }, {
          path: 'guide',
          component: Guide
        },
        {
          path: 'about',
          component: About
        },
        {
          path: 'geneticdoc',
          component: GeneticDoc
        }
        // {
        //   name: 'exemption',
        //   path: 'exemption',
        //   component: Mianze
        // }
      ]
    },
    // 个人信息
    {
      name: 'personalInfo',
      path: '/personalInfo',
      component: PersonalInfo,
      children: [
        {
          //修改密码
          path: 'updatepasswd',
          component: UpdatePasswd
        },
        {
          //手机设置
          path: 'phone',
          component: Phone
        },
        {
          //邮箱设置
          path: 'email',
          component: Email
        },
        {
          //充值
          path: 'recharge',
          component: Recharge
        },
        {
          path: 'buycard',
          component: BuyCard
        }, {
          path: 'mywallet',
          component: MyWallet
        },
        {
          path: '/personalInfo',
          redirect: '/personalInfo/mywallet'
        },
        {
          path: 'buycardrecord',
          component: BuyCardRecord
        },
        {
          path: 'rechargerecord',
          component: RechargeRecord
        },
        {
          path: 'deducpoints',
          component: DeducPoints
        }
      ]
    },
    //忘记密码
    {
      path: '/forgetpassword',
      name: 'forgetPassword',
      component: ForgetPasswd
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
  ]

})

// const RouteSymbol = Symbol();
// export const provideRoute = () => {
//   provide(RouteSymbol, reactive(router));
// }

// export const useRoute = () => {
//   const router = inject(RouteSymbol)
//   return router;
// }



    // {
    //   path: '/home',
    //   name: 'home',
    //   component: HomePage
    // },
    // {
    //   path: '/notfound',
    //   component: NotFound
    // },


    // // 我的模型 创建模型  历史回测

    // }

    //     {
    //       path: 'modelstorage',
    //       component: ModelStorage
    //     },
    //     {
    //       path: 'trackmodel',
    //       component: Track
    //     },
    //     {
    //       //历史回测
    //       path: 'history',
    //       component: History
    //     },
    //     {
    //       path: '/model',
    //       redirect: '/model/newModel'
    //     },
    //     {
    //       path: 'singletest',
    //       component: Result,

    //     },
    //     {
    //       path: 'ruletalk',
    //       component: RuleTalk
    //     },
    //     // {
    //     //   path: 'genetictest',
    //     //   component: GeneticTest
    //     // },
    //     {
    //       path: 'genetictest',
    //       component: GeneticTest
    //     }
    //   ]
    // },
    // {
    //   path: '/backstage/article', //

    //   name: 'article',
    //   component: Article

    // }, {
    //   path: '/backstage/official',
    //   name: 'official',
    //   component: Official
    // },
    // //个人信息


