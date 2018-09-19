import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Platform
} from 'react-native';
import BaseComponent, {BaseStyles, integralRelease, upDataUserInfo} from "./BaseComponent";
import ViewUtils from "../util/ViewUtils";
import {Carousel} from 'teaset';
import Utils from "../util/Utils";
import DialogUtils from '../util/DialogUtils';
import AsySorUtils from '../dao/AsySorUtils';
import BaseUrl from '../util/BaseUrl';
import HttpUtils from '../util/HttpUtils';
import UserInfo from '../model/UserInfo';
import SplashScreen from "react-native-splash-screen"
import {observer, inject} from 'mobx-react';
import gcj02towgs84 from "../util/location"
import codePush from "react-native-code-push";
import AdView from "../common/AdView";
import Colors from "../util/Colors";

const screen_width = Utils.getWidth();

@inject('AppStore') @observer
export default class HomePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerArray: [],
            isRefresh: false,
        }
        //this.props.AppStore.userInfo = this.props.AppStore.userInfo
    }

    componentDidMount() {
        SplashScreen.hide();
        this.showRedPacket();
    }

    _itemView(callback, img, text) {
        return <TouchableOpacity

            activeOpacity={0.8}
            onPress={callback}
        >
            <View style={[BaseStyles.container_column,
                {
                    width: screen_width / 3 - 1,
                    height: screen_width / 3 - 20,
                }, styles.itemView]}>
                <Image source={img}
                       style={styles.itemImage}/>
                <Text style={{fontSize: 15, color: '#333', marginTop: 10}}>{text}</Text>
            </View>
        </TouchableOpacity>
    }

    _StatusBar(statusBarColor) {
        return <View style={{height: 20, backgroundColor: statusBarColor}}>
            <StatusBar
                animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                hidden={false}  //是否隐藏状态栏。
                backgroundColor={statusBarColor} //状态栏的背景色
                translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
            />
        </View>
    }

    /**
     * 下拉刷新
     */
    onRefreshs() {
        this.setState({isRefresh: true})
        let url = BaseUrl.getUserInfoBy(this.props.AppStore.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                // alert(JSON.stringify(result))
                this.setState({isRefresh: false})
                if (result.code === 1) {
                    //Mobx保存方式
                    this.props.AppStore.setUserInfo(result.data)
                    //全局保存
                    UserInfo.userInfo = result.data
                    //刷新红包数据
                    this.showRedPacket()
                } else {
                    DialogUtils.showToast(result.msg)
                }
            }).catch(error => {
            this.setState({isRefresh: false})
        })

    }

    /**
     * 显示红包
     */
    showRedPacket() {
        if (this.props.AppStore.userInfo.isReward === 0 && this.props.AppStore.userInfo.todayReleas > 0) {
            DialogUtils.redPacket(this.props.AppStore.userInfo.todayReleas,
                () => integralRelease(this.props.AppStore))
        }
    }

    render() {
        return (
            <View style={BaseStyles.container_column}>
                {this._StatusBar(Colors.mainColor)}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            //Android下只有一个 colors 是转圈的颜色
                            colors={['#d11', '#000']}
                            //ios 下 可以设置标题，转圈颜色，标题颜色
                            title={'Loading...'}
                            tintColor={'#d11'}
                            titleColor={'#d11'}
                            //刷新状态 false:隐藏，true:显示
                            refreshing={this.state.isRefresh}
                            //刷新触发的后执行的方法
                            onRefresh={() => this.onRefreshs()}
                        />
                    }
                    //onScroll={this._onScroll.bind(this)}
                    scrollEventThrottle={50}
                >
                    <View style={BaseStyles.container_column}>

                        <View style={styles.container_top}>
                            {/*顶部 用户信息布局*/}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onClicks(11)}
                            >
                                <View
                                    style={[BaseStyles.container_column, {alignItems: 'center', margin:50,}]}
                                >
                                    <Image source={{uri: this.getImgUrl(this.props.AppStore.userInfo.imgHead)}}
                                           style={styles.headImg}/>
                                    <Text
                                        style={[styles.text,{marginTop:5, fontWeight:"900"}]}>
                                    {this.props.AppStore.userInfo.username}</Text>
                                    <Text
                                        style={[styles.text,{marginTop:5, fontWeight:"900"}]}>
                                    UID:{this.props.AppStore.userInfo.userid}</Text>
                                </View></TouchableOpacity>

                            {/* 余额积分布局*/}
                            <View style={[BaseStyles.container_row, {
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                padding: 10,
                                backgroundColor: Colors.white,
                                borderRadius: 20,
                                height: 100,
                                marginLeft: 15,
                                marginRight: 15,
                                width: Utils.getWidth() - 30,
                                position: "absolute",
                                bottom: -50,
                            }]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => this.onClicks(13)}
                                >
                                    <View style={{flexDirection: 'column', alignItems: "center"}}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: Colors.mainColor
                                        }}>￥{this.props.AppStore.userInfo.cangkuNum}</Text>
                                        <Text style={{fontSize: 16, color: Colors.text3, marginTop: 10}}>余额</Text>
                                    </View></TouchableOpacity>

                                {/*扫描二维码布局*/}
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.onClicks(12)}
                                ><View
                                    style={[BaseStyles.container_column, {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }]}>
                                    <Image
                                        style={{width: 60, height: 60, marginLeft: 2, }}
                                        source={require('../../res/images/saoma.png')}
                                    />
                                </View></TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => this.onClicks(14)}
                                >
                                    <View style={{flexDirection: 'column', alignItems: "center"}}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: Colors.mainColor
                                        }}>￥{this.props.AppStore.userInfo.fengmiNum}</Text>
                                        <Text style={{fontSize: 16, color: Colors.text3, marginTop: 10}}>积分</Text>
                                    </View></TouchableOpacity>
                            </View>
                        </View>
                        {/*<Carousel*/}
                        {/*style={{ width: screen_width, height: screen_width / 4 }}*/}
                        {/*control={() => { return <Carousel.Control /> }}*/}
                        {/*>*/}
                        {/*{this.setImgToBanner(this.state.bannerArray)}*/}
                        {/*</Carousel>*/}
                        <View style={[BaseStyles.container_row, {flexWrap: 'wrap', marginTop: 60}]}>
                            {this._itemView(() => this.onClicks(2), require('../../res/images/zhuanru.png'), "收款")}
                            {this._itemView(() => this.onClicks(1), require('../../res/images/zhuanchu.png'), "转账")}
                            {this._itemView(() => this.onClicks(5), require('../../res/images/shuzi.png'), "数字资产")}
                            {this._itemView(() => this.onClicks(3), require('../../res/images/mairu.png'), "买入")}
                            {this._itemView(() => this.onClicks(4), require('../../res/images/maichu.png'), "卖出")}
                            {this._itemView(() => this.onClicks(6), require('../../res/images/shangcheng.png'), "商城")}
                            {this._itemView(() => this.onClicks(7), require('../../res/images/jihuo.png'), "激活")}
                            {this._itemView(() => this.onClicks(8), require('../../res/images/youxi.png'), "娱乐")}
                            {this._itemView(() => this.onClicks(9), require('../../res/images/hudong.png'), "养生")}

                        </View>
                    </View>
                </ScrollView></View>
        );
    }

    onClicks(type) {
        switch (type) {
            case 11:
                this.props.navigation.navigate('SettingView');
                break;
            case 12:
                this.props.navigation.navigate('SaoSaoView');
                break;
            case 13:
                this.props.navigation.navigate('YueOrIntegralRecord', {type: 0});
                break;
            case 14:
                this.props.navigation.navigate('YueOrIntegralRecord', {type: 1});
                break;
            case 1:
                this.props.navigation.navigate('ZhuanChu');
                break;
            case 2:
                this.props.navigation.navigate('ZhuanRu');
                break;
            case 3:
                this.props.navigation.navigate('BuyPage');
                break;
            case 4:
                this.props.navigation.navigate('SellPage');
                break;
            case 5://数字资产
                this.props.navigation.navigate('NumberHome');
                //DialogUtils.showToast("此模块正在升级中...")
                break;
            case 6://商城
                this.props.navigation.navigate('StoreMall');
                break;
            case 7://爱心公益
                this.props.navigation.navigate('JiHuo');
                break;
            case 8://游戏娱乐
                DialogUtils.showToast("此模块正在升级中...")
                break;
            case 9://群员互动
                DialogUtils.showToast("此模块正在升级中...")
                break;
            default://
                break
        }
    }

}
const styles = StyleSheet.create({
    container_top: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.mainColor,
        padding: 10,
    },
    text: {
        color: "#fff",
        fontSize: 16,
    },
    headImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 3
    },
    itemView: {
        flexWrap: 'wrap',
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0.5,
        marginTop: 0.5,
    },
    itemImage: {
        width: 35,
        height: 35,
        backgroundColor: '#fff',
        borderColor: "#fff"
    },
});
