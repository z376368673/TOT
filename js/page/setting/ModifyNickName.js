import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, upDataUserInfo } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import AsySorUtils from '../../dao/AsySorUtils';
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import DialogUtils from '../../util/DialogUtils';
import { inject } from 'mobx-react';

/**
 * 修改昵称
 */
@inject("AppStore")
export default class ModifyNickName extends BaseComponent {
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
        const { userName, sessionId } = this.props.navigation.state.params
        this.userInfo = this.getUserInfo();
        this.state = {
            userInfo:this.userInfo,
            userName: userName,
            sessionId: sessionId,
        }
    }



    /**
     * 修改昵称
     */
    updateUserName() {
        DialogUtils.showLoading()
        //alert(this.state.userName)
        let url = BaseUrl.updateUserName(this.state.sessionId,this.state.userName )
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                     upDataUserInfo(this.props.AppStore)
                    //更新用户本地信息
                      //这个nickname 是上一个界面里 
                      this.userInfo.userName = this.state.userName;
                      this.navigation.state.params.callbacks({ nickname: this.state.userName })
                      this.props.navigation.goBack()
                    DialogUtils.showToast("修改成功")
                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
                    DialogUtils.showToast(result.msg)
                }
                DialogUtils.hideLoading()
            })
    }
    render() {

        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='修改昵称'
                    navigation={this.props.navigation}
                />
                <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: "#fff",
                    marginTop: 8
                }]}>
                    <TextInput
                        style={{ height: 40, flex: 1, fontSize: 16, color: '#333', marginLeft: 8 }}
                        placeholder={'请输入新的昵称'}
                        defaultValue={this.state.userName}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={"default"}
                        onChangeText={(text) => this.setState({ userName: text })}
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
                    onPress={() => this.onClicks()}
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
    onClicks() {
        this.updateUserName();


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