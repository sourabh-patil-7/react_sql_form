// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import TablePage from "./components/TablePage";
import InsertForm from "./components/InsertForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/table/:tableName" element={<TablePage />} />
        <Route path="/table/:tableName/insert" element={<InsertForm />} />
      </Routes>
    </Router>
  );
};

export default App;
