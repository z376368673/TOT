import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    View,
    TextInput,
} from 'react-native';
import BaseComponent, {mainColor, upDataUserInfo} from "../BaseComponent";
import RefreshFlatList2 from "../../common/RefreshFlatList2"
import SliderView from "../../common/SliderView"
import Colors from "../../util/Colors"
import { Overlay } from 'teaset';
import Echarts from 'native-echarts';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
import Utils from '../../util/Utils';
import DialogUtils from "../../util/DialogUtils";
import PassWordInput from "../../common/PassNumInput";
import BaseUrl from "../../util/BaseUrl";
import HttpUtils from "../../util/HttpUtils";
import Values from "../../model/CurrencyValues"



//发布出售、购买订单

export default class TradeHome extends BaseComponent {
    constructor(props) {
        super(props);
        const cid = this.props.navigation.state.params.cid

        this.state = {
            wepayNum: Values.coinBalance, //Wepay资产
            yueNum:  Values.walletBalance, //余额

            title:this.getTitleByCid(cid),
            cid: cid,
            price: Values.coinPrice,

            myPrice:Values.coinPrice, //我的定价
            num: 0, //购买数量
        }
        this.type = this.props.navigation.state.params.type // 1 出售， 2 购买
        this.userInfo = this.getUserInfo();

    }
    getTitleByCid(cid){
        let title
        if (cid===2){
            title = "比特币"

        } else  if (cid===3){
            title = "莱特币"

        }else  if (cid===4){
            title = "以太坊"

        }else  if (cid===5){
            title = "狗狗币"

        }else {
            title = "TOT"
        }
        return title ;
    }
    componentDidMount() {
        this._refreshData()
    }

