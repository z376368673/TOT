import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import BaseComponent, { BaseStyles } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import BaseUrl from "../../util/BaseUrl";
import RefreshFlatList from "../../common/RefreshFlatList"
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors"
import Utils from '../../util/Utils';
//W宝

export default class Wbao extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
            isNull: false,
            yesterdayEarnings:"0.00",//昨日收益
            totalAssets:"0.00", //W宝资产
            availableAssets:"0.00", //可用资产
            wepayNum:"0.00", //wepay资产
            grade:0,//用户等级
        }
        this.userInfo = this.getUserInfo();
        this.action = 0
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
        if (this.action === 1) {
            this.url = BaseUrl.getWBIndex(this.userInfo.sessionId, this.pageIndex,2)
        } else if (this.action === 2) {
            this.url = BaseUrl.getWBIndex(this.userInfo.sessionId, this.pageIndex,3)
        } else {
            this.url = BaseUrl.getWBIndex(this.userInfo.sessionId, this.pageIndex,1)
        }
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    this.setState({
                        yesterdayEarnings:result.data.yesterdayEarnings,
                        totalAssets:result.data.totalAssets,
                        availableAssets:result.data.availableAssets,
                        wepayNum:result.data.wepayNum,
                        grade:result.data.grade,
                    })
                    if (isRefesh) {
                        this.refList.setData(result.data.yskWbaoDetails)
                        if (result.data.yskWbaoDetails.length < 1) {
                            DialogUtils.showToast("暂无商品")
                        }
                    } else {
                        this.refList.addData(result.data.yskWbaoDetails)
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

    getImageBygrade(){
        if (this.state.grade===1) {
            return require("../../../res/images/g1.png")
        }else  if (this.state.grade===2){
                return require("../../../res/images/g2.png")
        } else  if (this.state.grade===3){
                return require("../../../res/images/g3.png")
        } else {
                return require("../../../res/images/g0.png")
        }
    }

    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='W宝数字中心'
                    navigation={this.props.navigation}
                />
                {/* top布局 */}
                <View style={[{ alignItems: 'center', padding: 10, backgroundColor: Colors.mainColor }]}>
                    <View style={{ marginTop: 10, flexDirection: "row" }}>
                        <Text>昨日收益 (余额) </Text>
                        <Image source={this.getImageBygrade()} style={{ height: 15, width: 15, resizeMode: "stretch" }} />
                    </View>
                    <Text style={{ fontSize: 15, color: "#fff", marginTop: 10, }}>{this.state.yesterdayEarnings}</Text>
                </View>
                {/* 顶部布局  资产  余额*/}
                <View style={[{
                    flexDirection: 'row', backgroundColor: Colors.mainColor
                }]}>
                    <TouchableOpacity
                        activeOpacity={0.8} >
                        <View style={{ padding: 10, flexDirection: 'column', alignItems: "center", justifyContent: "center", width: Utils.getWidth() / 2, backgroundColor: "#62abad" }}>
                            <Text style={{ fontSize: 14, color: '#fff' }}>W宝总资产</Text>
                            <Text style={{ fontSize: 16, color: '#fff', marginTop: 5 }}>{this.state.totalAssets}</Text>
                        </View></TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}  onPress={()=>this._goTran(3)}>
                        <View style={{ padding: 10, flexDirection: 'column', alignItems: "center", justifyContent: "center", width: Utils.getWidth() / 2, backgroundColor: "#62a2a4" }}>
                            <Text style={{ fontSize: 14, color: '#fff' }}> 可用资产</Text>
                            <Text style={{ fontSize: 16, color: '#fff', marginTop: 5 }}>{this.state.availableAssets}</Text>
                        </View></TouchableOpacity>
                </View>
                <View style={{ marginTop: 5, flexDirection: "row", alignItems: "center", padding: 5, backgroundColor: Colors.white }}>
                    <TouchableOpacity onPress={() => this.onClick(0)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: this.state.selectIndex === 0 ? Colors.red : Colors.text3, fontSize: 15, marginTop: 5, fontWeight: "900" }}>收益记录</Text>
                        </View></TouchableOpacity>
                    <View style={{ backgroundColor: Colors.lineColor, width: 0.5, height: 20, marginTop: 10, marginBottom: 10 }}></View>
                    <TouchableOpacity onPress={() => this.onClick(1)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: this.state.selectIndex === 1 ? Colors.red : Colors.text3, fontSize: 15, marginTop: 5, fontWeight: "900" }}>转出记录</Text>
                        </View></TouchableOpacity>
                    <View style={{ backgroundColor: Colors.lineColor, width: 0.5, height: 20, marginTop: 10, marginBottom: 10 }}></View>
                    <TouchableOpacity onPress={() => this.onClick(2)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center", }}>
                            <Text style={{ color: this.state.selectIndex === 2 ? Colors.red : Colors.text3, fontSize: 15, marginTop: 5, fontWeight: "900" }}>转入记录</Text>
                        </View></TouchableOpacity>
                </View>
                
                {
                    this._getItemTiele()
                }
                <View style={{ flex: 1, marginTop: 1 }}>

                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        isDownLoad={true}
                        renderItem={(items) => this._getItem(items)}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={()=>this._onLoadData()}
                    />

                </View>


                <View style={[{ flexDirection: 'row', }]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={()=>this._goTran(2)}
                        style={{
                            padding: 10, flexDirection: 'column', alignItems: "center",
                            justifyContent: "center", width: Utils.getWidth() / 2, backgroundColor: Colors.red_d9
                        }}>
                        <Text style={{ fontSize: 16, color: '#fff' }}>转入</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}
                                      onPress={()=>this._goTran(1)}
                        style={{
                            padding: 10, flexDirection: 'column', alignItems: "center",
                            justifyContent: "center", width: Utils.getWidth() / 2, backgroundColor: Colors.blue_66
                        }}>
                        <Text style={{ fontSize: 16, color: '#fff' }}>转出</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    _getItemTiele() {
        let item1 = <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.black_dc }}>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>来源</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>数量(余额)</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>时间</Text>
        </View>

        let item2 = <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.black_dc }}>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>数量</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>时间</Text>
        </View>
        let item3 = <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.black_dc }}>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>来源</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>数量</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>时间</Text>
        </View>
        if (this.state.selectIndex === 0) {
            return item1
        } else if (this.state.selectIndex === 1) {
            return item2
        } else {
            return item3
        }
    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(data) {
        let typeNmae
            if ( data.item.type===1){
                typeNmae = "转出"
            } else if ( data.item.type===2){
                typeNmae = "转入"
            } else if ( data.item.type===3){
                typeNmae = "静态收益"
            } else if ( data.item.type===4){
                typeNmae = "动态收益"
            } else if ( data.item.type===5){
                typeNmae = "冻结"
            }

        let item1 = <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.white }}>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>{typeNmae}</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>{Utils.formatNumBer(data.item.num, 4)}</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>{Utils.formatDateTime(data.item.createTime*1000)}</Text>
        </View>

        let item2 = <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.white }}>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>{Utils.formatNumBer(data.item.num, 4)}</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>{Utils.formatDateTime(data.item.createTime*1000)}</Text>
        </View>
        let item3 = <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.white }}>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>{typeNmae}</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 4, textAlign: "center" }}>{Utils.formatNumBer(data.item.num, 4)}</Text>
            <Text style={{ padding: 8, color: "#333", fontSize: 13, width: Utils.getWidth() / 2, textAlign: "center" }}>{Utils.formatDateTime(data.item.createTime*1000)}</Text>
        </View>
        if (this.state.selectIndex === 0) {
            return item1
        } else if (this.state.selectIndex === 1) {
            return item2
        } else {
            return item3
        }
    }

    onClick(type) {
        switch (type) {
            case 0: //预热中
            case 1://进行中
            case 2://已结束
                this.setState({
                    selectIndex: type,
                })
                this.action = type
                this._refreshData()
                break;
        }
    }

    _goTran(type) {
        if (type===2){
            this.props.navigation.navigate('TranWB',{
                type:type,
                number:this.state.wepayNum,
                setCallback:()=>this._refreshData()
            });
        } else if (type===3){
            this.props.navigation.navigate('TranWB',{
                type:type,
                number:this.state.availableAssets,
                setCallback:()=>this._refreshData()
            });
        }else {
            this.props.navigation.navigate('TranWB',{
                type:type,
                number:this.state.availableAssets,
                setCallback:()=>this._refreshData()
            });
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