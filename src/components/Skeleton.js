import React from 'react';
import {HStack, VStack, Skeleton} from 'native-base';
import {FlatList, StyleSheet, Dimensions, View} from 'react-native';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';

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
            <Skeleton.Text w="16%" lines={1} pl="1" mb={3} />
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
