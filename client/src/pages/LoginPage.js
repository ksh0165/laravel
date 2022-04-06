import {useState} from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

export default function Auth ({LoginStatus,getUserId}) {
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
            await axios.get(
                'http://localhost:5000/users',
                {
                    params:{
                        username:username,
                        password:password
                    }
                },
                { withCredentials: true }
            )
            .then(function (response){
                console.log(response.data);
                console.log(JSON.stringify(response.data));
                if(JSON.parse(JSON.stringify(response.data)).username !== ""){
                    LoginStatus(true);
                    getUserId(JSON.parse(JSON.stringify(response.data)));
                }else{
                    setError("다시 로그인을 하시기 바랍니다.");
                    // window.location.reload();
                }
            }).catch(function (err){
                setError("인증에 실패하였습니다.");
            }).then(function(){

            })
        }catch(err){
            console.log(err);
        }
    }
    return (<div>
        <form onSubmit={onSubmit} className="container">
            <table>
            <tbody>
            <tr>
                <td>
                <input type="text" name="username" placeholder="username" value={username} required onChange={onChange} className="authInput" />
                </td>
                <td><input type="password" name="password" placeholder="password" value={password} required onChange={onChange} className="authInput" /></td>
                <td><input type="submit" value="Log In" className="authSubmit"/></td>
                <td>{error && <span className="authError"></span>}</td>
            </tr>
            </tbody>
            </table>
        </form>
    </div>
    )
}