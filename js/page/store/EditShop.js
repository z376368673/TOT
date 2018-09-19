import React from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView} from 'react-native';
import NavigationBar from "../../common/NavigationBar";
import BaseComponent, {BaseStyles, mainColor} from "../BaseComponent";
import SYImagePicker from 'react-native-syan-image-picker'
import Utils from '../../util/Utils';
import DialogUtils from '../../util/DialogUtils';
import HttpUtils from '../../util/HttpUtils';
import BaseUrl from '../../util/BaseUrl';
import EditText from "../../common/EditText";

/**
 * 添加商品 / 编辑修改商品
 */
const width_w = Utils.getWidth() / 3 - 20;
const editPhotos = new Map();
export default class EditShop extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            shopName: "",
            shopPrice: "",
            shopNum: "",
            describe:"",
            shopImage: [],
            photos: [],
        }
        this.userInfo = this.getUserInfo()
        this.navigation = this.props.navigation;
        this.params = this.props.navigation.state.params;
        this.data = this.params ? this.params.data : null;
        this.actionIndex = -1
    }
    componentDidMount() {
        // alert(JSON.stringify(this.data))
        if (this.data) {
            let pic = [this.data.item.coverPlan,this.data.item.goodsPic2,this.data.item.goodsPic3,
                this.data.item.goodsPic4,this.data.item.goodsPic5,this.data.item.goodsPic6]
            this.setState({
                shopName: this.data.item.goodsName,
                shopPrice: this.data.item.goodsPrice,
                shopNum: this.data.item.goodsStock,
                describe:this.data.item.describe?this.data.item.describe:"",
                shopImage: this.picToUri(pic)
            })
            //alert(this.data.item.goodsName)
        }
    }

    picToUri(pic){
        let uri = []
        pic.map((value,index)=>{
            if (value.length>=1){
                uri.push({uri:this.getImgUrl(value)})
            }
        })
        alert(JSON.stringify(uri))
        return uri
    }

    /**
     * 选择图片后回调此函数
     */
    handleOpenImagePicker = (index) => {
        this.actionIndex = index
        SYImagePicker.showImagePicker({imageCount: 1, isRecordSelected: false}, (err, photos) => {
            console.log(err, photos);
            if (!err) {
                let index =  this.actionIndex >-1?this.actionIndex :-1
                if (index>-1){
                    this.state.photos.splice(index, 1)
                    editPhotos.set(index,photos[0])
                }else {
                    let size =  editPhotos.size
                     editPhotos.set(size,photos[0])
                }
                let p =  this.state.photos.concat(photos)
                this.setState({ photos: p,})
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
                    style={{width: width_w, height: width_w, marginLeft: 10, marginTop: 10}}>
                    {/*<TouchableOpacity*/}
                        {/*style={{position: "absolute", zIndex: 1, right: -5, top: -5}}*/}
                        {/*onPress={() => {*/}
                            {/*this.state.photos.splice(index, 1)*/}
                            {/*let data = this.state.photos;*/}
                            {/*this.setState({ photos: data, })*/}
                        {/*}}>*/}
                        {/*<Image*/}
                            {/*style={{width: 15, height: 15,}}*/}
                            {/*source={require("../../../res/images/shanchu-4.png")}/>*/}
                    {/*</TouchableOpacity>*/}
                    <TouchableOpacity
                       onPress={() => this.handleOpenImagePicker(index)}
                    ><Image
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


    onClicks() {
        if (this.type == "add") {
            if (this.state.shopName.length < 1) {
                DialogUtils.showMsg("请输入商品名称");
            } else if (this.state.shopPrice.length < 1) {
                DialogUtils.showMsg("请输入商品价格");
            } else if (this.state.shopNum.length < 1) {
                DialogUtils.showMsg("请输入商品库存");
            } else if (this.state.photos.length < 1) {
                DialogUtils.showMsg("请选择商品照片");
            } else {
                this.addShop();
                // this.props.navigation.navigate('MyStore');
            }
        } else {
            if (this.state.shopName.length < 1) {
                DialogUtils.showMsg("请输入商品名称");
            } else if (this.state.shopPrice.length < 1) {
                DialogUtils.showMsg("请输入商品价格");
            } else if (this.state.shopNum.length < 1) {
                DialogUtils.showMsg("请输入商品库存");
            } else {
                this.editShop();
            }

        }
    }

    /**
     * 添加商品信息
     */
    addShop() {
        //alert(JSON.stringify(this.state.photos))
        let url = BaseUrl.getAddShopUrl()
        /** sessionId   contents  file */
        HttpUtils.uploadImage(url,
            {
                sessionId: this.userInfo.sessionId,
                goodsName: this.state.shopName,
                goodsPrice: this.state.shopPrice,
                goodsStock: this.state.shopNum,
                describe: this.state.describe,
            },
            this.state.photos, (result) => {
                if (result.code === 1) {
                    DialogUtils.showMsg("添加商品成功", "知道了", () => {
                        this.props.navigation.goBack()
                    });
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }


    /**
     * 修改商品信息
     */
    editShop() {
        let url = BaseUrl.getUpdateShopUrl()
        /** sessionId   contents  file */
        let editps = []
        let editIndexs = []
        editPhotos.forEach(function(value, index,){
            editIndexs.push(index)
            editps.push(value)
        })
        alert(editIndexs.toString()+"   "+editps.toString())
        HttpUtils.uploadImage(url,
            {
                sessionId: this.userInfo.sessionId,
                id: this.data.item.id,
                goodsName: this.state.shopName,
                goodsPrice: this.state.shopPrice,
                goodsStock: this.state.shopNum,
                describe: this.state.describe,
                nums: editIndexs,
            },
            editps, (result) => {
                if (result.code === 1) {
                    DialogUtils.showMsg("编辑商品成功", "知道了", () => {
                        this.props.navigation.goBack()
                    });
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
    }

    render() {
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={this.type === "add" ? "添加商品" : "修改商品"}
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    <View style={[BaseStyles.container_column, {backgroundColor: "#f1f1f1"}]}>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>
                                商品名称</Text>
                            <EditText
                                style={styles.itemTextInput}
                                placeholder={'请输入商品名称'}
                                defaultValue={this.state.shopName+""}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"default"}
                                value={this.state.shopName+""}
                                maxLength={12}
                                onChangeText={(text) => this.setState({shopName: text})}/>
                        </View>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>
                                商品描述</Text>
                            <EditText
                                style={[{textAlignVertical: 'top', minHeight: 70}, styles.itemTextInput]}
                                placeholder={'请输入商品介绍(限80字以内)...'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"default"}
                                multiline={true}
                                numberOfLines={3}
                                maxLength={80}
                                value={this.state.describe+""}
                                onChangeText={(text) => this.setState({describe: text})}/>
                        </View>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>
                                商品价格</Text>
                            <TextInput
                                style={[styles.itemTextInput, {width: 60}]}
                                placeholder={'请输入价格'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"numeric"}
                                maxLength={12}
                                value={this.state.shopPrice + ""}
                                onChangeText={(text) => {
                                    this.setState({shopPrice: Utils.chkPrice(text)})
                                }}
                            />
                            <Text style={[styles.itemText, {marginLeft: 10}]}>
                                元</Text>
                        </View>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>库存数量</Text>
                            <TextInput
                                style={[styles.itemTextInput, {width: 60}]}
                                placeholder={'请输入库存数量'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"numeric"}
                                maxLength={12}
                                value={this.state.shopNum + ""}
                                onChangeText={(text) => {
                                    const newText = text.replace(/[^\d]+/, '0')
                                    this.setState({shopNum: newText})
                                }}/>
                            <Text style={[styles.itemText, {marginLeft: 10}]}>件</Text>
                        </View>
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#333',
                                fontSize: 14,
                            }}> *上传商品主图,最多6张(默认第一张为封面图)</Text>
                        </View>
                        <View style={[{flexWrap: "wrap", flexDirection: "row", padding: 10}]}>
                            {this.createImg(this.state.photos)}
                            {this.state.photos.length >= 6 ? null :
                                <TouchableOpacity onPress={() => this.handleOpenImagePicker()}>
                                    <Image
                                        source={require("../../../res/images/addimg.png")}
                                        style={{
                                            alignSelf: "center", marginTop: 10,
                                            width: width_w, height: width_w,
                                            marginLeft: 10, borderColor: "#ddd",
                                            borderWidth: 0.5, resizeMode: "cover"
                                        }}
                                    /></TouchableOpacity>}
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                height: 45, marginTop: 30, marginLeft: 15,
                                marginRight: 15, marginBottom: 50, borderRadius: 8,
                                justifyContent: 'center', alignItems: 'center',
                                backgroundColor: mainColor,
                            }} onPress={() => this.onClicks("add")}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#FFF',
                                fontSize: 20,
                            }}>确认{this.type === "add" ? "添加" : "修改"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
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
        marginTop: 0.5
    },
    itemText: {
        fontSize: 16, color: "#333", width: 80
    },
    itemTextInput: {
        height: 35, flex: 1, fontSize: 16, color: '#333', backgroundColor: "#fff", padding: 5,
        borderWidth: 0.5, borderColor: "#ccc",
    }
});