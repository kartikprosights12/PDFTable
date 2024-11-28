import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => {
        logout();
        window.location.href = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || '';
      }}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
