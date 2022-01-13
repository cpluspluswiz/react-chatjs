import styled from "styled-components";
import {Avatar} from "@material-ui/core";
import getRecepientEmail from "../utils/getRecipientEmail";
import {auth, db} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, where, query } from "@firebase/firestore";
import { useRouter } from "next/router";



const Chat = ({id, users}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  }
  const q = query(collection(db, "users"), where("email", "==", getRecepientEmail(users, user)));
  const [recipientSnapshot] = useCollection(q);
  const recipientEmail = getRecepientEmail(users, user);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL}/> 
      ): (
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )
      }
      <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;