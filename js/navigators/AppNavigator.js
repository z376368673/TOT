import React from 'react'
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation'
import Welcome from '../page/Welcome'
import AboutOur from '../page/AboutOur'
import ImageBorwser from '../page/ImageBorwser'
import HomePage from "../page/HomePage";
import SettingView from "../page/setting/SettingView";
import SaoSaoView from "../page/SaoSaoView";
import ZhuanRu from "../page/ZhuanRu";
import ZhuanChu from "../page/ZhuanChu";
import ZhuanChuNext from "../page/ZhuanChuNext";

import TranMoneyRecord from "../page/TranMoneyRecord";
import SharedRecord from "../page/SharedRecord";
import JiHuo from "../page/JiHuo";
import JiHuoNext from "../page/JiHuoNext";
import BuyPage from "../page/BuyPage";
import SellPage from "../page/SellPage";
import ExcIntegral from "../page/ExcIntegral";
import YueOrIntegralRecord from "../page/YueOrIntegralRecord";
import ExcinttegralRecord from "../page/ExcinttegralRecord";

import BuyOrSellCentre from "../page/BuyOrSellCentre";
import Country from "../page/Country";
import BuyOrSellRecord from "../page/BuyOrSellRecord";
import BuyOrSellUnfinishedOrder from "../page/BuyOrSellUnfinishedOrder";
import BuyOrSellOrde from "../page/BuyOrSellOrder";
import ModifyNickName from "../page/setting/ModifyNickName";
import BankCardList from "../page/setting/BankCardList ";
import AddBankCard from "../page/setting/AddBankCard";
import SharePage from "../page/setting/SharePage";
import ModifyPassWord from "../page/setting/ModifyPassWord";
import ForgetPassWord from "../page/setting/ForgetPassWord";
import NoticeList from "../page/setting/NoticeList";
import NoticDetails from "../page/setting/NoticDetails";
import MyNoticDetails from "../page/setting/MyNoticDetails";
import MyNoticeList from "../page/setting/MyNoticeList";
import AddressList from "../page/setting/AddressList";
import EditAddress from "../page/setting/EditAddress";
import Complaint from "../page/setting/Complaint";
import RegisterPage from "../page/setting/RegisterPage";
import LoginPage from "../page/setting/LoginPage";
import ApplyStore from "../page/store/ApplyStore";
import MyStore from "../page/store/MyStore";
import BusinessUnion from "../page/store/BusinessUnion";
import BusinessUnionInfo from "../page/store/BusinessUnionInfo";
import ApplyBusiness from "../page/store/ApplyBusiness";
import AddShop from "../page/store/AddShop";
import StoreMall from "../page/store/StoreMall";
import SearchStore from "../page/store/SearchStore";
import ShopDetails from "../page/store/ShopDetails";
import StoreDetails from "../page/store/StoreDetails";
import MyStoreOrder from "../page/store/MyStoreOrder";
import CreatOrder from "../page/store/CreatOrder";
import StoreList from "../page/store/StoreList";
import ShopingType from "../page/store/ShopingType";
import MyOrder from "../page/setting/MyOrder";
import PassNumInput from "../common/PassNumInput";
import NumberHome from "../page/number/NumberHome"
import TransactionRecord from "../page/number/TransactionRecord"
import TranWepay from "../page/number/TranWepay"
import ZhongChou from "../page/number/ZhongChou"
import ZhongChouRecord from "../page/number/ZhongChouRecord"
import TradeHome from "../page/number/TradeHome"
import TradeHome1 from "../page/number/TradeHome1"

import EchartsDemo from "../page/number/EchartsDemo"
import CreateBSOrder from "../page/number/CreateBSOrder"
import Wbao from "../page/number/Wbao"
import TranWB from "../page/number/TranWB"
import OrderRecord from "../page/number/OrderRecord"
import TeadeRecord from "../page/number/TeadeRecord"


