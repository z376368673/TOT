import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import AutoGrowingTextInput from '../../common/AutoGrowingTextInput';
import NavigationBar from "../../common/NavigationBar";
import BaseComponent, { BaseStyles, upDataUserInfo } from "../BaseComponent";
import { PullPicker } from 'teaset';
import SYImagePicker from 'react-native-syan-image-picker'
import Utils from '../../util/Utils';
import DialogUtils from '../../util/DialogUtils';
import HttpUtils from '../../util/HttpUtils';
import BaseUrl from '../../util/BaseUrl';
import { observer, inject } from 'mobx-react';
import { observable, comparer } from 'mobx';
import PassWordInput from '../../common/PassNumInput';


/**
 * 创建订单
 */
const width_w = Utils.getWidth() / 2 - 20;
const counter = observable.box(1);
@inject('AppStore') @observer
export default class CreatOrder extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            addressData: null,
            shopData:null,
            shopName:"",
            shopImage:require("../../../res/images/ruzhu.png"),
        }
        this.userInfo = this.getUserInfo()
        this.params = this.props.navigation.state.params;
        this.data = this.params ? this.params.data : null;
    }

    componentDidMount() {
        this.getAddress();
        this.getStoreDetail()
    }

    onPay() {
        if(!this.state.addressData){
            DialogUtils.showMsg("请选择收货地址")
        }else{
            PassWordInput.showPassWordInput((safetyPwd) => this.creatOrder(safetyPwd))
        }
    }

    /**
     * 生成订单
     */
    creatOrder(safetyPwd) {
        DialogUtils.showLoading();
        this.url = BaseUrl.createShopOrder()
        // let goodsNum = counter
         let goodsNum = counter.get()
        let data = {
            sessionId: this.userInfo.sessionId,
            addressId: this.state.addressData.addressId,
             goodsId: this.data.id,
             goodsNum: goodsNum,
             safetyPwd: safetyPwd,
        }
        //alert(JSON.stringify(data))
        HttpUtils.postData(this.url,data)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    DialogUtils.showMsg("购买成功")
                    upDataUserInfo(this.props.AppStore)
                    //this.props.navigation.goBack()
                }  else if(result.code === 2||result.code === 4){
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
                    DialogUtils.showToast(result.msg)
                }
                DialogUtils.hideLoading()
            })
    }

    /**
     * 获取默认地址
     */
    getAddress() {
        let url = BaseUrl.getDefaultAddressUrl(this.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                   let info = result.data
                    if(info.provinceId){
                        let address = info.provinceId + info.cityId + info.countryId + info.address
                        this.setState({
                            addressData: info,
                            addressid: info.addressId,
                            userName: info.name,
                            userPhone: info.telephone,
                            userAddress: address,
                        })
                    }
                }  
            })
    }
    /**
    * 获取商品信息 by id 
    */
   getStoreDetail() {
    let url = BaseUrl.getStoreDetail(this.userInfo.sessionId, this.data.shopId)
    HttpUtils.getData(url)
        .then(result => {
            if (result.code === 1) {
                //alert(JSON.stringify(result.data))
                this.info = result.data
                this.setState({
                    shopName: this.info.shopName,
                    shopImage: {uri: this.getImgUrl(this.info.imgHead)},
                    shopData:result.data
                })
            }else if (result.code === 2||result.code === 4) {
                DialogUtils.showToast(result.msg)
                this.goLogin(this.props.navigation)
            }
        })
     
}

    /**
     * 选择收货地址
     */
    selectAddess() {
        this.props.navigation.navigate('AddressList', {
            selectAddess: (addressData) => {
                let address = addressData.provinceId + addressData.cityId + addressData.countryId + addressData.address
                this.setState({
                    addressid: addressData.addressId,
                    userName: addressData.name,
                    userPhone: addressData.telephone,
                    userAddress: address,
                    addressData: addressData,
                })
            }
        })
    }
    goStoreDetails(id){
        this.props.navigation.navigate('StoreDetails', {
            storeId:id,
        });
    }
    render() {
        let selectAddess = this.state.addressData === null ?
            <Text style={{ color: '#333', fontSize: 17, flex: 1 }}>请选择您的收货地址</Text> :
            <View style={{ flex: 1, }} >
                <Text style={{ color: '#333', fontSize: 17, }}>收货人:{this.state.userName}      {this.state.userPhone}</Text>
                <Text style={{ color: '#555', fontSize: 15, marginTop: 8, }}>收货地址:{this.state.userAddress} </Text>
            </View>

        let count = <View style={{flexDirection:"row",}}>
            
              <Text style={{fontSize:18,color:"#333",borderWidth:1,borderColor:"#aaa",backgroundColor:"#aaa",paddingLeft:8,paddingRight:8}} onPress={()=>{
                 if(counter.get()>1){
                    counter.set(counter.get() - 1);
                 }
             }}>-</Text>
             <Text style={{fontSize:16,color:"#333",marginLeft:15,marginRight:15}}>{counter.get()}</Text>
              <Text style={{fontSize:18,color:"#333",borderWidth:1,borderColor:"#aaa",backgroundColor:"#aaa",paddingLeft:8,paddingRight:8}} onPress={()=>{
                  if(counter.get()<=this.data.goodsStock){
                    counter.set(counter.get() + 1);
                 }
             }}>+</Text>
        </View>
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={"确认订单"}
                    navigation={this.props.navigation}
                />
                <ScrollView >
                    <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                        <TouchableOpacity onPress={() => this.selectAddess()}>
                            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: "#fff",marginTop:10, }}>
                                {selectAddess}
                                <Image style={{ width: 25, height: 25 }} source={require("../../../res/images/ic_tiaozhuan.png")} />
                            </View>
                        </TouchableOpacity>
                        {/* 店铺信息 */}
                         <TouchableOpacity onPress={() => this.goStoreDetails(this.data.shopId)}>
                            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: "#fff",marginTop:10,alignItems:"center" }}>
                                <Image style={{ width: 35, height: 35,}} source={this.state.shopImage} />
                                <Text style={{ color: '#333', fontSize: 17, flex: 1 ,marginLeft:10}}>{this.state.shopName}</Text> 
                                <Image style={{ width: 25, height: 25 }} source={require("../../../res/images/ic_tiaozhuan.png")} />
                            </View>
                        </TouchableOpacity>
                            <View style={{marginLeft:20,marginRight:20,height:1,backgroundColor:"#eee"}}/>
                            {/* 商品信息 */}
                            <View style={{ flexDirection: "row",padding: 10,backgroundColor:"#fff", }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ShopDetails', {
                                    shopId: this.data.id,
                                })}>
                                    <Image style={{ width: 110, height: 100 }} source={{ uri: this.getImgUrl(this.data.coverPlan) }} />
                                </TouchableOpacity>

                                <View style={{ flex: 1, flexDirection: "column", marginLeft: 10 }}>
                                    <Text style={{ color: "#333", fontSize: 16, }} numberOfLines={1} >{this.data.goodsName}</Text>
                                    <Text style={{ color: "#d11", fontSize: 18, marginTop: 5 }} numberOfLines={1} >￥{this.data.goodsPrice} </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ color: "#666", fontSize: 14, marginTop: 5,flex:1 }} numberOfLines={1} >库存：{this.data.goodsStock}</Text>
                                        {count}
                                    </View>
                                </View>
                            </View>

                              {/* 支付方式       */}
                             <View style={{ flexDirection: 'row', padding: 15, backgroundColor: "#fff",marginTop:10, }}>
                            <Text style={{ color: "#333", fontSize: 16, }} numberOfLines={1} >支付方式:TOT支付(余额{this.props.AppStore.userInfo.cangkuNum})</Text>
                            </View>   

                    </View>
                </ScrollView>
                <View style={{
                    flexDirection: "row",
                    height: 50,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#fff",
                }}>
                    <TouchableOpacity
                        style={{ flex: 2, alignItems:"center", backgroundColor: "#fff", }}
                        activeOpacity={0.8}
                        onPress={() => this.onClicks("store")}>
                            <Text style={{
                                alignSelf:"flex-end",
                                color: '#333',
                                fontSize: 18,
                                marginRight:10,
                                marginLeft:10,
                            }}>合计：{ new Number(this.data.goodsPrice*counter.get()).toFixed(2)}元</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#d11", }}
                        activeOpacity={0.8}
                        onPress={() => this.onPay()}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#FFF',
                                fontSize: 18,
                                padding: 15,
                            }}>立即支付</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

        );
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