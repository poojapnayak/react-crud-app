import React, { useEffect, useState } from "react";
import { fetchItems, createItem, updateItem, deleteItem } from "../api/mockAPI";

interface Item {
  id: number;
  title: string;
  body: string;
}

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchItems()
      .then((data) => {
        setItems(data.slice(1, 6));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      setError("Title and body are required.");
      return;
    }

    try {
      if (editId) {
        // Update Item
        const updatedItem = await updateItem(editId, { title, body });
        setItems(
          items.map((item) => (item.id === editId ? updatedItem : item))
        );
      } else {
        // Create New Item
        const newItem = { title, body, userId: 1 };
        const createdItem = await createItem(newItem);
        setItems([createdItem, ...items]);
      }

      // Reset Form
      setTitle("");
      setBody("");
      setEditId(null);
      setFormOpen(false);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (item: Item) => {
    setFormOpen(true);
    setEditId(item.id);
    setTitle(item.title);
    setBody(item.body);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleSort = () => {
    const sortedItems = [...items].sort((a, b) => {
      if (sortOrder === "asc") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

    setItems(sortedItems);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading)
    return <p className="flex items-center justify-center">Loading Items...</p>;

  return (
    <div>
      <h2 className="bg-gray-200 text-3xl font-bold text-center p-4">
        Mock API Item List
      </h2>
      <div className="p-10">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!formOpen && (
          <div className="flex justify-between mb-4">
            <div>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-3xl shadow-md hover:bg-gray-600"
                onClick={toggleSort}
              >
                Sort by Title ({sortOrder === "asc" ? "ASC" : "DESC"})
              </button>
            </div>
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-3xl shadow-md hover:bg-blue-600"
                onClick={() => {
                  setFormOpen(true);
                  setEditId(null);
                  setTitle("");
                  setBody("");
                }}
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        {formOpen ? (
          <form
            onSubmit={handleFormSubmit}
            className="bg-gray-100 p-4 rounded-lg shadow-md space-y-2 mb-4 max-w-md mx-auto"
          >
            <h3 className="text-lg font-bold text-center mb-4 mt-4">
              {editId ? "Edit Item" : "Add Item"}
            </h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
            <div className="flex justify-around gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditId(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg mt-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
              >
                {editId ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="border p-2 mb-2 flex justify-between"
              >
                <div className="flex w-full justify-between items-center">
                  <div>
                    <span className="font-bold">{item.title}</span>
                    <p className="text-gray-600 max-w-md text-sm">
                      {item.body}
                    </p>
                  </div>
                  <div>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded-2xl"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className=" bg-red-500 text-white px-2 py-1 rounded-2xl"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ItemList;
