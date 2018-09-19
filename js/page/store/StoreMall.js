import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Button,
    ImageBackground,
} from 'react-native';
import BaseComponent, {BaseStyles} from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from '../../util/Utils';
import StoreCommon from '../../common/StoreCommon';
import AdView from '../../common/AdView';
import HorizontalMenu from '../../common/HorizontalMenu';
import SplashScreen from "react-native-splash-screen"
import Colors from "../../util/Colors";
import RefreshFlatList from "../../common/RefreshFlatList";
import BaseUrl from "../../util/BaseUrl";
import UserInfo from "../../model/UserInfo";
import HttpUtils from "../../util/HttpUtils";
import DialogUtils from "../../util/DialogUtils";
import FastImage from 'react-native-fast-image'

const window_width = Utils.getWidth()
//商城首页
const window_w = Utils.getWidth();
export default class StoreMall extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            typeTitle:["全部"],
        }
        this.userInfo = this.getUserInfo();
        this.typeTitleData =[]
        this.typeId = 0;

    }

    //界面加载完成
    componentDidMount() {
        SplashScreen.hide()
        this._refreshData()
        this.getCateList()
        //加载商品的分类
        // this.getCateList();
    }
    /**
     * 获取商品分类
     */
    getCateList() {
        let url = BaseUrl.getCateList()
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    this.typeTitleData = result.data
                    this.setState({
                        typeTitle:this.getTypeName(result.data),
                    })
                }
            })
    }

    getTypeName(data){
        let nameArr = []
        data.map((value,index)=>{
            nameArr.push(value.name)
        })
         nameArr =  ["全部"].concat(nameArr)
        // alert(nameArr.toString())
        return nameArr;
    }

    render() {
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                <NavigationBar
                    title='购物中心'
                    navigation={this.props.navigation}
                    titleView={() => this.searchView()}
                    //rightView={NavigationBar.getRightStyle_View(require("../../../res/images/dingdan-shang.png"),()=>this.onClicks(1))}
                    rightView={this.getRightStyle_View()}
                />
                <View style={{marginBottom: 5, flexDirection: "column"}}>
                    <HorizontalMenu
                        data={this.state.typeTitle}
                        titleStyle={{color: Colors.text3, fontSize: 16, marginLeft: 10, marginRight: 10}}
                        activeTitleStyle={{color: Colors.mainColor, fontSize: 16, marginLeft: 10, marginRight: 10}}
                        onSegmentedBarChange={(index, value) => {
                            if (index){
                                this.typeId = this.typeTitleData[index-1].id
                            }else {
                                this.typeId = 0
                            }
                            this._refreshData()
                            //alert(index + value)
                        }}/>
                </View>
                <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        numColumns={2}
                        minLength={10}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={() => this._onLoadData()}
                        isDownLoad={true}
                        ListHeaderComponent={() => this._headView()}
                        renderItem={(items) =>  this._getStore(items)}/>
                </View>
                {/*<StoreCommon navigation={this.props.navigation} tabLabel='商品列表' numColumns={2} {...this.props}/>*/}
            </View>
        );
    }

    _headView() {
        return <View style={{marginBottom: 5, flexDirection: "column", backgroundColor: Colors.white}}>
            <AdView
                {...this.props}
                action={"store"}
                height={Utils.getWidth() / 3}/>
        </View>
    }

    //刷新数据
    _refreshData() {
        //获取经纬度 并赋值给全局变量
        this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(true)
    }

    //加载更多数据
    _onLoadData() {
        this.getData(false)
    }

    /**
     * 获取数据
     * @param {*} isRefesh  是否刷新
     * @param {*} pageIndex
     */
    getData(isRefesh) {
        this.url = BaseUrl.getHomeShop(this.userInfo.sessionId, this.pageIndex,this.typeId)
        //alert(this.url)
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无数据")
                        }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                } else if (result.code === 2 || result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })

    }

    /** 商品
     * 绘制itemView
     * 3.1    id        商品id
     3.2    goodsName        商品名称
     3.3    goodsPrice        商品价格
     3.4    goodsStock        商品库存
     3.5    coverPlan        商品封面图
     3.6    shopId        店铺id
     * @param data
     * @returns {*}
     * @private
     */
    _getStore(data) {
        return <View
            style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                marginBottom: 4,
                flexDirection: "column",
                marginLeft: 2,
                marginRight: 2,
                maxWidth: window_width / 2 - 4,
            }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{width: window_w / 2 - 4, height: window_w / 2,}}
                onPress={(item) => this.goDetails(data.item)}>
                <FastImage
                    style={{width: window_w / 2 - 4, height: window_w / 2,}}
                    source={{uri: this.getImgUrl(data.item.coverPlan)}}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>

            <View style={{
                flexDirection: 'column',
                padding: 5,
                height: 60,
                justifyContent: "center",
                alignContent: "center"
            }}>
                <Text style={{color: "#333333", fontSize: 18,}} numberOfLines={1}>
                    {data.item ? data.item.goodsName : "name"}</Text>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{
                        color: "#d11",
                        fontSize: 15,
                    }}>￥{data.item.goodsPrice}</Text>
                    <Text style={{
                        color: "#888",
                        fontSize: 15,
                        marginLeft: 30,
                    }}>库存:{data.item.goodsStock}</Text>
                </View>
            </View>
        </View>
    }

    /**
     * 去商品详情
     * @param {*} item
     */
    goDetails(item) {
        this.props.navigation.navigate('ShopDetails', {
            shopId: item.id,
        });
    }

    searchView() {
        return (<View style={{flexDirection: "row", alignItems: "center", position: "absolute", left: 0}}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.onClicks(2)}
                style={{justifyContent: "center", alignItems: "center",}}
            >
                <View style={{
                    marginLeft: 0,
                    width: 240,
                    backgroundColor: "#fff",
                    height: 35,
                    borderRadius: 18,
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <Image style={{height: 30, width: 30, marginLeft: 10, padding: 5,}}
                           source={require("../../../res/images/sousuo-shang.png")}/>

                    <Text
                        style={[{
                            fontSize: 13, color: '#999', backgroundColor: "#fff", marginRight: 20, padding: 10,
                            borderColor: "#ccc",
                        }]}
                    >请输入商品名称</Text>
                </View></TouchableOpacity>
        </View>);
    }

    //导航右边更多按钮
    getRightStyle_View() {
        return (
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.onClicks(0)}
                >
                    <Image
                        style={{width: 25, height: 25, padding: 5,marginRight:10,marginLeft:10}}
                        source={require("../../../res/images/dianpu-3.png")}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.onClicks(1)}
                >
                    <Image
                        style={{width: 25, height: 25, padding: 5, marginLeft: 10}}
                        source={require("../../../res/images/dingdan-shang.png")}/>
                </TouchableOpacity>
            </View>)
    }

    onClicks(index) {
        switch (index) {
            case 0://店铺列表
                this.props.navigation.navigate('StoreList');
                break;
            case 1://我的订单
                this.props.navigation.navigate('MyOrder');
                break;
            case 2://搜索商品
                this.props.navigation.navigate('SearchStore');
                break;
            default:
                break;
        }
    }
}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
});