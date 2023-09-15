import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const TcvnScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.tcvnData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.tcvnData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Tiêu chuẩn Việt Nam'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default TcvnScreen;
