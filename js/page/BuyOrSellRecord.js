import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, {BaseStyles} from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import Utils from "../util/Utils";
import RefreshFlatList from "../common/RefreshFlatList";
import HttpUtils from "../util/HttpUtils";
import DialogUtils from '../util/DialogUtils';
import BaseUrl from '../util/BaseUrl';

const URL = 'https://api.github.com/search/repositories?q=';
/**
 * 买入/卖出记录
 */


const width = Utils.getWidth()
export default class BuyOrSellRecord extends BaseComponent {
    constructor(props) {
        super(props);

        this.userInfo = this.getUserInfo()
        //type 表示     0，买入  1， 卖出  
        const { navigation } = this.props;
        this.type = navigation.state.params.type ? navigation.state.params.type : 0;
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    render() {
        const {navigation} = this.props;
        const type = navigation.state.params.type ? navigation.state.params.type : 0;
        let title = type===0?"买入记录":"卖出记录"
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
                    <View style={{alignItems: 'center', width: width / 3 - 2,}}>
                        <Text style={{
                            color: '#333',
                            fontSize: 18,
                        }}>{type===0?"卖出":"买入"}账号</Text>
                    </View>
                    <View style={{alignItems: 'center', width: 1, backgroundColor: "#999"}}/>
                    <View style={{alignItems: 'center', width: width / 3,}}>
                        <Text style={{
                            color: '#333',
                            fontSize: 18,
                        }}>{type===0?"买入":"卖出"}金额</Text>
                    </View>
                    <View style={{alignItems: 'center', width: 1, backgroundColor: "#999"}}/>
                    <View style={{alignItems: 'center', width: width / 3,}}>
                        <Text style={{
                            color: '#333',
                            fontSize: 18,
                        }}>{type===0?"买入":"卖出"}时间</Text>
                    </View>
                </View>
                <View style={{flex: 1, marginTop: 10, paddingTop: 10, backgroundColor: "#fff"}}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        onRefreshs={() => {
                            this._refreshData()
                        }}
                        onLoadData={() =>this._onLoadData()}
                        isDownLoad={true}
                        renderItem={(items) => this._getBuyOrSellItem(items)}/>
                </View>
            </View>
        );
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
            this.url = BaseUrl.getInBuyRecords(this.userInfo.sessionId, this.pageIndex)
        } else if (this.type == 1) { //卖出 
            this.url = BaseUrl.getOutSellRecords(this.userInfo.sessionId, this.pageIndex)
        }
        HttpUtils.getData(this.url)
            .then(result => {
               // alert(JSON.stringify(result.data))
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if(result.data.length<1){
                            DialogUtils.showToast("暂无记录") }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
           
    }

    _getBuyOrSellItem(items) {
        return <View style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: '#CCC',
            backgroundColor: '#fff',
            marginBottom: 1,
            paddingTop:15,
            paddingBottom:15,
            paddingLeft:10,
            paddingRight:10,
        }}>
            <TouchableOpacity onPress={() => {
                // alert('点击')
            }}>
                <View style={{flexDirection: 'row',}}>
                    <Text style={{color: "#333333", fontSize: 13,width: width / 3 ,textAlign:"center",alignSelf:"center"}}>
                    {this.type === 0?items.item.payoutId:items.item.payinId}({items.item.userName})</Text>
                    <Text style={{
                        color: "#333",
                        fontSize: 14,
                        width: width / 3,textAlign:"center",alignSelf:"center"
                    }}>{items.item.payNums}</Text>
                     <Text style={{
                        color: "#333",
                        fontSize: 14,
                        width: width / 3,textAlign:"center",
                    }}>{Utils.formatDateTime(items.item.getMoneyTime * 1000)}</Text>
                </View>
            </TouchableOpacity>
        </View>
    }
}
