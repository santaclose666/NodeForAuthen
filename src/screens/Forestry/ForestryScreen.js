import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const ForestryScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.lamsinh?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.lamsinh?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.lamsinh?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.lamsinh?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.lamsinh?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'lamsinh';
    await getDocument(dispatch, name);
    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Ngành Lâm học'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
      resetFunction={fetchDocument}
    />
  );
};

export default ForestryScreen;
