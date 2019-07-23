import React, { PureComponent } from 'react';
import {
  View,
  ViewPropTypes,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import { emptyFunc } from './../lib/helpers';

class Button extends PureComponent {
  static propTypes = {
    viewStyles: ViewPropTypes.style,
    textStyles: Text.propTypes.style,
    text: PropTypes.string,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    viewStyles: {},
    textStyles: {},
    text: '',
    onPress: emptyFunc,
  }

  render() {
    const {
      viewStyles,
      textStyles,
      text,
      onPress,
    } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
      >
        <View style={viewStyles}>
          <Text style={textStyles}>{text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

export default Button;