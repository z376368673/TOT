import React, { Component } from 'react';
import {
    TextInput,
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
import Colors from '../util/Colors';

/**
 * 分享记录
 */
const width = Utils.getWidth()
export default class SharedRecord extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.index = 1
        this.userInfo = this.getUserInfo()
        this.state = {
            keyword: "",
        }

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
                    title={this.tranType === "分享记录"}
                    navigation={this.props.navigation}
                />

                <View style={{ height: 35, flexDirection: "row", alignItems: "center", margin: 5 }}>
                    <TextInput
                        style={[{
                            borderRadius: 5, height: 35, flex: 1, fontSize: 13, color: '#333',
                            backgroundColor: "#fff", padding: 5, borderColor: "#ccc",
                        }]}
                        placeholder={'搜索UID/手机号码'}
                        //defaultValue={userName}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={"default"}
                        maxLength={12}
                        value={this.state.keyword}
                        onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '0')
                            this.setState({ keyword: newText })}} />
                    <Text style={{
                        backgroundColor: "#d15", color: "#fff", fontSize: 15,
                        borderRadius: 10, paddingLeft: 12, paddingRight: 12,
                        marginLeft: 10, paddingTop: 10, paddingBottom: 10,
                    }}
                        onPress={() => this._refreshData()}
                    >搜索</Text>
                </View>

                <View style={{ flex: 1, marginTop: 10, backgroundColor: "#f1f1f1" }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getItem(items)}
                        // isDownLoad={true}
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
        this.url = BaseUrl.shareRecord(this.userInfo.sessionId, this.pageIndex, this.state.keyword)
        // alert(this.url)
        HttpUtils.getData(this.url)
            .then(result => {
                // alert(JSON.stringify(result))
               // alert(JSON.stringify(result))
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无消息")
                        }
                    }else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                }else if (result.code === 2||result.code === 4) {
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

    onClick(news) {

    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(data) {
        if (data.item) {
            let imgPath = this.getImgUrl(data.item.imgHead)
            return <TouchableOpacity
                onPress={() => this.onClick(data.item)}>
                <View
                    key={data.item.index}
                    style={{
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: "center",
                        marginBottom: 8,
                        flexDirection: 'row',
                        padding: 10
                    }}>
                    <Image
                        style={{ width: 45, height: 45, borderWidth: 1, borderRadius: 23, borderColor: "#666" }}
                        source={{ uri: imgPath }} />

                    <View style={{ flexDirection: 'column', justifyContent: "center", flex: 1, marginLeft: 10, marginRight: 10 }}>
                        <Text
                            style={{ color: "#333333", fontSize: 14 }}>{data.item ? data.item.username : "name"}</Text>

                        <Text style={{ color: "#888", fontSize: 14, marginTop: 5 }}
                            numberOfLines={1}
                        >UUID:{data.item ? data.item.userid : "name"}</Text>
                        <Text style={{ color: "#888", fontSize: 14, marginTop: 5 }}
                            numberOfLines={1}
                        >手机号:{data.item ? data.item.mobile : "name"}</Text>
                    </View>

                    <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignItems: "flex-end", alignSelf: "flex-end" }}>
                        <Text
                            style={{
                                color: "#fff", fontSize: 14,
                                backgroundColor: this.getGradeStyle(data.item.useGrade)[0], 
                                paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
                            }}>{this.getGradeStyle(data.item.useGrade)[1] }</Text>

                        <Text style={{ color: "#888", fontSize: 13, marginTop: 5, textAlign: "right" }}
                            numberOfLines={1}>{Utils.formatDateTime(data.item.regDate * 1000)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        }
    }

    getGradeStyle(useGrade) {
        var color;
        var text;
        switch (useGrade) {
            case 0:
                color = Colors.gray
                text = "初始会员"
                break
            case 1:
                color = Colors.green
                text = "普通会员"
                break
            case 2:
                color = Colors.blue
                text = "五星会员"
                break
            case 3:
                color = Colors.red
                text = "VIP"
                break
        }
        return [color,text]
    }
}
