import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  HStack,
  useDisclosure,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const { onClose } = useDisclosure();

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box width={"100%"} as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        width={"full"}
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "red.700",
          color: "white",
          borderColor: "red.800",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function RadioComp({setStatus}) {
  const { t } = useTranslation();
  const options = [
    t("all"),
    t("Pending"),
    t("accept"),
    t("way"),
    t("deliverd"),
    t("completed"),
    t("canceled"),
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: options[0], // Set default to the first option
    onChange: (value) => {
      setStatus(value);
    },
  });

  const group = getRootProps();

  return (
    <HStack {...group} w="100%" flexDir={"column"}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard w="100%" key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

export default RadioComp;
