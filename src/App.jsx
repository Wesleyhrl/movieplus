import { BrowserRouter } from "react-router-dom";

import RoutesApp from "./routes.jsx";
import Header from './components/template/Header';
import Footer from "./components/template/Footer.jsx";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer autoClose={2000} limit={4} />
        <Header expand="lg" />
        <RoutesApp/>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
