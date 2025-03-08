import Wrapper from "@/layout/wrapper/wrapper";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <Wrapper>
        <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </Wrapper>
  );
}
