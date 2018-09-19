import React,{Component}from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    View,
    TextInput,
    Slider,
} from 'react-native';

export default class SliderView extends Component {
    constructor(props) {
        super(props);
        this.state={
            value:0,
        }
    }
    static defaultProps = {
        onValueChanges: () => {
        },
      
    }
    render() {
        return(
            <View style={{alignItems:"center"}}>
                <Text style={{fontSize:13,color:"#333"}}>{new Number(this.state.value).toFixed(2)}%</Text>
            <Slider
            {...this.props}
            onValueChange={(value) => {
                this.props.onValueChanges(value)
                this.setState({value: value})}}
            />
            </View>
            
        )
    }
}