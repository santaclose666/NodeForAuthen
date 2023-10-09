import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const VP809Screen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.vanphong_809?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.vanphong_809?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.vanphong_809?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.vanphong_809?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.vanphong_809?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'vanphong_809';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Văn phòng 809'}
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

export default VP809Screen;
