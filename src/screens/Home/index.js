import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as SQLite from 'expo-sqlite';
import Constants from 'expo-constants';

import { UserCard } from '../../components';

const { DB_NAME } = Constants.manifest.extra.env;
const db = SQLite.openDatabase(DB_NAME);

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const load = (page, data) => {
    setCurrentPage(page);

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM users ORDER BY name LIMIT 10 OFFSET ?;`,
        [page * 10],
        (_, { rows: { _array } }) => setUsers([...data, ..._array]),
      );
    });
  };

  const loadMore = () => {
    load(currentPage + 1, users);
  };

  const refreshList = () => {
    load(0, []);
  };

  const handlePress = (userCurrent) => {
    dispatch({
      type: '@user/SAVE_USER',
      user: userCurrent,
    });
    navigation.push('Details');
  };

  useEffect(() => {
    load(0, []);
  }, []);

  useEffect(() => {
    setUsers(users.map((x) => ((x._id === user._id) ? user : x)));
  }, [user]);

  return (
    <View
      style={styles.container}
    >
      <FlatList
        style={styles.list}
        data={users}
        keyExtractor={({ _id }) => String(_id)}
        renderItem={({ item }) => (
          <UserCard
            name={item.name}
            age={item.age}
            email={item.email}
            picture={item.picture}
            onPress={() => handlePress(item)}
          />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
        onRefresh={refreshList}
        refreshing={false}
      />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 15,
    backgroundColor: '#f3f3f3',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 15,

    // flex: 1,
    // paddingTop: 50,
    // paddingBottom: 50,
    // backgroundColor: 'red',
  },
});

export default Home;
