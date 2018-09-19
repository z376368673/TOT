import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, {BaseStyles, mainColor, upDataUserInfo} from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from "../../util/Utils";
import HttpUtils from "../../util/HttpUtils";
import {SegmentedBar, Label, Overlay} from 'teaset';
import BaseUrl from '../../util/BaseUrl';
import RefreshFlatList from '../../common/RefreshFlatList';
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors"

/**
 * 交易记录
 */

const width = Utils.getWidth()
export default class TeadeRecord extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo()
        const cid = this.props.navigation.state.params.cid
        this.cid = cid
    }

    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    render() {
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={"交易记录"}
                    navigation={this.props.navigation}
                    rightView={NavigationBar.getRightStyle_More((view) => {
                        this.showPopover(view)
                    })}/>
                {this.getItemTitle()}
                <View style={{flex: 1, backgroundColor: "#f1f1f1", marginTop: 1,}}>
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

    getItemTitle() {
        let title1 =
            <View style={{flexDirection: "row", padding: 8, marginTop: 1, backgroundColor: Colors.bgColor}}>
                <View style={{flexDirection: "row", alignItems: "center", width: width / 7}}>
                    <Text style={{fontSize: 15, color: Colors.text3, flex: 1, textAlign: "center"}}>类型</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", width: width / 5}}>
                    <Text style={{fontSize: 15, color: Colors.text3, flex: 1, textAlign: "center"}}>对方</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", width: width / 5}}>
                    <Text style={{fontSize: 15, color: Colors.text3, flex: 1, textAlign: "center"}}>数量</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", width: width / 5}}>
                    <Text style={{fontSize: 15, color: Colors.text3, flex: 1, textAlign: "center"}}>总价</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", flex:1}}>
                    <Text style={{fontSize: 15, color: Colors.text3, flex: 1, textAlign: "center"}}>时间</Text>
                </View>

            </View>

        return title1
    }

    renderItem(data) {
        var cname = "TOT"
         if(data.item.cid===2){
            cname = "比特币"
        }else  if(data.item.cid===3){
            cname = "莱特币"
        }else  if(data.item.cid===4){
            cname = "以太坊"
        }else  if(data.item.cid===5){
            cname = "狗狗币"
        }else {
            cname = "TOT"
        }
        let view1 =
            <View style={{
                flexDirection: "row",
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 10,
                paddingBottom: 10,
                marginTop: 1,
                backgroundColor: Colors.white
            }}>
                <View style={{flexDirection: "row", alignItems: "center", width: width / 7}}>
                    <Text style={{fontSize: 14, color: Colors.text3, flex: 1, textAlign: "center"}}>{data.item.type===1?"出售":"购买"}</Text>
                </View>

                <View style={{flexDirection: "row", alignItems: "center", width: width / 5}}>
                    <Text style={{
                        fontSize: 14,
                        color: Colors.text3,
                        flex: 1,
                        textAlign: "center"
                    }}>{data.item.opposite}</Text>
                </View>

                <View style={{flexDirection: "row", alignItems: "center", width: width / 5}}>
                    <Text style={{
                        fontSize: 14,
                        color: Colors.text3,
                        flex: 1,
                        textAlign: "center"
                    }}>{data.item.num+"\n"}</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", width: width / 5}}>
                    <Text style={{fontSize: 14, color: Colors.text3, flex: 1, textAlign: "center"}}>{data.item.tprice}</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", flex:1}}>
                    <Text style={{
                        fontSize: 14,
                        color: Colors.text3,
                        flex: 1,
                        textAlign: "center"
                    }}>{Utils.formatDateTime(data.item.createTime*1000)}</Text>
                </View>

            </View>
        return view1
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
        this.url = BaseUrl.teadeRecord(this.userInfo.sessionId, this.pageIndex,this.cid)
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

                } else if (result.code === 2 || result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })

    }
    /**
     * onPress={() => this.showPopover(this.refs['downcenter'], 'down', 'center')}
     * @param {*} view
     * @param {*} direction
     * @param {*} align
     */
    showPopover(view) {
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
        let popoverStyle = [].concat(whiteStyle).concat(shadowStyle);

        view.measure((x, y, width, height, pageX, pageY) => {
            let fromBounds = { x: pageX, y: pageY, width, height };
            let overlayView = (
                <Overlay.PopoverView popoverStyle={popoverStyle}
                                     fromBounds={fromBounds} direction={"down"} align={"left"}
                                     directionInsets={4} showArrow={true}
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
        this.cid = cid
        this._refreshData()
    }
}
