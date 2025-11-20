import React from 'react';
import {Route, Routes } from 'react-router-dom';
import LoginRoleSelection from './components/LoginRoleSelection';
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginRoleSelection />} />
        <Route path="/about" element={<div>About Page</div>} />
      </Routes>
    </>
  )
}

export default App;

