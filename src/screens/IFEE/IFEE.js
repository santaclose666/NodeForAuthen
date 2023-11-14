import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument, getIFEEDocument} from '../../redux/apiRequest';

const IFEE = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data?.ifee?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data?.ifee?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data?.ifee?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data?.ifee?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data?.ifee?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'ifee';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Viện Sinh thái rừng và Môi trường'}
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

export default IFEE;
