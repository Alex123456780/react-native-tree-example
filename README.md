Реализация иерархии элементов в виде дерева с использованием React Native.

Особенности:
- Имеется возможность **добавления**, **удаления** и **переименования** элемента в дереве.
- При **удалении** элемента также удаляются и все его **дочерние** элементы.
- Дерево элементов **сохраняется** в **[AsyncStorage](https://github.com/react-native-community/async-storage)**.
- Реализации выполнена **без** использования **сторонних библиотек**, кроме AsyncStorage, ранее являющейся [частью](https://facebook.github.io/react-native/docs/asyncstorage) React Native.

Визуальное представление:

![visual](https://s3.gifyu.com/images/exampleebec0f835f02a0f5.gif)