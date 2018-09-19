import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, window_width } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import QRCode from "react-native-qrcode";
import ExcIntegral from "./ExcIntegral";
import DialogUtils from '../util/DialogUtils';


export default class ZhuanRu extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
        }
        
    }
  
    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='转出'
                    navigation={this.props.navigation}
                    rightView={NavigationBar.getRightStyle_Text('转出记录', {
                        fontSize: 16,
                        color: "#fff"
                    }, () => this.onClicks("outRecord"))}
                />
                <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: "#fff",
                    marginTop: 8
                }]}>
                    <Text style={{
                        color: '#333',
                        fontSize: 18,
                    }}> 对方账户：</Text>
                    <TextInput
                        style={{ height: 40, flex: 1, fontSize: 16, color: '#333', marginLeft: 8 }}
                        placeholder={'请输入手机号码/UID'}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                       // defaultValue={this.state.account}
                        value={this.state.account+""}
                        onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '0')
                            this.setState({ account:newText})
                        }}
                        //失去焦点时
                        onBlur={() => this.onClicks(4)}
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
                        fontSize: 20,
                    }}> 下一步</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        height: 45,
                        marginTop: 20,
                        marginLeft: 15,
                        marginRight: 10,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#2ac988',
                    }}
                    onPress={() => this.onClicks(3)}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 20,
                    }}> 积分兑换</Text>
                </TouchableOpacity>
            </View>
        );
    }

    onClicks(index) {
        switch (index) {
            case "outRecord":
                this.props.navigation.navigate('TranMoneyRecord', {
                    tranType: "out",
                });
                break;
            case 2:
                if(this.state.account.length>0){
                    this.props.navigation.navigate('ZhuanChuNext', {
                        account: this.state.account,
                    });
                }else{
                    DialogUtils.showToast("请输入账号/UID")
                }
               
                break;
            case 3:
                this.props.navigation.navigate('ExcIntegral', {
                    account: this.state.account,
                });
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