import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import { PullPicker } from 'teaset';
import DialogUtils from '../../util/DialogUtils';
import Checkbox from 'teaset/components/Checkbox/Checkbox';
import EditText from "../../common/EditText"
/**
 * 添加银行卡
 */
export default class AddBankCard extends BaseComponent {
    /**
     * bankCard:
     *          "banqGenre": "中国工商银行",
     *          "banqImg": "http://tz.hxksky.com/wepay/upload/zggsyh.png",
     *          "qid": 3
     */
    bankCard = []
    constructor(props) {
        super(props);
        this.state = {
            userName: "",//用户
            bankName: "请选择开户行",//开户行
            bankNum: "", //卡号
            bankBranch: "",//开户行支行
            selectedIndex: 0,
            bankCardId: -1,
            bankCardTextList: [],
            isDefault: 0,
        }
        this.navigation = this.props.navigation;
        this.userInfo = this.getUserInfo()
    }
    componentDidMount() {
        this.getBankList();
    }
   
    //选择银行类型
    showBankCardList() {
        PullPicker.show(
            '请选择银行卡类型',
            this.state.bankCardTextList,
            this.state.selectedIndex,
            (item, index) => {
                this.setState({
                    selectedIndex: index,
                    bankName: item,
                    bankCardId: this.bankCard[index].qid,
                })
            }
        );
    }

    addBankCard() {
        let url = BaseUrl.addBankCardUrl(this.userInfo.sessionId,
            this.state.bankCardId, this.state.userName, this.state.bankBranch, this.state.bankNum, this.state.isDefault)
        HttpUtils.getData(url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    DialogUtils.showMsg("添加银行卡成功", "知道了",
                        () => {
                            this.navigation.state.params.callback()
                            this.props.navigation.goBack()
                        })
                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                }else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    onClicks() {
        if (this.state.userName.length < 1) {
            DialogUtils.showMsg("请输入持卡人名称")
        } else if (this.state.bankCardId === -1) {
            DialogUtils.showMsg("请选择开户银行")
        } else if (this.state.bankNum.length < 10||this.state.bankNum.length>19) {
            DialogUtils.showMsg("请输入10-19位银行卡号")
        } else if (this.state.bankBranch.length < 1) {
            DialogUtils.showMsg("请输入银行卡开户支行")
        } else {
            this.addBankCard();
        }
        //this.props.navigation.goBack()
        //this.navigation.state.params.callbacks({nickname: this.state.text})
    }
    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='添加银行卡'
                    navigation={this.props.navigation}
                />
                <ScrollView><View>
                
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontSize: 14, color: "#888", }}>
                        *请帮定持卡人本人的银行卡，银行卡添加后将不可修改</Text></View>

                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        持卡人姓名</Text>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入真实姓名'}
                        //defaultValue={userName}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        onChangeText={(text) => this.setState({ userName: text })} />
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        开户银行</Text>
                    <TouchableOpacity
                        style={{ padding: 8 }}
                        onPress={() => this.showBankCardList()}>
                        <Text style={{ fontSize: 16, color: '#666' }}>{this.state.bankName}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        银行卡号</Text>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入开户银行卡号'}
                        //defaultValue={userName}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        value={this.state.bankNum+""}
                        onChangeText={(text) => {
                            const newText = text.replace(/[^\d]+/, '0')
                            this.setState({ bankNum: newText })}} 
                        />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center',backgroundColor: "#fff",}}>
                    <Text style={{height:0}}>
                      </Text>
                    <TextInput
                        style={{  height: 0, flex: 1, fontSize: 16, color: '#333', marginLeft: 8}}
                        //placeholder={'请输入开户银行的支行分行1'}
                        //defaultValue={userName}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        onChangeText={(text) => this.setState({ bankBranch: text })} />
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        开户支行</Text>
                    <EditText
                        style={styles.itemTextInput}
                        placeholder={'请输入开户银行的支行分行'}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        onChangeText={(text) => this.setState({ bankBranch: text })} />
                </View>
                <View style={{margin:10}}>
                <Checkbox
                    title='是否设置为默认绑定银行卡'
                    size='md'
                    checked={this.state.isDefault===0?true:false}
                    onChange={value => this.setState({ isDefault: value?0:1 })}
                /></View>
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
                </ScrollView>
            </View>
        );
    }



    /**
   * 获取所有银行卡类型
   */
    getBankList() {
        HttpUtils.getData(BaseUrl.getBankListUrl())
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result))
                    var bankCardList = result.data;
                    var bankText = []
                    bankCardList.forEach(bank => {
                        bankText.push(bank.banqGenre)
                    });
                    this.bankCard = result.data
                    this.setState({ bankCardTextList: bankText })
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
      
    }
}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "#fff",
        marginTop: 1
    },
    itemText: {
        fontSize: 16, color: "#333", width: 90
    },
    itemTextInput: {
        height: 40, flex: 1, fontSize: 16, color: '#333', marginLeft: 8
    }
});