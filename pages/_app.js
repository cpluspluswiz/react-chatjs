import {useEffect} from 'react';
import '../styles/globals.css';
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import Login from './login';
import Loading from '../components/Loading';
import { collection, setDoc, serverTimestamp, doc, getDoc } from "@firebase/firestore";


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user) {
      const col = collection(db, "users");
      const document = doc(col, user.uid);
      setDoc(document, 
        {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
        },
        {merge: true}
      )
      
    }
  }, [user])

  if(loading) return <Loading />;
  if(!user) return <Login />;

  return <Component {...pageProps} />
}

export default MyApp
