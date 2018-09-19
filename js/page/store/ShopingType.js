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

//特殊类别商品 比如 新品尝鲜 热门爆款 .....
const window_w = Utils.getWidth();
export default class ShopingType extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
        this.userInfo = this.getUserInfo();
        this.Type = this.props.navigation.state.params.type?this.props.navigation.state.params.type:1
        this.getTitleByType(this.Type)
    }
    getTitleByType(type){
            switch (type) {
                case 1:
                    this.title = "新品尝鲜"
                    break
                case 2:
                    this.title = "热门爆款"
                    break
                case 3:
                    this.title = "实惠好货"
                    break
            }
            return this.title
    }

    //界面加载完成
    componentDidMount() {
        this._refreshData()
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
        this.url = BaseUrl.getShopByType(this.userInfo.sessionId, this.pageIndex,this.Type)
        //alert(JSON.stringify(this.url))
        HttpUtils.getData(this.url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无数据") }
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
                    title={this.title}
                />
                <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
                <RefreshFlatList
                    ref={refList => this.refList = refList}
                    isDownLoad ={true}
                    numColumns={2}
                    minLength={10}
                    onRefreshs={() => this._refreshData()}
                    onLoadData={() => this._onLoadData()}
                    renderItem={(items) =>  this._getStore(items)} />
                </View>
            </View>
        );
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

}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
});