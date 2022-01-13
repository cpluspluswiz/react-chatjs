import styled from 'styled-components';
import Head from 'next/head'
import { Button } from '@material-ui/core';
import chatjsLogo from '../images/chatjsLogo.png';
import Image from 'next/image';
import { auth, provider } from '../firebase';
import { signInWithPopup } from '@firebase/auth';
import { useRouter } from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";

const Login = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  }

  if(user) router.push(`/`);

  return (
      <Container>
          <Head>
            <title>Login</title>
          </Head>

          <LoginContainer>
            <Image layout="fixed" width={150} height={150} src={chatjsLogo} alt="chatjs logo"/>
            <Button onClick={signIn} style={{marginTop: "40px"}}variant="outlined">Sign in with Google</Button>
          </LoginContainer>

      </Container>
  )
}

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;