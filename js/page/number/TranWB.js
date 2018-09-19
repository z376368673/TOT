import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import QRCode from "react-native-qrcode";
import ExcIntegral from "../ExcIntegral";
import DialogUtils from '../../util/DialogUtils';
import Utils from '../../util/Utils';
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import PassWordInput from '../../common/PassNumInput';

//W宝  转出 转入  锁定
export default class TranWB extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            account: "", //数量
            wepayNum:this.props.navigation.state.params.number, // 当前数量
        }
        this.userInfo = this.getUserInfo()
        this.type = this.props.navigation.state.params.type // 1转出 2转入  3锁定
        this.title = "W宝转出"
    }

    render() {
        let name
        if(this.type===1){
            this.title = "W宝转出"
            name = "转出"
        }else if(this.type===2){
            this.title = "W宝转入"
            name = "转入"
        } else{
            this.title = "W宝锁定资产"
            name = "锁定"
        }
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title={this.title}
                    navigation={this.props.navigation}
                />
                <View style={[{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: "#fff", marginTop: 8 }]}>
                    <Text style={{color: '#666', fontSize: 14, }}>当前{this.type===2?"wepay资产":"W宝可用资产"}:</Text>
                    <TextInput
                        style={{ height: 40, flex: 1, fontSize: 15, color: '#333', marginLeft: 8 }}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        editable={false}
                        value={this.state.wepayNum + ""}

                    />
                </View>
                <View style={[{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: "#fff", marginTop: 1 }]}>
                    <Text style={{color: '#333', fontSize: 14, width: 80,}}>{name}数量</Text>
                    <TextInput
                        style={{ height: 40, flex: 1, fontSize: 14, color: '#333', marginLeft: 8 }}
                        placeholder={'可输入最多四位小数'}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        value={this.state.account + ""}
                        onChangeText={(text) => {
                            const newText = Utils.chkCurrency(text,4)
                            this.setState({ account: newText })
                        }}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        height: 45,
                        marginTop: 40,
                        marginLeft: 15,
                        marginRight: 15,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mainColor,
                    }}
                    onPress={() => this.onClicks(2)}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 16,
                    }}> 确定</Text>
                </TouchableOpacity>
            </View>
        );
    }

    //支付转出
    payTransfer(transferAddress, safetyPwd) {
        if (this.type===2){
            this.url = BaseUrl.rollInWb()
        } else   if (this.type===3){
            this.url = BaseUrl.lockAssetWb()
        }else {
            this.url = BaseUrl.rollOut()
        }
        DialogUtils.showLoading();
        HttpUtils.postData(this.url,
            {
                sessionId: this.userInfo.sessionId,
                num: transferAddress,
                safetyPwd: safetyPwd
            })
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    if (this.type===2){
                        DialogUtils.showToast("转入成功")
                        this.props.navigation.state.params.setCallback()
                    } else if (this.type===3){
                        DialogUtils.showToast("锁定成功")
                        this.props.navigation.state.params.setCallback()
                    }else {
                        DialogUtils.showToast("转出成功")
                        this.props.navigation.state.params.setCallback()
                    }
                    this.props.navigation.goBack()
                } else {
                    DialogUtils.showToast(result.msg)
                }

            })
    }

    onClicks(index) {
        switch (index) {
            case "outRecord":
                this.props.navigation.navigate('TransactionRecord');
                break;
            case 2:
                if (this.state.account.length < 1) {
                    DialogUtils.showToast("请输入数量")
                } else {
                    PassWordInput.showPassWordInput((safetyPwd) => {
                        this.payTransfer(this.state.account, safetyPwd)
                    },this.title,this.state.account)
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