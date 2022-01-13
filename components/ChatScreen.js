import {useState, useRef, useEffect} from 'react';
import styled from "styled-components";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import { useRouter } from "next/router";
import { Avatar } from "@material-ui/core";
import { AttachFileOutlined, InsertEmoticon } from "@material-ui/icons";
import IconButton from '@material-ui/core/IconButton';
import { addDoc, collection, where, query, orderBy, setDoc, doc, serverTimestamp} from "@firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import getRecepientEmail from "../utils/getRecipientEmail";
import Message from "./Message";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import TimeAgo from 'timeago-react';

const ChatScreen = ({chat, messages}) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState("");
    const endOfMessagesRef = useRef(null);

    const docRef = doc(collection(db, "chats"), router.query.id);
    const msgCol = query(collection(docRef, "messages"), orderBy("timestamp", "asc"));
    const [messagesSnapshot] = useCollection(msgCol);
    
    const q = query(collection(db, "users"), where("email", "==", getRecepientEmail(chat.user, user)));
    const [recipientSnapshot] = useCollection(q);

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecepientEmail(chat.user, user);

    useEffect(() => {
        console.log("Scroll to bottom");
        endOfMessagesRef.current.scrollIntoView();
    }, [router.query.id]);

    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => {
                return <Message
                key = {message.id}
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }}
                />
            })
        } else {
            return JSON.parse(messages).map(message => {
                return <Message key = {message.id} user={message.user} message={message} />
            });
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();
        
        // we need to update 'lastSeen' field
        const col = collection(db, "users");
        const document = doc(col, user.uid);
        setDoc(document, 
            {
                lastSeen: serverTimestamp(),
            },
            {merge: true}
        );

        const docRef = doc(collection(db, "chats"), router.query.id);
        const msgCol = collection(docRef, "messages");
        addDoc(msgCol, {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        })
        setInput("");
        scrollToBottom();
    }

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : (
                                "Unavailable"
                            )}
                        </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileOutlined/>
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndofMessage id="hello" ref={endOfMessagesRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)}/>
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>send  message</button>
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}
 
export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 20;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;
const HeaderIcons = styled.div`

`;
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;
const EndofMessage  = styled.div`
    margin-bottom: 50px;
`;
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 20px;
`;
const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
`;