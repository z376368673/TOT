import React, { Component } from 'react';
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
import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import BaseUrl from "../../util/BaseUrl";
import { SegmentedBar, Drawer } from 'teaset';
import Utils from '../../util/Utils';
import StoreCommon from '../../common/StoreCommon';
import SplashScreen from "react-native-splash-screen"
import ViewUtils from '../../util/ViewUtils';
import RefreshFlatList from "../../common/RefreshFlatList"
import DialogUtils from '../../util/DialogUtils';
import UserInfo from "../../model/UserInfo";
import FastImage from "react-native-fast-image";
import Colors from "../../util/Colors";

//商铺列表

const window_w = Utils.getWidth()/3-10;
export default class StoreList extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
        this.userInfo = this.getUserInfo();
        this.longitude = 114.122618
        this.latitude = 22.540178

    }
    //界面加载完成
    componentDidMount() {
        // 每次进入商城 刷新获取一下经纬度
       // this._refreshData()
        Utils.getLocation((coords) => {
                this.longitude = coords.longitude
                this.latitude = coords.latitude
                this._refreshData()
            },
            (error)=>{
                DialogUtils.showToast(error+"")
                this._refreshData()
            }
        )
    }
      //刷新数据
    _refreshData() {
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
        this.url = BaseUrl.getStoreList(this.userInfo.sessionId,
            this.pageIndex, this.longitude, this.latitude)
       // alert(JSON.stringify(this.url))
        HttpUtils.getData(this.url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                   
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无消息") }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                    if(result.data.length<1){
                        DialogUtils.showToast("暂无数据")
                    }
                }  else if(result.code === 2||result.code === 4){
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
                    DialogUtils.showToast(result.msg)
                }
            })
           
    }

    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    navigation={this.props.navigation}
                    title={"店铺"}
                />
                <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
                <RefreshFlatList
                    ref={refList => this.refList = refList}
                    isDownLoad ={true}
                    minLength={10}
                    onRefreshs={() => this._refreshData()}
                    onLoadData={() => this._onLoadData()}
                    renderItem={(items) =>  this._getStoreMall(items)} />
                </View>
            </View>
        );
    }


    /**商铺
     * 绘制itemView
     * @param data
     * @returns {*}
     * 3.1	id		店铺id
     3.2	uid		用户id
     3.3	shopName		店铺名称
     3.4	shopAddress		店铺地址
     3.5	imgHead		头像
     3.6	distance		距离（单位米）
     * @private
     */
    _getStoreMall(data) {
        var distance;
        if (data.item.distance > 1000) {
            distance = data.item.distance / 1000 + "千米"
        } else {
            distance = data.item.distance + "米"
        }
        return <View style={{marginBottom: 8,}}><View
            style={{
                backgroundColor: '#fff',
                alignItems: 'center',

                flexDirection: 'row',
                padding: 10
            }}>
            <Image
                style={{ width: 60, height: 60, borderWidth: 1, borderRadius: 30, borderColor: "#d11" }}
                source={{ uri: this.getImgUrl(data.item.imgHead) }} />
            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10, }}>
                <Text
                    style={{ color: "#333333", fontSize: 18 }}>{data.item ? data.item.shopName : "name"}</Text>
                <View style={{ marginTop: 5, flexDirection: "column" }}>
                    <Text style={{
                        color: "#888",
                        fontSize: 15,
                        flex: 1,
                    }}
                          numberOfLines={1}
                    >{distance}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row-reverse", backgroundColor: "#fff", marginTop: 5 }}>
                <TouchableOpacity
                    style={{
                        marginRight: 5,
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 16,
                        borderColor: mainColor,
                        borderWidth: 0.5,
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 10,
                    }}
                    onPress={() => this.onComeInStore(data)}>
                    <Text style={{
                        fontSize: 15,
                        color: mainColor,
                    }}>进店</Text>
                </TouchableOpacity>
            </View>
        </View>
            <View style={{backgroundColor:Colors.lineColor,height:0.5}}></View>
            <View style={{flexDirection:"row",backgroundColor:"#fff",padding:10}}>
                {this.getShopImg(data.item)}
            </View>
        </View>
    }

    getShopImg(data){
        let views = []
        data.shopGoods.forEach((value,index)=>{
            let img = {uri: this.getImgUrl(value.coverPlan)}
            views.push(
                <TouchableOpacity
                    key={index+""}
                    activeOpacity={0.8}
                    style={{width: window_w , height: window_w,marginLeft:2,marginRight:2,borderRadius:10}}
                    onPress={() => this.goDetails(value)}
                >
                    <FastImage
                        style={{width: window_w , height: window_w ,borderRadius:10}}
                        source={img}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
            )
        })
        return views
    }

    /**
     * 去商品详情
     * @param {*} item
     */
    goDetails(item) {
        //alert(JSON.stringify(item))
        this.props.navigation.navigate('ShopDetails', {
            shopId: item.goodsId,
        });
    }
    onComeInStore(data) {
        this.props.navigation.navigate('StoreDetails', {
            storeId: data.item.id,
        });
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