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
import RefreshFlatList2 from "../../common/RefreshFlatList2";
import { Checkbox } from "teaset"
import DialogUtils from '../../util/DialogUtils';
import BaseUrl from '../../util/BaseUrl';

/**
 * 地址管理
 */

const width = Utils.getWidth()
export default class AddressList extends BaseComponent {
    constructor(props) {
        super(props);
        this.index = 1
        this.state = {
            selectIndex: 0,
        }
        this.userInfo = this.getUserInfo()
        this.navigation = this.props.navigation;
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
                    title="地址管理"
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 1, marginTop: 10, paddingTop: 10, backgroundColor: "#f1f1f1", marginBottom: 65 }}>
                    <RefreshFlatList2
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getBuyOrSellItem(items)}
                        onRefreshs={() => this._refreshData()}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={()=>this.addAddress()}
                    style={{
                        height: 45,
                        marginTop: 40,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: "absolute",
                        bottom: 15,
                        left: 15,
                        right: 15,
                        backgroundColor: mainColor,
                    }}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 20,
                    }}> 添加地址</Text>
                </TouchableOpacity>
            </View>
        );
    }

    //刷新数据
    _refreshData() {
        this.refList.refreshStar()
        let url =  BaseUrl.getAddressList(this.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                //alert(JSON.stringify(result))
                if(result.code===1){
                    this.refList.setData(result.data)
                    if(result.data.length<1){
                        DialogUtils.showToast("暂无记录") }
                }else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else{
                     DialogUtils.showToast(result.msg)   
                }
            })
        
    }


    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getBuyOrSellItem(data) {
        //alert(JSON.stringify(data.item.zt))
        var isChecked = true
         isChecked = data.item.zt == "0" ?false  : true;
      
        if(data.item)
        return <TouchableOpacity onPress={()=>{
            if(this.navigation.state.params){
              this.navigation.state.params.selectAddess(data.item)
              this.props.navigation.goBack()
            }
          }}>
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
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Text style={{
                    flex: 1,
                    color: "#333",
                    fontSize: 18,
                }}>{data.item.name}</Text>
                <Text style={{
                    color: "#333",
                    fontSize: 18,
                    flexDirection: "row-reverse"
                }}>{data.item.telephone}</Text>
            </View>
            <Text style={{
                color: "#666666",
                fontSize: 16,
                marginTop: 15
            }}
                numberOfLines={1}
            >{data.item ? data.item.address : "地址详细信息"}</Text>
            <View style={{backgroundColor:"#ddd",height:0.5,marginTop: 15 }}></View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
                <View style={{ flex: 1, padding: 10 }}>
                    <Checkbox
                        disabled={true}
                        title='默认地址'
                        size='md'
                        checked={isChecked}
                        //onChange={value =>this.defaultAddress(data.item)}
                    />
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", flexDirection: "row-reverse", }}>
                    <TouchableOpacity
                        onPress={() => this.editCallBack(data.item)}>
                    <Text style={{
                            color: "#666666",
                            fontSize: 16,
                            alignSelf: "auto",
                            padding: 10,
                        }}>编辑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.delDialog(data.item)}>
                        <Text style={{
                            color: "#666666",
                            fontSize: 16,
                            alignSelf: "auto",
                            padding: 10,
                        }}>删除</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
        </TouchableOpacity>
    }

      /**
     * 确认删除提示框
     * @param {*} address 
     */
    delDialog(address){
        DialogUtils.showPop("您确认要删除此银行卡？一旦删除,将不可恢复！",
        ()=>this.delCallBack(address),
        ()=>{},"删除","取消")
    }

     /**
     * 删除地址
     * @param {*} data 
     */
    delCallBack(address){
        DialogUtils.showLoading()
        let url =  BaseUrl.delAddressUrl(this.userInfo.sessionId,address.addressId)
        HttpUtils.getData(url)
        .then(result => {
            DialogUtils.hideLoading();
            if(result.code===1){
                DialogUtils.showToast("删除成功")  
                this._refreshData()
            }else{
                 DialogUtils.showToast(result.msg)   
            }
        })
        .catch(error => {   
            DialogUtils.hideLoading()
        })
    }


    /**
     * 编辑地址
     * @param {*} data 
     */
    editCallBack(data) {
        this.props.navigation.navigate('EditAddress',{
            addrssInfo:data,
            editCallBack:()=>{
                this._refreshData()
            }
        })
    }
    /**
     * 添加新地址
     */
    addAddress() {
        this.props.navigation.navigate('EditAddress',{
            addrssInfo:null,
            editCallBack:()=>{
                this._refreshData()
            }
        })
    }
    /**
     * 设置默认地址
     * @param {*} data 
     */
    defaultAddress(data) {
        
    }
}
