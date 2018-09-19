import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native';
import Picker from 'react-native-picker';
import BaseComponent, { BaseStyles, mainColor, window_width } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import { Checkbox } from "teaset"
import Utils from '../../util/Utils';
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import DialogUtils from '../../util/DialogUtils';
import EditText from "../../common/EditText";

/**
 * 编辑地址
 */
export default class EditAddress extends BaseComponent {
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo()
        this.state = {
            name: '',
            phone: '',
            province: "广东",
            city: "深圳",
            area: "宝安区",
            address: "",
            isDefault: 1,
        }
        this.params = this.props.navigation.state.params;
        // const { addrssInfo,} = this.props.navigation.state.params
        this.addrssInfo = this.params.addrssInfo ? this.params.addrssInfo : null;
    }
    componentDidMount() {
        // alert(JSON.stringify(this.addrssInfo))
        if (this.addrssInfo) {
            this.setState({
                name: this.addrssInfo.name,
                phone: this.addrssInfo.telephone,
                province: this.addrssInfo.provinceId,
                city: this.addrssInfo.cityId,
                area: this.addrssInfo.countryId,
                address: this.addrssInfo.address,
                isDefault: this.addrssInfo.zt,
            })
        }
    }
    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title={this.addrssInfo ? "编辑地址" : "添加地址"}
                    navigation={this.props.navigation}
                />
                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        姓名</Text>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入姓名'}
                        defaultValue={this.state.name}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        onChangeText={(text) => this.setState({ name: text })} />
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        电话</Text>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入电话'}
                        defaultValue={this.state.phone}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ phone: text })} />
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemText}>
                        选择省市区</Text>
                    <TouchableOpacity
                        style={{ padding: 8 }}
                        onPress={() => this.showPCAlist()}>
                        <Text style={{ fontSize: 16, color: '#666' }}>{this.state.province + " " + this.state.city + " " + this.state.area}</Text>
                    </TouchableOpacity>
                </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: "#fff", marginTop: 1 }}>
                        <Text style={styles.itemText}>
                            收货地址</Text>
                        <TextInput
                            style={{ height: 40, flex: 1, fontSize: 16, color: '#333', marginLeft: 8 }}
                            placeholder={'请输入详细收货地址'}
                            placeholderTextColor={'#999'}
                            defaultValue={this.state.address}
                            underlineColorAndroid='transparent'
                            keyboardType='default'
                            onChangeText={(text) => this.setState({ address: text })} />
                        <TextInput
                            style={{ height: 40, fontSize: 16, color: '#333', width:1 }}
                            placeholderTextColor={'#999'}
                            underlineColorAndroid='transparent'
                            keyboardType='default'
                            />
                    </View>

                <View style={{ padding: 10 }}>
                    <Checkbox
                        title='默认地址'
                        size='md'
                        checked={this.state.isDefault === 1 ? true : false}
                        onChange={value => this.defaultAddress(value)}
                    />
                </View>
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
        );
    }
    defaultAddress(value) {
        var def = 1;
        def = value ? 1 : 0;
        this.setState({
            isDefault: def,
        })
    }
    onClicks() {
        //this.props.navigation.goBack()
        //this.navigation.state.params.callbacks({nickname: this.state.text})
        if (this.state.name.length < 1) {
            DialogUtils.showMsg("请输入收件人姓名")
        } else if (this.state.phone.length !== 11) {
            DialogUtils.showMsg("请输入11位手机号")
        } else if (this.state.address.length < 2) {
            DialogUtils.showMsg("请输入详细地址")
        } else {
            this.addAddress();
        }
        //this.props.navigation.goBack()
        //this.navigation.state.params.callbacks({nickname: this.state.text})
    }
    /**
     * 添加地址/修改地址信息
     */
    addAddress() {
        if (this.addrssInfo === null) {
            this.url = BaseUrl.putAddress(
                this.userInfo.sessionId,
                this.userInfo.userid,
                this.state.name,
                this.state.phone,
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.address,
                this.state.isDefault)
        } else {
            this.url = BaseUrl.editAddress(
                this.userInfo.sessionId,
                this.addrssInfo.addressId,
                this.userInfo.userid,
                this.state.name,
                this.state.phone,
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.address,
                this.state.isDefault)
        }
        //alert(JSON.stringify(this.state.name))
        HttpUtils.getData(this.url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    let tip = this.addrssInfo === null ? "添加地址成功" : "修改地址成功"
                    DialogUtils.showToast(tip)
                    this.props.navigation.goBack()
                    this.params.editCallBack()
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }
    showPCAlist() {
        Picker.init({
            pickerData: Utils.createPCA(),
            selectedValue: ['广东', '深圳', '宝安'],
            // options={},
            pickerConfirmBtnText: "确定",
            pickerCancelBtnText: '关闭',
            pickerTitleText: '请选择',
            // onPickerConfirm: pickedValue => {
            //     alert(JSON.stringify(pickedValue))
            //     console.log('area', pickedValue);
            // },
            // onPickerCancel: pickedValue => {
            //     alert(JSON.stringify(pickedValue))
            //     console.log('area', pickedValue);
            // },
            onPickerSelect: pickedValue => {
                // alert(JSON.stringify(pickedValue))
                // var pca = "";
                // pickedValue.forEach(text => {
                //     pca+=text;
                // });
                this.setState({
                    province: pickedValue[0],
                    city: pickedValue[1],
                    area: pickedValue[2],
                })
                //Picker.select(['山东', '青岛', '黄岛区'])
                console.log('area', pickedValue);
            }
        });
        Picker.show();
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