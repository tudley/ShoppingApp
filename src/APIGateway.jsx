import axios from "axios";

const getItems = async () => {
  const getUrl = "https://fakestoreapi.com/products";
  const response = await axios.get(getUrl);
  //console.log(response.data);
  const items = response.data;
  const formattedItems = items.map((item) =>
    item.category.includes("clothing")
      ? {
          ...item,
          stock: {
            //small: Math.floor(10 * Math.random()),
            small : 0,
            medium: Math.floor(10 * Math.random()),
            large: Math.floor(10 * Math.random()),
          },
        }
      : { ...item, stock: Math.floor(10 * Math.random()) }
  );
  return formattedItems; // Note, when getItems is called, it returns an unfufilled promise intiially, and when the promise is fufilled, it returns the valid response I'm expecting
};

export default getItems;
