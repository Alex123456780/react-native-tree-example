import React, { PureComponent } from 'react';
import {
  View,
  Text
} from 'react-native';

class Loader extends PureComponent {
  render() {
    return (
      <View>
        <Text>Подождите, идет загрузка дерева</Text>
      </View>
    );
  }
}

export default Loader;