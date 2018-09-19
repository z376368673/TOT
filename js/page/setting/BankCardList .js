import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import BaseComponent, {BaseStyles, mainColor} from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from "../../util/Utils";
import HttpUtils from "../../util/HttpUtils";
import {getBankCardIcon} from "../../model/BankCardModel";
import RefreshFlatList2 from "../../common/RefreshFlatList2";
import AddBankCard from "./AddBankCard";
import BaseUrl from '../../util/BaseUrl';
import DialogUtils from '../../util/DialogUtils';
/**
 * 我的银行卡
 */

const width = Utils.getWidth()
export default class BankCardList extends BaseComponent {
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
        this.index = 1
        this.userInfo = this.getUserInfo()
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    render() {
        const {navigation} = this.props;
        const title = navigation.state.params.title ? navigation.state.params.title : '我的银行卡'
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                <NavigationBar
                    title={title}
                    navigation={this.props.navigation}
                />
                <View style={{flex: 1, marginTop: 10, paddingTop: 10, backgroundColor: "#f1f1f1"}}>
                    <RefreshFlatList2
                        ref={refList => this.refList = refList}
                        renderItem={(items) => this._getBankCardItem(items)}
                        onRefreshs={() => this._refreshData()}
                        footerView={() => this.getFootView()}
                    />
                </View>
            </View>
        );
    }

  

    //刷新数据
    _refreshData() {
        this.refList.refreshStar()
        let url =  BaseUrl.getUserBankListUrl(this.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                //alert(JSON.stringify(result))
                if(result.code===1){
                    this.refList.setData(result.data)
                }else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else{
                     DialogUtils.showToast(result.msg)   
                }
            })
        
    }

    /**
     * 绘制FootView
     * @returns {*}
     */
    getFootView() {
        return <TouchableOpacity
            onPress={() => this.onClickAddBankCard()}
            activeOpacity={0.8}>
            <View style={{
            flex: 1,
            backgroundColor: mainColor,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            margin: 20,
        }}>
            <Image
                style={{width: 50, height: 50, marginLeft: 5}}
                source={getBankCardIcon(-1)}/>
            <Text style={{
                color: "#fff",
                fontSize: 18,
                padding: 15,
            }}>添加银行卡</Text>
        </View></TouchableOpacity>
    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getBankCardItem(data) {

        let isDefault = <Text 
        style={{color:"#fff",fontSize:12,
        backgroundColor:mainColor,//width:30,height:15,
        padding:5,
        position:"absolute",left:0,top:0,alignSelf:"center"
        }}>默认</Text>

        return <TouchableOpacity onPress={()=>{
          let  exis =  this.navigation.state.params.selectBank
          if(exis){
            this.navigation.state.params.selectBank(data.item)
            this.props.navigation.goBack()
          }
        }}><View
            key={data.item.index}
            style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 20,
                marginRight: 20,
                borderRadius: 5,
                flexDirection: 'row',
                padding: 10
            }}>
            <Image
                style={{width: 50, height: 50, marginLeft: 5}}
                source={{uri:this.getImgUrl(data.item.banqImg)}}/>
            <View style={{flexDirection: 'column', flex: 1, marginLeft: 10, marginRight: 10}}>
                <Text
                    style={{color: "#333333", fontSize: 18}}>{data.item ? data.item.banqGenre : ""}</Text>
                <Text style={{
                    color: "#666666",
                    marginTop: 5,
                    fontSize: 15,
                }}>{data.item ? data.item.cardNumber : ""}</Text>
            </View>
          
            {data.item.isDefault===0?isDefault:null}
            <TouchableOpacity
                onPress={()=>this.delDialog(data.item.id)}>
                <Text style={{
                    marginRight: 5,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 8,
                    paddingRight: 8,
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: "#cccccc"
                }}>删除</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    }
    /**
     * 去添加银行卡
     */
    onClickAddBankCard() {
        this.props.navigation.navigate("AddBankCard",{
            callback:()=>this._refreshData()
        })
    }
      /**
     * 确认删除提示框
     * @param {*} id 
     */
    delDialog(id){
        DialogUtils.showPop("您确认要删除此银行卡？一旦删除,将不可恢复！",
        ()=>this.delBankCard(id),
        ()=>{},"删除","取消")
    }

    /**
     * 删除银行卡
     * @returns {undefined}
     */
    delBankCard(id){
        DialogUtils.showLoading()
        let url =  BaseUrl.delBankCardUrl(this.userInfo.sessionId,id)
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
      
    }
}
