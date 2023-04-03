import './App.css';
import React from 'react';
import Header from './components/header';
import Login from './pages/login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./pages/main";
import Google from "./pages/google";
import Popup from "./components/popup";


function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <Routes>
                    <Route path={"/"} exact element={<Login />} />
                    <Route path={"/main"} element={<Main />} />
                    <Route path={"/google-callback"} element={<Google />}/>
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;
