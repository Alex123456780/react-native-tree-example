import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet
  /*, Platform */
} from 'react-native';
import PropTypes from 'prop-types';
import { centerContent } from './../lib/styles';

class MainContainer extends PureComponent {
  static propTypes = {
    isCenter: PropTypes.bool,
  }

  static defaultProps = {
    isCenter: true,
  }

  render() {
    const {
      isCenter
    } = this.props;
    return (
      <View style={[styles.container, isCenter ? centerContent : null ]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: '#fff',
  },
});

export default MainContainer;