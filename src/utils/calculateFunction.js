export const sortByTitle = (arr, titleOrder) => {
  return arr.sort((a, b) => {
    const indexA = titleOrder.indexOf(a.chucdanh);
    const indexB = titleOrder.indexOf(b.chucdanh);
    return indexA - indexB;
  });
};
