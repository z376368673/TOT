import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import { QRScannerView } from 'ac-qrcode';
import DialogUtils from '../util/DialogUtils';

export default class SaoSaoView extends BaseComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            < QRScannerView
                isCornerOffset={true}
                cornerBorderLength={24}
                cornerBorderWidth={4}
                cornerOffsetSize={4}
                rectWidth={280}
                rectHeight={280}
                hintText={'请将扫描框对准二维码'}
                hintTextStyle={{ color: "#fff", fontSize: 16, }}
                hintTextPosition={80}
                maskColor={"#00000080"}
                bottomMenuHeight={100}
                bottomMenuStyle={{ backgroundColor: '#00000080', height: 100, justifyContent: 'center' }}
                scanBarColor={"#d11"}
                scanBarMargin={10}
                scanBarAnimateTime={3000}
                onScanResultReceived={this.barcodeReceived.bind(this)}
                renderTopBarView={() => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ zIndex: 1 }}
                            onPress={() => this.props.navigation.goBack()}>
                            <NavigationBar
                                title='扫一扫'
                                navigation={this.props.navigation}
                                style={{ backgroundColor: mainColor, }}
                                statusBar={{
                                    statusBar: 'light-content',
                                    hide: false,
                                    translucent: false,
                                    backgroundColor: mainColor,
                                }}
                            /></TouchableOpacity>
                    )
                }}

                renderBottomMenuView={() => {
                    return (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            {/* //暂时无法做到扫描相册的二维码 */}
                            {/* <Text style={{fontSize:22,color:"#fff",padding:30}}
                            >打开相册</Text> */}
                        </View>
                    )
                }}
            />

        );
    }
    onClicks(type) {

    }
    zIndex = 0;
    barcodeReceived(e) {
        var data = e.data;
        this.zIndex += 1;
        if (this.zIndex === 1) {
            //判断是不是纯数字 纯数字就跳转转出界面
            var reg = /^\d{20,45}$/
            if (reg.test(data)) {
                 data = this.getQRcode(data)
                 //DialogUtils.showMsg("qrcode:"+data)
                this.props.navigation.navigate('ZhuanChuNext', {
                    account: data,
                })
            } else if (data.startsWith("http")||data.startsWith("https")){
                contactBaidu(data)
            }else{
                DialogUtils.showToast(data)
            }
            this.props.navigation.goBack();
            this.zIndex = 0
        }
    }

}
//调用本地浏览器打开网页
export const contactBaidu = (url) => {
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            DialogUtils.showToast("An error occurred:" + url)
        } else {
            return Linking.openURL(url);
        }
    }).catch(err => console.error('An error occurred', url));
}
export const Styles = StyleSheet.create({
    image_qqbrowser_light: {
        height: 30,
        width: 30,
    },

    view_title_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000000B3',
        height: 56,
        alignItems: 'center',
    }
})