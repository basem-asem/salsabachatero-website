import useTranslation from "@/hooks/useTranslation";
import { Box, HStack, useDisclosure, useRadio, useRadioGroup } from "@chakra-ui/react";

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box width={'100%'} as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        width={'full'}
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: '#822727',
          color: 'white',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function CancelOption({ setCancel }) {
  const { t } = useTranslation();
  const options = [
    t("payment.change"),
    t("supplier.took.long.time"),
    t("change.supplier"),
    t("change.mind"),
    t("other"),
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: (value) => setCancel(value), // Corrected this line
  });

  const group = getRootProps();

  return (
    <HStack {...group} w='100%' flexDir={'column'}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard w='100%' key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

export default CancelOption;
