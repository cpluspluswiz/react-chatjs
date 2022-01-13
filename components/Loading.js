import Image from 'next/image';
import styled from 'styled-components'
import chatjsLogo from "../images/chatjsLogo.png"
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {

  return (
    <Container>
        <Image
          src={chatjsLogo}
          alt="chatjs logo"
          width="150"
          height="150"
          layout="fixed"
        />
        <CircularProgress style={{marginTop: "10px", color: "#6bb430"}}/>
    </Container>
  )
}

export default Loading

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;