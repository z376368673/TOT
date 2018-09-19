import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Clipboard,
    TouchableOpacity,
    Image,
    Button,
    ImageBackground, ScrollView, RefreshControl,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import BaseUrl from "../../util/BaseUrl";
import RefreshFlatList from "../../common/RefreshFlatList"
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors"
//数字资产

export default class NumberHome extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRefresh: false,
            wepayPrice:"0.00",//当前价格
            assetsNum: 0.00,//   拥有wepay资产
            purseAddress: "njadnahdnqjeio123qdhsuydy891209ejh1d",//   钱包地址
            coinVos:[],  // 货币信息集合
        }
        this.userInfo = this.getUserInfo();
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    /**
    * 获取数据
    * @param {*} isRefesh  是否刷新
    * @param {*} pageIndex 
    */
   _refreshData() {
       this.setState({isRefresh:true})
        this.url = BaseUrl.numberIndex(this.userInfo.sessionId)
        HttpUtils.getData(this.url)
            .then(result => {
                this.setState({isRefresh:false})
                if (result.code === 1) {
                   this.setState({
                     wepayPrice:result.data.currPrice,
                     wepayNum:result.data.num,
                     purseAddress:result.data.walletAddress
                   })
                   this.refList.setData(result.data.coinVos)
                } else if (result.code === 2||result.code === 4) {
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
                    title='数字资产'
                    navigation={this.props.navigation}
                    rightView={NavigationBar.getRightStyle_Text('交易记录', {
                        fontSize: 15,
                        color: "#fff"
                    }, () => this.transactionRecord())}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            //Android下只有一个 colors 是转圈的颜色
                            colors={['#d11', '#000']}
                            //ios 下 可以设置标题，转圈颜色，标题颜色
                            title={'Loading...'}
                            tintColor={'#d11'}
                            titleColor={'#d11'}
                            //刷新状态 false:隐藏，true:显示
                            refreshing={this.state.isRefresh}
                            //刷新触发的后执行的方法
                            onRefresh={() =>  this._refreshData()}
                        />
                    }
                    //onScroll={this._onScroll.bind(this)}
                    scrollEventThrottle={50}
                >
                    <View style={{ backgroundColor: Colors.bgColor }}>
                        <Image
                            style={{position:"absolute"}}
                            source={require('../../../res/images/shuzizichai-bg.png')}/>
                {/* top布局 */}
                <View style={[{ alignItems: 'center', justifyContent: 'space-around', padding: 10,}]}>
                    <Image source={require("../../../res/images/tot-shu.png")} style={{ height: 70, width: 70, resizeMode: "stretch" }} />
                    <Text style={{ fontSize: 15, color: "#fff", marginTop: 8, marginBottom: 30 }}>当前价格:￥{this.state.wepayPrice}</Text>
                </View>

                <View style={{ marginTop: -15, backgroundColor: Colors.white, paddingLeft: 10, paddingBottom: 10, paddingRight: 10,borderRadius:15, }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <View style={{ backgroundColor: Colors.y1, width: 8, height: 8 }} />
                        <Text style={{ color: Colors.text6, fontSize: 15, marginLeft: 5 }}>TOT资产</Text>
                        <Text style={{ color: Colors.text3, fontSize: 15, marginLeft: 10 }}>{this.state.wepayNum}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <View style={{ backgroundColor: Colors.r1, width: 8, height: 8 }} />
                        <Text style={{ color: Colors.text6, fontSize: 15, marginLeft: 5 }}>钱包地址</Text>
                    </View>
                    <Text style={{ color: Colors.text3, fontSize: 14, marginTop: 5 }}>{this.state.purseAddress}</Text>
                    <View style={{ marginTop: 8, backgroundColor: Colors.gray, height: 0.5 }} />
                    <TouchableOpacity style={{ borderColor: Colors.red, borderRadius: 5, borderWidth: 0.5, height: 30, width: 80, justifyContent: "center", alignItems: "center", position: "absolute", right: 20, top: 30, }}
                        onPress={() => {
                            Clipboard.setString(this.state.purseAddress);
                            DialogUtils.showToast("已复制到剪贴板")
                        }}>
                        <Text style={{ color: Colors.red, fontSize: 13 }}>复制地址</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, }}>

                        <TouchableOpacity onPress={() => this.onClick(1)} style={{ flex: 1 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../../../res/images/zhuanchu-shu.png")} style={{ height: 50, width: 50, }} />
                                <Text style={{ color: Colors.text3, fontSize: 15, marginTop: 5 }}>转出</Text>
                            </View></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onClick(2)} style={{ flex: 1 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../../../res/images/zhongchou.png")} style={{ height: 50, width: 50, }} />
                                <Text style={{ color: Colors.text3, fontSize: 15, marginTop: 5 }}>众筹</Text>
                            </View></TouchableOpacity>
                        {/*<TouchableOpacity onPress={() => this.onClick(3)} style={{ flex: 1 }}>*/}
                            {/*<View style={{ alignItems: "center", justifyContent: "center", }}>*/}
                                {/*<Image source={require("../../../res/images/wbao.png")} style={{ height: 50, width: 50, }} />*/}
                                {/*<Text style={{ color: Colors.text3, fontSize: 15, marginTop: 5 }}>W宝</Text>*/}
                            {/*</View></TouchableOpacity>*/}
                        <TouchableOpacity onPress={() => this.onClick(4)} style={{ flex: 1 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../../../res/images/jiaoyi.png")} style={{ height: 50, width: 50, }} />
                                <Text style={{ color: Colors.text3, fontSize: 15, marginTop: 5 }}>交易</Text>
                            </View></TouchableOpacity>

                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "#f1f1f1", marginTop: 10, }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getBuyOrSellItem(items)}
                        onRefreshs={() => this._refreshData()}
                    />
                </View>
               </View>
             </ScrollView>
            </View>
        );
    }
    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getBuyOrSellItem(data) {
         let cid = data.item?data.item.cid:1
         var name = "TOT"
         var color = Colors.y1
         if(cid===2){
            name = "比特币"
            color = Colors.r1
         }else if(cid===3){
            name = "莱特币"
            color = Colors.r2
         }else if(cid===4){
            name = "以太坊"
            color = Colors.b1
         }else if(cid===5){
            name = "狗狗币"
            color = Colors.z1
         }else {
            name = "TOT"
            color = Colors.y1
         }
        return <View style={{ padding: 10, backgroundColor: Colors.white,marginTop:1 }}>
            <View style={{ flexDirection: "row",alignItems:"center" }}>
                <View style={{ backgroundColor: color, width: 8, height: 8 }} />
                <Text style={{ color: Colors.text3, fontSize: 16, marginLeft: 5 }}>{data.item.coinName}</Text>
            </View>
            <View style={{ flexDirection: "row",marginTop:5}}>
                <Text style={{ color: Colors.text3, fontSize: 15, marginLeft: 5, flex: 1 }}>{data.item.num}</Text>
                <Text style={{ color: Colors.text3, fontSize: 15, marginLeft: 5, flex: 1 }}>{data.item.coinPrice}</Text>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate('TradeHome',{cid:cid})
                    }}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 5, backgroundColor: Colors.y1 }}>
                    <Text style={{ color: Colors.white, fontSize: 14, }}>余额交易</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" ,marginTop:5}}>
                <Text style={{ color: Colors.text6, fontSize: 14, marginLeft: 5, flex: 1 }}>{data.item.coinName}</Text>
                <Text style={{ color: Colors.text6, fontSize: 14, marginLeft: 5, flex: 1 }}>当前价格</Text>
                <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 5, backgroundColor: Colors.mainColor }}>
                    <Text style={{ color: Colors.white, fontSize: 14, }}>现金交易</Text>
                </TouchableOpacity>
            </View>
        </View>
    }

    transactionRecord() {//交易记录
        this.props.navigation.navigate('TransactionRecord');
    }


    onClick(type) {
        switch (type) {
            case 1: //转出
                this.props.navigation.navigate('TranWepay');
                break;
            case 2://众筹
                this.props.navigation.navigate('ZhongChou');
                break;
            case 3://W宝
            this.props.navigation.navigate('Wbao');
                break;
            case 4://交易
                this.props.navigation.navigate('TradeHome',{cid:1});
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