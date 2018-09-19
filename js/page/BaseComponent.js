import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import DialogUtils from "../util/DialogUtils"
import HttpUtils from "../util/HttpUtils"
import AsySorUtils from '../dao/AsySorUtils';
import { inject } from 'mobx-react';

import { PullPicker } from 'teaset';
import SplashScreen from "react-native-splash-screen"
import BaseUrl from '../util/BaseUrl';
import user from '../model/UserInfo';
import UserInfo from '../model/UserInfo';
//重置路由 首先导入NavigationActions
import { NavigationActions, StackActions } from 'react-navigation';
import Colors from "../util/Colors";

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        // this.navigation = this.props.navigation;
        //this.props.navigation.navigate('name');
        // this.props.navigation.goBack()
        //this.props.AppStore.userInfo.sessionId,
        //const { userName, sessionId } = this.props.navigation.state.params
    }

    //qu登录
    goLogin(navigation) {
        //然后设置新路由的第0个路由为home 
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'LoginPage' }),
            ],
        });
        //执行重置路由方法
        navigation.dispatch(resetAction)
    }

    //跳转并替换当前路由
    goHome(navigation ) {
        //然后设置新路由的第0个路由为home 
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'HomePage' }),
            ],
        });
        //执行重置路由方法
        navigation.dispatch(resetAction)
    }

    componentDidMount() {
        // SplashScreen.hide();
    }

    getUser() {
        return user;
    }
    //获取用户信息
    getUserInfo() {
        if (user.userInfo === null) {
            //下面的方法不同步 很烦 正在找方法
            return null
        }
        return user.userInfo;
    }
    //获取用户信息 sessionId
    getSessionId() {
        return user.sessionId;
    }
    getCallBackValue = (params) => this.setState(params)
    //获取图片拼接的地址，有些图片不需要拼接
    getImgUrl() {
        return "http://wepay.hxksky.com/"
    }
    getImgUrl(imgName) {
        return "http://wepay.hxksky.com/" + imgName
    }
    getSharedUrl(userId) {
        return "http://wp.wepay168.com/wepay/share?userId=" + userId
    }

    setQRcode(text) {
        return qrcodetext + text
    }
    getQRcode(text) {
        return text.substr(qrcodetext.length, text.length)
    }
}
const qrcodetext = "567309251673029316273928";
const { height, width } = Dimensions.get('window');
export const mainColor = Colors.mainColor;
export const window_height = height;
export const window_width = width;
//更新用户信息  想办法更新全局的 用户信息
export const upDataUserInfo = (AppStore) => {
    let url = BaseUrl.getUserInfoBy(AppStore.userInfo.sessionId)
    HttpUtils.getData(url)
        .then(result => {
            if (result.code === 1) {
                //Mobx保存方式
                AppStore.setUserInfo(result.data)
                //全局保存
                UserInfo.userInfo = result.data
            } else {
                DialogUtils.showToast(result.msg)
            }
        })
}

//领红包 积分释放到余额
export const integralRelease = (AppStore) => {
    let url = BaseUrl.integralRelease(AppStore.userInfo.sessionId)
    HttpUtils.getData(url)
        .then(result => {
            if (result.code === 1) {
                upDataUserInfo(AppStore)
                DialogUtils.showToast("红包领取成功")
            } else {
                DialogUtils.showToast(result.msg)
            }
        })

}


export const BaseStyles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    container_row: {
        flex: 1,
        flexDirection: 'row',
    },
    container_column: {
        flex: 1,
        flexDirection: 'column',
    },

});


/*
flexWrap enum('wrap', 'nowrap')

flexDirection enum('row', 'column','row-reverse','column-reverse')
row: 从左向右依次排列
row-reverse: 从右向左依次排列
column(default): 默认的排列方式，从上向下排列
column-reverse: 从下向上排列

justifyContent enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around')
space-between 在每行上均匀分配弹性元素。相邻元素间距离相同。每行第一个元素与行首对齐，每行最后一个元素与行尾对齐。
space-around 在每行上均匀分配弹性元素。相邻元素间距离相同。每行第一个元素到行首的距离和每行最后一个元素到行尾的距离将会是相邻元素之间距离的一半


alignItems enum('flex-start', 'flex-end', 'center', 'stretch')
stretch 弹性元素被在侧轴方向被拉伸到与容器相同的高度或宽度。

子视图属性
alignSelf enum('auto', 'flex-start', 'flex-end', 'center', 'stretch')
stretch 元素被拉伸以适应容器。
center 元素位于容器的中心。
flex-start 元素位于容器的开头。
flex-end 元素位于容器的结尾。

position enum('absolute', 'relative')属性设置元素的定位方式，为将要定位的元素定义定位规则。
absolute：生成绝对定位的元素，元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。
relative：生成相对定位的元素，相对于其正常位置进行定位。因此，"left:20" 会向元素的 LEFT 位置添加 20 像素。
*/
