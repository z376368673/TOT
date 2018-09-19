import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Linking,
    TouchableOpacity,
    Image,
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
import ShopDetails from './ShopDetails';
import FastImage from "react-native-fast-image";

//商铺详情
const window_w = Utils.getWidth();
export default class StroeDetails extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {

            shopName: "", //店铺名称
            shopAddress: "",//店铺地址
            shopPhone: "", //店铺联系方式
            imgHead: "",  //店铺头像
        }
        //获取传过来的店铺id
        this.storeId = this.props.navigation.state.params.storeId
        this.userInfo = this.getUserInfo();
        this.typeId = ""
    }
    //界面加载完成
    componentDidMount() {
        this.getStoreDetail()
    }

    /**
    * 获取商品信息 by id 
    */
    getStoreDetail() {
        let url = BaseUrl.getStoreDetail(this.userInfo.sessionId, this.storeId)
        this.refList.refreshStar()
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    this.info = result.data
                    this.refList.setData(this.info.goodsDtos)
                    this.setState({
                        shopName: this.info.shopName,
                        shopAddress: this.info.shopAddress,
                        shopPhone: this.info.shopPhone,
                        imgHead: { uri: this.getImgUrl(this.info.imgHead) },
                    })
                }else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }
    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title={"店铺详情"}
                    navigation={this.props.navigation}
                />
                <View style={{ flexDirection: "row", backgroundColor: mainColor, padding: 15, alignItems: "center" }}>
                    <Image
                        style={{ width: 60, height: 60, borderColor: "#d11", borderWidth: 1, borderRadius: 30 }}
                        source={this.state.imgHead} />
                    <View style={{ flex: 1, marginLeft: 15, marginEnd: 50 }}>
                        <Text style={{ fontSize: 16, color: "#fff", }}>{this.state.shopName}  {this.state.shopPhone}</Text>
                        <Text style={{ fontSize: 14, color: "#fff", marginTop: 5, }}>{this.state.shopAddress}</Text>
                    </View>
                    <TouchableOpacity
                        style={{height:50,width:50}}
                        onPress={() => this.callStore(this.state.shopPhone)}
                    >
                        <Image
                            style={{ width: 33, height: 35, resizeMode:"stretch"}}
                            source={require("../../../res/images/dianhua.png")} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        numColumns={2}
                        isDownLoad={true}
                        onRefreshs={() => this.getStoreDetail()}
                        renderItem={(items) => this._getStore(items)} />

                </View>
            </View>
        );
    }
    //联系商家 //暂时返回失败， 可能要真机测试才可以
    callStore(phone) {
        let url = 'tel: ' + phone;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                DialogUtils.showToast('Can\'t handle url: ' + url)
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => DialogUtils.showToast('An error occurred', err));
    }

    /** 商品
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getStore(data) {
        return <View
            key={this.state.activeIndex === 0 ? data.item.index : data.item.index + 1}
            style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                marginBottom: 4,
                flexDirection: "column",
                marginLeft: 2,
                marginRight: 2,
                maxWidth:window_width/2-4,
            }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ width: window_w / 2 - 4, height: window_w / 2, }}
                onPress={(item) => this.goDetails(data.item)}>
                <FastImage
                    style={{ width: window_w / 2 - 4, height: window_w / 2, }}
                    source={{ uri: this.getImgUrl(data.item.coverPlan) }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>

            <View style={{ flexDirection: "column", padding: 5, height: 60, justifyContent: "center", alignContent: "center" }}>
                <Text style={{ color: "#333333", fontSize: 18, }} numberOfLines={1}>
                    {data.item ? data.item.goodsName : "name"}</Text>

                <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
     * 
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