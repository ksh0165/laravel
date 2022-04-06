import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, { Fragment } from 'react'
import LoginPage from "../pages/LoginPage";
import Home from "../pages/Home";
import EmptyPage from "./EmptyPage";
import Navigation from './Navigation';
import Profile from '../pages/Profile';
import PostListPage from '../pages/PostListPage';
import RegisterPage from '../pages/RegisterPage';
import WritePage from '../pages/WritePage';
import PostPage from '../pages/PostPage';

const AppRouter = ({isLoggedIn, LoginStatus,getUserId,userInfo,logOut}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userInfo={userInfo} />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path="/" element={[<Home userInfo={userInfo}/> ,<PostListPage />]}/>
                        <Route path="/profile" element={<Profile LoginStatus={LoginStatus} logOut={logOut} userInfo={userInfo} getUserId={getUserId} />}/> 
                        {/* <Route path="/" element={<PostListPage />} exact /> */}
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/write" element={<WritePage />} />
                        {/* <Route path="/@:username/:postId" element={<PostPage />} />
                        <Route path="/@:username" element={<PostListPage />} exact /> */}
                    </>
                ):(
                    <Route path="/"element={<LoginPage LoginStatus={LoginStatus} getUserId={getUserId}/>}/>
                )}
                <Route path="*" element={<EmptyPage />}/>
            </Routes>
        </Router>
    )
}

export default AppRouter;