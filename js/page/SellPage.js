import React from 'react';
import ReactNative, {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, upDataUserInfo } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import { Menu } from 'teaset';
import BankCardView from "../common/BankCardView";
import BankCardModel from "../model/BankCardModel";
import ViewUtils from "../util/ViewUtils";
import CheckMoney from "../common/CheckMoney";
import BaseUrl from '../util/BaseUrl';
import DialogUtils from '../util/DialogUtils';
import HttpUtils from '../util/HttpUtils';
import PassWordInput from '../common/PassNumInput';
import { inject } from '../../node_modules/mobx-react';
import Colors from '../util/Colors';
import SplashScreen from "react-native-splash-screen"

@inject('AppStore')
export default class SellPage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            seleIndex: -1,//默认不选中
            selectedValue: 0,//选中金额 默认值为0 
            bankCard: null,
            describe: "",//描述
        }
        this.userInfo = this.getUserInfo();
    }
    componentDidMount() {
        SplashScreen.hide();
    }

    /**
     * 创建订单
     */
    creatOrder(safetyPwd) {
        DialogUtils.showLoading();
        this.url = BaseUrl.createOutOrder()
        HttpUtils.postData(this.url,
            {
                sessionId: this.userInfo.sessionId,
                exchangeMoney: this.state.selectedValue,
                describe: this.state.describe,
                bankId: this.state.bankCard.id,
                safetyPwd: safetyPwd,
            })
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    upDataUserInfo(this.props.AppStore)
                    this.props.navigation.navigate('HomePage');
                    DialogUtils.showToast("创建订单成功")
                    //this.props.navigation.goBack()
                } else {
                    DialogUtils.showToast(result.msg)
                }
              
            })

    }




    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='卖出'
                    navigation={this.props.navigation}
                    //rightView={NavigationBar.getRightStyle_More((view) => this._rightClick(view))}
                />
                <ScrollView>
                    <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                        
                        <View style={{ flexDirection: "row", backgroundColor: "#fff", paddingLeft: 10, paddingRight: 10 ,paddingTop:15}}>
                            {this.creatLabel("创建订单", { color: Colors.mainColor }, { flex: 1 }, ()=>this._menuClick(0))}
                            {this.creatLabel("未完成订单", { color: Colors.text3 }, { flex: 1, marginLeft: 15, marginRight: 15 }, ()=>this._menuClick(1))}
                            {this.creatLabel("确认收款", { color: Colors.text3 }, { flex: 1 }, ()=>this._menuClick(2))}
                        </View>
                        <View style={{ flexDirection: "row", backgroundColor: "#fff", paddingLeft: 10, paddingRight: 10 ,paddingTop:10,paddingBottom:15,marginBottom:12}}>
                            {this.creatLabel("已完成订单", { color: Colors.text3 }, { flex: 1 }, ()=>this._menuClick(3))}
                            {this.creatLabel("卖出记录", { color: Colors.text3 }, { flex: 1, marginLeft: 15, marginRight: 15 }, ()=>this._menuClick(4))}
                            {this.creatLabel("卖出中心", { color: Colors.text3 }, { flex: 1 }, ()=>this._menuClick(5))}
                        </View>
                        
                        {/*绑定银行卡*/}
                        <BankCardView {...this.props}
                            selechBankCard={(bankCard) => this.setState({ bankCard: bankCard })}
                        />

                        <View style={[{ flexDirection: 'column', backgroundColor: "#fff", marginTop: 12, }]}>
                            <Text style={{
                                color: '#999',
                                fontSize: 16,
                                paddingTop: 15,
                                paddingLeft: 15,
                                paddingBottom: 15,
                            }}> 请选择卖出金额</Text>
                            {ViewUtils.getLineView()}
                            <CheckMoney
                                arrText={[500, 1000, 3000, 5000, 10000, 30000]}
                                onSelected={(index, value) => this.onSelected(index, value)}
                            />
                        </View>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior='padding '>
                            <TextInput
                                style={{
                                    padding: 10,
                                    height: 50,
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    fontSize: 15,
                                    color: '#333',
                                    maxLength: 50,
                                    marginTop: 8,
                                    backgroundColor: "#fff"
                                }}
                                placeholder={'描述，(注意：请不要输入表情)'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                onChangeText={(text) => this.setState({ describe: text })}
                            //失去焦点时
                            //onBlur={this.onClicks("onBlur")}
                            /></KeyboardAvoidingView>
                        <View style={{ height: 60 }} />
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                height: 45,
                                marginLeft: 15,
                                marginRight: 15,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: mainColor,
                            }}
                            onPress={() => this.onClicks("creatOrder")}
                        >
                            <Text style={{
                                alignSelf: "center",
                                color: '#FFF',
                                fontSize: 18,
                            }}> 创建订单</Text>
                        </TouchableOpacity>
                    </View></ScrollView>
            </View>
        );
    }

    onClicks(type) {
        switch (type) {
            case "creatOrder":
                if (!this.state.bankCard) {
                    DialogUtils.showMsg("请选择银行卡")
                } else if (this.state.seleIndex < 0) {
                    DialogUtils.showMsg("请选择卖出金额")
                } else {
                    PassWordInput.showPassWordInput((safetyPwd) => this.creatOrder(safetyPwd))
                }

                break;
        }
    }

    

    onSelected(index, value) {
        this.state.seleIndex = index
        this.setState({
            seleIndex: index,
            selectedValue: value,
        })
    }
    _menuClick(index) {
        //type 表示   0，买入  1， 卖出    
        //orderType    1，未完成订单， 2，确定打款订单  3 已完成订单
        switch (index) {
             case 0:
               // alert(index+"")
                break;
            case 1:
                this.props.navigation.navigate('BuyOrSellUnfinishedOrder', { type: 1, orderType: 1 });
                break;
            case 2:
                this.props.navigation.navigate('BuyOrSellOrde', { type: 1, orderType: 2 });
                break;
            case 3:
                this.props.navigation.navigate('BuyOrSellOrde', { type: 1, orderType: 3 });
                break;
            case 4:
                this.props.navigation.navigate('BuyOrSellRecord', { type: 1 });
                break;
            case 5:
                this.props.navigation.navigate('BuyOrSellCentre', { type: 1 });
                break;
            default:
                break;
        }
    }
    creatLabel(text, textStyle, style, onClicks) {
        return <TouchableOpacity
            onPress={(type) => onClicks(type)}
            style={[{
                backgroundColor: "#ddd", paddingTop: 8, paddingBottom: 8, borderRadius: 8,
                alignItems: "center", justifyContent: "center"
            }, style]} >
            <Text style={[{ fontSize: 15, color: "#333" }, textStyle]}>{text}</Text>
        </TouchableOpacity>
    }

    // _rightClick(view) {
    //     this.show(view, 'end')
    // }

    /**
     * 已废弃 不再使用
     *
     * @param view
     * @param align  'star' ,'end'
     */
    // show(view, align) {
    //     if (view)
    //         view.measure((x, y, width, height, pageX, pageY) => {
    //             let itemStyle = { backgroundColor: mainColor, color: "#fff", fontSize: 16, borderColor: "#fff" }
    //             let activeOpacity = 0.9;
    //             let backgroundColor = "#fff";
    //             let items = [
    //                 { title: '未完成订单', onPress: () => this._menuClick(1), itemStyle: itemStyle },
    //                 { title: '确认收款', onPress: () => this._menuClick(2), itemStyle: itemStyle },
    //                 { title: '已完成订单', onPress: () => this._menuClick(3), itemStyle: itemStyle },
    //                 { title: '卖出记录', onPress: () => this._menuClick(4), itemStyle: itemStyle },
    //                 { title: '卖出中心', onPress: () => this._menuClick(5), itemStyle: itemStyle },
    //             ];
    //             Menu.show({ x: pageX, y: pageY, width, height }, items, { align, activeOpacity, backgroundColor });
    //         });
    // }

}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
});