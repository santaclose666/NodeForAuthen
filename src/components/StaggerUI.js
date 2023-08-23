import React from 'react';
import {
  Box,
  Stagger,
  useDisclose,
  IconButton,
  Icon,
  HStack,
  Image,
} from 'native-base';
import Icons from '../contants/Icons';
import Images from '../contants/Images';

const StaggerUI = ({eventFunc1, eventFunc2}) => {
  const {isOpen, onClose, onToggle} = useDisclose();
  return (
    <Box>
      <Box alignItems="center">
        <Stagger
          visible={isOpen}
          initial={{
            opacity: 0,
            scale: 0,
            translateY: 34,
          }}
          animate={{
            translateY: 0,
            scale: 1,
            opacity: 0.9,
            transition: {
              type: 'spring',
              mass: 0.8,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
          exit={{
            translateY: 34,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 100,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}>
          <IconButton
            onPress={() => {
              eventFunc2();
              onClose();
            }}
            mb="4"
            variant="solid"
            bg="indigo.400"
            colorScheme="indigo"
            borderRadius="full"
            icon={
              <Image
                size="7"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="warmGray.50"
                source={Images.addFile}
                alt="add"
              />
            }
          />
          <IconButton
            onPress={() => {
              eventFunc1();
              onClose();
            }}
            mb="4"
            variant="solid"
            bg="info.400"
            colorScheme="yellow"
            borderRadius="full"
            icon={
              <Image
                size="7"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="warmGray.50"
                source={Images.personal}
                alt="add"
              />
            }
          />
        </Stagger>
      </Box>
      <HStack justifyContent="center">
        <IconButton
          variant="solid"
          borderRadius="full"
          size="lg"
          onPress={onToggle}
          bg="tertiary.300"
          opacity={0.8}
          icon={
            <Icon
              as={Icons.MaterialCommunityIcons}
              size="7"
              name="dots-horizontal"
              color="warmGray.50"
              _dark={{
                color: 'warmGray.50',
              }}
            />
          }
        />
      </HStack>
    </Box>
  );
};

export default StaggerUI;
