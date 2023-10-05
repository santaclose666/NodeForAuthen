import React from 'react';
import {Center, VStack, Skeleton} from 'native-base';
import {FlatList, StyleSheet, Dimensions, View} from 'react-native';

const width = Dimensions.get('window').width / 2 - 22;

export const BioSkeleton = () => {
  const renderTemp = new Array(6);

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
              space={8}
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
              <Skeleton.Text lines={3} alignItems="center" px="4" mb={3} />
            </VStack>
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
