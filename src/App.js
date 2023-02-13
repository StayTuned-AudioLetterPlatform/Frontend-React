import './App.css';
import React from 'react';
import Header from './components/header';
import Login from './pages/login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./pages/main";

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <Routes>
                    <Route path={"/"} element={<Login />} />
                    <Route path={"/main"} element={<Main />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
