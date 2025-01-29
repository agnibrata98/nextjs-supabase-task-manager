import Wrapper from "@/layout/wrapper/wrapper";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}