export default AppNavigator = createStackNavigator({
    // PassNumInput: {//密码输入
    //     screen: PassNumInput
    // },

    LoginPage: {//登陆
        screen: LoginPage
    },
    HomePage: {//首页
        screen: HomePage
    },

    NumberHome: {//数字资产
        screen: NumberHome
    },

    TransactionRecord: {//交易记录
        screen: TransactionRecord
    },
    TranWepay: {//Wepay转出
        screen: TranWepay
    },
    ZhongChou: {//众筹
        screen: ZhongChou
    },
    ZhongChouRecord: {//众筹项目记录
        screen: ZhongChouRecord
    },
    Wbao: {//W宝
        screen: Wbao
    },
    TranWB: {//W宝 转出 转入 锁定
        screen: TranWB
    },

    TradeHome: {//交易
        screen: TradeHome
    },
    TradeHome1: {//交易
        screen: TradeHome1
    },
    TeadeRecord: {//交易记录
        screen: TeadeRecord
    },

    CreateBSOrder: {//发布购买卖出订单
        screen: CreateBSOrder
    },
    OrderRecord: {//订单记录
        screen: OrderRecord
    },

    EchartsDemo: {//统计图
        screen: EchartsDemo
    },

    SettingView: {//设置
        screen: SettingView
    },
    AddBankCard: {//添加银行卡
        screen: AddBankCard
    },
    StoreMall: {//商城首页
        screen: StoreMall
    },
    SearchStore: {//搜索界面
        screen: SearchStore
    },
    MyOrder: {//我的订单
        screen: MyOrder
    },
    MyStoreOrder: {//店铺订单
        screen: MyStoreOrder
    },

    SharePage: {//分享好友
        screen: SharePage
    },

    ShopDetails: {//商品详情
        screen: ShopDetails
    },

    CreatOrder: {//创建订单界面 支付界面
        screen: CreatOrder
    },

    StoreList: {//店铺列表
        screen: StoreList
    },
    ShopingType: {//特类商品
        screen: ShopingType
    },
    StoreDetails: {//店铺详情
        screen: StoreDetails
    },
    AddShop: {//添加商品
        screen: AddShop
    },
    MyStore: {//我的店铺
        screen: MyStore
    },
    BusinessUnion: {//商家联盟
        screen: BusinessUnion
    },
    BusinessUnionInfo: {//商家联盟
        screen: BusinessUnionInfo
    },
    ApplyBusiness: {//申请成为代理
        screen: ApplyBusiness
    },

    RegisterPage: {//注册
        screen: RegisterPage
    },

    YueOrIntegralRecord: {// 余额,积分记录
        screen: YueOrIntegralRecord
    },
    ExcinttegralRecord: {// 积分兑换记录
        screen: ExcinttegralRecord
    },
    BuyOrSellRecord: {// 买入/卖出记录 
        screen: BuyOrSellRecord
    },
    BuyOrSellUnfinishedOrder: {// 买入/卖出 未完成订单
        screen: BuyOrSellUnfinishedOrder
    },
    BuyOrSellOrde: {// 买入/卖出  的订单
        screen: BuyOrSellOrde
    },
    ZhuanRu: { //转入
        screen: ZhuanRu
    },
    ZhuanChu: {//转出
        screen: ZhuanChu
    },
    ZhuanChuNext: {//转出 下一步
        screen: ZhuanChuNext
    },
    TranMoneyRecord: { //转入转出记录
        screen: TranMoneyRecord
    },
    SharedRecord: { //分享记录
        screen: SharedRecord
    },

    JiHuo: { //激活
        screen: JiHuo
    },

    JiHuoNext: { //激活
        screen: JiHuoNext
    },

    ExcIntegral: {//兑换积分
        screen: ExcIntegral
    },

    BuyPage: { //买入
        screen: BuyPage
    },
    SellPage: { //卖入
        screen: SellPage
    },

    BuyOrSellCentre: { //买入\卖出中心
        screen: BuyOrSellCentre
    },

    SaoSaoView: {//扫一扫界面
        screen: SaoSaoView
    },
    ModifyNickName: {//修改昵称
        screen: ModifyNickName
    },
    BankCardList: {//我的银行卡
        screen: BankCardList
    },
    ModifyPassWord: {//修改 登陆/支付 密码
        screen: ModifyPassWord
    },
    ForgetPassWord: {//忘记 登陆/支付 密码
        screen: ForgetPassWord
    },
    NoticeList: {//公告消息列表
        screen: NoticeList
    },
    MyNoticeList: {//个人消息列表
        screen: MyNoticeList
    },
    NoticDetails: {//公告详情
        screen: NoticDetails
    },
    MyNoticDetails: {//个人消息详情
        screen: MyNoticDetails
    },
    AddressList: {//地址管理
        screen: AddressList
    },
    EditAddress: {//编辑地址
        screen: EditAddress
    },
    Complaint: {//投诉建议
        screen: Complaint
    },

    ApplyStore: {//店铺申请认证
        screen: ApplyStore
    },

    ImageBorwser: {//图片浏览器 查看图片 
        screen: ImageBorwser
    },
    Country: {//选择国家 
        screen: Country
    },

    AboutOur: {
        screen: AboutOur,
    },
    Welcome: {//欢迎页 
        screen: Welcome,
        path: 'app/homeTwo',//使用url导航时用到, 如 web app 和 Deep Linking
        //navigationOptions: {}  // 此处设置了, 会覆盖组件内的`static navigationOptions`设置. 具体参数详见下文
    },

}, {
    initialRouteName: 'LoginPage', // 默认显示界面
    //initialRouteName: 'TradeHome', // 默认显示界面
    //initialRouteName: 'EchartsDemo', // 默认显示界面

    mode: 'card',
    navigationOptions: {
        header: null,
        cardStack: {
            gesturesEnabled: true  // 是否允许右滑返回，在iOS上默认为true，在Android上默认为false
        }
    }
})

