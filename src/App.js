import AppRoutes from "./Routes/Routes";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="container">
      <Sidebar />
      <AppRoutes />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
