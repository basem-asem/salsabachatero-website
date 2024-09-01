import { Box, Button, CircularProgress, Divider, Grid, HStack, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import { AiOutlinePlus } from "react-icons/ai";
import useTranslation from "@/hooks/useTranslation";
import AddressCard from "../Address/AddressCard";
import AddressForm from "../Address/AddressForm";
import { db } from "@/firebase/firebase";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";

const Address = () => {
  const { t } = useTranslation();
  const [hide, setHide] = useState(false);
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRef, setUserRef] = useState();
  const [editAddress, setEditAddress] = useState(null);

  const addAddressFunc = () => {
    setEditAddress(null);  // Clear any edit address on add
    setHide(true);
  };

  const editAddressFunc = (addressId) => {
    const addressToEdit = addresses.find(address => address.id === addressId);
    setEditAddress(addressToEdit);
    setHide(true);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = localStorage.getItem("userId");
      const userRef = doc(db, `users/${userId}`);
      setUserRef(userRef);
      const addressesCollection = collection(db, 'Addresses');
      const q = query(addressesCollection, where('UserAd', '==', userRef));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        const addressList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          userName: userData.display_name,
          ...doc.data(),
        }));
        setAddresses(addressList);
        setIsLoading(false);
      });

      return () => unsubscribe(); // Cleanup listener on component unmount
    };

    fetchAddresses();
  }, []);

  return (
    <Grid
      templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
      my="7"
      minH={"container.sm"}
      gap={2}
    >
      <ProfileSidebar />
      <Box
        pos={"relative"}
        p={["3", '3', '5']}
        border="1px solid"
        borderRadius={"md"}
        borderColor={"blackAlpha.400"}
        overflowY={"auto"}
        maxH={"container.md"}
      >
        <HStack mb="2" w='full' justifyContent={"space-between"}>
          <Heading
            fontSize={"1.4rem"}
            color={"blackAlpha.800"}
            fontWeight={400}
          >
            {t('user.address')}
          </Heading>
          <Button
            bg="red.800"
            onClick={addAddressFunc}
            fontWeight={600}
            color={"white"}
            _hover={{ bg: "red.600" }}
            display={hide ? 'none' : "flex"}
          >
            {t("add.address")}
            <AiOutlinePlus style={{ marginInline: "5px" }} fontSize={"1.3rem"} />
          </Button>
        </HStack>
        <Divider />

        <Box display={hide ? 'none' : "block"}>
          {isLoading ? (
            <Grid
              item
              xs={12}
              textAlign="center"
              style={{ justifyContent: "center", display: "flex" }}
            >
              <CircularProgress isIndeterminate />
            </Grid>
          ) : (
            <Grid>
              {addresses.map((address, i) => (
                <AddressCard
                  setHide={setHide}
                  editAddress={editAddressFunc}
                  address={address}
                  key={i}
                />
              ))}
            </Grid>
          )}
        </Box>
        <Box display={!hide ? 'none' : "block"}>
          <AddressForm setHide={setHide} editAddress={editAddress} userRef={userRef} />
        </Box>
      </Box>
    </Grid>
  );
};

export default Address;
