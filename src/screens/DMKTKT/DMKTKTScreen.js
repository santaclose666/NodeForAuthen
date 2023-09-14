import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const DMKTKTScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Định mức Kinh tế Kĩ thuật'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default DMKTKTScreen;
