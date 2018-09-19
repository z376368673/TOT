import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Button,
    findNodeHandle, UIManager,
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
import ImgBrowser from "../../common/ImgBrowser";
import Picker from "react-native-picker";
//商家联盟

export default class BusinessUnion extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            townName: "",//镇名

            province: "广东",
            city: "深圳",
            area: "宝安区",
            address: null,
            imgs: require("../../../res/images/lianmeng-bg.png"),

            status: 2,//用户当前状态（是否是代理）1.可申请，2.未达到条件，3.正在审核，4已经是代理
            condition: ["VIP会员", "直推会员1000人以上", "有办公场地"], //申请条件（List集合）
            remark: "", //备注

        }

        this.userInfo = this.getUserInfo();
    }

    //界面加载完成
    componentDidMount() {
        DialogUtils.showLoading()
        this.getInfo()
    }
    /**
     * 获取商品信息 by id
     */
    getInfo() {
        let url = BaseUrl.getUnion(this.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    this.setState({
                        data: result.data,
                        remark: result.data.remark,
                        status: result.data.status,
                        condition: result.data.condition,
                    })
                } else if (result.code === 2 || result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }


    headView() {

        return <View style={{flexDirection: "column"}}>

            {/*申请代理*/}
            <View style={{}}>
                <Image source={require("../../../res/images/lianmeng-bg.png")}/>
                <View style={{position: "absolute", zIndex: 1, flex: 1, padding: 10}}>
                    <Text style={{fontSize: 15, color: Colors.black_dc}}>申请条件:</Text>
                    <View style={{flexDirection: "row", width: Utils.getWidth(), marginTop: 7}}>
                        <View style={{
                            flex: 1, borderRadius: 5,
                            backgroundColor: "rgba(255,255,255,0.7)",
                            margin: 2, justifyContent: "center", alignItems: "center",
                            paddingTop: 10, paddingBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 13,
                                color: Colors.text3,
                                margin: 10,
                            }}>{this.state.condition[0]}</Text>
                        </View>
                        <View style={{
                            flex: 1, borderRadius: 5,
                            backgroundColor: "rgba(255,255,255,0.7)",
                            margin: 2, justifyContent: "center", alignItems: "center",
                            paddingTop: 10, paddingBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 13,
                                color: Colors.text3,
                                margin: 10,
                            }}>{this.state.condition[1]}</Text>
                        </View>
                        <View style={{
                            flex: 1, borderRadius: 5,
                            backgroundColor: "rgba(255,255,255,0.7)",
                            margin: 2, justifyContent: "center", alignItems: "center",
                            paddingTop: 10, paddingBottom: 10, marginRight: 20
                        }}>
                            <Text style={{
                                fontSize: 13,
                                color: Colors.text3,
                                margin: 10,
                            }}>{this.state.condition[2]}</Text>
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.white,
                        lineHeight: 23,
                        marginTop: 10
                    }}>备注:{this.state.remark}</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flex:1,
                            height: 45,
                            marginTop: 20,
                            marginRight: 25,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.mainColor,
                        }}
                        onPress={() => this.onClicks(1)}
                    >
                        <Text style={{
                            alignSelf: "center",
                            color: '#FFF',
                            fontSize: 16,
                           // status: 2,//用户当前状态（是否是代理）1.可申请，2.未达到条件，3.正在审核，4已经是代理
                        }}> {this.state.status==4?"查看代理信息":"申请成为代理"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/*搜索代理*/}
            <View style={{
                marginTop: 10,
                padding: 10,
                flexDirection: "row",
                height: 55,
                alignItems: "center",
                backgroundColor: Colors.white
            }}>
                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => this.showPCAlist()}
                >
                    <Text style={{
                        color: Colors.mainColor,
                        fontSize: 14, numberOfLines: 1, ellipsizeMode: "tail"
                    }}> {this.state.address ? this.state.address : "请选择区域"} </Text>
                </TouchableOpacity>
                <TextInput
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
                    // defaultValue={this.state.townName}
                    // //value={this.state.townName}
                    maxLength={8}
                    // onChangeText={(text) => {
                    //     this.setState({townName: text})
                    // }}
                />
                <TouchableOpacity
                    onPress={()=>this.onClicks(2)}
                    style={{
                    borderRadius: 5, borderColor: Colors.mainColor, borderWidth: 1,
                    margin: 2, justifyContent: "center", alignItems: "center",
                    width: 80, height: 35
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.mainColor,
                    }}>搜索代理</Text>
                </TouchableOpacity>
            </View>
        </View>

    }


    render() {
        return (
            <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                <NavigationBar
                    title='商家联盟'
                    navigation={this.props.navigation}
                />
                <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        //onRefreshs={() => this._refreshData()}
                        onLoadData={() => this._onLoadData()}
                        isDownLoad={true}
                        ListHeaderComponent={() => this.headView()}
                        renderItem={(items) => this._getItem(items.item)}/>
                </View>


            </View>
        );
    }

    //刷新数据
    _refreshData() {
        //获取经纬度 并赋值给全局变量
        //this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(true)
    }

    //加载更多数据
    _onLoadData() {
        this.getData(false)
    }

    /**
     * 获取数据
     * @param {*} isRefesh  是否刷新
     * @param {*} pageIndex
     */
    getData(isRefesh) {
        if (!this.state.address){
            DialogUtils.showToast("请选择区域")
            return
        }else {
        this.url = BaseUrl.searchUnion(this.userInfo.sessionId, this.pageIndex,this.state.address+this.state.townName)
       // alert(this.url)
            HttpUtils.getData(this.url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无数据")
                        }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1
                } else if (result.code === 2 || result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
        }
    }

    _getItem(data){

     let itemview =    <View style={{backgroundColor: Colors.white, borderRadius: 10, padding: 15, margin: 10}}>

            <View style={{flexDirection: "row"}}>
                <Text style={{color: Colors.text8, fontSize: 14, width: 80}}>代 理人</Text>
                <Text style={{flex: 1, color: Colors.text3, fontSize: 14}}>{data.realname}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 10}}>
                <Text style={{color: Colors.text8, fontSize: 14, width: 80}}>联系电话</Text>
                <Text style={{flex: 1, color: Colors.text3, fontSize: 14}}>{data.phone}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 10}}>
                <Text style={{color: Colors.text8, fontSize: 14, width: 80}}>代理区域</Text>
                <Text style={{flex: 1, color: Colors.text3, fontSize: 14}}>{data.agencyArea}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 5}}>
                <Text style={{color: Colors.text8, fontSize: 14, width: 80, lineHeight: 20}}>经营范围</Text>
                <Text style={{
                    flex: 1,
                    color: Colors.text3,
                    fontSize: 14,
                    lineHeight: 20
                }}>{data.businessScope}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 5}}>
                <Text style={{color: Colors.text8, fontSize: 14, width: 80, lineHeight: 20}}>办公地址</Text>
                <Text style={{
                    flex: 1,
                    color: Colors.text3,
                    fontSize: 14,
                    lineHeight: 20
                }}>{data.workAddress}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 10}}>
                <Text
                    style={{color: Colors.text8, fontSize: 14, width: 80}}>办公照片</Text>
                <View ref={view => this.view = view} style={{flexDirection: "row", flex: 1, height: 70}}>
                    {this.create([data.workImg1, data.workImg2, data.workImg3])}
                </View>
            </View>
        </View>


        return itemview
    }


    onClicks(index) {
        if (index === 1) {
            if (this.state.status == 1) {
                this.props.navigation.navigate('ApplyBusiness', {
                    redraw: () => this.getInfo()
                });
            } else if (this.state.status == 2) {
                DialogUtils.showMsg("对不起，您尚未达到申请条件")
            } else if (this.state.status == 3) {
                DialogUtils.showMsg("正在审核中，请耐心等待")
            } else if (this.state.status == 4) {
                this.props.navigation.navigate('BusinessUnionInfo');
            }
        }else if (index === 2){
            this._refreshData()
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