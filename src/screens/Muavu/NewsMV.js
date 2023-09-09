import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import NewsTemplate from '../../components/NewsTemplate';

const NewsMV = ({navigation}) => {
  const [featureIndex, setFeatureIndex] = useState(0);
  const newsArr = useSelector(state => state.news.newSlice?.data);
  const category = useSelector(state =>
    state.news.newSlice?.category.map(item => {
      return {title: item.name, id_category: item.id};
    }),
  );
  const featureArr = [{title: 'Tất cả', id_category: 0}, ...category];
  const [newsFilter, setNewsFilter] = useState(null);

  return (
    <NewsTemplate
      screenName={'Tin tức Mùa vụ'}
      navigation={navigation}
      featureIndex={featureIndex}
      setFeatureIndex={setFeatureIndex}
      newsArr={newsArr}
      featureArr={featureArr}
      newsFilter={newsFilter}
      setNewsFilter={setNewsFilter}
    />
  );
};

export default NewsMV;
