import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Auth/Login/Login';
import S3FileUpload from './components/FileUpload/FileUpload';
import { Routes, Route } from "react-router-dom";

function App() {
  const [isLoggedIn, setLogin] = useState(false);

  useEffect(()=>{
    let login = sessionStorage.getItem('userLogin')

    login === 'true' ? setLogin(true) : setLogin(false);

  },[isLoggedIn])

  return (
    <div>
      <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<S3FileUpload />} />
          <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
