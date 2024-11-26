import { Provider } from "react-redux";
import store from "../redux/Store";
import Header from "../components/header";
import UploadContainer from "../features/upload/container";
import DataTable from "../components/dataTable";
import '../styles/globals.css';

const Home: React.FC = () => (
  <Provider store={store}>
    <div className="min-h-screen bg-gray-100">
      <main className="p-6 flex flex-col items-center">
        {/* Render the upload component */}
        <UploadContainer />
        {/* Render the results table */}
        {/* <div className="mt-8 w-full">
          <DataTable />
        </div> */}
      </main>
    </div>
  </Provider>
);

export default Home;
