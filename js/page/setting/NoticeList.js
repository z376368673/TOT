import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from "../../util/Utils";
import HttpUtils from "../../util/HttpUtils";
import RefreshFlatList from "../../common/RefreshFlatList";
import BaseUrl from '../../util/BaseUrl';
import DialogUtils from '../../util/DialogUtils';

/**
 * 公告
 */


const width = Utils.getWidth()
export default class NoticeList extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.index = 1
        this.userInfo = this.getUserInfo()
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
                    title="公告"
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 1, marginTop: 10, paddingTop: 10, backgroundColor: "#f1f1f1" }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getBuyOrSellItem(items)}
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
        let url = BaseUrl.getSystemNews(this.userInfo.sessionId, this.pageIndex)
        HttpUtils.getData(url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无消息") }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
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

    /**
     * 进入公告详情
     * @param data
     */
    onClick(news) {
        this.props.navigation.navigate('NoticDetails', {
            id:news.id,
        })
    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getBuyOrSellItem(data) {
        if (data.item)
            return <TouchableOpacity
                onPress={() => this.onClick(data.item)}>
                <View
                    key={data.item.index}
                    style={{
                        backgroundColor: '#fff',
                        //alignItems: 'center',
                        marginTop: 5,
                        marginBottom: 5,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 5,
                        flexDirection: 'column',
                        padding: 10
                    }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>

                        <Text style={{
                            color: "#333",
                            marginTop: 5,
                            fontSize: 18,
                        }}>{data.item.title}</Text>
                        {/* <View style={{ backgroundColor: "#d11", width: 8, height: 8, borderRadius: 4, marginLeft: 5 }} /> */}
                    </View>
                    <Text style={{
                        color: "#666666",
                        marginTop: 5,
                        fontSize: 16,
                    }}
                        numberOfLines={1}
                    >{data.item ? data.item.description : "description"}</Text>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{
                            color: "#666666",
                            marginTop: 5,
                            fontSize: 16,
                        }}>{Utils.formatDateTime(data.item.addtime*1000)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
    }
}
