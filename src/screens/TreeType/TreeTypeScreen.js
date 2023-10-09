import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const TreeTypeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.giongln?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.giongln?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.giongln?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.giongln?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.giongln?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'giongln';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Giống Lâm nghiệp'}
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

export default TreeTypeScreen;
