import React , {useState} from "react";
import Button from '../components/common/Button';
import styled from 'styled-components';
import palette from '../lib/styles/palette';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthTemplate from '../components/auth/AuthTemplate';
const RegisterPage = ({LoginStatus,getUserId}) => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    // const navigate = useNavigate();
    const onChange = (e) =>{
        const { target: {name,value},} = e;
        if(name === "username"){
            setUsername(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }

    const onSubmit= async (e)=>{
        e.preventDefault();
        try{
            const res = await axios.post(
                'http://localhost:5000/users/register',
                {
                    params:{
                        username:username,
                        password:password
                    }
                },
                {
                    headers:{
                        'Content-Type':'application/json'
                    }
                }
            );
            console.log(res);
            
        }catch(err){
            console.log(err);
        }
    }

    /**
     * 폼 하단에 로그인 혹은 회원가입 링크를 보여줌
     */
    const Footer = styled.div`
    margin-top: 2rem;
    text-align: right;
    a {
        color: ${palette.gray[6]};
        text-decoration: underline;
        &:hover {
        color: ${palette.gray[9]};
        }
    }
    `;

    /**
     * 에러를 보여줍니다
     */
    const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    font-size: 0.875rem;
    margin-top: 1rem;
    `;

    const ButtonWithMarginTop = styled(Button)`
    margin-top: 1rem;
    `;
    return (
        <>
            <div>
                <AuthTemplate>
                <form onSubmit={onSubmit} className="container">
                <input type="text" name="username" placeholder="username" value={username} required onChange={onChange} className="authInput" />
                <input type="password" name="password" placeholder="password" value={password} required onChange={onChange} className="authInput" />
                <ButtonWithMarginTop cyan fullWidth style={{ marginTop: '1rem' }}>
                    회원가입
                </ButtonWithMarginTop>
                {error && <ErrorMessage className="authError">{error}</ErrorMessage>}
                </form>
                <Footer>
                <ButtonWithMarginTop cyan fullWidth style={{ marginTop: '1rem' }}><Link to="/">뒤로 돌아가기</Link></ButtonWithMarginTop>
                </Footer>
                </AuthTemplate>
            </div>
        </>
    )

};

export default RegisterPage;