import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import HttpUtils from '../util/HttpUtils';

export default class CountDownView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            codeText: this.props.codeText?this.props.codeText:"获取验证码"
        }
    }
    static defaultProps = {
        phone:undefined,
        viewStyle:{},
        textStyle:{},
        callBack:()=>{},
    }
    render() {
        const {textStyle,viewStyle} = this.props
        return (
            <TouchableOpacity
                style={viewStyle}
                disabled={this.state.disabled}
                activeOpacity={0.7}
                onPress={() => this.getVerificationCode()}
                >
                <Text style={[ { fontSize: 15, color: "#EAC100", padding: 5 },textStyle]}> {this.state.codeText}  </Text>
            </TouchableOpacity>
        );
    }
    /**
     * 开始倒计时
     */
    starDown() {
        var time = 60;
       var interval =  setInterval(() => {
            time = time-1
            if(time>0){
                this.setState({ codeText: time + "秒",})
            }else{
                //倒计时完成 初始化按钮文字 和 可点击状态
                this.setState({ codeText: "获取验证码",disabled: false,})
                clearInterval(interval)
            }
        }, 1000);
    }

    /**
     * 获取验证码
     */
    getVerificationCode() {
        if(!this.props.phone){
            DialogUtils.showToast("请输入手机号码")
            return
        }
        let url = BaseUrl.getVerificationCodeUrl(this.props.phone);
        //设置不可点击
        this.setState({
            disabled: true,
        })
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    this.starDown();
                    this.props.callBack(result.data)
                } else {
                    DialogUtils.showToast(result.msg)
                    this.setState({ codeText: "获取验证码",disabled: false,})
                }
            })
            .catch(error => {
                DialogUtils.showToast("服务器繁忙" + error.message)
                this.setState({ codeText: "获取验证码",disabled: false,})
            })
    }
}