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
import useTranslation from "@/hooks/useTranslation";
import { Create_Update_Doc, getStaticData } from "@/firebase/firebaseutils";
import { useRouter } from "next/router";
import Head from "next/head";

const index = () => {
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
      router.push("/login")
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Grid
       display={"flex"} justifyContent={"center"} alignItems={"center"} my={'10px'}
      >
         <Head>
          <title>{"Contact Us"}</title>
        </Head>
        <Box
        width={['auto','auto','50%']}
        padding={['8px','16px']}
         style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          margin: "auto",
          backgroundColor: "rgba(54, 46, 44, 0.1)",
          border: "1px solid #868686",
          borderRadius: "8px",
        }}
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
          <Stack spacing={4} my="5" w={"100%"}>
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
                  >
                    {t("what")}
                    <Select
                      name="subject"
                      placeholder={t("contact.subject")}
                      mt={"1rem"}
                      borderColor={"blackAlpha.400"}
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

export default index;
