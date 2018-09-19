import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import Utils from "../util/Utils";
import HttpUtils from "../util/HttpUtils";
import { SegmentedBar, Label } from 'teaset';
import BaseUrl from '../util/BaseUrl';
import RefreshFlatList from '../common/RefreshFlatList';
import SellOrderItem from '../item/SellOrderItem';
import BuyOrderItem from '../item/BuyOrderItem';
import DialogUtils from '../util/DialogUtils';

/**
 * 买入/卖出  未完成订单
 * 
 *  type 表示     0，买入  1， 卖出    
 * 
 *  orderType    1，未完成订单(不是这个界面)， 2，确定打款订单  3 已完成订单
 *  这个界面支持 orderType = 2，3
 */

const width = Utils.getWidth()
export default class BuyOrSellOrde extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo()
        const { navigation } = this.props;
        //取出参数   orderType    type
        this.orderType = navigation.state.params.orderType ? navigation.state.params.orderType : 2;
        this.type = navigation.state.params.type ? navigation.state.params.type : 0;

        this.title = this.orderType === 2 ? this.type === 0 ? "确认打款" : "确认收款" : "已完成"

        //  alert("orderType="+this.orderType+" type="+this.type)
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }
    render() {
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={this.title}
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 1, backgroundColor: "#f1f1f1", marginTop: 1, }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        isDownLoad={true}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={() => this._onLoadData()}
                        renderItem={(items) => this.renderItem(items)}
                    />
                </View>
            </View>
        );
    }

    renderItem(data) {
        let view = this.type === 1 ? <SellOrderItem data={data}
            delBack={(index) => this.refList.delData(index)}
            type={this.type} orderType={this.orderType}
            {...this.props} /> :
            <BuyOrderItem data={data}
                delBack={(index) => this.refList.delData(index)}
                type={this.type} orderType={this.orderType}
                {...this.props} />
        return view
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
        if (this.type == 0 && this.orderType == 2) { //买入 确认打款
            this.url = BaseUrl.getInAffirmProceeds(this.userInfo.sessionId, this.pageIndex)
        } else if (this.type == 0 && this.orderType == 3) {//买入 完成订单
            this.url = BaseUrl.getInCompleteOrder(this.userInfo.sessionId, this.pageIndex)
        } else if (this.type == 1 && this.orderType == 2) { //卖出 确认打款
            this.url = BaseUrl.getOutAffirmProceeds(this.userInfo.sessionId, this.pageIndex)
        } else if (this.type == 1 && this.orderType == 3) { //卖出 完成订单
            this.url = BaseUrl.getOutCompleteOrder(this.userInfo.sessionId, this.pageIndex)
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
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })

    }
}
