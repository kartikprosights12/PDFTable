// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import store from "@/redux/Store"; // Import your Redux store

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Handle redirection after login
  const onRedirectCallback = () => {
    router.push("/auth");
  };

  return (
    <Provider store={store}>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
        authorizationParams={{
          redirect_uri: typeof window !== "undefined" ? `${window.location.origin}/auth` : "",
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || undefined,
          scope: "openid profile email",
        }}
        onRedirectCallback={onRedirectCallback}
      >
        <Component {...pageProps} />
      </Auth0Provider>
    </Provider>
  );
}

export default MyApp;
