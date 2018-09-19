import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import BaseComponent ,{BaseStyles}from "./BaseComponent";
import SplashScreen from "react-native-splash-screen";


export  default class Welcome extends BaseComponent {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        SplashScreen.hide();
    }
    render() {
        return (
            <View style={BaseStyles.container}>
                <Text style={BaseStyles.container_row}> Welcome Wepay</Text>
            </View>
        );
    }
}
