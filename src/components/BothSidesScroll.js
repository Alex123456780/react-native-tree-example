import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';

class BothSidesScroll extends PureComponent {
  render() {
    return (
      <ScrollView>
          <ScrollView horizontal>
            {this.props.children}
          </ScrollView>
        </ScrollView>
    );
  }
}

export default BothSidesScroll;