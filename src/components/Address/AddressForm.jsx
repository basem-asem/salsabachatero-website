import useTranslation from "@/hooks/useTranslation";
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Create_Update_Doc } from "@/firebase/firebaseutils";
import { doc, GeoPoint } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AdressMap } from "./map";

const AddressForm = ({ setHide, userRef, editAddress }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [addressData, setAddressData] = useState({
    Name: "",
    Phone: "",
    City: "",
    Details: "",
    Address: ""
  });

  useEffect(() => {
    if (editAddress) {
      setAddressData(editAddress);
    }
  }, [editAddress]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const address = document.getElementById("address").value;
      const loc = new GeoPoint(
        Number(document.getElementById("lat").value),
        Number(document.getElementById("lng").value)
      );
      const newAddressData = { ...addressData, UserAd: userRef, Address: address, location: loc };

      await Create_Update_Doc("Addresses", newAddressData, editAddress ? editAddress.id : null).then(() => {
        setAddressData({
          Name: "",
          Phone: "",
          City: "",
          Details: "",
          Address: ""
        });
      });

      setHide(false);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <Box p={["0", "3", "5"]}>
      <Box my="2">
        <Text as="label" htmlFor="Name">{t("teacher.form.name")}</Text>
        <Input
          id="Name"
          value={addressData.Name}
          onChange={handleInputChange}
          placeholder={t("teacher.form.name")}
        />
      </Box>
      <Box my="2">
        <Text as="label" htmlFor="Phone">{t("user.phone")}</Text>
        <PhoneInput
          country={"in"}
          containerStyle={{ marginBottom: '1rem' }}
          buttonStyle={
            router.locale === "ar"
              ? { paddingRight: "22px" }
              : { paddingLeft: "8px" }
          }
          inputStyle={{ paddingBlock: "22px" }}
          inputProps={{
            name: "Phone",
            required: true,
            autoFocus: false,
          }}
          value={addressData.Phone}
          id="Phone"
          onChange={(phone) =>
            setAddressData((prevData) => ({ ...prevData, Phone: phone }))
          }
        />
      </Box>
      <Box my="2">
        <Text as="label" htmlFor="address">{t("user.address")}</Text>
        <Input
          id="address"
          isReadOnly
          placeholder="choose your address from the map"
          value={addressData.Address || t("add.address.defult")}
          className="addres_input"
          rounded="lg"
          borderColor="gray.300"
          py={2}
          px={3}
          bg="gray.100"
          _dark={{ bg: "gray.700", borderColor: "gray.600", color: "white" }}
        />
      </Box>
      <Box my="2">
        <AdressMap />
      </Box>
      <Box my="2">
        <Text as="label" htmlFor="City">{t("user.city")}</Text>
        <Input
          id="City"
          value={addressData.City}
          onChange={handleInputChange}
          placeholder={t("user.city")}
        />
      </Box>
      <Box my="2">
        <Text as="label" htmlFor="Details">{t("teacher.form.details")}</Text>
        <Input
          id="Details"
          value={addressData.Details}
          onChange={handleInputChange}
          placeholder={t("teacher.form.details")}
        />
      </Box>
      <Box my="2" display="none">
        <Text as="label" htmlFor="lat">lat</Text>
        <Input
          type="number"
          id="lat"
          rounded="lg"
          borderColor="gray.300"
          py={2}
          px={3}
          bg="gray.100"
          _dark={{ bg: "gray.700", borderColor: "gray.600", color: "white" }}
        />
      </Box>
      <Box my="2" display="none">
        <Text as="label" htmlFor="lng">lng</Text>
        <Input
          type="number"
          id="lng"
          rounded="lg"
          borderColor="gray.300"
          py={2}
          px={3}
          bg="gray.100"
          _dark={{ bg: "gray.700", borderColor: "gray.600", color: "white" }}
        />
      </Box>
      <HStack>
          <Button
            w="full"
            onClick={() => setHide(false)}
            my="5"
            colorScheme="red"
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button
            bg="red.800"
            w="full"
            my="5"
            color="white"
            onClick={handleClick}
            _hover={{ bg: "red.600" }}
          >
            {t("ADD")}
          </Button>
        </HStack>
    </Box>
  );
};

export default AddressForm;