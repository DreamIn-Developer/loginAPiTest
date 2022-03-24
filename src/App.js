import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";

function App() {
  console.log(process.env["REACT_APP_REST_API_KEY "]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/oauth" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
