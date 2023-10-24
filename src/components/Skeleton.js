import React from 'react';
import {HStack, VStack, Skeleton} from 'native-base';
import {FlatList, StyleSheet, Dimensions, View} from 'react-native';
import Dimension from '../contants/Dimension';
import {shadowIOS} from '../contants/propsIOS';
import Colors from '../contants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
              _dark={{
                borderColor: 'coolGray.500',
              }}
              _light={{
                borderColor: 'coolGray.200',
              }}>
              <Skeleton h="40" />
              <Skeleton.Text lines={2} px="4" mb={1} />
              <Skeleton.Text w={'66%'} lines={1} px="4" mb={3} />
            </VStack>
          </View>
        );
      }}
    />
  );
};

export const NewsSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={renderTemp}
      renderItem={({item, index}) => {
        return (
          <View
            style={{
              marginHorizontal: Dimension.setWidth(3.5),
              borderWidth: 0.4,
              borderRadius: 10,
              borderColor: Colors.WHITE,
              backgroundColor: Colors.WHITE,
              marginBottom: Dimension.setHeight(1.8),
              elevation: 5,
              ...shadowIOS,
              padding: 5,
            }}
            key={index}>
            <VStack
              w="100%"
              borderWidth="1"
              space={4}
              overflow="hidden"
              rounded="md"
              alignItems="flex-start"
              _dark={{
                borderColor: 'coolGray.500',
              }}
              _light={{
                borderColor: 'coolGray.200',
              }}>
              <Skeleton h="40" />
              <Skeleton.Text lines={2} px="4" mb={1} />
              <Skeleton.Text w={'30%'} lines={1} px="4" mb={3} _line={{h: 2}} />
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

export const StaffSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        marginTop: Dimension.setHeight(1),
        marginHorizontal: Dimension.setWidth(0.6),
      }}
      data={renderTemp.concat(renderTemp)}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 12,
              borderColor: Colors.WHITE,
              backgroundColor: Colors.WHITE,
              paddingHorizontal: Dimension.setWidth(2),
              paddingVertical: Dimension.setWidth(4),
              marginVertical: Dimension.setWidth(1.2),
              marginHorizontal: Dimension.setWidth(2),
              ...shadowIOS,
            }}>
            <Skeleton size={12} rounded="full" mr={3} />
            <VStack width={'66%'}>
              <Skeleton.Text w="55%" lines={1} px="1" _line={{h: 4}} mb={3} />
              <Skeleton.Text w="70%" lines={1} px="1" />
            </VStack>
            <VStack width={'20%'} alignItems={'flex-end'}>
              <Skeleton.Text w="80%" lines={1} px="1" mb={3} />
              <Skeleton.Text w="100%" lines={1} px="1" _line={{h: 4}} />
            </VStack>
          </View>
        );
      }}
    />
  );
};

export const NationalParkSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={{
        marginTop: hp('2%'),
      }}
      data={renderTemp}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <View
            style={{
              marginBottom: hp('2%'),
              marginHorizontal: wp('2%'),
              elevation: 6,
              ...shadowIOS,
            }}>
            <VStack w="100%" rounded="16" alignItems="center">
              <Skeleton
                height={hp('21%')}
                rounded="16"
                startColor={'dark.600'}
                endColor={'blueGray.400'}
              />
            </VStack>
          </View>
        );
      }}
    />
  );
};

export const TextRenderSkeleton = () => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: Dimension.setHeight(2),
        width: wp('100%'),
      }}>
      <Skeleton h="40" w="95%" mb={4} />
      <Skeleton.Text w="95%" lines={16} _line={{h: 4}} />
    </View>
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
