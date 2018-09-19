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
//众筹

export default class ZhongChou extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
            isNull: false,
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
        DialogUtils.showToast("暂无活动")
        this.refList.setData([])
        // if (this.action === 1) {
        //     this.url = BaseUrl.getOutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        // } else if (this.action === 2) {
        //     this.url = BaseUrl.getOutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        // } else {
        //     this.url = BaseUrl.getOutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        // }
        // HttpUtils.getData(this.url)
        //     .then(result => {
        //         if (result.code === 1) {
        //             if (isRefesh) {
        //                 this.refList.setData(result.data)
        //                 if (result.data.length < 1) {
        //                     DialogUtils.showToast("暂无信息")
        //                 }
        //                 this.setState({
        //                     isNull: result.data.length < 1 ? true : false,
        //                 })
        //             } else {
        //                 this.refList.addData(result.data)
        //             }
        //             this.pageIndex += 1
        //         } else if (result.code === 2||result.code === 4) {
        //             DialogUtils.showToast(result.msg)
        //             this.goLogin(this.props.navigation)
        //         } else {
        //             DialogUtils.showToast(result.msg)
        //         }
        //     })

    }

    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='众筹项目中心'
                    navigation={this.props.navigation}
                    rightView={NavigationBar.getRightStyle_Text('记录', {
                        fontSize: 16,
                        color: "#fff"
                    }, () => this.transactionRecord())}
                />

                <View style={{ flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: Colors.white }}>

                    <TouchableOpacity onPress={() => this.onClick(0)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image source={require("../../../res/images/yure.png")} style={{ height: 50, width: 50, }} />
                            <Text style={{ color: this.state.selectIndex === 0 ? Colors.mainColor : Colors.text3, fontSize: 15, marginTop: 5 }}>预热中</Text>
                        </View></TouchableOpacity>
                    <View style={{ backgroundColor: Colors.lineColor, width: 0.5, height: 50, marginTop: 10, marginBottom: 10 }}></View>
                    <TouchableOpacity onPress={() => this.onClick(1)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image source={require("../../../res/images/jinxingzhong.png")} style={{ height: 50, width: 50, }} />
                            <Text style={{ color: this.state.selectIndex === 1 ? Colors.mainColor : Colors.text3, fontSize: 15, marginTop: 5 }}>进行中</Text>
                        </View></TouchableOpacity>
                    <View style={{ backgroundColor: Colors.lineColor, width: 0.5, height: 50, marginTop: 10, marginBottom: 10 }}></View>
                    <TouchableOpacity onPress={() => this.onClick(2)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center", }}>
                            <Image source={require("../../../res/images/yijiesu.png")} style={{ height: 50, width: 50, }} />
                            <Text style={{ color: this.state.selectIndex === 2 ? Colors.mainColor : Colors.text3, fontSize: 15, marginTop: 5 }}>已结束</Text>
                        </View></TouchableOpacity>

                </View>

                <View style={{ flex: 1, backgroundColor: "#f1f1f1", marginTop: 10, }}>
                    {
                        this.state.isNull ? <Text style={{ color: "#333", fontSize: 16, backgroundColor: Colors.white, padding: 10 }}>没找到相关数据</Text> : null
                    }
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        isDownLoad={true}
                        renderItem={(items) => this._getItem(items)}
                        onRefreshs={() => this._refreshData()}
                    />

                </View>
            </View>
        );
    }
    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(data) {
        return <View style={{ flexDirection: 'row', marginTop: 2, backgroundColor: Colors.white }}>
            <Text style={{ color: "#d11", fontSize: 15, }}>￥{data.index}</Text>
            <Text style={{ color: "#888", fontSize: 15, marginLeft: 30, }}>库存:{data.index}</Text>
        </View>
    }

    transactionRecord() {//交易记录
        this.props.navigation.navigate('ZhongChouRecord');
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
            case 4://记录
                this.props.navigation.navigate('TranWepay');
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