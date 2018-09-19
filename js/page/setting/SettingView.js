import React from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, upDataUserInfo } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../util/ViewUtils";
import DialogUtils from '../../util/DialogUtils';
import SYImagePicker from 'react-native-syan-image-picker'
import Utils from '../../util/Utils';
import HttpUtils from '../../util/HttpUtils';
import BaseUrl from '../../util/BaseUrl';
import { inject, observer } from 'mobx-react';

@inject('AppStore') @observer
export default class SettingView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],//选择的照片
            newMessage: 0,
            storeStatus: 2,//0.申请中,1.已通过,2.去申请
        }
        this.props.AppStore.userInfo = this.getUserInfo()
    }
    componentDidMount() {
        this.isNewMessage();
        this.getStoreStatus()
    }

    /**
      * 获取设置界面的消息状态
      */
    isNewMessage() {
        let url = BaseUrl.getuserInfoUrl(this.props.AppStore.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    this.info = result.data
                    this.setState({
                        newMessage: this.info.newMessage,
                    })
                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    /**
    * 申请店铺-店铺状态
    *  描述:	判断是否有店铺，是否申请中
    */
    getStoreStatus() {
        let url = BaseUrl.getStoreStatus(this.props.AppStore.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                if (result.code === 1) {
                    this.setState({
                        storeStatus: result.data,
                    })
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    /**
     * 使用方式sync/await
     * 相册参数暂时只支持默认参数中罗列的属性；
     * @returns {Promise<void>}
     */
    handleAsyncSelectPhoto = async () => {
        SYImagePicker.removeAllPhoto()
        try {
            const photos = await SYImagePicker.asyncShowImagePicker({ imageCount: 1, isCrop: true, showCropCircle: false });
            photos.map((photo, index) => {
                let source = { uri: photo.uri };
                if (photo.enableBase64) {
                    source = { uri: photo.base64 };
                }
                this.source = source;
                let imgs = [photo];
                this.uploadImage(imgs)
            })
        } catch (err) {
            DialogUtils.showToast(err.message)
            // 取消选择，err.message为"取消"
        }
    };

    /**
     * 上传照片
     * @param {*} imgs 
     */
    uploadImage(imgs) {
        let url = BaseUrl.getUpdataHeadUrl()
        HttpUtils.uploadImage(url, { sessionId: this.props.AppStore.userInfo.sessionId }, imgs, (result) => {
            if (result.code === 1) {
                DialogUtils.showToast("上传成功")
                upDataUserInfo(this.props.AppStore)
            } else {
                DialogUtils.showToast(result.msg)
            }
        })
    }

    /**
     * 点击事件
     * @param type 点击标识
     */
    onClicks(type) {
        switch (type) {
            case "headImg"://修改头像
                this.handleAsyncSelectPhoto()
                break
            case "nickname"://修改昵称
                this.props.navigation.navigate('ModifyNickName', {
                    userName: this.props.AppStore.userInfo.username,
                    sessionId: this.props.AppStore.userInfo.sessionId,
                    callbacks: (name) => { this.getCallBackValue(name) }
                });
                break
            case "language"://多语言
                DialogUtils.showMsg("暂不支持切换其他语言");
                break
            case "bankName"://我的银行卡
                this.props.navigation.navigate('BankCardList', {
                    title: "我的银行卡",
                });
                break
            case "share":
                this.props.navigation.navigate('SharePage');
                break
            case "password1"://修改 登陆密码
                this.props.navigation.navigate('ModifyPassWord', {
                    type: 0,
                });
                break
            case "password2"://修改 支付密码
                this.props.navigation.navigate('ModifyPassWord', {
                    type: 1,
                });
                break
            case "notice"://公告
                this.props.navigation.navigate('NoticeList', {
                    type: 1,
                });
                break
            case "geren"://个人消息
                this.props.navigation.navigate('MyNoticeList', {
                    type: 1,
                });
                break
            case "store"://我的店铺
                let content;
                let btn;
                if (this.state.storeStatus === 0) {
                    content = "您的店铺已提交申请，请耐心等待审核..."
                    btn = "知道了"
                } else if (this.state.storeStatus === 1) {
                    this.props.navigation.navigate('MyStore');
                    break;
                } else {
                    content = "您还没有开通店铺，是否去申请店铺"
                    btn = "去申请"
                }
                DialogUtils.showPop(content,
                    () => {
                        this.state.storeStatus === 0 ? {} : this.props.navigation.navigate('ApplyStore', {
                            status: () => this.setState({
                                storeStatus: 0,
                            })
                        });
                    },
                    () => { },
                    btn, "取消"
                );
                break
            case "address"://地址管理
                this.props.navigation.navigate('AddressList');
                break
            case "Complaint"://投诉建议
                this.props.navigation.navigate('Complaint');
                break
            case "version"://版本管理
                // DialogUtils.showPop("您已经是最新版本了", () => {
                //     DialogUtils.showToast("检查完毕");
                // });
                DialogUtils.upDataApp()
                break
            case "about"://关于
                this.props.navigation.navigate('AboutOur');
                break
            case 66://退出登录
                this.goLogin(this.props.navigation)
                break
        }
    }

    render() {
        return (
            <View style={BaseStyles.container}>
                <NavigationBar
                    title='设置'
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    <View style={[BaseStyles.container_column, { backgroundColor: '#f1f1f1' }]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.onClicks("headImg")}
                        >
                            <View
                                style={[styles.container_row, { alignItems: 'center', padding: 10, }]}
                            >
                                <Image source={{ uri: this.getImgUrl(this.props.AppStore.userInfo.imgHead) }}
                                    style={styles.headImg} />
                                <View style={{ flex: 1, marginLeft: 10 ,justifyContent:"center"}}>

                                    <Text style={{ color: "#333", fontSize: 16, }}>
                                        {this.props.AppStore.userInfo.account}
                                    </Text>

                                    <View style={{ flexDirection: "row",marginTop:5 }}>
                                        <Text style={{ color: "#333", fontSize: 16, }}>
                                            UID:{this.props.AppStore.userInfo.userid}
                                        </Text>
                                        {this.props.AppStore.userInfo.useGrade === 3 ? <Image source={require("../../../res/images/huangguan.png")}
                                            style={{ height: 16, width: 16, marginLeft: 5 }} /> : null}
                                    </View>

                                </View>
                                <Text style={{ color: "#666", fontSize: 16, marginRight: 10 }}>
                                    更换头像
                                </Text>
                            </View></TouchableOpacity>
                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem(require('../../../res/images/nicheng.png'), '昵称', this.props.AppStore.userInfo.username,
                            () => this.onClicks("nickname"))}
                        {ViewUtils.getSettingItem(require('../../../res/images/duoyuyan.png'), '多语言', '中文',
                            () => this.onClicks("language"))}
                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem1(require('../../../res/images/yinghangka.png'), '银行卡', false,
                            () => this.onClicks("bankName"))}
                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem1(require('../../../res/images/fenxiang.png'), '分享', false,
                            () => this.onClicks("share"))}
                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem(require('../../../res/images/denglumima.png'), '登陆密码', '点击修改',
                            () => this.onClicks("password1"))}
                        {ViewUtils.getSettingItem(require('../../../res/images/zhifumima.png'), '支付密码', '点击修改',
                            () => this.onClicks("password2"))}
                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem1(require('../../../res/images/gonggao.png'), '公告', true,
                            () => this.onClicks("notice"))}
                        {ViewUtils.getSettingItem1(require('../../../res/images/gerenxiaoxi.png'), '个人消息',
                            this.state.newMessage === 1 ? true : false, () => this.onClicks("geren"))}

                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem1(require('../../../res/images/dianpu.png'), '我的店铺', false,
                            () => this.onClicks("store"))}
                        {ViewUtils.getSettingItem1(require('../../../res/images/dizhiguanli.png'), '地址管理', false,
                            () => this.onClicks("address"))}

                        <View style={[BaseStyles.container_center, { marginTop: 12 }]} />
                        {ViewUtils.getSettingItem1(require('../../../res/images/tousujianyi.png'), '投诉建议', false,
                            () => this.onClicks("Complaint"))}
                        {ViewUtils.getSettingItem(require('../../../res/images/banben.png'), '版本检测', '1.2.7',
                            () => this.onClicks("version"))}
                        {ViewUtils.getSettingItem1(require('../../../res/images/guanyu.png'), '关于', false,
                            () => this.onClicks("about"))}

                        <View style={[BaseStyles.container_center, { marginTop: 25 }]} />
                        <TouchableOpacity
                            style={styles.logoutView}
                            onPress={() => this.onClicks(66)}
                        >
                            <Text style={{ fontSize: 18, color: mainColor, }}>退出登陆</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container_row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#ffffff"
    },
    headImg: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 0.5,
        borderColor: "#d11",
    },
    logoutView: {
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 80,
    },
});
