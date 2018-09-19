import React, {Component} from 'react';
import {Platform, TextInput} from 'react-native';

class EditText extends Component {
	shouldComponentUpdate(nextProps) {
		return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
			(nextProps.defaultValue === 'undefined' || nextProps.defaultValue === '' )) ||
			(this.props.defaultValue === nextProps.defaultValue &&
				(nextProps.value === 'undefined' || nextProps.value === '' ));
	}

	render() {
		return <TextInput {...this.props} />;
	}
}

export default EditText;