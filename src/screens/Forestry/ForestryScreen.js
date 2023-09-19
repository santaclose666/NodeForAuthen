import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const ForestryScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.forestryData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.forestryData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Ngành Lâm học'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default ForestryScreen;
