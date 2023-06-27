import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../App';
import { View, Image, TouchableOpacity } from "react-native";
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { Alert,  } from 'react-native';

export default function ChatScreen({route}) {
  const chatBack=require("../assets/chatBackground.jpg");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { user } = route.params;


  useLayoutEffect(() => {
    const unsubscribe = fetchMessages();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchMessages = () => {
    const collectionRef = collection(db, 'chats', 'btU9hIxXFJkt9cRj4pkp', 'messages');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
  
    return onSnapshot(q, (querySnapshot) => {
      setLoading(false);
      setMessages(
        querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const message = {
            _id: data._id,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          };
          if (data.text) {
            message.text = data.text;
          }
          if (data.message) {
            message.text = data.message;
          }
          if (data.image) {
            message.image = data.image;
          }
          return message;
        })
      );
    }, (error) => {
      console.log(error);
    });
  };
  

  const sendMessage = (messages = []) => {
    const { _id, createdAt, text, name, user,image } = messages[0];
     if(image)
     {
      console.log("heyyyy")
      addDoc(collection(db, 'chats','btU9hIxXFJkt9cRj4pkp','messages'), {
        _id,
        createdAt,
        user,
        image
        
      }).catch((error) => {
        console.log(error);
      });
    setImage(null)
     } 
    else{

    addDoc(collection(db, 'chats','btU9hIxXFJkt9cRj4pkp','messages'), {
      _id,
      createdAt,
      message: text,
      user
      
    }).catch((error) => {
      console.log(error);
    });
  }
  }
  
      
    


  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    
     sendMessage(messages)
    
  }, []);


  const renderMessageImage = (props) => {
   
    return (
      <Image
        source={{ uri: props.currentMessage.image }}
        style={{ width:200 , height: 150 ,borderRadius:20}}
      />
    );
  }

  const renderActions = (props) => {
    const handleChoosePhoto = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.canceled) {
        const { uri } = result.assets[0];
        setImage(uri);
        
        console.log("image picked successfully",image)
        uploadImage(uri);
      }
    };

    const uploadImage = async (uri) => {
     
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `mangalChat/${Date.now()}`);
      
      const uploadTask = await uploadBytesResumable(storageRef, blob);
      console.log('Image uploaded successfully');
      const url=await getDownloadURL(storageRef);
            const message = [{
              _id: new Date().getTime(),
              createdAt: new Date(),
              user: {
                _id: user.user.uid,
                avatar: 'https://previews.123rf.com/images/jemastock/jemastock2003/jemastock200326032/142736384-cute-little-boy-head-avatar-character-vector-illustration-design.jpg'

              },
              image: url,
            }];
            console.log(image)
            setImageUrl(url);
            onSend(message)
      // const url = await getDownloadURL(storageRef);
      // console.log(url);
      // setImageUrl(url);
    
    };

    const handleTakePhoto = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          const { uri } = result.assets[0];
          setImage(uri);
          console.log("Image picked successfully", uri);
          uploadImage(uri);
          
        }
      } else {
        alert('Camera permission not granted');
      }}
  

    return (
      <View  style={{flexDirection:"row"}}>
      <TouchableOpacity onPress={handleChoosePhoto}>
        <Image style={{width:30,height:30,marginBottom:5,marginLeft:5}} source={require('../assets/media.jpg')} />
      </TouchableOpacity>

  <TouchableOpacity onPress={handleTakePhoto}>
  <Image style={{width:30,height:30,marginBottom:5,marginLeft:5}} source={require('../assets/cameraIcon.jpg')} />
        </TouchableOpacity>
        </View>
    );
  };

  return (
    <View style={{flex:1}}>
      <Image source={chatBack} style={{ position:"absolute",
        width:1000,height:1000
      }} />
      
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        onSend={onSend}
        renderBubble={(props) => {
          return (
            <Bubble {...props}
            onLongPress={(context, message) => onLongPress(context, message)}
              wrapperStyle={{
                right:{
                  backgroundColor:"orange",
                },
              }}
            />
          )
        }}
        renderActions={renderActions}
        renderMessageImage={renderMessageImage}
         messagesContainerStyle={{
           backgroundColor: 'light-blue'
         }}
        textInputStyle={{
          backgroundColor: 'white',
          borderRadius: 15,
        }}
        user={{
          _id: user.user.uid,
        avatar: 'https://previews.123rf.com/images/jemastock/jemastock2003/jemastock200326032/142736384-cute-little-boy-head-avatar-character-vector-illustration-design.jpg' 
        // name: auth?.currentUser?.displayName  'Unknown User'
      }}

      
    />
    
    </View>
  );
}

/* close this use Effect one important thing  it's to clean up  saying return unsubscribe like this this is a 
function cleanup whenever the component is unmounted um it's gonna delete this subscriber this subscriber function 
now another important thing is to add this array of
dependencies in this use effect add the user*/

