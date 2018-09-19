import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import Utils from "../util/Utils";
import HttpUtils from "../util/HttpUtils";
import RefreshFlatList from "../common/RefreshFlatList";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import Colors from "../util/Colors";

/**
 * 转出 转入 记录
 */
const width = Utils.getWidth()
export default class TranMoneyRecord extends BaseComponent {
    pageIndex = 1;
    tranType = "out";// "in"
    constructor(props) {
        super(props);
        this.index = 1
        this.userInfo = this.getUserInfo()
        const { tranType } = this.props.navigation.state.params
        this.tranType = tranType
        this.userInfo = this.getUserInfo();

    }

    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title={this.tranType === "out" ? "转出记录" : "转入记录"}
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 1, marginTop: 10, backgroundColor: "#f1f1f1" }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getItem(items)}
                        isDownLoad={true}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={() => this._onLoadData()}
                    />
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
        if (this.tranType === "out") {
            this.url = BaseUrl.getOutRecord(this.userInfo.sessionId, this.pageIndex)
        } else {
            this.url = BaseUrl.getInRecord(this.userInfo.sessionId, this.pageIndex)
        }
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无记录") }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                }  else if(result.code === 2||result.code === 4){
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
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

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(data) {
        if (data.item){
            let imgPath = this.getImgUrl(data.item.imgHead)
            return <TouchableOpacity
               >
                <View
                    key={data.item.index}
                    style={{
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent:"center",
                        marginBottom: 8,
                        flexDirection: 'row',
                        padding: 10
                    }}>
                    <Image
                        style={{ width: 45, height: 45, borderWidth: 1, borderRadius: 23, borderColor: "#666" }}
                        source={{uri:imgPath}} />
                        
                    <View style={{ flexDirection: 'column',justifyContent:"center", flex: 1, marginLeft: 10,marginRight:10 }}>
                        <Text
                            style={{ color: "#333333", fontSize: 14 }}>{data.item ? data.item.username : ""}</Text>
                        
                        <Text style={{color: "#888",fontSize: 14,marginTop:5}}
                                numberOfLines={1}
                            >UID:{this.tranType === "out" ? data.item.getId : data.item.payId}</Text>
                    </View>

                    <View style={{ flexDirection: 'column',justifyContent:"center",flex: 2, marginLeft: 10,marginRight:10 }}>
                        <Text
                            style={{ color:Colors.mainColor, fontSize: 16,textAlign:"right"}}>{this.tranType==="out"? "-":"+"}{data.item.getNums}</Text>
                        
                        <Text style={{color: "#888", fontSize: 13, marginTop:5,textAlign:"right"}}
                                numberOfLines={1}>{Utils.formatDateTime(data.item.getTime*1000)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
    }}
}
