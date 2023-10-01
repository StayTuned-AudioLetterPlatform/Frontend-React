import './App.css';
import React from 'react';
import Header from './components/header';
import Login from './pages/login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Main} from "./pages/main";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from "recoil";
import MyPage from "./pages/mypage";


function App() {

    return (
        <RecoilRoot>
            <BrowserRouter>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path={"/"} exact element={<Login />} />
                        <Route path={"/login"} exact element={<Login />} />
                        <Route path={"/main"} element={<Main />} />
                        <Route path={"/mypage"} element={<MyPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </RecoilRoot>
    );
}

export default App;
