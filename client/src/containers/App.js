import AppRouter from "../components/Router";
import {useState} from "react";

//json-server-auth
//jsonwebtoken
//cors
//express
//concurrently nodemon
//json-server-auth jsonwebtoken path body-parser
// npm install htpp-proxy-middleware --save
function App () {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo,setUserInfo] = useState([]);
    const LoginStatus = (isLog) =>{
        alert("LoginStatus call "+isLog);
        setIsLoggedIn(isLog);
    }

    const getUserId = (userInfo) =>{//로그인한 username state에 저장하는 용도
        console.log(userInfo);
        setUserInfo(userInfo);
    }

    const logOut = () =>{
        setUserInfo([]);
    }

    return (
        <>
            {userInfo.nickname ? userInfo.nickname+"님 환영합니다.":""}
            <AppRouter LoginStatus={LoginStatus} isLoggedIn={isLoggedIn} getUserId={getUserId} userInfo={userInfo} logOut={logOut}/>
            <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
        </>
    )
}

export default App;