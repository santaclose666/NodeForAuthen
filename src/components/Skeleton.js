import React from 'react';
import {HStack, VStack, Skeleton} from 'native-base';
import {FlatList, StyleSheet, Dimensions, View} from 'react-native';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';
import Colors from '../contants/Colors';

const width = Dimensions.get('window').width / 2 - 22;
const renderTemp = new Array(6);

export const BioSkeleton = () => {
  return (
    <FlatList
      columnWrapperStyle={{justifyContent: 'space-between'}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        marginTop: 10,
        paddingBottom: 50,
      }}
      numColumns={2}
      data={renderTemp}
      renderItem={({item, index}) => {
        return (
          <View style={styles.card} key={index}>
            <VStack
              w="100%"
              borderWidth="1"
              space={4}
              overflow="hidden"
              rounded="md"
              alignItems="center"
              _dark={{
                borderColor: 'coolGray.500',
              }}
              _light={{
                borderColor: 'coolGray.200',
              }}>
              <Skeleton h="40" startColor="success.100" />
              <Skeleton.Text lines={2} alignItems="center" px="4" mb={1} />
              <Skeleton.Text
                w={'66%'}
                lines={1}
                alignItems="center"
                px="4"
                mb={3}
              />
            </VStack>
          </View>
        );
      }}
    />
  );
};

export const InternalSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        paddingTop: Dimension.setHeight(3),
      }}
      data={renderTemp}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <View
            style={{
              marginHorizontal: Dimension.setWidth(3),
              marginBottom: Dimension.setHeight(2),
              backgroundColor: '#ffffff',
              elevation: 5,
              ...shadowIOS,
              borderRadius: 15,
              paddingHorizontal: Dimension.setWidth(5),
              paddingTop: Dimension.setHeight(2),
              paddingBottom: Dimension.setHeight(1),
            }}>
            <HStack space="6" mb={3}>
              <Skeleton.Text w="66%" lines={2} px="1" _line={{h: 5}} />
              <Skeleton h={'5'} w="30%" rounded={6} />
            </HStack>
            <HStack space="2" mb={2} alignItems="center">
              <Skeleton size="8" rounded="full" />
              <Skeleton.Text w="66%" lines={1} rounded="33" _line={{h: 4}} />
            </HStack>
            <HStack space="2" mb={2} alignItems="center">
              <Skeleton size="8" rounded="full" />
              <Skeleton.Text w="66%" lines={1} rounded="33" _line={{h: 4}} />
            </HStack>
          </View>
        );
      }}
    />
  );
};

export const CategorySkeleton = () => {
  return (
    <View
      style={{
        marginTop: Dimension.setHeight(1.5),
        marginHorizontal: Dimension.setWidth(5),
      }}>
      <HStack space="3" mb={1}>
        <Skeleton.Text
          startColor={'cyan.300'}
          w="20%"
          lines={1}
          px="1"
          _line={{h: 4}}
        />
        <Skeleton.Text
          startColor={'cyan.300'}
          w="25%"
          lines={1}
          px="1"
          _line={{h: 4}}
        />
        <Skeleton.Text
          startColor={'cyan.300'}
          w="18%"
          lines={1}
          px="1"
          _line={{h: 4}}
        />
        <Skeleton.Text
          startColor={'cyan.300'}
          w="32%"
          lines={1}
          px="1"
          _line={{h: 4}}
        />
      </HStack>
    </View>
  );
};

export const DocumentSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        marginTop: Dimension.setHeight(1),
        marginHorizontal: Dimension.setWidth(0.6),
      }}
      data={renderTemp}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#ffffff',
              marginBottom: Dimension.setHeight(1.6),
              borderRadius: 9,
              elevation: 4,
              ...shadowIOS,
              borderWidth: 0.5,
              borderColor: Colors.WHITE,
              paddingTop: Dimension.setHeight(1.6),
              paddingBottom: Dimension.setHeight(1.2),
            }}>
            <HStack space="4" mb={3}>
              <Skeleton h={'10'} w="10%" rounded={6} />
              <Skeleton.Text w="66%" lines={2} px="1" _line={{h: 4}} />
              <Skeleton h={'9'} w="9%" rounded={6} />
            </HStack>
            <Skeleton mb={1} alignSelf={'center'} size={1} w="80%" />
            <Skeleton.Text
              alignSelf={'center'}
              w="18%"
              lines={1}
              py="1"
              _line={{h: 3}}
            />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    width: width,
    marginHorizontal: 8,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
  },
});