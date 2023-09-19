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
  const yearOption = useSelector(
    state => state.document.documentSlice?.forestryData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.forestryData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.forestryData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Ngành Lâm học'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default ForestryScreen;
