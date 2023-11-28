import React, {useLayoutEffect, useState} from 'react';
import {getAllEcosystem} from '../../redux/apiRequest';
import BioList from '../../components/BioList';

const ListBioScreen = ({navigation, route}) => {
  const item = route.params.item;
  const [loading, setLoading] = useState(false);
  const [speciesArr, setSpeciesArr] = useState([]);
  const [api, setApi] = useState(item?.api);
  const [link, setLink] = useState(item?.link);
  const [nameVQG, setNameVQG] = useState(item?.name);
  const [logo, setLogo] = useState(item?.logo);

  useLayoutEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const data = await getAllEcosystem(api);
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
      api={api}
      setApi={setApi}
      link={link}
      setLink={setLink}
      loading={loading}
      name={nameVQG}
      setNameVQG={setNameVQG}
      logo={logo}
      setLogo={setLogo}
    />
  );
};

export default ListBioScreen;
