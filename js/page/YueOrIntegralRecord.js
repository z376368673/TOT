import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, { BaseStyles } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import Utils from "../util/Utils";
import RefreshFlatList from "../common/RefreshFlatList";
import HttpUtils from "../util/HttpUtils";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';

const URL = 'https://api.github.com/search/repositories?q=';
/**
 * 余额,积分记录
 */


const width = Utils.getWidth()
export default class YueOrIntegralRecord extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo();
    }

    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    render() {
        const { navigation } = this.props;
        this.type = navigation.state.params.type ? navigation.state.params.type : 0;
        const title = this.type === 0 ? "余额记录" : "积分记录"
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={title}
                    navigation={this.props.navigation}
                />

                <View style={[{
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: "#fff",
                }]}>
                    <View style={{ alignItems: 'center', width: width / 4 - 20, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 15,
                        }}>业务类型</Text>
                    </View>
                    <View style={{ alignItems: 'center', width: 0.5, backgroundColor: "#999" }} />
                    <View style={{ alignItems: 'center', width: width / 4 - 10, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 15,
                        }}>数额</Text>
                    </View>
                    <View style={{ alignItems: 'center', width: 0.5, backgroundColor: "#999" }} />
                    <View style={{ alignItems: 'center', width: width / 4 + 4, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 15,
                        }}>当前{this.type === 0 ? "余额" : "积分"}</Text>
                    </View>
                    <View style={{ alignItems: 'center', width: 0.5, backgroundColor: "#999" }} />
                    <View style={{ alignItems: 'center', width: width / 4 + 14, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 15,
                        }}>时间</Text>
                    </View>
                </View>
                <View style={{ flex: 1, marginTop: 1, backgroundColor: "#fff" }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        onRefreshs={() => {
                            this._refreshData()
                        }}
                        isDownLoad={true}
                        onLoadData={() => {
                            this._onLoadData()
                        }}

                        renderItem={(item) => this._getItem(item)} />
                </View>
            </View>
        );
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
        if (this.type === 0) {
            this.url = BaseUrl.getExchangeRecordY(this.userInfo.sessionId, this.pageIndex)
        } else {
            this.url = BaseUrl.getExchangeRecordJ(this.userInfo.sessionId, this.pageIndex)
        }
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无记录")
                        }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1

                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })

    }
    //刷新数据
    _refreshData() {
        this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(true)
    }
    _getItem(data) {
        return <View style={{
            borderBottomWidth: 0.5,
            borderColor: '#CCC',
            backgroundColor: '#fff',
            paddingBottom: 10,
            paddingTop: 10,
            paddingLeft: 5,
            paddingRight: 5,
        }}>
            <TouchableOpacity onPress={() => {
                //alert(JSON.stringify(data.item))
            }}>
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ justifyContent: "center", alignItems: 'center', width: width / 4 - 10, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 13,
                        }}>{this.type === 0 ? this.getYueType(data)[0] : this.getJifenType(data)[0]}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: 'center', width: width / 4 - 10, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 13,
                        }}>{this.type === 0 ? this.getYueType(data)[1] : this.getJifenType(data)[1]}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: 'center', width: width / 4 + 4, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 13,
                            //当getType===0 时  当前余额或者积分 取得的 nowNums 其他的都是取nowNumsGet
                        }}>{data.item.getType === 0||data.item.getType === 4 ? data.item.nowNums : data.item.nowNumsGet}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: 'center', width: width / 4 + 14, }}>
                        <Text style={{
                            color: '#333',
                            fontSize: 13,
                        }}>{Utils.formatDateTime(data.item.getTime * 1000, "-")}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }
    //获取余额类型
    getYueType(data) {
        let type = data.item.getType
        let payId = data.item.payId
        let getId = data.item.getId

        let yue = data.item.getNums
        var typeText;
        var typeValue;
        switch (type) {
            case 0:
                typeText = "转出(" + getId + ")"
                typeValue = "-" + yue
                break;
            case 2:
                typeText = "积分释放"
                typeValue = "+" + yue
                break;
            case 3:
                typeText = "货币求购"
                typeValue = "-" + yue
                break;
            case 4:
                typeText = "货币购买"
                typeValue = "-" +yue
                break;
            case 5:
                typeText = "货币出售"
                typeValue = "+" + yue
                break;
            case 6:
                typeText = "货币\n取消求购"
                typeValue = "+" + yue
                break;
            case 7:
                typeText = "购买众筹"
                typeValue = "-" + yue
                break;
            case 8:
                typeText = "买入"
                typeValue = "+" + yue
                break;
            case 9:
                typeText = "卖出"
                typeValue = "-" + yue
                break;
            case 10:
                typeText = "取消卖出"
                typeValue = "+" + yue
                break;
            case 11:
                typeText = "系统操作"
                if (yue >= 0) {
                    typeValue = "+" + yue
                } else {
                    typeValue = yue
                }
                break;
            case 13:
                typeText = "兑换积分"
                typeValue = "-" + yue
                break;
            case 20:
                typeText = "商城消费"
                typeValue = "-" + yue
                break;
            case 21:
                typeText = "店铺收益"
                typeValue = "+" + yue
                break;
            case 24:
                typeText = "扣除保证金"
                typeValue = "-" + yue
                break;
            case 25:
                typeText = "退还保证金"
                typeValue = "+" + yue
                break;
            case 26:
                typeText = "商城返还"
                typeValue = "+" + yue
                break;
            case 31:
                typeText = "(" + payId + ")转入"
                typeValue = "+" + yue
                break;
        }
        return [typeText, typeValue];
    }

    //获取积分类型
    getJifenType(data) {
        let type = data.item.getType
        let jifen = data.item.getNums
        var typeText;
        var typeValue;
        switch (type) {
            case 1:
                if (jifen < 0) {
                    typeText = "积分释放"
                } else if (data.item.payId !== data.item.getId) {
                    typeText = "转入获得"
                } else if (data.item.payId === data.item.getId) {
                    typeText = "兑换积分"
                }
                break;
            case 12:
                typeText = "系统操作"
                break;
            case 16:
                typeText = "vip获得"
                break;
            case 22:
                typeText = "店铺收益"
                break;
            case 23:
                typeText = "商城返还"
                break;
            case 30:
                typeText = "转出获得"
                break;
        }
        if (jifen > 0) {
            typeValue = "+" + jifen
        } else {
            typeValue = jifen
        }
        return [typeText, typeValue]
    }

}