    render() {
        let { price } = this.state;
       
        return (
            <View style={styles.container}>
                <View style={{
                    flexDirection: "row", justifyContent: "center", alignItems: "center",
                    backgroundColor: Colors.mainColor, height: 45, marginTop: Platform.OS === "ios" ? 20 : 0
                }}>
                    <TouchableOpacity
                        style={[{ paddingRight: 20, paddingTop: 10, paddingBottom: 10, position: "absolute", left: 10 },]}
                        onPress={() => this.props.navigation.goBack(null)} >
                        <Image source={require('../../../res/images/fanhui.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        ref={title => this.title = title}
                       // onPress={() => this.showPopover(this.title)}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 18, color: Colors.white, marginBottom: 3 }}>{this.state.title}</Text>
                            {/*<Image source={require("../../../res/images/sanjiao.png")} />*/}
                        </View></TouchableOpacity>
                </View>
                <ScrollView style={{ flex:1,backgroundColor: Colors.bgColor }}>
                    <View >
                        {/* 顶部布局  资产  余额*/}
                        <View style={[{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                            padding: 10, backgroundColor: mainColor
                        }]}>
                            <TouchableOpacity
                                activeOpacity={0.8} >
                                <View style={{ flexDirection: 'column', alignItems: "center", width: width / 2 }}>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.title}资产</Text>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.wepayNum}</Text>
                                </View></TouchableOpacity>
                            <View style={{ height: 30, width: 0.5, backgroundColor: '#fff' }} />
                            <TouchableOpacity activeOpacity={0.8}>
                                <View style={{ flexDirection: 'column', alignItems: "center", width: width / 2 }}>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>余  额</Text>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.yueNum}</Text>
                                </View></TouchableOpacity>
                        </View>
                        <View style={{
                            padding: 10, backgroundColor: Colors.white, flexDirection: "column", borderRadius: 15,
                            borderColor: Colors.lineColor, borderWidth: 0.5, margin: 15,
                        }}>
                            <View style={{ flexDirection: "row", flex: 1, alignItems: "center", padding: 12 }}>
                                <Text style={{ fontSize: 14, color: Colors.text6, }}>当前价格:</Text>
                                <Text style={{ fontSize: 14, color: Colors.blue, }}> {price}</Text>
                            </View>
                            <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                            <View style={{ flexDirection: "row", flex: 1, alignItems: "center", paddingLeft: 12, }}>
                                <Text style={{ fontSize: 14, color: Colors.text6, }}>{this.type===1?"出售":"购买"}价格:</Text>
                                <TextInput
                                    style={{ flex: 1,height:40 }}
                                    placeholder={this.state.price+""}
                                    placeholderTextColor={'#666'}
                                    underlineColorAndroid='transparent'
                                    keyboardType={"numeric"}
                                    editable={false}
                                    value={this.state.myPrice}
                                    onChangeText={(text) => {
                                        this.setState({ myPrice: Utils.chkCurrency(text,4) })
                                    }}
                                />
                                <View style={{ flex: 1 ,paddingTop:5}}>
                                    <SliderView
                                        style={{width: 150, marginTop: -5 }}
                                        maximumTrackTintColor={Colors.mainColor}
                                        minimumTrackTintColor={Colors.mainColor}
                                        minimumValue={-10} maximumValue={10}
                                        //value={Number(this.state.myPrice)}
                                        onValueChanges={(value)=>{
                                            const num = this.state.price+this.state.price*value/100
                                            this.setState({myPrice:Utils.formatNumBer(num,4)})
                                        }}
                                    /></View>
                            </View>
                            <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                            <View style={{ flexDirection: "row", flex: 1, alignItems: "center", padding: 12 ,height:40}}>
                                <Text style={{ fontSize: 14, color: Colors.text6, }}>{this.type===1?"出售":"购买"}数量:</Text>
                                <TextInput
                                    style={{ flex: 1 ,height:40}}
                                    underlineColorAndroid='transparent'
                                    keyboardType={"numeric"}
                                    value={this.state.num+""}
                                    maxLength={8}
                                    onChangeText={(text) => {
                                        this.setState({ num: Utils.chkPrice(text) })
                                    }}
                                />
                            </View>
                            <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                            <View style={{ flexDirection: "row", flex: 1, alignItems: "center", padding: 12 }}>
                                <Text style={{ fontSize: 14, color: Colors.text6, }}>{this.type===1?"购买":"支付"}金额:</Text>
                                <Text style={{ fontSize: 14, color: Colors.text3, }}>{Utils.formatNumBer(this.state.num*this.state.myPrice,4)}</Text>
                            </View>
                            <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                            <TouchableOpacity
                                onPress={()=>this.submitOrder()}
                            activeOpacity={0.8}
                            style={{borderRadius:10,backgroundColor:Colors.red,justifyContent:"center",alignItems:"center", margin:30,padding:10}}
                            ><Text style={{color:Colors.white,fontSize:15}}>发布</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    /**
     * 提交 发布
     */
    submitOrder(){
        try{
        if (!Number(this.state.myPrice)>0) {
            DialogUtils.showMsg("请输入正确的价格(大于0的数字)")
        } else if (!Number(this.state.num)>0) {
            DialogUtils.showMsg("请输入正确的数量(大于0的数字)")
        } else {
            PassWordInput.showPassWordInput((safetyPwd) => {
                DialogUtils.showLoading();
                this.url =  this.type ===1 ?BaseUrl.createSellOrder():BaseUrl.createBuyOrder()
                HttpUtils.postData(this.url,
                    {
                        sessionId: this.userInfo.sessionId,
                        cid: this.state.cid, //币种id
                        num: this.state.num, //出售数量
                        price: this.state.myPrice, //价格
                        safetyPwd: safetyPwd,
                    })
                    .then(result => {
                        DialogUtils.hideLoading()
                        if (result.code === 1) {
                            //upDataUserInfo(this.props.AppStore)
                            //this.props.navigation.navigate('HomePage');
                            DialogUtils.showToast("发布订单成功")
                            this.props.navigation.goBack()
                        } else {
                            DialogUtils.showToast(result.msg)
                        }
                    })
            })
        }
        }catch (e) {
            DialogUtils.showToast("请输入正确的数字")
        }
    }

    //刷新数据
    _refreshData(cid) {

    }

    /**
     * onPress={() => this.showPopover(this.refs['downcenter'], 'down', 'center')} 
     * @param {*} view 
     * @param {*} direction 
     * @param {*} align 
     */
    showPopover(view) {
        let { black, shadow, showArrow } = this.state;
        let blackStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            //   paddingTop: 1,
            //   paddingBottom: 1,
            paddingLeft: 12,
            paddingRight: 12,
        };
        let whiteStyle = {
            ...blackStyle,
            backgroundColor: Colors.white,
        };
        let shadowStyle = {
            shadowColor: '#777',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
        };
        let popoverStyle = [].concat(black ? blackStyle : whiteStyle).concat(shadow ? shadowStyle : null);

        view.measure((x, y, width, height, pageX, pageY) => {
            let fromBounds = { x: pageX, y: pageY, width, height };
            let overlayView = (
                <Overlay.PopoverView popoverStyle={popoverStyle}
                    fromBounds={fromBounds} direction={"down"} align={"center"}
                    directionInsets={4} showArrow={showArrow}
                    ref={v => this.view = v}>
                    <View>
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(1,"TOT")
                            }}

                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            Wepay</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(2,"比特币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            比特币</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(3,"莱特币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            莱特币</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(4,"以太坊")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            以太坊</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(5,"狗狗币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            狗狗币</Text>
                    </View>
                </Overlay.PopoverView>
            );
            Overlay.show(overlayView);
        });
    }
    //选择币种  cid 各种货币id
    //1.Wepay 2.比特币 3.莱特币  4.以太坊  5.狗狗币
    selectCid(cid,title){
        this.setState({cid:cid, title :title})
        this._refreshData(cid)
    }
}


export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    container: {
        flex: 1,
    },

    titleView: {
        height: Platform.OS == 'ios' ? 64 : 44,
        paddingTop: Platform.OS == 'ios' ? 14 : 0,
        backgroundColor: '#ff6400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },

});