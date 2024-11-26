import { Provider } from "react-redux";
import store from "../redux/Store";
import UploadContainer from "../features/upload/container";
// import '../styles/globals.css';

const Home: React.FC = () => (
  <Provider store={store}>
    <div className="min-h-screen bg-gray-100">
      <main className="p-6 flex flex-col items-center">
        <UploadContainer />
      </main>
    </div>
  </Provider>
);

export default Home;
