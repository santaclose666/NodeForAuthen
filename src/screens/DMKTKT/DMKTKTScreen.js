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
  const yearOption = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Định mức Kinh tế Kĩ thuật'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default DMKTKTScreen;
