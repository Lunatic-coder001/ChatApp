// import React, {
//     useState,
//     useLayoutEffect,
//     useCallback,
//     useEffect,
//   } from "react";
//   import { GiftedChat } from "react-native-gifted-chat";
//   import {
//     collection,
//     addDoc,
//     orderBy,
//     query,
//     onSnapshot,
//   } from "firebase/firestore";
  
//   import { useNavigation } from "@react-navigation/native";
//   import { db, auth } from "../firebase";
//   import AsyncStorage from "@react-native-async-storage/async-storage";
  
//   export default function ChatScreen({ route }) {
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigation = useNavigation();
//     const { user } = route.params;
//     // console.log(user);
//     useLayoutEffect(() => {
//       const unsubscribe = fetchMessages();
  
//       return () => {
//         unsubscribe();
//       };
//     }, []);
//     console.log(user.user.uid);
//     const fetchMessages = () => {
//       const collectionRef = collection(
//         db,
//         "chats",
//         "btU9hIxXFJkt9cRj4pkp",
//         "messages"
//       );
//       const q = query(collectionRef, orderBy("createdAt", "desc"));
  
//       return onSnapshot(
//         q,
//         (querySnapshot) => {
//           setLoading(false);
//           setMessages(
//             querySnapshot.docs.map((doc) => ({
//               _id: doc.data()._id,
//               createdAt: doc.data().createdAt.toDate(),
//               text: doc.data().text || doc.data().message,
//               user: doc.data().user,
//               name: doc.data().name,
//               email: doc.data().email,
//             }))
//           );
//         },
//         (error) => {
//           console.log(error);
//         }
//       );
//     };
  
//     const sendMessage = (messages = []) => {
//       const { _id, createdAt, text, name } = messages[0];
//       const userEmail = auth?.currentUser?.email;
//       console.log(auth?.currentUser?.email);
  
//       addDoc(collection(db, "chats", "btU9hIxXFJkt9cRj4pkp", "messages"), {
//         _id,
//         createdAt,
//         message: text,
//         user: {
//           _id: user.user.email,
//         },
//       }).catch((error) => {
//         console.log(error);
//       });
//     };
  
//     const onSend = useCallback((messages = []) => {
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, messages)
//       );
//       sendMessage(messages);
//     }, []);
  
//     return (
//       <GiftedChat
//         messages={messages}
//         showAvatarForEveryMessage={false}
//         showUserAvatar={true}
//         onSend={onSend}
//         messagesContainerStyle={{
//           backgroundColor: "#fff",
//         }}
//         textInputStyle={{
//           backgroundColor: "#fff",
//           borderRadius: 20,
//         }}
//         user={{
//           _id: user.user.email,
//           // uid: user.user.uid,
//           // name: auth?.currentUser?.displayName  'Unknown User'
//         }}
//       />
//     );