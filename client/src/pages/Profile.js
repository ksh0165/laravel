import {useEffect, useState} from 'react';
import {useNavigate } from 'react-router-dom';
 
const Profile = ({LoginStatus,logOut,userInfo,getUserId}) => {
    const navigate = useNavigate();
    const [nweets, setNweets] = useState([]);
    const [nickname, setNickname] = useState(userInfo.nickname);
    const getNweets = async () =>{
        await fetch("http://localhost:3001/notes")
        .then(res=>{
            return res.json();
        })
        .then(data =>{
            data.filter(text=> text.username === userInfo.username)
            .map(mine => {
                setNweets((prev)=>[mine,...prev])
            });
        })
    }

    useEffect(()=>{
        getNweets();
    },[])

    const onChange = (e) => {
        const {
            target:{value},
        } = e;
        setNickname(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(nickname !== userInfo.nickname){
            fetch(`http://localhost:3001/users/${userInfo.id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    id:userInfo.id,
                    username:userInfo.username,
                    password:userInfo.password,
                    nickname:nickname,
                    status:userInfo.status
                })
            })
            .then(res=>{
                if(res.ok){
                    getUserId({
                        id:userInfo.id,
                        username:userInfo.username,
                        password:userInfo.password,
                        nickname:nickname,
                        status:userInfo.status
                    })
                }
            })
        }    
    }

    console.log(typeof nweets);
    console.log(nweets);
    return (
        <>  
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nick Name" value={nickname} onChange={onChange}/>
                <input type="submit" value="CHANGE" />
            </form>
            {nweets.map((nweet)=>(
                <div key={nweet.id}>
                {nweet.text}
                {nweet.username}
                {nweet.filename}
                {new Date(nweet.createAt).toLocaleDateString("en-GB",{
                    hour: "2-digit",
                    minute: "2-digit"
                })}
                </div>
            ))}
            <button onClick={()=>{
                LoginStatus(false);
                logOut();
                navigate("/");
            }} >LogOut</button>
        </>
    )
}

export default Profile;