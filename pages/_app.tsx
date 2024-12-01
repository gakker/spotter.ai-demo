import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";

import Main from "./api/Main";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Main Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

export default MyApp;
