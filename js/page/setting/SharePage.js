import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    CameraRoll,
    Clipboard,
    Platform, 
} from 'react-native';
var ReactNative = require('react-native');

import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import QRCode from "react-native-qrcode";
import DialogUtils from '../../util/DialogUtils';
/**
 * 分享好友
 */

export default class SharePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo();
        let sharedUrl = this.getSharedUrl(this.userInfo.userid);
        let json = { type: "url", data: sharedUrl }
        this.state = {
            text: sharedUrl,
        }
    }
    /**
     * 保存图片
     * @param {*} view 
     */
    saveImgBy(view) {
        if(Platform.OS==='ios'){
            ReactNative.takeSnapshot(view, { format: 'png', quality: 1 }).then(
                (uri) => {
                    var promise = CameraRoll.saveToCameraRoll(uri);
                    promise.then(function (result) {
                        DialogUtils.showToast('保存成功')
                    }).catch(function (error) {
                        DialogUtils.showToast('保存失败！\n' + error);
                    });
                }
            ).catch(
                (error) => alert(error)
            );
        }else{
            DialogUtils.showMsg("Android暂不支持保存二维码，可以截图分享哦")
        }
    }

    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: mainColor }]}>
                <NavigationBar
                    title='分享好友'
                    navigation={this.props.navigation}
                    rightView={NavigationBar.getRightStyle_Text('保存', {
                        fontSize: 16,
                        color: "#fff"
                    }, () => this.saveImgBy(this.qrCode))}
                />
                <View
                    ref={qrCode => this.qrCode = qrCode}
                    style={{
                        // backgroundColor: mainColor,
                        height: 390,
                        alignItems: 'center',
                        flexDirection: "column",
                        marginTop: 30,
                    }}>
                    <Image source={require("../../../res/images/erweima-bg.png")}
                        style={{ flex: 1, position: "absolute", resizeMode: Image.resizeMode.contain, }} />
                    {/*生成二维码*/}
                    <View style={{ marginTop: 40, top: 20, }}>
                        <QRCode
                            value={this.state.text}
                            size={window_width / 2}
                            bgColor='black'
                            fgColor='white' />
                    </View>
                    <Text
                        style={{
                            color: '#333',
                            //position: 'relative', top: 90,
                            position: "absolute", bottom: 30,
                            fontSize: 16,
                        }}>分享TOT</Text>
                </View>

                <TouchableOpacity
                    onPress={() => { this.onClicks(1) }}
                    style={{ alignSelf: "center", position: "absolute", zIndex: 1, bottom: 115 }}>
                    <Text style={{ color: '#FFF', fontSize: 16, borderColor: "#fff", borderBottomWidth: 1, }}>
                        复制TOT下载地址</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { this.onClicks(2) }}
                    style={{ alignSelf: "center", position: "absolute", zIndex: 1, bottom: 70 }}>
                    <Text style={{ color: '#FFF', fontSize: 16, }}>分享记录</Text>
                </TouchableOpacity>
            </View >
        );
    }

    onClicks(type) {
        switch (type) {
            case "save_img":
                break
            case 1:
                Clipboard.setString(this.getSharedUrl(this.userInfo.userid));
                DialogUtils.showToast("已复制到剪贴板")
                break
            case 2:
                this.props.navigation.navigate('SharedRecord')
                break
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