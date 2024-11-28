// src/pages/index.tsx
import { Provider } from "react-redux";
import store from "../redux/Store";
import UploadContainer from "../features/upload/container";
import AuthGuard from "@/components/AuthGuard";
// import LogoutButton from "@/components/Logout";

const Home: React.FC = () => (
  <Provider store={store}>
    <div className="min-h-screen bg-gray-100">
      <main className="p-6 flex flex-col items-center">
        <AuthGuard>
          <UploadContainer />
          {/* <LogoutButton /> */}
        </AuthGuard>
      </main>
    </div>
  </Provider>
);

export default Home;