// navigation
// 在StackNavigator中注册后的组件都有navigation这个属性. navigation又有5个参数:navigate, goBack, state, setParams, dispatch, 可以在组件下console.log一下this.props就能看到.
// this.props.navigation.navigate('Two', { name: 'two' }): push下一个页面
// routeName: 注册过的目标路由名称
// params: 传递的参数
// action: 如果该界面是一个navigator的话，将运行这个sub-action
// this.props.navigation.goBack(): 返回上一页
// this.props.navigation.state: 每个界面通过这去访问它的router，state其中包括了：
// routeName: 路由名
// key: 路由身份标识
// params: 参数
// this.props.navigation.setParams: 该方法允许界面更改router中的参数，可以用来动态的更改导航栏的内容
// this.props.navigation.dispatch: 可以dispatch一些action，主要支持的action有：

// Navigate:
//   import { NavigationActions } from 'react-navigation'
//   const navigationAction = NavigationActions.navigate({
//     routeName: 'Profile',
//     params: {},
//     // navigate can have a nested navigate action that will be run inside the child router
//     action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
//   })
//   this.props.navigation.dispatch(navigationAction)


// Reset: Reset方法会清除原来的路由记录，添加上新设置的路由信息, 可以指定多个action，index是指定默认显示的那个路由页面, 注意不要越界了
//   import { NavigationActions } from 'react-navigation'
//   const resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//       NavigationActions.navigate({ routeName: 'Profile'}),
//       NavigationActions.navigate({ routeName: 'Two'})
//     ]
//   })
//   this.props.navigation.dispatch(resetAction)


// SetParams: 为指定的router更新参数，该参数必须是已经存在于router的param中
//   import { NavigationActions } from 'react-navigation'
//   const setParamsAction = NavigationActions.setParams({
//     params: {}, // these are the new params that will be merged into the existing route params
//     // The key of the route that should get the new params
//     key: 'screen-123',
//   })
//   this.props.navigation.dispatch(setParamsAction)
