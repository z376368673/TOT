/**
 * 自定义导航栏
 * https://github.com/facebook/react-native
 * @flow
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Platform,
    StyleSheet,
    Text,
    Image,
    View,
    StatusBar,
    TouchableOpacity,
    ViewPropTypes,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from "../util/Utils";
import Colors from "../util/Colors";

//定义Bar的高度
const NAV_HEIGHT_ANDROID = 50;
const NAV_HEIGHT_IOS = 44;
const STATUS_HEIGHT = 20;
const StatusBarShape = {
    backgroundColor: PropTypes.string,
    //onefo 是必须是其中一个 相当于 枚举
    barStyle: PropTypes.oneOf('default', 'light-content', 'dark-content'),
    hidden: PropTypes.bool,
    //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）
    translucent: PropTypes.bool,
};

export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }

    //类型约束
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        leftView: PropTypes.element,
        isShowBackView: PropTypes.bool,//是否显示返回按钮
        rightView: PropTypes.element,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
    }
    static defaultProps = {
        isShowBackView: true,//默认显示返回按钮
        title: '标题',
        hide: false,
        props: null,
        style: {
            backgroundColor: Colors.mainColor,
        },
        statusBar: {
            statusBar: 'light-content',
            hide: false,
            translucent: false,
            backgroundColor: Colors.mainColor
        },
    }

    render() {
        //状态栏
        let status = <View style={[styles.statusBar]}>
            <StatusBar {...this.props.statusBar}/>
        </View>
        //标题栏布局{backgroundColor:this.props.mainColor}
        let content = <View style={[styles.navBar, this.props.style]}>
            <View style={styles.leftViewContainer}>{this._leftView()}</View>
            <View style={styles.titleViewContainer}>{this._titleViews()}</View>
            <View style={styles.rightViewContainer}>{this._rightViews()}</View>
        </View>
        return (
            <View style={[this.props.style]}>
                {status}
                {content}
            </View>
        );
    }

    //如果titleView 没有传过来 则 默认为Text 并赋值为 title
    _titleViews() {
        if (this.props.titleView){
            return this.props.titleView();
        }else{
            let view = <Text style={[styles.titleText, {color: "#fff",}]}>{this.props.title}</Text>
            return view;
        }
    }

    //定义左边按钮 左边布局，一般都是返回按钮
    _leftView() {
        //打印日志 不知道在哪看日志输出
        console.log('isShowBackView:' + this.props.isShowBackView);
        //如果不显示左边按钮 直接返回空
        if (!this.props.isShowBackView) return <View/>
        //如果传过来的props.leftView 存在 则直接显示
        if (this.props.leftView) return this.props.leftView;
        //显示默认的 返回按钮
        return this.getLeftDefault();
    }

    //右边布局，一般都是 “保存”| 什么都没穿 则隐藏
    _rightViews() {
        if (this.props.rightView) return this.props.rightView;
        return <View/>;
    }

    //左边默认返回组件 返回按钮
    getLeftDefault() {
        return <TouchableOpacity
            style={[{ paddingRight: 20,paddingTop:10,paddingBottom:10},styles.leftContainer]}
            onPress={() => {
                this.props.navigation.goBack(null);
            }}
        >
            <Image source={require('../../res/images/fanhui.png')}/>
        </TouchableOpacity>
    }

    //左边返回组件 返回按钮 + 文字
    static getLeftStyle_BackText(text, callBack) {
        return <TouchableOpacity
            activeOpacity={0.8}
            style={styles.leftContainer}
            onPress={callBack}
        >
            <Ionicons name={'ios-arrow-back'} size={25} color={"#fff"}/>
            <Text style={[styles.leftText, {color: "#fff"}]}>{text}</Text>
        </TouchableOpacity>
    }

    //右边按钮 文字
    static getRightStyle_Text(text, textStyle, callBack) {
        return <TouchableOpacity
            activeOpacity={0.8}
            style={styles.leftContainer}
            ref={v=>this.right=v}
            onPress={()=>callBack(this.right)}
        >
            <Text style={[styles.rightText, textStyle]}>{text}</Text>
        </TouchableOpacity>
    }



    //导航右边更多按钮
    static getRightStyle_More(callBack) {
        return <TouchableOpacity
            style={{ flexDirection: 'row',alignItems: 'center',}}
            ref={v=>this.more=v}
            onPress={()=>{
                callBack(this.more)
            }}
        >
            <Image
                style={{width: 25,height: 25,}}
                source={require('../../res/images/ic_more_vert_white_48pt.png')}/>
        </TouchableOpacity>
    }

    //导航右边更多按钮
    static getRightStyle_View(imgPath,callBack) {
        return <TouchableOpacity
            style={{ flexDirection: 'row',alignItems: 'center',}}
            ref={v=>this.more=v}
            onPress={()=>{
                callBack(this.more)
            }}
        >
            <Image
                style={{width: 25,height: 25,}}
                source={imgPath}/>
        </TouchableOpacity>
    }

}

const styles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? Utils.isFullScreenPhone()?STATUS_HEIGHT+10: STATUS_HEIGHT:Utils.isFullScreenPhone()?10:0,
    },

    navBar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Platform.OS === "ios" ? NAV_HEIGHT_IOS : NAV_HEIGHT_ANDROID,
        flexDirection: 'row',
    },

    titleViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',//布局方式 绝对布局
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
    },
    leftViewContainer: {
        justifyContent: 'center',
        // alignItems:'center',
        position: 'absolute',//布局方式 绝对布局
        left: 10,
        top: 0,
        bottom: 0,
    },

    rightViewContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',//布局方式 绝对布局
        right: 10,
        top: 0,
        bottom: 0,
    },

    titleText: {
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftText: {
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5

    },
    rightText: {
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',//上下剧中
    },
});
