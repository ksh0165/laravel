import {useEffect, useState,useCallback} from 'react';
// import Nweet from '../components/Nweet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = ({userInfo}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [message,setMessage] = useState("");
    const [maxId,setMaxId] = useState();
    const forceUpdate = useCallback(()=>setNweet(""),[]);
    const sortedNweet = nweets.sort((a,b)=>(b.createAt-a.createAt));
    const [attachment, setAttachment] = useState("");
    const onClearAttachment = useCallback(() => setAttachment(""),[]);
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("");
    const navigate = useNavigate();

    const getNweets = async () =>{
        await fetch("http://localhost:3001/notes")
        .then(res=>{
            return res.json();
        })
        .then(data =>{
            setMaxId(data.length+1);
            data.map((text)=>(
                setNweets((prev)=>[text,...prev])
            ));
        })
    }

    useEffect(()=>{
        getNweets();
    },[])

    const onDeleteNweet = (deleteId) => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok){
            console.log(deleteId);
            fetch(`http://localhost:3001/notes/${deleteId}`,{
                method:'DELETE',
            })
            .then(res=>{
                if(res.ok){
                    setNweets(nweets.filter((dId)=>(dId.id !== deleteId)))
                    setMessage(deleteId+" 삭제가 완료되었습니다.");
                }
            })
            
            const response = axios.delete(
                '/users/delete',
                {
                    params:{
                        id:deleteId
                    }
                },
                { withCredentials: true }
            )
            .then(function (response){
                console.log(response.data);
            }).catch(function (err){
                alert(err);
            }).then(function(){
                setMaxId(maxId-1);
            })

        }   
    }
    
    const onUpdateNweet = (updateNweet) => {
        const updatedNweetArray = nweets.map((nweet)=>{
            if(nweet.id === updateNweet.id){
                return updateNweet;
            }
            return nweet;
        });

        fetch(`http://localhost:3001/notes/${updateNweet.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:updateNweet.id,
                text:updateNweet.text,
                username:updateNweet.username,
                filename:updateNweet.filename,
                createAt:Date.now()
            })
        })
        .then(res=>{
            if(res.ok){
                setNweets(updatedNweetArray); 
            }
        })
    }

    //notes {id: id, text:nweet, username:username, filename:filename, createAt: Data.now() }
    const onSubmit = async (e) => {
        e.preventDefault();
        alert(maxId);
        if(e.target.nweetText.value === "" && attachment === ""){
            setMessage("내용을 입력해주세요.");
            return;
        }
        setIsLoding(true);
        const id = maxId;
        const text = nweet;
        const createAt = Date.now();
        let fNm = "";
        if(attachment !== ""){
            fNm = filename;
        }
        if(attachment !== ""){
            const formData = new FormData();
            formData.append('file',file);
            try{
                const res = await axios.post('/users/upload', formData,{
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                });
                console.log(res);
                const {fileName, filePath} = res.data;

                console.log(filePath," + ",fileName);
                setMessage('File Uploaded');
            }catch(err){
                alert(err);
            }
        }

        fetch(`http://localhost:3001/notes/`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id: maxId,
                text:nweet,
                username:userInfo.username,
                filename:fNm,
                createAt: createAt
            })
        })
        .then(res=>{
            if(res.ok){
                setMessage("생성이 완료되었습니다.");
                const newNweets = [...nweets];
                newNweets.push({id:id,text:text,username:userInfo.username,createAt:createAt})
                setNweets(newNweets);
                forceUpdate();
                // setMaxId(maxId+1);
                navigate("/profile");
                navigate("/");
            }
        })

        setIsLoding(false);
    }

    const onChange = (e) => {
        e.preventDefault();
        const {
            target: {value},
        } = e;
        setNweet(value);
    }

    const onFileChange = (e) => {
        const {
            target:{files},
        } = e;

        const theFile = new File(    
            [files[0].slice(0,files[0].size,'image/jpg')],
            maxId+'.jpg',{type: 'image/jpg'}
        )

        console.log(theFile);
        console.log(theFile.name);
        // setFile(files[0]);

        setFile(theFile);
        setFilename(theFile.name);
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" name="nweetText" value={nweet} onChange={onChange} placeholder="what`s on your mind?" maxLength={120} />
                <input style={{opacity: isLoding ? 0.3 : 1}} type="submit" value={isLoding ? "트위터 추가중..." : "트위터 추가"} />
                {message}
                <input type="file" name="file" accept="image/*" onChange={onFileChange}/>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment} >CLEAR</button>
                    </div>
                )}       
            </form>
            <div>
                {/* {sortedNweet.map((nweet)=>( 
                <Nweet key={nweet.id} nweet={nweet} isOwner={userInfo.username === nweet.username} onDeleteNweet={onDeleteNweet} onUpdateNweet={onUpdateNweet} />                
                ))} */}
            </div>
        </>
    )
}
export default Home;