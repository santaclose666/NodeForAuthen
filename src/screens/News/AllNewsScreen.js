import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import NewsTemplate from '../../components/NewsTemplate';

const AllNewsScreen = ({navigation}) => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const newsArr = useSelector(state => state.news.newSlice?.data);
  const category = useSelector(state =>
    state.news.newSlice?.category.map(item => {
      return {title: item.name, id_category: item.id};
    }),
  );
  const featureArr = [{title: 'Tất cả', id_category: 0}, ...category];
  const [title, setTitle] = useState('');

  return (
    <NewsTemplate
      screenName={'Tin tức F4'}
      navigation={navigation}
      featureIndex={featureIndex}
      setFeatureIndex={setFeatureIndex}
      newsArr={newsArr}
      featureArr={featureArr}
      title={title}
      setTitle={setTitle}
    />
  );
};

export default AllNewsScreen;
