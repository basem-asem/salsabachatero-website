import React, { useState, useEffect } from 'react';
import useTranslation from "@/hooks/useTranslation";
import { Box, CircularProgress, Container, SimpleGrid, Input, useToast } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import CategoryComponent from "@/components/Home/CategoryComponent";
import LatestProduct from "@/components/Home/LatestProduct";
import About from "@/components/Home/about";
import TrendingBooks from "@/components/Home/TrendingBooks";
import Ads from "@/components/Home/Ads";
import ImageGallery from "@/components/comman/ImageGallery";
import Head from "next/head";
import { getStaticData, getUserDataByRef } from '@/firebase/firebaseutils';
import ProductCard from '@/components/comman/ProductCard';
import { useDispatch } from 'react-redux';
import { setUserLocation } from '@/redux/locationSlice';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const Index = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [bannerData, setBannerData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const Da = new Date();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    const UsersQuery = query(
      collection(db, "banners"),
      where("status", "==", "accepted"),
      where("city", "==", city),
      where("expireDate", ">=", Da),
    );
    const unsubscribe = onSnapshot(UsersQuery, (querySnapshot) => {
      setBannerData(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [city]);

  useEffect(() => {
    if (bannerData.length > 0) {
      const randomIndex = Math.floor(Math.random() * bannerData.length);
      showBanner(randomIndex);
    }
  }, [bannerData.length]);

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        // Fetch products from your data source
        const fetchedProducts = await getStaticData("Products");

        const productsWithSupplierData = await Promise.all(
          fetchedProducts.map(async (product) => {
            // Calculate average rating
            const array = product.rating;
            product.averageRating = array ? array.reduce((acc, val) => acc + val, 0) / array.length : 0;

            // Fetch supplier data
            if (product.supplier) {
              try {
                const supplierData = await getUserDataByRef(product.supplier);
                product.supplierDisplayName = supplierData.display_name;
              } catch (error) {
                console.error(`Error fetching supplier data for product ${product.docid}:`, error);
                product.supplierDisplayName = "Unknown Supplier";
              }
            } else {
              product.supplierDisplayName = "Unknown Supplier";
            }

            return product;
          })
        );

        setProducts(productsWithSupplierData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
        setLoading(false);
      }
    };

    fetchProductsAndSuppliers();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDbyqQs6fkB0ZKoVwBDd27042c0FjW1yaQ`)
      .then((res) => res.json())
      .then((res) => {
        const cityComponent = res.results[0].address_components?.find((ele) => ele.types[0] === "administrative_area_level_1");
        const cityName = cityComponent?.long_name || '';

        setCity(cityName);
        localStorage.setItem('city', cityName);
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
        // Dispatch the Redux action after the city state has been updated
        dispatch(setUserLocation({ lat: latitude, lng: longitude, city: cityName }));
      });
    });
  }, [dispatch]); // Only re-run if dispatch changes

  useEffect(() => {
    if (city) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Dispatch the Redux action when the city state changes
        dispatch(setUserLocation({ lat: latitude, lng: longitude, city }));
      })
    }
  }, [city, dispatch]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const showBanner = (num) => {
    toast({
      position: "top-right",
      isClosable: true,
      title: `${bannerData[num].supplierName}`,
      description: `${bannerData[num].description}`,
      duration: 9000,
      colorScheme: "cyan",
      containerStyle: { backgroundColor: "#daf9d7c6" },
    });
  };
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Container py="3" maxW="container.xl">
        <Box pos="relative">
          <Input
            placeholder={t("item")}
            py="5"
            my="5"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FiSearch className='searchIcon'
            style={{
              position: "absolute",
              fontSize: "1.2rem",
              top: "30px",
              color: "#808080",
            }}
          />
        </Box>
        {isSearching ? (
          loading ? (
            <Box textAlign="center" display="flex" justifyContent="center">
              <CircularProgress isIndeterminate />
            </Box>
          ) : (
            <SimpleGrid columns={[2, 2, 4]} spacing={4}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, i) => (
                  <ProductCard key={i} productDetails={product} />
                ))
              ) : (
                <Box textAlign="center" py={5}>No products found</Box>
              )}
            </SimpleGrid>
          )
        ) : (
          <>
            <Ads />
            <CategoryComponent />
            <LatestProduct />
            <TrendingBooks />
            <About />
            <ImageGallery />
          </>
        )}
      </Container>
    </>
  );
};

export default Index;
