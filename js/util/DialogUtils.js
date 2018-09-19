import React from 'react';
import {
    TouchableHighlight,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TextInput, Platform, StatusBar,
} from 'react-native';
import {Overlay, Toast, ActionSheet, Theme, Label, Button, AlbumView} from "teaset";
import codePush from "react-native-code-push"
import Colors from "./Colors";
import Utils from "./Utils";
import {mainColor} from "../page/BaseComponent";
import PassWordInput,{PayInfoView} from "../common/PassNumInput";

export default class DialogUtils {

    /**
     * 消息对话框
     * @param {*} text 提示类容 
     * @param {*} confirm 确定按钮回调
     * @param {*} cancel 取消按钮回调
     * @param {*} Text1 确定按钮文字
     * @param {*} Text2 取消按钮文字
     */
    static showPop(text, confirm, cancel, Text1, Text2) {
        let overlayView = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}
                type={"zoomIn"}//动画效果
                modal={false}//点击任意区域消失 
                ref={v => this.PopView = v}
            >
                <View style={{ backgroundColor: "#fff", minWidth: 300, minHeight: 100, flexDirection: 'column', borderRadius: 15 }}>
                    {/* 内容 */}
                    <View style={{ minHeight: 100, justifyContent: "center", alignItems: "center", padding: 25 }}>
                        <Text style={{ fontSize: 18, color: "#333" }}>{text}</Text>
                    </View>
                    {/* 按钮 */}
                    <View style={{ backgroundColor: "#e0e0e0", height: 1 }} />
                    <View style={{ justifyContent: "center", alignItems: "center", height: 60, flexDirection: "row", }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                                this.PopView && this.PopView.close()
                                cancel ? cancel() : {}
                            }}
                        >
                            <Text style={{ fontSize: 20, color: "#333" }}>{Text2 ? Text2 : "取消"}</Text>
                        </TouchableOpacity>
                        <View style={{ width: 1, backgroundColor: "#e0e0e0", height: 60 }} />
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                                this.PopView && this.PopView.close(),
                                    confirm ? confirm() : {}
                            }}
                        >
                            <Text style={{ fontSize: 20, color: "#333" }}>{Text1 ? Text1 : "确定"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }




    /**
     * 消息提示框
     * @param {*} text 提示类容 
     * @param {*} confirm  按钮回调
     * @param {*} confirmText  按钮文字
     */
    static showMsg(text, confirmText, confirm, ) {
        let overlayView = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}
                type={"zoomIn"}//动画效果
                modal={false}//点击任意区域消失 
                ref={v => this.MsgView = v}
            >
                <View style={{ backgroundColor: "#fff", minWidth: 300, minHeight: 100, flexDirection: 'column', borderRadius: 15 }}>
                    {/* 内容 */}
                    <View style={{ minHeight: 100, justifyContent: "center", alignItems: "center", padding: 25 }}>
                        <Text style={{ fontSize: 18, color: "#333" }}>{text}</Text>
                    </View>
                    {/* 按钮 */}
                    <View style={{ backgroundColor: "#e0e0e0", height: 1 }} />
                    <View style={{ justifyContent: "center", alignItems: "center", height: 60, flexDirection: "row", }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                                this.MsgView && this.MsgView.close(),
                                    confirm ? confirm() : {}
                            }}
                        >
                            <Text style={{ fontSize: 20, color: "#333" }}>{confirmText ? confirmText : "确定"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }

    /**
     * 显示Toast提示
     * @param {*} text 
     */
    static showToast(text) {
        Toast.message(text)
    }


    /**
     * 加载动画
     * @param text
     */
    static showLoading(text) {
        let overlayView = (
            <Overlay.View
                style={{ alignItems: 'center', justifyContent: 'center' }}
                modal={false}
                overlayOpacity={0}
                ref={v => this.loadingView = v} >
                <View style={{ backgroundColor: '#333', padding: 25, borderRadius: 15, alignItems: 'center' }}>
                    <ActivityIndicator
                        size={'large'}
                        animating={true}
                    />
                    <Text style={{ fontSize: 16, color: "#fff" }}>{text ? text : "加载中..."}</Text>
                </View>
            </Overlay.View>
        );
        Overlay.show(overlayView);
    }
    /**
     * 关闭加载动画
     */
    static hideLoading() {
        if (this.loadingView){
            this.loadingView.close();
        }
    }
    /**
     * 底部弹出选择框
     * @param {*} array 
     * @param {*} callback 
     */
    static showDownSheet(array, callback) {
        let items = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            items.push({ title: element, onPress: () => callback(element) });
        }
        let cancelItem = { title: '关闭' };
        ActionSheet.show(items, cancelItem);
    }




    // /**
    //  * 红包
    //  * @param {*} text 提示类容 
    //  * @param {*} confirm  按钮回调
    //  * @param {*} confirmText  按钮文字
    //  */
    // static redPacket(text, confirm,) {
    //     let overlayView = (
    //         <Overlay.PopView
    //             style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}
    //             type={"zoomIn"}//动画效果
    //             modal={true}//点击任意区域消失 
    //             ref={v => this.MsgView = v}
    //         >
    //             <View style={{ minWidth: 300, minHeight: 100, flexDirection: 'column',  }}>
    //                 {/* 内容 */}
    //                 <View style={{ backgroundColor:"#F9F900",marginBottom:-100,zIndex:1,
    //                  justifyContent: "center", alignItems: "center", padding: 25,marginLeft:30,marginRight:30, }}>
    //                     <Text style={{ fontSize: 23, color: "#d11" ,marginTop:40,}}>{text}元</Text>
    //                     <View style={{ backgroundColor: "#d11", height: 0.5 ,width:120,marginTop:10,marginBottom:10}} />
    //                     <Text style={{ fontSize: 15, color: "#d11" }}>天天签到红包不断</Text>
    //                 </View>
    //                 <View style={{backgroundColor:"#d11",minHeight: 160}}>
    //                 <Text style={{ fontSize: 18, color: "#F9F900",position:"absolute", bottom:15,alignSelf:"center"}}>Wepay签到红包</Text>
    //                 </View>
    //                 <View style={{ justifyContent: "center", alignItems: "center",  flexDirection: "row", }}>
    //                     <TouchableOpacity
    //                         style={{ justifyContent: "center", 
    //                         alignItems: "center",height:48,
    //                         backgroundColor:"#f9f900",borderRadius:24,
    //                         borderColor:"#EAC100",borderWidth:3,margin:30,
    //                        paddingLeft:40,paddingRight:40}}
    //                         onPress={() => {
    //                             this.MsgView && this.MsgView.close(),
    //                                 confirm? confirm() : {}
    //                         }} >
    //                         <Text style={{ fontSize: 20, color: "#d11" }}>存入余额</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         </Overlay.PopView>
    //     );
    //     Overlay.show(overlayView);
    // }


    /**
     * 红包
     * @param {*} text 提示类容 
     * @param {*} confirm  按钮回调
     * @param {*} confirmText  按钮文字
     */
    static redPacket(text, confirm, ) {
        let overlayView = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}
                type={"zoomIn"}//动画效果
                modal={true}//点击任意区域消失 
                overlayOpacity={0}
                ref={v => this.MsgView = v}
            >
                <View style={{
                    minWidth: 300, minHeight: 100,
                    flexDirection: 'column', justifyContent: "center", alignItems: "center",
                    marginTop: -150, paddingBottom: 50,
                }}>
                    <Image source={require("../../res/images/hongbao.png")} />
                    <Text style={{ flex: 1, fontSize: 25, color: "#d11", position: "absolute", paddingBottom: 50 }}>{new Number(text).toFixed(2)}元</Text>
                    <View style={{
                        justifyContent: "center", alignItems: "center",
                        flexDirection: "row", position: "absolute", bottom: 0, zIndex: 1
                    }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                                alignItems: "center", height: 48,
                                backgroundColor: "#f9f900", borderRadius: 24,
                                borderColor: "#EAC100", borderWidth: 3, margin: 30,
                                paddingLeft: 40, paddingRight: 40
                            }}
                            onPress={() => {
                                this.MsgView && this.MsgView.close(),
                                    confirm ? confirm() : {}
                            }} >
                            <Text style={{ fontSize: 20, color: "#d11" }}>存入余额</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }



    /** 热更新
    * 
    * sync方法，提供了如下属性以允许你定制sync方法的默认行为
    deploymentKey （String）： 部署key，指定你要查询更新的部署秘钥，默认情况下该值来自于Info.plist(Ios)和MianActivity.java(Android)文件，你可以通过设置该属性来动态查询不同部署key下的更新。
    installMode (codePush.InstallMode)： 安装模式，用在向CodePush推送更新时没有设置强制更新(mandatory为true)的情况下，默认codePush.InstallMode.ON_NEXT_RESTART即下一次启动的时候安装。
    mandatoryInstallMode (codePush.InstallMode):强制更新,默认codePush.InstallMode.IMMEDIATE。
    minimumBackgroundDuration (Number):该属性用于指定app处于后台多少秒才进行重启已完成更新。默认为0。该属性只在installMode为InstallMode.ON_NEXT_RESUME情况下有效。
    updateDialog (UpdateDialogOptions) :可选的，更新的对话框，默认是null,包含以下属性
    appendReleaseDescription (Boolean) - 是否显示更新description，默认false
    descriptionPrefix (String) - 更新说明的前缀。 默认是” Description: “
    mandatoryContinueButtonLabel (String) - 强制更新的按钮文字. 默认 to “Continue”.
    mandatoryUpdateMessage (String) - 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
    optionalIgnoreButtonLabel (String) - 非强制更新时，取消按钮文字. Defaults to “Ignore”.
    optionalInstallButtonLabel (String) - 非强制更新时，确认文字. Defaults to “Install”.
    optionalUpdateMessage (String) - 非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
    title (String) - 要显示的更新通知的标题. Defaults to “Update available”.
    * 
    */
    static upDataApp() {
        codePush.checkForUpdate()
            .then((update) => {
                if (!update) {
                    //热更新后添加这个代码 不然貌似热更新会自动回滚
                    Platform.OS ==="ios"? {}:codePush.sync()
                    DialogUtils.showToast("已是最新版本")
                } else {
                    codePush.sync({
                        //可选的，更新的对话框，默认是null,包含以下属性
                        updateDialog: {
                            appendReleaseDescription: true,//是否显示更新description，默认false
                            //要显示的更新通知的标题. Defaults to “Update available”.
                            title: '更新',
                            //强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
                            mandatoryUpdateMessage: '发现新的更新，请您安装最新版本', 
                            //强制更新的按钮文字. 默认 to “Continue”.
                            mandatoryContinueButtonLabel: '更新',
                            //非强制更新时，取消按钮文字. Defaults to “Ignore”.
                            optionalIgnoreButtonLabel: "忽略",
                            //非强制更新时，确认文字. Defaults to “Install”.
                            optionalInstallButtonLabel: "安装",
                            //更新说明的前缀。 默认是” Description: “
                           // descriptionPrefix: '更新内容：\n', 
                            descriptionPrefix: '  \n',
                            //非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
                            optionalUpdateMessage: "发现新的更新，您是否要安装最新版本"
                        },
                        //(codePush.InstallMode)： 安装模式，用在向CodePush推送更新时没有设置强制更新(mandatory为true)的情况下，默认codePush.InstallMode.ON_NEXT_RESTART即下一次启动的时候安装。
                        //installMode :codePush.InstallMode.ON_NEXT_RESTART
                        // (codePush.InstallMode):强制更新,默认codePush.InstallMode.IMMEDIATE。
                        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
                        //指定那个环境下 直接填写key 就行    但是不建议使用 因为 苹果和Android的是分开的 无法做到同时更新 Android 和 IOS
                        //deploymentKey: "v-5TDPSESydQj-n9alBgCVEab3Mefdf2b04e-456b-420f-8acd-58a99c8306be",
                    });
                }
            });
    }


   static onImagePress(images,index) {
        //let pressView = view;
       // pressView.measure((x, y, width, height, pageX, pageY) => {
            let overlayView = (
                <Overlay.PopView
                    style={{backgroundColor:"reg(0,0,0)"}}
                    containerStyle={{flex: 1}}
                    overlayOpacity={1}
                    //type='custom'
                    //customBounds={{x: pageX, y: pageY, width, height}}
                    ref={v => this.fullImageView = v}
                >
                    <AlbumView
                        style={{flex: 1}}
                        control={true}
                        images={images}
                        //thumbs={this.thumbs}
                        defaultIndex={index}
                        onPress={() => this.fullImageView && this.fullImageView.close()}
                    />
                    <StatusBar animated={false} hidden={true} />
                </Overlay.PopView>
            );
            Overlay.show(overlayView);
       // });
    }



}