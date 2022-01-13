import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { collection, doc, query, getDocs, getDoc, orderBy } from "@firebase/firestore";
import { get } from "@firebase/database"
import {auth, db} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import getRecepientEmail from '../../utils/getRecipientEmail';

const Chat = ({chat, messages}) => {
  const [user] = useAuthState(auth);
  console.log("helo ghelop", chat)
  return (
    <Container>
        <Head>
          <title>Chat with {getRecepientEmail(chat.user, user)}</title>
        </Head>
        <Sidebar />
        <ChatContainer>
          <ChatScreen chat={chat} messages={messages}/>
        </ChatContainer>
    </Container>
  );
}

export default Chat

export async function getServerSideProps(context) {
  const docRef = doc(collection(db, "chats"), context.query.id);

  // prepare messages on the server
  const q = query(collection(docRef, "messages"), orderBy("timestamp"));
  const messagesRef = await getDocs(q);

  const messages = messagesRef.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime(),
  }));

  // prepare the chats
  const chatRes = await getDoc(docRef);
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }
  
  return {
      props: {
        messages: JSON.stringify(messages),
        chat: chat
      }
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;