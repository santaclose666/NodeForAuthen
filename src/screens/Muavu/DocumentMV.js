import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const DocumentMV = ({navigation}) => {
  const data = useSelector(state => state.documentMv.documentMvSlice?.data);

  return (
    <DocumentTemplate
      screenName={'Tài liệu Mùa vụ'}
      navigation={navigation}
      data={data}
    />
  );
};

export default DocumentMV;
