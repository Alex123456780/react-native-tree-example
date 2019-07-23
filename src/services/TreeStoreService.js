import AsyncStorage from '@react-native-community/async-storage';
import { STORAGE_TREE } from './../lib/constants'

class TreeStoreService {

  tree = [];

  async loadTree() {
    const stringify_tree = await AsyncStorage.getItem(STORAGE_TREE).then(res => res);
    if (stringify_tree !== null) {
      const_current_tree = JSON.parse(stringify_tree);
      this.tree = const_current_tree;
      return this.tree;
    }
    return null;
  }

  setTree(new_tree) {
      this.tree = new_tree;
      AsyncStorage.setItem(STORAGE_TREE, JSON.stringify(new_tree));
  };

  getTree() {
      return JSON.parse(JSON.stringify(this.tree));
  }

  removeTree() {
    this.tree = [];
    AsyncStorage.removeItem(STORAGE_TREE);
  }

  buildTree() {
    this.tree.push({name: `Element`, children: [], id: '_' + Math.random().toString(36).substr(2, 9)});
    AsyncStorage.setItem(STORAGE_TREE, JSON.stringify(this.tree));
  }
}

export default new TreeStoreService();