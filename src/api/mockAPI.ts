import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

//Fetch the items
export const fetchItems = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
}

//Create the item
export const createItem = async (newItem: { title: string; body: string; userId: number }) => {
    const response = await axios.post(BASE_URL, newItem)
    return response.data;
}

//Update the item
export const updateItem = async (id: number, updatedItem: { title?: string; body?: string }) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedItem);
    return response.data
}

//Delete the item
export const deleteItem = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
}