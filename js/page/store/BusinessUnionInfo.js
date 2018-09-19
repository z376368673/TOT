import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView, TouchableOpacity
} from 'react-native';
import BaseComponent, {BaseStyles, mainColor, window_width} from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import BaseUrl from "../../util/BaseUrl";
import RefreshFlatList from "../../common/RefreshFlatList"
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors";
import Utils from "../../util/Utils";
import EditText from "../../common/EditText";
import Picker from "react-native-picker";
import ImgBrowser from "../../common/ImgBrowser";
//商家联盟

export default class BusinessUnionInfo extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgs: require("../../../res/images/lianmeng-bg.png"),
            data: null,
        }
        this.userInfo = this.getUserInfo();
    }

    //界面加载完成
    componentDidMount() {
        this.getData()
    }

    /**
     * 获取数据
     * @param {*} isRefesh  是否刷新
     * @param {*} pageIndex
     */
    getData() {
        this.url = BaseUrl.agency(this.userInfo.sessionId)
        //alert(this.url)
        HttpUtils.getData(this.url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    this.setState({data: result.data})
                } else if (result.code === 2 || result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }


    render() {
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                <NavigationBar
                    title='商家联盟'
                    navigation={this.props.navigation}
                />

                <ScrollView>
                    <View style={{backgroundColor: Colors.white, borderRadius: 10, margin: 10}}>

                        <View style={{
                            padding: 15,
                            backgroundColor: Colors.mainColor,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            alignItems: "center",
                        }}>
                            <Image
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 35,
                                    borderWidth: 0.5,
                                    marginTop: 10,
                                    borderColor: "#fff",
                                }}
                                source={this.state.data?{uri:this.getImgUrl(this.state.data.imgHead)}:require("../../../res/images/touxiang-xiao.png")}
                            />

                            <Text style={{color: Colors.white, fontSize: 14, marginTop: 8}}>{"代理人"}</Text>
                            <Text style={{color: Colors.white, fontSize: 14, marginTop: 8}}>{this.state.data?this.state.data.realname:""}</Text>

                        </View>

                        <View style={{
                            padding: 15,
                            backgroundColor: Colors.white,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10
                        }}>

                            <View style={{flexDirection: "row", marginTop: 5}}>
                                <Text style={{color: Colors.text8, fontSize: 14, width: 80}}>联系电话</Text>
                                <Text style={{flex: 1, color: Colors.text3, fontSize: 14}}>{this.state.data?this.state.data.phone:""}</Text>
                            </View>
                            <View style={{flexDirection: "row", marginTop: 5}}>
                                <Text style={{color: Colors.text8, fontSize: 14, width: 80, lineHeight: 20}}>经营范围</Text>
                                <Text style={{
                                    flex: 1,
                                    color: Colors.text3,
                                    fontSize: 14,
                                    lineHeight: 20
                                }}>{this.state.data?this.state.data.businessScope:""}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: 5}}>
                                <Text style={{color: Colors.text8, fontSize: 14, width: 80, lineHeight: 20}}>办公地址</Text>
                                <Text style={{
                                    flex: 1,
                                    color: Colors.text3,
                                    fontSize: 14,
                                    lineHeight: 20
                                }}>{this.state.data?this.state.data.workAddress:""}</Text>
                            </View>

                            <View style={{flexDirection: "row", marginTop: 10}}>
                                <Text
                                    style={{color: Colors.text8, fontSize: 14, width: 80}}>办公照片</Text>
                                <View ref={view => this.view = view}
                                      style={{flexDirection: "row", flex: 1, height: 70}}>
                                    {this.state.data?this.create([this.state.data.workImg1, this.state.data.workImg2, this.state.data.workImg3]):<View/>}
                                </View>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    onClicks(index) {
        if (index === 1) {
            this.props.navigation.navigate('ApplyBusiness');
        }
    }

    create(arr) {
        var views = []
        var imgs = []
        for (var i = 0; i < arr.length; i++) {
            let data = {uri:this.getImgUrl(arr[i])}
            imgs.push(data)
            views.push(
                <TouchableOpacity
                    key={i + ""}
                    onPress={()=>ImgBrowser(data)}
                    style={{flex: 1, height: 70, marginRight: 5}}>
                    <Image  style={{ height: 70,}} source={data}/>
                </TouchableOpacity>
            );
        }
        return views
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
                    address: pickedValue[0] + " " + pickedValue[1] + " " + pickedValue[2]
                })
            },
            // onPickerCancel: pickedValue => {
            //     alert(JSON.stringify(pickedValue))
            //     console.log('area', pickedValue);
            // },
            // onPickerSelect: pickedValue => {
            //     // alert(JSON.stringify(pickedValue))
            //     // var pca = "";
            //     // pickedValue.forEach(text => {
            //     //     pca+=text;
            //     // });
            //     this.setState({
            //         province: pickedValue[0],
            //         city: pickedValue[1],
            //         area: pickedValue[2],
            //         address:pickedValue[0]+" "+pickedValue[1]+" "+pickedValue[2]
            //     })
            //     //Picker.select(['山东', '青岛', '黄岛区'])
            //     console.log('area', pickedValue);
            // }
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
});