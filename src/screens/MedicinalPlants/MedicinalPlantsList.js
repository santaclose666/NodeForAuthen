import React, {useLayoutEffect, useState} from 'react';
import {getMedicinalPlants} from '../../redux/apiRequest';
import BioList from '../../components/BioList';

const MedicinalPlantsList = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [speciesArr, setSpeciesArr] = useState([]);

  useLayoutEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const data = await getMedicinalPlants();
      if (data) {
        setSpeciesArr(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BioList
      navigation={navigation}
      speciesArr={speciesArr}
      loading={loading}
      name={'Các loại thảo dược'}
    />
  );
};

export default MedicinalPlantsList;
