import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    Linking,
} from 'react-native';
import BaseComponent ,{BaseStyles}from "./BaseComponent";


export  default class MyWebView extends BaseComponent {
    constructor(props){
        super(props);
        this.source = this.props.navigation.state.params.source
    }
    render() {
        const html = "这是一段html,用一下方式可以显示 ，（未已经测试）"
      //  <WebView originWhitelist={['*']} source={{ html: html, baseUrl: '' }} />
        return (
            
            <WebView style={{width:'100%',height:'100%'}}
            source={this.source}>
            </WebView>
        );
    }
}
