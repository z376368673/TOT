import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import {window_width} from "../page/BaseComponent";
import PropTypes from 'prop-types';
import Colors from "../util/Colors";


/**
 * 选择余额，
 */
export default class CheckMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seleIndex: this.props.seleIndex,//默认不选中
            selectedValue: this.props.selectedValue,//默认值为0
        }
    }
    static propTypes = {
        onSelected: PropTypes.element,
    }
    static defaultProps = {
        arrText: ["undefined"],
        seleIndex: -1,//默认不选中
        selectedValue: 0,//默认值为0
    }

    render(){
        const {arrText,...other} = this.props
        return(
            <View {...other}>
                {this.creatViews(arrText)}
            </View>
        );
    }

    creatViews(arrText) {
        let textWidth = window_width / 3 - 30
        let style = {
            width: textWidth,
            height: textWidth / 3,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.mainColor,
            alignItems: 'center', justifyContent: 'center',
            margin: 10,
        }
        var views = [];
        for (let i = 0; i < arrText.length; i++) {
            let styleText = this.state.seleIndex === i ? {color: "#fff"} : { color: Colors.mainColor};
            let styleView = this.state.seleIndex === i ? {backgroundColor: Colors.mainColor} : { backgroundColor: "#fff"};
            views.push(
                <TouchableOpacity
                    key={arrText[i]}
                    style={[style, styleView]}
                    activeOpacity={0.9}
                    onPress={() => {
                        this.props.onSelected(i, arrText[i])
                        this.setState({
                            seleIndex: i,
                            selectedValue: arrText[i]
                        })
                    }}>
                    <Text
                        key={i}
                        style={[styleText,{fontSize: 16,}]}>{arrText[i]}</Text>
                </TouchableOpacity>
            );
        }
        return <View style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            marginLeft: 15,
            marginRight: 15,
            paddingTop: 10,
            paddingBottom: 10
        }}>
            {views}
        </View>
    }

}