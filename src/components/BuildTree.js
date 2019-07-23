import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from './';
import { emptyFunc } from './../lib/helpers';
import { centerContent } from './../lib/styles';

class BuildTree extends PureComponent {

  static propTypes = {
    buildTree: PropTypes.func,
  }

  static defaultProps = {
    buildTree: emptyFunc,
  }

  buildTree = () => {
    this.props.buildTree();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Дерево не построено</Text>
        <Button
          text='Начать построение дерева'
          onPress={this.buildTree}
          viewStyles={[styles.buttonView, centerContent]}
          textStyles={styles.buttonText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonView: {
    marginTop: 10,
    backgroundColor: '#00a133',
  },
  buttonText: {
    color: '#fff',
  }
});

export default BuildTree;