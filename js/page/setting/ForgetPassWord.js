import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native';
import BaseComponent, {BaseStyles, mainColor, window_width} from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import DialogUtils from '../../util/DialogUtils';
import CountDownView from '../../common/CountDownView';
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import Colors from "../../util/Colors";


/**
 * 修改密码
 */
export default class ModifyPassWord extends BaseComponent {
    constructor(props) {
        super(props);
        const {type} = this.props.navigation.state.params
        this.state = {
            phone: "",
            code: 0,//当前验证码
            sms: 10868866,//短信验证码
            pwd: "",//第一次密码
            pwdAgain: "",//第二次密码
            type: type,
        }
    }
    onClicks(type) {
        switch (type) {
            case 1://确定
                if(this.state.code!=this.state.sms){
                    DialogUtils.showMsg("验证码不正确")
                }else if(this.state.pwd.length<6){
                    DialogUtils.showMsg("密码不能小于6位")
                }else if(this.state.pwd!==this.state.pwdAgain){
                    DialogUtils.showMsg("两次密码不相等,请重新输入")
                }else{
                    this.sumbit()
                }
                break
        }
    }
    sumbit(){
        if(this.state.type==0){
            this.url = BaseUrl.getForgotPwdUrl()
        }else{
            this.url = BaseUrl.getForgotPayPwdUrl()
        }
        DialogUtils.showLoading();
        //+"?mobile="+this.state.phone+"&newPwd="+this.state.pwdAgain
        HttpUtils.postData(this.url,
            {mobile:this.state.phone,newPwd:this.state.pwdAgain})
        .then(result => {
            if (result.code===1) {
                DialogUtils.showToast("修改成功")
                this.props.navigation.goBack()
            }else{
                DialogUtils.showToast(result.msg)
            }
            DialogUtils.hideLoading()
        })
    }

    render() {
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: mainColor}]}>
                <NavigationBar
                    title={this.state.type === 0 ? "找回登陆密码" : "找回支付密码"}
                    navigation={this.props.navigation}
                />
                <View style={styles.itemView}>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入手机号码'}
                        placeholderTextColor={Colors.blue_66}
                        underlineColorAndroid='transparent'
                        keyboardType="numeric"
                        value={this.state.phone}
                        onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '0')
                            this.setState({ phone: newText })}} 
                        />
                </View>

                <View style={styles.itemView}>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入验证码'}
                        placeholderTextColor={Colors.blue_66}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({code: text})}/>
                   <CountDownView codeText={"获取验证码"} 
                            phone = {this.state.phone}
                            callBack={(code)=>this.setState({sms:code})}
                            textStyle={{marginRight:-10,padding:10}}/>
                </View>

                <View style={styles.itemView}>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请设置新密码'}
                        //defaultValue={userName}
                        placeholderTextColor={Colors.blue_66}
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                        keyboardType={this.state.type === 0 ? "default" : "numeric"}
                        value={this.state.pwd}
                        onChangeText={(text) => {
                            const newText = this.state.type === 0 ?text:text.replace(/[^\d]+/, '0')
                            this.setState({ pwd: newText })}} 
                        />
                </View>

                <View style={styles.itemView}>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'确认新密码'}
                        //defaultValue={userName}
                        placeholderTextColor={Colors.blue_66}
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        keyboardType={this.state.type === 0 ? "default" : "numeric"}
                        value={this.state.pwdAgain}
                        onChangeText={(text) => {
                            const newText = this.state.type === 0 ?text:text.replace(/[^\d]+/, '0')
                            this.setState({ pwdAgain: newText })}} 
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
                        backgroundColor: "#004B97",
                    }}
                    onPress={() => this.onClicks(1)}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 20,
                    }}>确定</Text>
                </TouchableOpacity>
            </View>
        );
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
        borderWidth: 1,
        marginTop: 15,
        marginLeft:20,
        marginRight:20,
        height:50,
    },
    itemTextInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.text3,
    }
});