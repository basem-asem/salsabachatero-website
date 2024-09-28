import Layout from "@/components/Layout";
import ScrollToTopButton from "@/components/comman/ScrollToTopButton";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import store from "@/redux/store";
import "@/styles/globals.css";
import "@smastrom/react-rating/style.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Provider } from "react-redux";
export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
   
    if (localStorage.getItem("userId")) {
      router.push("/home");
    }
  }, []);


  useEffect(() => {
    let dir = router.locale == "ar" ? "rtl" : "ltr";
    let lang = router.locale == "ar" ? "ar" : "en";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", lang);
  }, [router?.locale]);
  return (
    <ChakraProvider>
      <Provider store={store}>
        <Layout>
         
          <Component {...pageProps} />
         
         <ScrollToTopButton/>
        </Layout>
      </Provider>
    </ChakraProvider>
  );
}
