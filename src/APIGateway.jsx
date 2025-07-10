import axios from "axios";

const getItems = async () => {
  const getUrl = "https://fakestoreapi.com/products";
  const response = await axios.get(getUrl);
  console.log(response.data);
  const items = response.data;
  return items; // Note, when getItems is called, it returns an unfufilled promise intiially, and when the promise is fufilled, it returns the valid response I'm expecting
};

export default getItems;
