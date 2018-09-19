import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import BaseComponent ,{BaseStyles}from "./BaseComponent";
import ImageViewer from "react-native-image-zoom-viewer"

//图片浏览器 暂时未验证是否能正常使用
export  default class ImageBorwser extends BaseComponent {
    constructor(props){
        super(props);
    }
    render() {
        const {images} = this.props;
        alert(images)
        return (
            <Modal visible={true} transparent={true}>
                <ImageViewer imageUrls={images}/>
            </Modal>
        );
    }
}
