import React from 'react'
import ReturnForm from './pages/ComplaintForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReturnForm />} />
      </Routes>
    </Router>
  );
}

export default App;
