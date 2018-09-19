import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image, Platform,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from '../../util/HttpUtils';
import BaseUrl from '../../util/BaseUrl';
import DialogUtils from '../../util/DialogUtils';
import AsySorUtils from "../../dao/AsySorUtils"
import { inject, observer } from 'mobx-react';
import UserInfo from '../../model/UserInfo';
import SplashScreen from "react-native-splash-screen"
import Colors from '../../util/Colors';
import Utils from "../../util/Utils";
import codePush from "react-native-code-push";
/**
 * 登陆页面
 */
@inject('AppStore')
export default class LoginPage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            pwd: '',
            appVersion:"1.2.8"
        }
    }
    componentDidMount() {
        SplashScreen.hide();
        AsySorUtils.getAccountPwd((result)=>{
            if(result){
                this.setState({
                    text:result[0],
                    pwd: result[1],
                })
            }
        })
        //热更新后添加这个代码 不然貌似热更新会自动回滚
        Platform.OS ==="ios"? {}:codePush.sync()
    }
    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: mainColor }]}>
                <NavigationBar
                    title={"用户登陆"}
                    navigation={this.props.navigation}
                />
                <Image
                    style={{position:"absolute"}}
                    source={require('../../../res/images/denglu-bg.png')}/>
                <View style={{height:150,justifyContent:"center",alignItems:"center"}}>
                <Image source={require('../../../res/images/denglu-logo.png')}/>
                </View>
                
                <View style={styles.itemView}>
                <Image style={{height:30,width:30,resizeMode:"stretch",marginRight:10}} 
                       source={require('../../../res/images/user.png')}/>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={"请输入手机号 / UID"}
                        defaultValue={this.state.text ? this.state.text : undefined}
                        placeholderTextColor={'#fff'}
                        underlineColorAndroid='transparent'
                        keyboardType={"numeric"}
                        onChangeText={(text) => this.setState({ text: text })} />
                </View>

                <View style={styles.itemView}>
                <Image style={{height:30,width:30,resizeMode:"contain",marginRight:10}} 
                       source={require('../../../res/images/password.png')}/>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入密码'}
                        placeholderTextColor={'#fff'}
                        defaultValue={this.state.pwd ? this.state.pwd : undefined}
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                        keyboardType={"default"}
                        onChangeText={(pwd) => this.setState({ pwd: pwd })} />
                </View>
                <View style={{ flexDirection: "row", }}>
                    <TouchableOpacity onPress={() => this.onClicks(1)} style={{ height: 50, justifyContent: 'center' }}>
                        <Text style={{
                            fontSize: 15,
                            color: Colors.white,
                            marginLeft:25,
                        }}>忘记密码?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onClicks(0)} style={{ flex: 1, height: 50, justifyContent:"center",alignItems:"flex-end" }}>
                        <Text style={{
                            fontSize: 15,
                            color: Colors.mainColor,
                            marginRight: 20
                        }}>注 册</Text>
                    </TouchableOpacity>
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
                        backgroundColor: Colors.blue1,
                    }}
                    onPress={() => this.onClicks(2)}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 20,
                        fontWeight:"900",
                    }}>登 陆</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     *  点击事件 
     * @param {*} type 
     */
    onClicks(type) {
        switch (type) {
            case 0://注册
                this.props.navigation.navigate('RegisterPage', {
                    userName: this.state.nickname,
                });
                break
            case 1://忘记密码
                this.props.navigation.navigate('ForgetPassWord', {
                    type: 0
                })
                break
            case 2://登陆
               //PassWordInput.showPassWordInput((safetyPwd) => alert(safetyPwd),"支付描述内容",100)
               // PassWordInput.showPassWordInput((safetyPwd) => alert(safetyPwd))
                //DialogUtils.showPay()
                //alert(Utils.formatNumbers("116.00",3))
                if(this.state.text.length<1){
                    DialogUtils.showMsg("请输入UID或者手机号")
                }else if(this.state.text.length<1){
                    DialogUtils.showMsg("请输入密码")
                }else{
                    this.loginByPwd();
                 }
                break
        }
    }
  
    /**
     * 登陆
     */
    loginByPwd()   {
        DialogUtils.showLoading("");
        let url = BaseUrl.loginUrl(this.state.text, this.state.pwd,this.state.appVersion)
        HttpUtils.getData(url)
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    //alert(JSON.stringify(result))
                    //Mobx保存方式
                    this.props.AppStore.setUserInfo(result.data)
                    //全局保存，    
                    UserInfo.userInfo = result.data
                   
                    DialogUtils.showToast("登陆成功")
                    //异步保存到本地文件  
                    AsySorUtils.saveAccountPwd([this.state.text, this.state.pwd])
                   // this.props.navigation.goBack()
                   // this.props.navigation.navigate('HomePage');
                    this.goHome(this.props.navigation)
                   // this.props.navigator.push({name: HomePage,reset:true});
                } else {
                    DialogUtils.showToast(result.msg)
                }
                
            })
    }

}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lineColor,
        borderRadius: 3,
        borderColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        borderWidth: 1,
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
    },
    itemTextInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.text3,
    }
});