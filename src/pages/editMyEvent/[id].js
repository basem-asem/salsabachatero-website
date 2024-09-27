import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Heading,
  Input,
  InputGroup,
  Stack,
  Select,
  Textarea,
  Icon,
  Checkbox,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaRegClock, FaPaperclip } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AdressMap } from "@/components/Address/map";
import { IoIosPin } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FileUpload from "../register/FileUpload";
import { doc, GeoPoint, Timestamp } from "firebase/firestore"; // Import Timestamp from Firestore
import { format } from "date-fns";
import { db, storage } from "@/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Create_Update_Doc, getDocumentData, imageUploading } from "@/firebase/firebaseutils";

const EventForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [editImage, setEditImage] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVid, setSelectedVid] = useState(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const toast = useToast();
  const [errors, setErrors] = useState({});

  const { id } = router.query;
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch event data
          const image = await getDocumentData("events", id);
          setLoadingPage(false);
          setFormData({
            ...image,
            date: image.date ? format(image.date.toDate(), "yyyy-MM-dd'T'HH:mm") : time,
            closeDate: image.closeDate ? format(image.closeDate.toDate(), "yyyy-MM-dd'T'HH:mm") : time,
          });
          setSelectedFile(image.eventPhoto);
          setSelectedVid(image.eventVideo);
          setPhone(image.phone)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id]);
  const [showplaces, setShowplaces] = useState(true);
  const time = new Date().toISOString().slice(0, 16); // Set current time to match datetime-local input format
  
  const [formData, setFormData] = useState({
    title: "",
    event: "",
    currency: "",
    description: "",
    phone: "",
    type: [],
    eventPhoto: "",
    eventVideo: "",
    city: "",
    latlng: new GeoPoint(0, 0),
    location: "",
    date: time,
    closeDate: time,
  });
  console.log(formData)
  
  useEffect(() => {
    // Whenever the phone state changes, update the formData's phone field
    setFormData((prevData) => ({ ...prevData, phone: phone }));
  }, [phone]);

  useEffect(() => {
    // Simulate fetching info from Firebase
    const fetchInfo = async () => {
      try {
        // Fetch App_Info data here (placeholder, remove if unnecessary)
        setLoadingPage(false);
      } catch (error) {
        console.error("Error fetching info:", error);
        setLoadingPage(false);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handletypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      type: prevData.type.includes(value)
        ? prevData.type.filter((type) => type !== value)
        : [...prevData.type, value],
    }));
  };
  const validateForm = () => {
    let errors = {};
    if (!formData.title) errors.title = "Event name is required";
    if (!formData.event) errors.event = "Entry price is required";
    if (!formData.currency) errors.currency = "Currency is required";
    if (!formData.description)
      errors.description = "Event description is required";
    if (!phone) errors.phone = "Phone number is required";
    if (formData.type.length === 0)
      errors.type = "Please select at least one event type";
    if (!formData.date) errors.date = "Event start date is required";
    if (!formData.closeDate) errors.closeDate = "Event end date is required";
    if (!selectedFile) errors.photo = "Event picture is required";
    if (!selectedVid) errors.video = "Event video is required";
    return errors;
  };
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Ensure that the date values are valid Date objects before conversion to Timestamp
      const startDate = formData.date ? new Date(formData.date) : null;
      const endDate = formData.closeDate ? new Date(formData.closeDate) : null;
  
      if (isNaN(startDate) || isNaN(endDate)) {
        throw new Error("Invalid date format");
      }
  
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
  
      // Fetch location and user information
      const formCity = localStorage.getItem("city");
      const formAdress = localStorage.getItem("address");
      const formLat = localStorage.getItem("latitude");
      const formLong = localStorage.getItem("longitude");
      const formLatLong = new GeoPoint(parseFloat(formLat), parseFloat(formLong));
      const userIdString = localStorage.getItem("userId");
      const userRef = doc(db, "users", userIdString);
  
      let updatedFormData = {
        ...formData,
        city: formCity,
        location: formAdress,
        latlng: formLatLong,
        date: startTimestamp, // Use Firebase Timestamp
        closeDate: endTimestamp, // Use Firebase Timestamp
        host: userRef,
      };
  
      // Upload files if needed
      let imageDownloadURL = "";
      let videoDownloadURL = "";
  
      if (selectedFile) {
        const imageRef = ref(storage, `users/${userIdString}/eventImages/${selectedFile.name}`);
        await uploadBytes(imageRef, selectedFile);
        imageDownloadURL = await getDownloadURL(imageRef);
        updatedFormData = { ...updatedFormData, eventPhoto: imageDownloadURL };
      }
  
      if (selectedVid) {
        const videoRef = ref(storage, `users/${userIdString}/eventVideos/${selectedVid.name}`);
        await uploadBytes(videoRef, selectedVid);
        videoDownloadURL = await getDownloadURL(videoRef);
        updatedFormData = { ...updatedFormData, eventVideo: videoDownloadURL };
      }
  
      // Save updated form data
      await Create_Update_Doc("events", updatedFormData, id);
  
      setLoading(false);
      toast({
        title: "Event added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/home");
    } catch (error) {
      toast({
        title: "Failed to add Event!",
        status: "error",
        description: error.message,
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
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
          localStorage.setItem("address", address);
          if (res.results[0].formatted_address) {
            setAddress(res.results[0].formatted_address);
            localStorage.setItem("address", res.results[0].formatted_address);
          }
          setCity(cityName);
          localStorage.setItem("city", cityName);
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);

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
            {loadingPage ? (
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
                <InputGroup display="flex" flexDirection={"column"}>
                  <Input
                    name="title"
                    placeholder="Event Name"
                    value={formData.title}
                    onChange={handleChange}
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="16px"
                    fontSize="1rem"
                  />
                  {errors.title && (
                    <Text color="red.500">{errors.title}</Text>
                  )}
                </InputGroup>

                <InputGroup display="flex" alignItems={"center"}>
                  <Input
                    name="event"
                    placeholder="Entry Price"
                    value={formData.event}
                    onChange={handleChange}
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="16px"
                    fontSize="1rem"
                    type="number"
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
                    <option value="Dollar">USD</option>
                    <option value="Euro">EUR</option>
                  </Select>
                </InputGroup>
                {errors.event && <Text color="red.500">{errors.event}</Text>}
                {errors.currency && (
                  <Text color="red.500">{errors.currency}</Text>
                )}

                <InputGroup display="flex" flexDirection={"column"}>
                  <Textarea
                    name="description"
                    placeholder="Event Description"
                    value={formData.description}
                    onChange={handleChange}
                    backgroundColor="#FFF"
                    border="1px solid #CCC"
                    borderRadius="8px"
                    padding="16px"
                    fontSize="1rem"
                    height="100px"
                    resize="none"
                  />
                  {errors.description && (
                    <Text color="red.500">{errors.description}</Text>
                  )}
                </InputGroup>

                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  <AdressMap setShowplaces={setShowplaces} events={1} />
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

                <PhoneInput
                  inputProps={{ name: "phone" }}
                  country={"at"}
                  inputStyle={{
                    paddingBlock: "22px",
                    backgroundColor: "#FFF",
                    border: "1px solid #CCC",
                    borderRadius: "8px",
                  }}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                />
                {errors.phone && <Text color="red.500">{errors.phone}</Text>}

                <Box border={"1px solid #ccc"} borderRadius={8} p={2}>
                  <Text>Event Type</Text>
                  <Stack
                    spacing={2}
                    direction="row"
                    padding="8px"
                    wrap={"wrap"}
                  >
                    <Checkbox
                      value="Salsa"
                      isChecked={formData.type.includes("Salsa")}
                      onChange={handletypeChange}
                    >
                      Salsa
                    </Checkbox>
                    <Checkbox
                      value="Bachata"
                      isChecked={formData.type.includes("Bachata")}
                      onChange={handletypeChange}
                    >
                      Bachata
                    </Checkbox>
                    <Checkbox
                      value="Kizomba"
                      isChecked={formData.type.includes("Kizomba")}
                      onChange={handletypeChange}
                    >
                      Kizomba
                    </Checkbox>
                  </Stack>
                  {errors.type && <Text color="red.500">{errors.type}</Text>}
                </Box>
                <Box display={"flex"} flexDirection={["column", "row"]} gap={5}>
                  <InputGroup
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexDirection={"column"}
                  >
                    <Text>Upload event image</Text>
                    <FileUpload
                      square={"true"}
                      setSelectedFile={setSelectedFile}
                      selectedFile={selectedFile}
                      editImage={editImage}
                      setEditImage={setEditImage}
                    />
                    {errors.photo && (
                      <Text color="red.500">{errors.photo}</Text>
                    )}
                  </InputGroup>

                  <InputGroup
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexDirection={"column"}
                  >
                    <Text>Upload event video</Text>
                    <FileUpload
                      square={"true"}
                      setSelectedFile={setSelectedVid}
                      selectedFile={selectedVid}
                      videos
                    />
                    {errors.video && (
                      <Text color="red.500">{errors.video}</Text>
                    )}
                  </InputGroup>
                </Box>
                <InputGroup
                  display="flex"
                  justifyContent="space-evenly"
                  flexWrap={"wrap"}
                  gap={5}
                >
                  <Box
                    backgroundColor="#eee"
                    padding="16px"
                    borderRadius="8px"
                    fontSize="1rem"
                  >
                    <Text mb={3}>Event Start Date</Text>
                    <Input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      padding="16px"
                      backgroundColor="#FFF"
                      border="1px solid #CCC"
                      borderRadius="8px"
                      fontSize="1rem"
                    />
                    {errors.date && <Text color="red.500">{errors.date}</Text>}
                  </Box>

                  <Box
                    backgroundColor="#eee"
                    padding="16px"
                    borderRadius="8px"
                    fontSize="1rem"
                  >
                    <Text mb={3}>Event End Date</Text>
                    <Input
                      type="datetime-local"
                      name="closeDate"
                      value={formData.closeDate}
                      onChange={handleChange}
                      padding="16px"
                      backgroundColor="#FFF"
                      border="1px solid #CCC"
                      borderRadius="8px"
                      fontSize="1rem"
                    />
                    {errors.closeDate && (
                      <Text color="red.500">{errors.closeDate}</Text>
                    )}
                  </Box>
                </InputGroup>

                <Button
                  mt={10}
                  variant={"solid"}
                  size={"lg"}
                  borderRadius={"30px"}
                  bgColor={"#f9cf58"}
                  width={"100%"}
                  type="button"
                  isLoading={loading}  // Use isLoading prop
                  _loading={loading}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Grid>
    </>
  );
};

export default EventForm;
