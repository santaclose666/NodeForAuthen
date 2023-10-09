import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const DocumentListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const data = useSelector(
    state => state.document.documentSlice?.data.dvmtr?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.dvmtr?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.dvmtr?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.dvmtr?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.dvmtr?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'dvmtr';
    await getDocument(dispatch, name);
    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Quỹ bảo vệ phát triển rừng'}
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

export default DocumentListScreen;
