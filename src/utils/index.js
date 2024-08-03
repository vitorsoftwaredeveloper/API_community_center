export const verifyIfAllItemListIsPresenceOtherList = (
  list = [],
  listAllItems,
  propmap
) => {
  const listMap = list.map((item) => item[`${propmap}`]);
  const listMapAllItems = listAllItems.map((item) => item[`${propmap}`]);

  const listItemsNotFound = [];
  const allItemsIsPresence =
    listMap.filter((item) => {
      const isPresence = listMapAllItems.includes(item);

      if (!isPresence) {
        listItemsNotFound.push(item);
      }

      return isPresence;
    }).length === listMap.length;

  return [allItemsIsPresence, listItemsNotFound];
};
