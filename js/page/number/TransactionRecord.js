import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from "../../util/Utils";
import HttpUtils from "../../util/HttpUtils";
import { SegmentedBar, Label } from 'teaset';
import BaseUrl from '../../util/BaseUrl';
import RefreshFlatList from '../../common/RefreshFlatList';
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors"

/**
 * 交易记录
 */

const width = Utils.getWidth()
export default class TransactionRecord extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
        this.barItems = [
            '转出记录',
            '转入记录',
        ];
        this.userInfo = this.getUserInfo()
        this.activeIndex = 0;
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    onSegmentedBarChange(index) {
        if (index != this.activeIndex) {
            this.setState({ activeIndex: index });
            this.activeIndex = index
            this._refreshData()
        }
    }

    renderCustomItems() {
        let { activeIndex } = this.state;
        return this.barItems.map((item, index) => {
            let isActive = index == activeIndex;
            let tintColor = isActive ? mainColor : '#333';
            return (
                <View key={index} style={{ padding: 15, alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, color: tintColor, paddingTop: 4, }} >{item}</Text>
                </View>
            );
        });
    }

    render() {
        let { activeIndex } = this.state;
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={"交易记录"}
                    navigation={this.props.navigation} />
                <SegmentedBar
                    justifyItem={"fixed"}
                    indicatorLineColor={Colors.r1}
                    indicatorLineWidth={2}
                    indicatorPositionPadding={5}
                    activeIndex={activeIndex}
                    onChange={index => this.onSegmentedBarChange(index)} >
                    {this.renderCustomItems()}
                </SegmentedBar>

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
        return <View style={{ padding: 15,marginTop:1 ,backgroundColor:Colors.white}}>
            <Text style={{ fontSize: 15, color: Colors.text3 }}>{this.state.activeIndex===0?"转出":"转入"} {data.item.getNums} Wepay</Text>
            <View style={{ flexDirection: "row",marginTop:10 }}>
                <Text style={{ fontSize: 14, color: Colors.text6, flex: 1 }}>{Utils.formatDateTime(data.item.getTime*1000)}</Text>
                <Text style={{ fontSize: 15, color: Colors.r1 }}>与 {data.item.userName} 完成交易</Text>
            </View>
        </View>
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
        if (this.activeIndex === 0) { //转出
            this.url = BaseUrl.tradingRecord(this.userInfo.sessionId, this.pageIndex,this.activeIndex +1)
        } else if (this.activeIndex === 1) {//转入
            this.url = BaseUrl.tradingRecord(this.userInfo.sessionId, this.pageIndex,this.activeIndex +1)
        }

        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无信息")
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
}
