import logo from "./logo.svg";
import "./App.css";
import NavigationBar from "./Components/Navbar";
import Classifier from "./Components/Classifier";
import { Route } from "react-router";
import Footer from "./Components/Footer.jsx";
import { BrowserRouter, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <div className="container-fluid">
        <Routes>
          <Route path="/classifier" exact element={<Classifier />} />
        </Routes>
      </div>
      <Classifier />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
