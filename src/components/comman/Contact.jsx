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
  SimpleGrid,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import useTranslation from "@/hooks/useTranslation";
import { Create_Update_Doc, getStaticData } from "@/firebase/firebaseutils";
import { useRouter } from "next/router";

const Contact = () => {
  const { t } = useTranslation();
  const router = useRouter()
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    name: '',
    date: new Date(),
    comment: ''
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const infosData = await getStaticData("App_Info");
        setInfo(infosData);
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

  const handleSubmit = async () => {
    try {
      await Create_Update_Doc("contact_us", formData);
      router.push("/")
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Grid
        templateColumns={["3fr", "3fr", "3fr", "1fr 3fr"]}
        my="7"
        minH={"container.sm"}
        gap={2}
      >
        <ProfileSidebar />
        <Box
          pos={"relative"}
          p={["2", "3", "5"]}
          border="1px solid"
          borderRadius={"md"}
          borderColor={"blackAlpha.400"}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "blackAlpha.300",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "blackAlpha.300",
            },
          }}
          overflowY={"auto"}
          maxH={"container.md"}
        >
          <Heading
            my="2"
            fontSize={"1.4rem"}
            color={"blackAlpha.800"}
            fontWeight={400}
          >
            {t("navbar.contact")}
          </Heading>
          <Divider />
          <Stack spacing={4} my="5">
            {loading ? (
              <Grid
                item
                xs={12}
                textAlign="center"
                style={{ justifyContent: "center", display: "flex" }}
              >
                <CircularProgress isIndeterminate />
              </Grid>
            ) : (
              <SimpleGrid>
                <InputGroup border={"none"}>
                  <label
                    bg="none"
                    style={{ width: "100%", fontSize: "18px", fontWeight: "500" }}
                    border={"none"}
                  >
                    {t("what")}
                    <Select
                      name="subject"
                      placeholder={t("contact.subject")}
                      mt={"1rem"}
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      {info.map((res, i) =>
                        res.Feedback.map((feed, j) => (
                          <option value={feed} key={j}>{feed}</option>
                        ))
                      )}
                    </Select>
                  </label>
                </InputGroup>
              </SimpleGrid>
            )}
            <InputGroup border={"none"}>
              <label
                bg="none"
                style={{ width: "100%", fontSize: "18px", fontWeight: "500" }}
                border={"none"}
              >
                {t("login.email")}
                <Input
                  name="email"
                  mt={"1rem"}
                  type="text"
                  _focusVisible={"none"}
                  borderColor={"blackAlpha.400"}
                  placeholder={t("login.email")}
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
            </InputGroup>
            <InputGroup border={"none"}>
              <label
                bg="none"
                style={{ width: "100%", fontSize: "18px", fontWeight: "500" }}
                border={"none"}
              >
                {t("teacher.form.name")}
                <Input
                  name="name"
                  mt={"1rem"}
                  type="text"
                  _focusVisible={"none"}
                  borderColor={"blackAlpha.400"}
                  placeholder={t("teacher.form.name")}
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
            </InputGroup>
            <InputGroup border={"none"}>
              <label
                bg="none"
                style={{ width: "100%", fontSize: "18px", fontWeight: "500" }}
                border={"none"}
              >
                {t("cotact.comment")}
                <Input
                  name="comment"
                  mt={"1rem"}
                  type="text"
                  _focusVisible={"none"}
                  borderColor={"blackAlpha.400"}
                  placeholder={t("cotact.comment")}
                  value={formData.comment}
                  onChange={handleChange}
                />
              </label>
            </InputGroup>
          </Stack>
          <Button
            bg="#822727"
            w="full"
            my="5"
            color={"white"}
            _hover={{ bg: "red.600" }}
            onClick={handleSubmit}
          >
            {t("fomr.submit")}
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default Contact;
