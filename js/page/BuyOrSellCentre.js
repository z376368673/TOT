import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, window_width } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import { Menu } from 'teaset';
import BankCardView from "../common/BankCardView";
import BankCardModel from "../model/BankCardModel";
import ViewUtils from "../util/ViewUtils";
import RefreshFlatList from "../common/RefreshFlatList";
import HttpUtils from "../util/HttpUtils";
import CheckMoney from "../common/CheckMoney";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import PassWordInput from '../common/PassNumInput';
/**
 * 买入\卖出中心
 */

export default class BuyOrSellCentre extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
        }
        this.seleIndex = 0;
        this.selectedValue = 500;
        this.userInfo = this.getUserInfo()
        //type 表示     0，买入  1， 卖出  
        const { navigation } = this.props;
        this.type = navigation.state.params.type ? navigation.state.params.type : 0;

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
     
        if (this.type === 0) { //买入 
            this.url = BaseUrl.getCallCenter(this.userInfo.sessionId, this.pageIndex, this.selectedValue)
        } else if (this.type == 1) { //卖出 
            this.url = BaseUrl.getOutSalesCenter(this.userInfo.sessionId, this.pageIndex, this.selectedValue)
        }
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    if (isRefesh) {
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无记录") }
                        this.refList.setData(result.data)
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                } else if(result.code === 2||result.code === 4){
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
            
    }
    render() {
        let title = this.type === 0 ? "买入中心" : "卖出中心"
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title={title}
                    navigation={this.props.navigation}
                />
                <View style={[{ flexDirection: 'column', backgroundColor: "#fff" }]}>
                    <Text style={{
                        color: '#999',
                        fontSize: 18,
                        paddingTop: 15,
                        paddingLeft: 15,
                        paddingBottom: 15,
                    }}> 点击选择匹配金额</Text>
                    {ViewUtils.getLineView()}
                    <CheckMoney
                        seleIndex={0}
                        selectedValue={500}
                        arrText={[500, 1000, 3000, 5000, 10000, 30000]}
                        onSelected={(index, value) => this.onSelected(index, value)}
                    />

                </View>
                <View style={{ flex: 1, marginTop: 12, }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        onRefreshs={() => {
                            this._refreshData()
                        }}
                        onLoadData={() =>this._onLoadData()}
                        isDownLoad={true}
                        renderItem={(items) => this._getBuyOrSellItem(items)} />
                </View>
            </View>
        );
    }
    _getBuyOrSellItem(data) {
        return <View
            style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                marginBottom: 8,
                flexDirection: 'row',
                padding: 10
            }}>
            <Image
                style={{ width: 60, height: 60, borderWidth: 1, borderRadius: 30, borderColor: "#d11" }}
                source={{uri:this.getImgUrl(data.item.imgHead)}} />
            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10, justifyContent: "center" }}>
                <Text
                    style={{ color: "#333333", fontSize: 16, }}>{data.item ? data.item.userName : "name"}</Text>
                {/* 信用值  */}
                <View style={{ marginTop: 5, alignContent: "center" }}>
                    {ViewUtils.getCreditView(data.item.userCredit, 13, 14, "#888")}
                </View>
                {/*支付方式 */}
                 <Text style={{
                    color: "#888",
                    fontSize: 13,
                    marginTop: 5
                }}
                    numberOfLines={1}
                >支付方式:{data.item.banqGenre}</Text> 
            </View>

            <View style={{ flexDirection: "column", backgroundColor: "#fff", marginTop: 5 }}>
                <Text style={{
                    color: "#444",
                    fontSize: 15,
                    alignSelf: "flex-end",
                }}
                    numberOfLines={1}
                >交易金额 {data.item.payNums}</Text>
                <Text style={{
                    color: "#888",
                    fontSize: 13,
                    marginTop: 8,
                    alignSelf: "flex-end",
                }}
                    numberOfLines={1}
                >实付金额:{data.item.payNums*0.85}</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#d11",
                        marginRight: 5,
                        borderRadius: 3,
                        borderColor: "#d11",
                        borderWidth: 0.5,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 5,
                        width: 60,
                        alignSelf: "flex-end",
                        height: 30
                    }}
                    onPress={() => this.onClickbtn(data)}>
                    <Text style={{
                        fontSize: 14,
                        color: "#fff",
                        padding: 5,
                    }}> {this.type === 0 ? "买入" : "卖出"} </Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    /**
     * * @param {*} sessionId 
     * @param {*} id          挂单id
     * @param {*} safetyPwd   交易密码
     * @param {*} data 
     */
    onClickbtn(data) {
        PassWordInput.showPassWordInput((safetyPwd) => {
            if (this.type === 0) {
                this.url = BaseUrl.getCallCenterBuyUrl()
            } else {
                this.url = BaseUrl.getSalesCenterSaleUrl()
            }
            HttpUtils.postData(this.url,
                {
                    sessionId: this.userInfo.sessionId,
                    id: data.item.id,
                    safetyPwd: safetyPwd,
                })
                .then(result => {
                    if (result.code === 1) {
                        //买入或者卖出成功 删除此条订单
                        DialogUtils.showMsg("交易成功")
                        this.refList.delData(data.index)
                    } else {
                        DialogUtils.showToast(result.msg)
                    }
                    DialogUtils.hideLoading()
                })
        })
    }

    onSelected(index, value) {
        this.selectedValue = value
        this.seleIndex= index
       // alert(this.selectedValue)
        this._refreshData()
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