import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View, Image, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Constants from 'expo-constants';

const { DB_NAME } = Constants.manifest.extra.env;
const db = SQLite.openDatabase(DB_NAME);

const Details = () => {
  const user = useSelector((state) => state.user.data);

  const dispatch = useDispatch();

  const handlePress = () => {
    const { _id, favorite } = user;
    db.transaction(
      (tx) => {
        tx.executeSql(`update users set favorite = ? where _id = ?;`, [favorite === 0 ? 1 : 0, _id]);
        tx.executeSql(`SELECT * FROM users where _id = ?`, [_id], (_, { rows: { _array } }) => {
          dispatch({
            type: '@user/SAVE_USER',
            user: _array[0],
          });
        });
      },
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri: `${user.picture}`,
          }}
          style={styles.image}
        />
      </View>
      <View
        style={styles.detailsContainer}
      >
        <Text>
          Nome:
          {user.name}
        </Text>
        <Text>
          E-mail:
          {user.email}
        </Text>
        <Text>
          Idade:
          {user.age}
        </Text>
        <Text>
          Salário:
          {user.balance}
        </Text>
        <Text>
          Latitude:
          {user.latitude}
        </Text>
        <Text>
          Longitude:
          {user.longitude}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
      >
        <Text>
          {user.favorite === 1 ? 'Desavoritar' : 'Favoritar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f3f3f3',
  },
  detailsContainer: {
    width: '100%',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    backgroundColor: '#e5e5e5',
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#b1b1b1',
    backgroundColor: '#e5e5e5',
  },
});

export default Details;
