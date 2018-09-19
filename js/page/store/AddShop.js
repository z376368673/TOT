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

export default class AddShop extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            goodsId:"",
            goodsStatus:"",//商品状态1.未上架，2.已上架
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
        this.type = "add"
        this.actionIndex = -1
        this.editPhotos = new Map();
    }

    componentDidMount() {
        // alert(JSON.stringify(this.data))
        if (this.data) {
            this.type = "edit"
            let pic = [this.data.item.coverPlan,this.data.item.goodsPic2,this.data.item.goodsPic3,
                this.data.item.goodsPic4,this.data.item.goodsPic5,this.data.item.goodsPic6]
            this.setState({
                goodsStatus:this.data.item.goodsStatus,
                goodsId:this.data.item.id,
                shopName: this.data.item.goodsName,
                shopPrice: this.data.item.goodsPrice,
                shopNum: this.data.item.goodsStock,
                describe:this.data.item.describe?this.data.item.describe:"",
                shopImage: this.picToUri(pic)
            })
            //alert(this.data.item.goodsName)
        }else {
            this.type = "add"
        }
    }

    picToUri(pic){
        let uri = []
        pic.map((value,index)=>{
            if (value.length>=1){
                uri.push({uri:this.getImgUrl(value)})
            }
        })
       // alert(JSON.stringify(uri))
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
                if (index>-1){//当index大于-1的时候 表示选择照片
                    if (this.type==="edit"){
                        this.state.shopImage.splice(index, 1,photos[0])
                        let p = this.state.shopImage
                        this.setState({ shopImage: p,})
                    }else {
                        this.state.photos.splice(index, 1,photos[0])
                        let p =  this.state.photos
                        this.setState({ photos: p,})
                    }
                    this.editPhotos.set(index,photos[0])
                }else {//当index小于等于-1的时候 表示添加照片

                    if (this.type==="edit"){ //编辑的时候 修改的是 shopImage

                        let size =  this.state.shopImage.length
                        this. editPhotos.set(size,photos[0])

                        let p =  this.state.shopImage.concat(photos)
                        this.setState({ shopImage: p,})
                    } else { //添加的时候 修改的是 photos
                        let p =  this.state.photos.concat(photos)
                        this.setState({ photos: p,})
                    }
                }
            }
        })
    };

    /**
     * 创建ImagView 显示图片
     * @param {*} photos
     */
    createImg(photos) {
        //alert("add:"+photos)
        let views = []
        let imgs = []
        photos.map((photo, index) => {
            let source = {uri: photo.uri};
            if (photo.enableBase64) {
                source = {uri: photo.base64};
            }
            imgs.push(source)
            views.push(
                this.getImgView(source,index)
            )
        })
        return views
    }

    getImgView(photo,index){
     return   <View
            key={`image-${index}`}
            style={{width: width_w, height: width_w, marginLeft: 10, marginTop: 10}}>
            <TouchableOpacity
                onPress={() => this.handleOpenImagePicker(index)}
            ><Image
                ref={"img" + index}
                style={{width: width_w, height: width_w,}}
                source={photo}
                resizeMode={"cover"}
            /></TouchableOpacity>
        </View>
    }

    /**
     * 创建ImagView 显示图片
     * @param {*} photos
     */
    createImgByuri(photos) {
       // alert("edit:"+photos)
        let views = []
        let imgs = []
        photos.map((photo, index) => {
            imgs.push(photo)
            views.push(
               this.getImgView(photo,index)
            )
        })
        return views
    }

    /**
     * 删除商品
     */
    onDelete(){
        //alert(JSON.stringify(this.state.photos))
       deleShop=()=>{
           let url = BaseUrl.deleteShopUrl(this.userInfo.sessionId,this.state.goodsId)
           alert(url)
           /** sessionId   contents  file */
           HttpUtils.getData(url)
               .then(result => {
                   if (result.code === 1) {
                       this.props.navigation.state.params.refresh()
                       DialogUtils.showMsg("删除成功", "知道了", () => {
                           this.props.navigation.goBack()
                       });
                   } else if (result.code === 2||result.code === 4) {
                       DialogUtils.showToast(result.msg)
                       this.goLogin(this.props.navigation)
                   } else {
                       DialogUtils.showToast(result.msg)
                   }
               })
       }

        DialogUtils.showPop("您确认要删除此商品",()=>deleShop(), ()=>{},"删除","取消")
    }

    onClicks() {
        if (this.type == "add") {
            if (this.state.shopName.length < 1) {
                DialogUtils.showMsg("请输入商品名称");
            } else if (this.state.describe.length < 10) {
                DialogUtils.showMsg("请输入商品描述(至少10个字)");
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
            } else if (this.state.describe.length < 10) {
                DialogUtils.showMsg("请输入商品描述(至少10个字)");
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
                    this.props.navigation.state.params.refresh()
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
        this.editPhotos.forEach(function(value, index,){
            //editIndexs+=index+","
            editIndexs.push(index)
            editps.push(value)
        })
        // if (editIndexs.indexOf(",")>=0) {
        //     editIndexs =   editIndexs.substring(0,editIndexs.length-1)
        // }
        //alert(editIndexs)
        HttpUtils.uploadImage(url,
            {
                sessionId: this.userInfo.sessionId,
                id: this.data.item.id,
                goodsName: this.state.shopName,
                goodsPrice: this.state.shopPrice,
                goodsStock: this.state.shopNum,
                describe: this.state.describe,
                nums: editIndexs.toString(),
            },
            editps, (result) => {
                if (result.code === 1) {
                    this.props.navigation.state.params.refresh()
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
                                placeholder={'请输入商品介绍(限150字以内)...'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={"default"}
                                multiline={true}
                                numberOfLines={3}
                                maxLength={150}
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
                            {this.state.shopImage.length>0?this.createImgByuri(this.state.shopImage) :this.createImg(this.state.photos)}
                            {this.state.photos.length >= 6 ||this.state.shopImage.length>=6 ? null :
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
                                marginRight: 15, marginBottom: 20, borderRadius: 8,
                                justifyContent: 'center', alignItems: 'center',
                                backgroundColor: mainColor,
                            }} onPress={() => this.onClicks("add")}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#FFF',
                                fontSize: 20,
                            }}>确认{this.type === "add" ? "添加" : "修改"}</Text>
                        </TouchableOpacity>
                        {this.type === "edit"&&this.state.goodsStatus== "1" ?<TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                height: 45,  marginLeft: 15,
                                marginRight: 15, marginBottom: 50, borderRadius: 8,
                                justifyContent: 'center', alignItems: 'center',
                                backgroundColor: mainColor,
                            }} onPress={() => this.onDelete()}>
                            <Text style={{
                                alignSelf: "center",
                                color: '#FFF',
                                fontSize: 20,
                            }}>删除商品</Text>
                        </TouchableOpacity>:null}
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