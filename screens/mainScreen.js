import { View, Text,TouchableOpacity ,Image,Linking} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React,{useState,useEffect} from 'react'
import { doc, getDoc } from "firebase/firestore";
import * as Animatable from 'react-native-animatable';
import { auth } from '../App';

const mainback = require("../assets/chatBackground.jpg")

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData !== null) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.log(error);
  }
};

export default function MainScreen  ()  {
  
  const [user,setUser]=useState();
  const navigation=useNavigation();

  const handle2 = async () => {
    const supported = await Linking.canOpenURL("https://meet.google.com/mjb-fofr-rje?authuser=1");
    if (supported) {
      await Linking.openURL("https://meet.google.com/mjb-fofr-rje?authuser=1");
    } else {
      console.log(`Don't know how to open URL: ${"https://meet.google.com/mjb-fofr-rje?authuser=1"}`);
    }
  };
  useEffect(() => {
    getUserData().then((userData) => {
      if (userData) {
        
        navigation.navigate("main")
        setUser(userData);
      }
    });
  }, []);
    const handleLogout = () => {
        AsyncStorage.removeItem('userData');
        navigation.replace("login")
       console.log("userLogout")
        setUser(null);
      };
    
  console.log(auth)
  return (
    <View>
      <Image source={mainback} style={{ width: 400,height: 1000,position: "absolute",}}/>
      
  <Animatable.View 
  animation="fadeInDown"
  easing="ease-in-out"
  >
    <Text style={{color:'#D09040',alignSelf:'center',marginTop:100,fontWeight:'bold',fontSize:32}}>WELCOME FREINDS</Text>
    <TouchableOpacity onPress={()=>navigation.navigate('fetch')}>
    <View style={{borderRadius: 15,padding:20,justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:80,backgroundColor:'#CECDD4',width:"70%"}}>
     
          <Text style={{color: '#3217C9', fontWeight: '600', fontSize: 14}}> USERLIST</Text>
          </View>
 
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Chats', {user:user})}>
    <View style={{borderRadius: 15,padding:20,justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:10,backgroundColor:'#CECDD4',width:"70%"}}>
     
          <Text style={{color: '#3217C9', fontWeight: '600', fontSize: 14}}> CHATS</Text>
          </View>
 
        </TouchableOpacity>

        <TouchableOpacity onPress={handle2} >
    <View style={{borderRadius: 15,padding:20,justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:10,backgroundColor:'#CECDD4',width:"70%"}}>
     
          <Text style={{color: '#3217C9', fontWeight: '600', fontSize: 14}}> GROUP MEET</Text>
          </View>
 
        </TouchableOpacity>

    <TouchableOpacity onPress={handleLogout}>
    <View style={{padding:20,justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:80,backgroundColor:'#CECDD4',height:100,width:100, borderRadius:50}}>
     
          <Text style={{color: '#3217C9', fontWeight: '600', fontSize: 14}}> Logout</Text>
          </View>
 
        </TouchableOpacity>
  </Animatable.View>
  </View>
   )
}