import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search";
import { signOut } from '@firebase/auth';
import {auth, db} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, addDoc, where } from "@firebase/firestore";
import EmailValidator from "email-validator";
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from "./Chat";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const q = query(collection(db, "chats"), where("user", "array-contains", user?.email));
  const [chatsSnapShot] = useCollection(q);

  const createChat = () => {
    const input = prompt('Enter an email address for the user you want to chat with.')
    if(!input) return null;
    if(EmailValidator.validate(input) && input != user.email && !chatExists(input)) {
      const col = collection(db, "chats");
      addDoc(col, 
        {
          user: [user.email, input]
        }
      );
    }
    else {
      alert("Email already present");
    }
  }

  const chatExists = (email) => {
    return !!chatsSnapShot?.docs.
              find(chat => chat.data().user.
                find(user => user === email)?.length > 0);
  }

    return (
      <Container>
        <Header>
          <UserAvatar onClick={() => {signOut(auth); router.push(`/login`);}} src={user.photoURL}/>
          <IconsContainer>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </IconsContainer>
        </Header>

        <Search>
          <SearchIcon/>
          <SearchInput placeholder="Search"/>
        </Search>

        <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
        {/* List of chats */}
        {chatsSnapShot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().user}/>
        ))}
      </Container>
    )
}
  
export default Sidebar

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width:: 300px;
  max-width:: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  outline-width: 0px;
  border: none;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    :hover {
    background-color: #f5f4f6;
    }
  }
`;