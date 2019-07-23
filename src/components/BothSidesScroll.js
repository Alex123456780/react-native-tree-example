import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';

class BothSidesScroll extends PureComponent {
  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {this.props.children}
          </ScrollView>
        </ScrollView>
    );
  }
}

export default BothSidesScroll;