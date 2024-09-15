import {
  Box,
  Button,
  Divider,
  Grid,
  Heading,
  Input,
  InputGroup,
  Stack,
  Select,
  CircularProgress,
  Textarea,
  Icon,
  Checkbox,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { FaRegClock, FaPaperclip } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AdressMap } from "@/components/Address/map";
import { IoIosPin } from "react-icons/io";
import { MultiSelect } from "chakra-multiselect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FileUpload from "../register/FileUpload";

const EventForm = () => {
  const router = useRouter();
  const [info, setInfo] = useState([]);
  const [showplaces, setShowplaces] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVid, setSelectedVid] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    entryPrice: "",
    currency: "",
    eventDescription: "",
    address: "",
    phoneNumber: "",
    eventType: [],
    eventPicture: "",
    eventVideo: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    // Simulate fetching info from Firebase
    const fetchInfo = async () => {
      try {
        // Fetch App_Info data here
        setInfo([]); // Replace with fetched data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching info:", error);
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleEventTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      eventType: prevData.eventType.includes(value)
        ? prevData.eventType.filter((type) => type !== value)
        : [...prevData.eventType, value],
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log(formData)
      // Submit the form to Firebase
      alert("Event added successfully!");
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const handleLocationUpdate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDbyqQs6fkB0ZKoVwBDd27042c0FjW1yaQ`
      )
        .then((res) => res.json())
        .then((res) => {
          const cityComponent = res.results[0].address_components?.find(
            (ele) => ele.types[0] === "administrative_area_level_1"
          );
          const cityName = cityComponent?.long_name || "";

          setCity(cityName);
          localStorage.setItem("city", cityName);
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
          dispatch(
            setUserLocation({ lat: latitude, lng: longitude, city: cityName })
          );

          // Show success toast
          toast({
            title: "Location Updated",
            description: `Your location has been updated to ${cityName}.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };
  return (
    <>
      <Grid
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundImage="url('/assets/backgroundImage.png')"
      >
        <Head>
          <title>Create Event</title>
        </Head>
        <Box
          width={["auto", "auto", "50%"]}
          padding={["20px", "40px"]}
          display="flex"
          alignItems="center"
          flexDirection="column"
          margin="auto"
          my={10}
          backgroundColor="#F6F6F6"
          border="1px solid #E0E0E0"
          borderRadius="12px"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        >
          <Heading
            mb="5"
            fontSize={30}
            color="#f9cf58"
            fontWeight={600}
            fontFamily="Arial, sans-serif"
            textAlign="center"
          >
            Salsabachatero
          </Heading>
          <Stack spacing={6} w="100%">
            {loading ? (
              <Grid
                item
                xs={12}
                textAlign="center"
                display="flex"
                justifyContent="center"
              >
                <CircularProgress isIndeterminate />
              </Grid>
            ) : (
              <>
                {/* Event Name */}
                <InputGroup>
                  <Input
                    name="eventName"
                    placeholder="Event Name"
                    value={formData.eventName}
                    onChange={handleChange}
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="16px"
                    fontSize="1rem"
                  />
                </InputGroup>

                {/* Entry Price and Currency */}
                <InputGroup display="flex" alignItems={"center"}>
                  <Input
                    name="entryPrice"
                    placeholder="Entry Price"
                    value={formData.entryPrice}
                    onChange={handleChange}
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="16px"
                    fontSize="1rem"
                  />
                  <Select
                    name="currency"
                    placeholder="Currency"
                    value={formData.currency}
                    onChange={handleChange}
                    ml="2"
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="8px"
                    fontSize="1rem"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </Select>
                </InputGroup>

                {/* Event Description */}
                <InputGroup>
                  <Textarea
                    name="eventDescription"
                    placeholder="Event Description"
                    value={formData.eventDescription}
                    onChange={handleChange}
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="16px"
                    fontSize="1rem"
                    height="100px"
                    resize="none"
                  />
                </InputGroup>

                {/* Address */}

                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  {showplaces && (
                    <Button
                      onClick={() => setShowplaces(!showplaces)}
                      borderRadius={"3xl"}
                      px={8}
                      maxW={"fit-content"}
                    >
                      Enter your city
                    </Button>
                  )}
                  {!showplaces && <AdressMap setShowplaces={setShowplaces}/>}
                  <Icon
                    as={IoIosPin}
                    border={"1px solid #4b39ef"}
                    borderRadius={"50%"}
                    bgColor={"white"}
                    w={8}
                    h={8}
                    color="black"
                    onClick={handleLocationUpdate}
                    cursor="pointer"
                  />
                </Box>
                {/* Phone Number */}
                <PhoneInput
                  inputProps={{
                    name: "phoneNumber",
                    required: false,
                    autoFocus: false,
                  }}
                  country={"at"}
                  name="phoneNumber"
                  onChange={handleChange}
                  containerClass="phoneContainer"
                  buttonStyle={
                    router.locale === "ar"
                      ? {
                          paddingRight: "22px",
                        }
                      : {
                          paddingLeft: "8px",
                        }
                  }
                  inputClass="phoneInput"
                  inputStyle={{
                    paddingBlock: "22px",
                    backgroundColor: "#FFF",
                    border: "1px solid #CCC",
                    borderRadius: "8px",
                  }}
                />

                {/* Event Type - Multiple Selection */}

                <Box border={"1px solid #ccc"} borderRadius={8} p={2}>
                  <Text>Event Type</Text>
                  <Stack spacing={2} direction="row" padding="8px">
                    <Checkbox
                      value="Salsa"
                      isChecked={formData.eventType.includes("Salsa")}
                      onChange={handleEventTypeChange}
                    >
                      Salsa
                    </Checkbox>
                    <Checkbox
                      value="Bachata"
                      isChecked={formData.eventType.includes("Bachata")}
                      onChange={handleEventTypeChange}
                    >
                      Bachata
                    </Checkbox>
                    <Checkbox
                      value="Kizomba"
                      isChecked={formData.eventType.includes("Kizomba")}
                      onChange={handleEventTypeChange}
                    >
                      Kizomba
                    </Checkbox>
                  </Stack>
                </Box>

                {/* Attach Event Picture */}
                <InputGroup display="flex" alignItems="start" gap={2} flexDirection={"column"} >
                <Text>Upload event image</Text>
                  <FileUpload
                    square="true"
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                  />
                </InputGroup>

                {/* Attach Event Video */}
                <InputGroup display="flex" alignItems="start" gap={2} flexDirection={"column"} >
                <Text>Upload event video</Text>
                  <FileUpload
                    square="true"
                    setSelectedFile={setSelectedVid}
                    selectedFile={selectedVid}
                    videos={true}
                  />
                </InputGroup>

                {/* Start and End Time */}
                <InputGroup display="flex" justifyContent="space-between" gap={5} flexDirection={["column","column","column","column","row"]}>
                  <Box
                    backgroundColor="#eee"
                    color="#000"
                    padding="16px"
                    borderRadius="8px"
                    fontSize="1rem"
                    _hover={{ backgroundColor: "#ccc" }}
                  >
                    <Text>Start Time</Text>
                    <Input type="datetime-local" name="startTime" />
                  </Box>
                  <Box
                    backgroundColor="#eee"
                    color="#000"
                    padding="16px"
                    borderRadius="8px"
                    fontSize="1rem"
                    _hover={{ backgroundColor: "#ccc" }}
                  >
                    <Text>End Time</Text>
                    <Input type="datetime-local" name="endTime" />
                  </Box>
                </InputGroup>
              </>
            )}
          </Stack>
          <Button
            bg="#E53935"
            w="full"
            my="6"
            color="white"
            padding="16px"
            fontSize="1.2rem"
            borderRadius="8px"
            _hover={{ bg: "#D32F2F" }}
            onClick={handleSubmit}
          >
            Add Event
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default EventForm;
