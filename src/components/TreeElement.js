import React, {
  PureComponent,
  createRef
} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList
} from 'react-native';
import PropTypes from "prop-types";

import { Button } from './';
import { TreeStoreService } from './../services';
import { emptyFunc } from './../lib/helpers';

// TODO: реализовать функционал, в рамках которого будет выполняться смена цвета у элемента в зависимости от его уровня
// иерархии, чтобы визуально можно было различить, на каком уровне иерархии находится элемент.
// На данный момент элементы разных уровней визуально отличаются только отступом слева (чем глубже уровень, тем больше
// этот отступ).
export default class TreeElement extends PureComponent {
  static propTypes = {
    margin_count: PropTypes.number,
    chain: PropTypes.arrayOf(PropTypes.number).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      // TODO: Cyclical prop-types:
      // https://stackoverflow.com/questions/44234238/cyclical-recursive-react-proptypes
      // children: PropTypes.arrayOf(name, id, children)
      children: PropTypes.arrayOf(PropTypes.any),//временное решение
    })),
    name: PropTypes.string,
    changeChildrenQuantity: PropTypes.func,
  }

  static defaultProps = {
    margin_count: 0,
    // chain: [0],
    items: [],
    name: '',
    changeChildrenQuantity: emptyFunc,
  }

  state = {
    tree: this.props.items,
  }

  parent_position = 0

  text_input = createRef();

  current_name = this.props.name

  onChangeText = (text) => {
    this.text_input.current.setNativeProps({text});
    this.current_name = text;
  }

  //TODO:
  // -) DRY - обеспечить переиспользование одинакового кода в ф-ях вида doSmthToStorage вплоть до выноса данного
  // кода в TreeStoreService
  // -) Оптимизировать работу обхода массива - избавиться от chain (массив позиций элемента в дереве, начиная от
  // вершины), необходимо как-то быстро получать доступ к нужному уровню дерева, изменять его и отдавать изменения
  // обратно в общее дерево. На данный момент реализован механизм рекурсии для поиска нужного уровня дерева,
  // соответствующего элементу, с которым работаем. Также иногда наблюдаются баги работы chain'а, которые я пока что не
  // понял как исправить, поскольку они случаются крайне редко и неожиданно, все попытки воспроизвести ситуацию не
  // увенчались успехом.
  changeNodeNameInStorage = (current_tree_list, value, chain) => {
    let temp_tree_list = JSON.parse(JSON.stringify(current_tree_list));
    if (chain.length !== 1) {
      const next_chain = chain.slice(1);
      temp_tree_list[chain[0]].children = this.changeNodeNameInStorage(temp_tree_list[chain[0]].children, value, next_chain)
      return temp_tree_list;
    }
    temp_tree_list[chain[0]].name = value;
    return temp_tree_list;
  }

  changeNodeName = () => {
    const value = this.current_name;
    if (value === '') {
      this.onChangeText(this.props.name);
      return null;
    }
    const { chain } = this.props;
    const current_tree_list = TreeStoreService.getTree();
    const new_tree_list = this.changeNodeNameInStorage(current_tree_list, value, chain);
    TreeStoreService.setTree(new_tree_list);
  }

  addToStorage = (current_tree_list, chain) => {
    let temp_tree_list = JSON.parse(JSON.stringify(current_tree_list));
    if (chain.length !== 1) {
      const next_chain = chain.slice(1);
      temp_tree_list[chain[0]].children = this.addToStorage(temp_tree_list[chain[0]].children, next_chain)
      return temp_tree_list;
    }
    temp_tree_list[chain[0]].children.push({name: `Element`, children: [], id: '_' + Math.random().toString(36).substr(2, 9)});
    return temp_tree_list;
  }

    add = () => {
      const { chain } = this.props;
      const current_tree_list = TreeStoreService.getTree();
      const new_tree_list = this.addToStorage(current_tree_list, chain);
      TreeStoreService.setTree(new_tree_list);
      this.setState({
        tree: [...this.state.tree, {name: `Element`, children: [], id: '_' + Math.random().toString(36).substr(2, 9)}],
      });
  }

  changeChildrenQuantity = (position) => {
    const start = this.state.tree.slice(0, position);
    const end = this.state.tree.slice(position + 1);
    this.setState({tree: start.concat(end)});
  }

  removeFromStorage = (current_tree_list, chain) => {
    let temp_tree_list = JSON.parse(JSON.stringify(current_tree_list));
    if (chain.length !== 1) {
      const next_chain = chain.slice(1);
      temp_tree_list[chain[0]].children = this.removeFromStorage(temp_tree_list[chain[0]].children, next_chain)
      return temp_tree_list;
    }
    temp_tree_list.splice(chain[0], 1);
    this.parent_position = chain[0];
    return temp_tree_list;
  }

  remove = () => {
    const { chain } = this.props;
    const current_tree_list = TreeStoreService.getTree();
    const new_tree_list = this.removeFromStorage(current_tree_list, chain);
    TreeStoreService.setTree(new_tree_list);
    this.props.changeChildrenQuantity(this.parent_position);
  }

  renderItem = ({item: {children, name}, index}) => {
    const { margin_count, chain } = this.props;
    const elem_chain = chain.slice();
    elem_chain.push(index);
    return (
      <TreeElement
        margin_count={margin_count + 5}
        chain={elem_chain}
        items={children}
        name={name}
        changeChildrenQuantity={this.changeChildrenQuantity}
      />
    )
  }

  keyExtractor = (elem, index) => elem.id

  // TODO: поработать над оптимизацией - вызываются при добавлении/удалении элементов лишние перерендеры в компонентах,
  // которые не должны быть затронуты при выполнении той или иной операции.
  get renderTree() {
    const { tree } = this.state;
    return (
      <View>
        <FlatList
        data={tree}
        numColumns={1}
        horizontal={false}
        scrollEnabled={false}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
      />
      </View>
    )
  }

  render() {
    const { tree } = this.state;
    const { margin_count, name } = this.props;
    return (
      <View style={{marginLeft: margin_count}}>
        <View style={styles.element_wrapper}>
          <View style={styles.element_name}>
            <TextInput
              ref={this.text_input}
              underlineColorAndroid={`transparent`}
              style={[styles.text_content, styles.text_input_width]}
              editable={true}
              defaultValue={name}
              onChangeText={this.onChangeText}
              placeholder={`Введите что-нибудь`}
              onSubmitEditing={this.changeNodeName}
            />
          </View>
          <Button
            text='+'
            onPress={this.add}
            viewStyles={[styles.center_alignment, styles.left_right_border, styles.button_style]}
            textStyles={styles.text_content}
          />
          <Button
            text='x'
            onPress={this.remove}
            viewStyles={[styles.center_alignment, styles.button_style]}
            textStyles={styles.text_content}
          />
        </View>
        {
          tree.length !== 0
          ? this.renderTree
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

  element_wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#9ed870',
  },
  button_style: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  text_content: {
    margin: 5,
    fontSize: 20,
  },
  text_input_width: {
    width: 90,
  },
  center_alignment: {
    alignItems:'center',
    justifyContent: 'center',
  },
  left_right_border: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderRightColor: '#9ed870',
    borderLeftColor: '#9ed870',
  },
});