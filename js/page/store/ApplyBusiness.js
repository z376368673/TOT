import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView, Image,
} from 'react-native';
import Picker from 'react-native-picker';
import BaseComponent, {BaseStyles, mainColor, window_width} from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import {Checkbox} from "teaset"
import Utils from '../../util/Utils';
import BaseUrl from '../../util/BaseUrl';
import HttpUtils from '../../util/HttpUtils';
import DialogUtils from '../../util/DialogUtils';
import EditText from "../../common/EditText";
import Colors from "../../util/Colors";
import SYImagePicker from "react-native-syan-image-picker";

/**
 * 申请成为代理
 */
const width_w = Utils.getWidth() / 3 - 20;

export default class ApplyBusiness extends BaseComponent {
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo()
        this.state = {
            name: '',
            phone: '',
            scope: "",//领域，范围

            province: "广东",
            city: "深圳",
            area: "宝安区",
            townName: "",//镇名
            region: "",  //代理区域

            address: "",//详细地址

            photos: [],//办公照片
            licencePhotos: null,//营业执照
        }
    }

    componentDidMount() {

    }

    /**
     * 选择办公图片
     * 选择图片后回调此函数
     */
    handleOpenImagePicker = () => {
        SYImagePicker.showImagePicker({imageCount: 3, isRecordSelected: true}, (err, photos) => {
            console.log(err, photos);
            if (!err) {
                this.setState({
                    photos: photos,
                })
            }
        })
    };

    /**
     * 选择经营许可证图片
     * 选择图片后回调此函数
     */
    handleOpenImagePicker1 = () => {
        SYImagePicker.showImagePicker({imageCount: 1, isRecordSelected: false}, (err, photos1) => {
            console.log(err, photos1);
            if (!err) {
                photos1.map((photo, index) => {
                    let source = {uri: photo.uri};
                    if (photo.enableBase64) {
                        source = {uri: photo.base64};
                    }
                    this.setState({
                        licencePhotos: source,
                    })
                })//

            }
        })
    };

    /**
     * 创建ImagView 显示图片
     * @param {*} photos
     */
    createImg(photos) {
        let views = []
        let imgs = []
        photos.map((photo, index) => {
            let source = {uri: photo.uri};
            if (photo.enableBase64) {
                source = {uri: photo.base64};
            }
            imgs.push(source)
            views.push(
                <View
                    key={`image-${index}`}
                    style={{width: width_w, height: width_w, marginLeft: 10, }}>
                    <TouchableOpacity
                        onPress={() => this.handleOpenImagePicker()}
                    >
                        <Image
                            ref={"img" + index}
                            style={{width: width_w, height: width_w,}}
                            source={source}
                            resizeMode={"cover"}
                        /></TouchableOpacity>
                </View>
            )
        })
        return views
    }


    render() {
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                <NavigationBar
                    title={"申请成为代理"}
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    <View style={{flex: 1}}>


                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>
                                姓 名</Text>
                            <TextInput
                                style={styles.itemTextInput}
                                placeholder={'请输入真实姓名'}
                                defaultValue={this.state.name}
                                maxLength={8}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType='default'
                                onChangeText={(text) => this.setState({name: text})}/>
                        </View>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>
                                电话</Text>
                            <TextInput
                                style={styles.itemTextInput}
                                placeholder={'请输入电话'}
                                defaultValue={this.state.phone}
                                placeholderTextColor={'#999'}
                                maxLength={11}
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                onChangeText={(text) => this.setState({phone: text})}/>
                        </View>

                        <View style={{
                            marginTop: 1,
                            padding: 10,
                            flexDirection: "row",
                            height: 55,
                            alignItems: "center",
                            backgroundColor: Colors.white
                        }}>
                            <Text style={styles.itemText}>
                                代理区域</Text>
                            <TouchableOpacity
                                style={{flex: 1}}
                                onPress={() => this.showPCAlist()}
                            >
                                <Text style={{
                                    color: Colors.mainColor,
                                    fontSize: 14, numberOfLines: 1, ellipsizeMode: "tail", marginLeft: 5
                                }}> {this.state.region ? this.state.region : "请选择区域"} </Text>
                            </TouchableOpacity>
                            <EditText
                                style={[{
                                    height: 35,
                                    width: 90,
                                    fontSize: 13,
                                    color: '#333',
                                    backgroundColor: Colors.black_dc,
                                    padding: 5,
                                    borderColor: "#ccc",
                                    borderRadius: 5,
                                    marginRight: 10,
                                    marginLeft: 10,
                                }]}
                                placeholder={'请输入镇名'}
                                placeholderTextColor={Colors.text8}
                                underlineColorAndroid='transparent'
                                value={this.state.townName + ""}
                                maxLength={12}
                                onChangeText={(text) => {
                                    this.setState({townName: text})
                                }}
                            />
                        </View>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>
                                办公地址</Text>
                            <TextInput
                                style={styles.itemTextInput}
                                placeholder={'请输入详细地址'}
                                maxLength={20}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType='default'
                                onChangeText={(text) => this.setState({address: text})}/>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 10,
                            backgroundColor: "#fff",
                            marginTop: 1
                        }}>
                            <Text style={styles.itemText}>
                                经营范围</Text>
                            <TextInput
                                style={{height: 40, flex: 1, fontSize: 16, color: '#333', marginLeft: 8}}
                                placeholder={'请输入经营范围'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType='default'
                                maxLength={50}
                                onChangeText={(text) => this.setState({scope: text})}/>
                            {/*<TextInput*/}
                            {/*style={{ height: 40, fontSize: 16, color: '#333', width:1 }}*/}
                            {/*placeholderTextColor={'#999'}*/}
                            {/*underlineColorAndroid='transparent'*/}
                            {/*keyboardType='default'*/}
                            {/*/>*/}
                        </View>

                        <View style={{flexDirection: 'row', padding: 10, marginTop: 1,backgroundColor:"#fff"}}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#333',
                                fontSize: 14,
                            }}> *上传3张办公照片</Text>
                        </View>
                        <View style={[{flexWrap: "wrap", flexDirection: "row",backgroundColor:"#fff",paddingBottom:10}]}>
                            {this.createImg(this.state.photos)}
                            {this.state.photos.length >= 3 ? null :
                                <TouchableOpacity onPress={() => this.handleOpenImagePicker()}>
                                    <Image
                                        source={require("../../../res/images/addimg.png")}
                                        style={{
                                            alignSelf: "center",
                                            width: width_w, height: width_w,
                                            marginLeft: 10, borderColor: "#ddd",
                                            borderWidth: 0.5, resizeMode: "cover"
                                        }}
                                    /></TouchableOpacity>}
                        </View>


                        <View style={{flexDirection: 'row', padding: 10, marginTop: 1,backgroundColor:"#fff"}}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#333',
                                fontSize: 14,
                            }}> *上传营业执照</Text>
                        </View>
                        <View style={[{flexWrap: "wrap", flexDirection: "row",backgroundColor:"#fff",paddingBottom:15}]}>
                            <TouchableOpacity onPress={() => this.handleOpenImagePicker1()}>
                                <Image
                                    source={this.state.licencePhotos?this.state.licencePhotos:require("../../../res/images/addimg.png")}
                                    style={{
                                        alignSelf: "center",
                                        width: width_w, height: width_w,
                                        marginLeft: 10, borderColor: "#ddd",
                                        borderWidth: 0.5, resizeMode: "cover"
                                    }}
                                /></TouchableOpacity>
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
                </ScrollView>
            </View>
        );
    }

    onClicks() {
        //this.props.navigation.goBack()
        //this.navigation.state.params.callbacks({nickname: this.state.text})
        if (this.state.name.length < 1) {
            DialogUtils.showMsg("请输入收件人姓名")
        } else if (this.state.phone.length !== 11) {
            DialogUtils.showMsg("请输入11位手机号")
        } else if (this.state.region.length < 1) {
            DialogUtils.showMsg("请选择区域")
        } else if (this.state.townName.length < 1) {
            DialogUtils.showMsg("请输入镇名")
        } else if (this.state.address.length < 1) {
            DialogUtils.showMsg("请输入详细地址")
        } else if (this.state.scope.length < 1) {
            DialogUtils.showMsg("请输入经营范围")
        } else if (this.state.photos.length < 3) {
            DialogUtils.showMsg("请选择3张办公照片")
        } else if (this.state.licencePhotos==null) {
            DialogUtils.showMsg("请选择营业执照")
        } else {
            this.addAddress();
        }
        //this.props.navigation.goBack()
        //this.navigation.state.params.callbacks({nickname: this.state.text})
    }

    /**
     * 提交申请
     */
    addAddress() {
        DialogUtils.showLoading()
        let url = BaseUrl.engoyApply()
        /** sessionId   contents  file */
        let photos = this.state.photos;
        photos.push(this.state.licencePhotos)
        HttpUtils.uploadImage(url,
            {
                sessionId: this.userInfo.sessionId,
                realname: this.state.name,
                phone: this.state.phone,
                agencyArea: this.state.region+" "+this.state.townName,
                businessScope: this.state.scope,
                workAddress: this.state.address,
            },
            photos, (result) => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    this.props.navigation.state.params.redraw()
                    DialogUtils.showMsg("已提交申请，我们将在七个工作日内，完成审核，审核结果将会在个人消息通知您", "知道了", () => {
                        this.props.navigation.goBack()
                    });
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
            onPickerConfirm: pickedValue => {
                this.setState({
                    province: pickedValue[0],
                    city: pickedValue[1],
                    area: pickedValue[2],
                    region:pickedValue[0]+" "+pickedValue[1]+" "+pickedValue[2]
                })
            },

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
        marginTop: 1,
        height: 55,
    },
    itemText: {
        fontSize: 16, color: "#333", width: 80
    },
    itemTextInput: {
        height: 35, flex: 1, fontSize: 16, color: '#333', marginLeft: 8
    }
});