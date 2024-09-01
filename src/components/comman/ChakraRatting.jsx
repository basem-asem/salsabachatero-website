import { HStack, Icon, useColorModeValue } from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'

 const ChakraRating = (props) => {
  const { defaultValue = 0, max = 5, size = 'md', rootProps } = props
  const color = useColorModeValue('#868686', '#868686')
  const activeColor = useColorModeValue('#852830', '#852830')
  return (
    <HStack spacing="0.5" {...rootProps}>
      {Array.from({
        length: max,
      })
        .map((_, index) => index + 1)
        .map((index) => (
          <Icon
            key={index}
            as={FaStar}
            fontSize={size}
            color={index <= defaultValue ? activeColor : color}
          />
        ))}
    </HStack>
  )
}

export default ChakraRating