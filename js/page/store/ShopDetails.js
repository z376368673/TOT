import React from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Linking} from 'react-native';
import AutoGrowingTextInput from '../../common/AutoGrowingTextInput';
import NavigationBar from "../../common/NavigationBar";
import ViewPager from "../../common/ViewPager";

import BaseComponent, {BaseStyles, mainColor, window_width, window_height} from "../BaseComponent";
import {PullPicker} from 'teaset';
import SYImagePicker from 'react-native-syan-image-picker'
import Utils from '../../util/Utils';
import DialogUtils from '../../util/DialogUtils';
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import FastImage from 'react-native-fast-image'
import Colors from "../../util/Colors";

/**
 * 商品详情
 */
const width_w = Utils.getWidth();
export default class ShopDetails extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            coverPlan: [],
        }
        this.navigation = this.props.navigation;
        this.userInfo = this.getUserInfo()
    }

    shouldComponentUpdate() {
        this.shopId = this.props.navigation.state.params.shopId
        //this.getShopDetail(this.shopId)
        return true
    }

    componentDidMount() {
        this.shopId = this.props.navigation.state.params.shopId
        this.getShopDetail(this.shopId)
    }

    componentWillUnmount() {
        // this.state = null;
    }

    /**
     * 获取商品信息 by id
     */
    getShopDetail(shopId) {
        let url = BaseUrl.getShopDetail(this.userInfo.sessionId, shopId)
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    //console.warn(JSON.stringify(result.data))
                    let pic = [result.data.coverPlan, result.data.goodsPic2, result.data.goodsPic3,
                        result.data.goodsPic4, result.data.goodsPic5, result.data.goodsPic6]
                    this.setState({
                        data: result.data,
                        coverPlan: this.picToUri(pic),
                    })
                } else if (result.code === 2 || result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    picToUri(pic) {
        let uri = []
        pic.map((value, index) => {
            if (value.length >= 1) {
                uri.push(value)
            }
        })
        // alert(JSON.stringify(uri))
        return uri
    }

    itemView(data, index) {
        return  <TouchableOpacity
            //key={index.toString()}
            onPress={() => {
            }}
            activeOpacity={0.8}>
            <FastImage
                style={{width:width_w, height: width_w+80}}
                //source={{uri:this.getImgUrl(data)}}
            source={require("../../../res/images/lianmeng-bg.png")}/>
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={this.state.data ? this.state.data.goodsName : "商品详情"}
                    navigation={this.props.navigation}
                />
                <ScrollView style={{flex: 1}}>
                    <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1",}]}>
                        <ViewPager
                           data={this.state.coverPlan}
                           height={width_w}  />
                        <View style={{flexDirection: 'row', padding: 10, backgroundColor: "#fff"}}>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    color: '#333',
                                    fontSize: 16,
                                }}>{this.state.data ? this.state.data.goodsName : "0"}</Text>
                        </View>
                        <View style={{flexDirection: 'row', padding: 10, backgroundColor: "#fff"}}>
                            <Text style={{
                                color: "#d11",
                                fontSize: 18,
                                flex: 1,
                            }}>￥{this.state.data ? this.state.data.goodsPrice : "0"}</Text>
                            <Text style={{
                                color: "#888",
                                fontSize: 15,
                                marginLeft: 50,
                            }}>库存:{this.state.data ? this.state.data.goodsStock : "0"}</Text>
                        </View>

                        {/*<TouchableOpacity*/}
                        {/*activeOpacity={0.8}*/}
                        {/*onPress={() => this.onClicks("store")}*/}
                        {/*style={{*/}
                        {/*borderWidth: 1, borderColor: "#999", justifyContent: "center",*/}
                        {/*alignItems: "center", margin: 15, backgroundColor: "#fff", borderRadius: 1000*/}
                        {/*}}>*/}
                        {/*<Text style={{*/}
                        {/*fontSize: 18,*/}
                        {/*color: "#333",*/}
                        {/*padding: 8*/}
                        {/*}}>{this.state.data ? this.state.data.shopName : ""}</Text>*/}
                        {/*</TouchableOpacity>*/}

                        <View style={{padding: 10, backgroundColor: "#fff", marginTop: 10, flex: 1,}}>
                            <Text
                                style={{color: '#333', fontSize: 16,}}>
                                商品详情:</Text>
                            <Text
                                style={{color: '#555', fontSize: 15, lineHeight: 28}}>
                                {this.state.data ? this.state.data.describe ? this.state.data.describe : "此商品暂无详情" : "此商品暂无详情"}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#fff",
                    marginBottom: Utils.isFullScreenPhone() ? 15 : 0,
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#fff",
                            paddingTop: 8
                        }}
                        activeOpacity={0.8}
                        onPress={() => this.onClicks("store")}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={require("../../../res/images/dianpu_1.png")}/>
                            <Text style={{
                                alignSelf: "center",
                                color: '#333',
                                fontSize: 14,
                                padding: 5,
                            }}>店铺</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#fff",
                            paddingTop: 8
                        }}
                        activeOpacity={0.8}
                        onPress={() => this.callStore(this.state.data.phone)}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={require("../../../res/images/lianxishangjia.png")}/>
                            <Text style={{
                                alignSelf: "center",
                                color: '#333',
                                fontSize: 14,
                                padding: 5,
                            }}>联系商家</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#d11",
                            paddingTop: 3
                        }}
                        activeOpacity={0.8}
                        onPress={() => this.buy()}
                    >
                        <View style={{flex: 1}}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#FFF',
                                fontSize: 18,
                                padding: 15,
                            }}>立即购买</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }

    onClicks(type) {
        if (type === "sumbitApply") {
            this.props.navigation.navigate('MyStore');
        } else if (type === "store") {
            this.props.navigation.navigate('StoreDetails', {
                storeId: this.state.data.shopId
            });
        }
    }

    //打电话  联系商家 //暂时返回失败， 可能要真机测试才可以
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

    /**
     * 购买
     */
    buy() {
        if (this.state.data) {
            this.props.navigation.navigate('CreatOrder', {
                data: this.state.data
            });
        } else {
            this.goLogin(this.props.navigation)
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
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 0.5
    },
    itemText: {
        fontSize: 16, color: "#333", width: 80
    },
    itemTextInput: {
        height: 35, flex: 1, fontSize: 16, color: '#333', backgroundColor: "#fff", padding: 5,
        borderWidth: 0.5, borderColor: "#ccc",
    }
});