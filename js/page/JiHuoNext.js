import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, {BaseStyles, mainColor, upDataUserInfo} from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import HttpUtils from '../util/HttpUtils';
import PassWordInput from '../common/PassNumInput';
import { observer, inject } from 'mobx-react';
import HomePage from './HomePage';
//激活
@inject('AppStore')@observer
export default class JiHuoNext extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            exchangeMoney:0,
            yue: 0,
            jifen: 0,
        }
        //this.account =  this.navigation.state.params.account;
    // this.props.AppStore.userInfo = this.getUserInfo();
   
    }
    componentDidMount(){
       
    }
     /**
     * 积分兑换
     */
    creditsExchange(safetyPwd){
        DialogUtils.showLoading()
        let url =  BaseUrl.creditsExchange()
        HttpUtils.postData(url,{
            sessionId: this.props.AppStore.userInfo.sessionId,
            exchangeMoney: this.state.exchangeMoney,
            safetyPwd: safetyPwd,
        })
        .then(result => {
            DialogUtils.hideLoading()
            if (result.code===1) {
               DialogUtils.showToast("激活成功")
               upDataUserInfo(this.props.AppStore)
               this.props.navigation.navigate('HomePage');
            } else if(result.code === 2||result.code === 4){
                DialogUtils.showToast(result.msg)
                this.goLogin(this.props.navigation)
            } else{
               DialogUtils.showToast(result.msg)
            }
        })
     
    }

     //  获取兑换的积分  
     getExchangeIntegral() {
        DialogUtils.showLoading()
        let url = BaseUrl.getExchangeIntegral(this.props.AppStore.userInfo.sessionId,this.state.exchangeMoney)
        console.warn(url)
        HttpUtils.getData(url)
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    PassWordInput.showPassWordInput((safetyPwd)=>{
                        this.creditsExchange(safetyPwd)
                     },"实际获得积分",result.data)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }
    render() {
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                <NavigationBar
                    title='激活'
                    navigation={this.props.navigation}

                />

                {/* 余额积分布局*/}
                <View style={[ {
                    flexDirection:'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: 10,
                    paddingTop:30,
                    backgroundColor:mainColor
                }]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                    >
                        <View style={{flexDirection: 'column',alignItems: "center" }}>
                            <Text style={{fontSize: 16, color: '#fff'}}>{this.props.AppStore.userInfo.cangkuNum}</Text>
                            <Text style={{fontSize: 14, color: '#fff',marginTop:5}}>当前余额</Text>
                        </View></TouchableOpacity>
                    <View style={{height: 30, width: 0.5, backgroundColor: '#fff'}}/>
                    <TouchableOpacity
                        activeOpacity={0.8}
                    >
                        <View style={{flexDirection: 'column',alignItems: "center" }}>
                            <Text style={{fontSize: 16, color: '#fff'}}>{this.props.AppStore.userInfo.fengmiNum}</Text>
                            <Text style={{fontSize: 14, color: '#fff',marginTop:5}}>当前积分</Text>
                        </View></TouchableOpacity>
                </View>
                <View style={{backgroundColor:"#f0f0f0",height:10,}}/>
                <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: "#fff",
                }]}>
                    <TextInput
                        style={{height: 40,flex:1,fontSize: 16,color:'#333',marginLeft:8}}
                        placeholder ={'请输入激活数量（最低200）'}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        value={this.state.exchangeMoney}
                        onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '0')
                            this.setState({ exchangeMoney: newText })}} 
                        //失去焦点时
                        // onBlur={()=>this.onClicks(4)}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        height:45,
                        marginTop:40,
                        marginLeft:15,
                        marginRight:15,
                        borderRadius:8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:mainColor,
                    }}
                    onPress={()=>this.onClicks("sumbit")}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 20,
                    }}> 确定 </Text>
                </TouchableOpacity>
            </View>
        );
    }

    onClicks(index) {
        switch (index) {
            case "sumbit"://确定兑换
            if(this.state.exchangeMoney<100||this.state.exchangeMoney%100!==0){
                DialogUtils.showMsg("请输入大于等于100的整数倍")
            }else{
                this.getExchangeIntegral()
               
            }
                break;
            default:
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