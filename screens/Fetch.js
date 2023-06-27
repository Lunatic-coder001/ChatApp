
import { View, Text, FlatList,TouchableOpacity,Image} from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../App';
import * as Animatable from 'react-native-animatable';


 const userback=require("../assets/chatBackground.jpg");
const Fetch = () => {
  const [users, setUsers] = useState([]);
  const collectionRef = collection(db, 'users');

  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { email, name } = doc.data();
        users.push({
          id: doc.id,
          email,
          name,
        });
      });
       setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{flex: 1}}>
    <Image source={userback} style={{ width: 400,height: 1000,position: "absolute",}} />
    <Animatable.View 
     animation="fadeInDown"
     easing="ease-in-out"
    style={{ flex: 1, marginTop: 100,justifyContent:'center',alignItems:'center' }}>
        <Text style={{fontWeight:'bold',fontSize:30,color:'orange'}}>UsersList</Text>
      <FlatList
        style={{ height: 100 }}
        data={users}
        numColumns={1}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
            <View style={{borderRadius:20,backgroundColor:'lightblue',borderWidth:1,marginTop:30, width: 300,height:50,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontWeight:"bold"}}>{item.name}</Text>
            </View>
            </TouchableOpacity>
          );
        }}
      />
      
    </Animatable.View>
    </View>
    
    
  );
};

export default Fetch;