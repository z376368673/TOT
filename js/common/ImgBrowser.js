import React, {Component} from 'react';
import {Platform, StatusBar, TextInput, View} from 'react-native';
import {AlbumView, Overlay} from "teaset";

export function ImgBrowsers(images,index) {
    let overlayView = (
        <Overlay.PopView
            style={{backgroundColor:"reg(0,0,0)"}}
            containerStyle={{flex: 1}}
            overlayOpacity={1}
            //type='custom'
            //customBounds={{x: pageX, y: pageY, width, height}}
            ref={v => this.fullImageView = v}
        >
            <AlbumView
                style={{flex: 1}}
                control={true}
                images={images}
                //thumbs={this.thumbs}
                defaultIndex={index}
                onPress={() => this.fullImageView && this.fullImageView.close()}
            />
            <StatusBar animated={false} hidden={true} />
        </Overlay.PopView>
    );
    Overlay.show(overlayView);
}


export function ImgBrowser(image) {
   ImgBrowsers([image],0)
}


export default ImgBrowser