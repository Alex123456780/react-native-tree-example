import React from 'react';

import {
  Loader,
  MainContainer,
  BuildTree,
  TreeElement,
  BothSidesScroll
} from './src//components';
import { TreeStoreService } from './src/services';

export default class App extends React.Component {
  state={
    loading: true,
    isTreeEmpty: true,
  }

  componentDidMount() {
    TreeStoreService.loadTree()
    .then(result => {
      if (result !== null) {
        this.setState({
          isTreeEmpty: false,
        });
      }
    })
    .finally(() => {
      this.setState({
        loading: false,
      });
    });
  }

  buildTree = () => {
    TreeStoreService.buildTree();
    this.setState({
      isTreeEmpty: false,
    });
  }

  removeTree = () => {
    TreeStoreService.removeTree();
    this.setState({isTreeEmpty: true});
  }

  get renderTree() {
    const {name, children } = TreeStoreService.getTree()[0];
    return (
        <TreeElement
          margin_count={0}
          chain={[0]}
          items={children}
          name={name}
          changeChildrenQuantity={this.removeTree}
        />
    )
  }

  render() {
    const { loading, isTreeEmpty } = this.state;
    if (loading) {
      return (
        <MainContainer>
          <Loader/>
        </MainContainer>
      )
    }
    if (isTreeEmpty) {
      return (
        <MainContainer>
          <BuildTree
            buildTree={this.buildTree}
          />
        </MainContainer>
      )
    }
    return (
      <MainContainer
        isCenter={false}
      >
        <BothSidesScroll>
          {this.renderTree}
        </BothSidesScroll>
      </MainContainer>
    );
  }
}