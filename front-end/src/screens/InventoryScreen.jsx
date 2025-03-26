import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import "./InventoryScreen.css";
import { TitleContext } from "../contexts/TitleContext";

const InventoryScreen = () => {
  const { setTitle } = useContext(TitleContext)
  setTitle("Inventory");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-ingredients`);
      setIngredients(response.data);
      setError(null);
    }
    catch (error) {
      console.error("Error loading ingredients:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='inventory-screen'>
        {loading ? ( // loading
          <div className="loading">Loading inventory data...</div>
        ) : error ? ( // error ocurred
          <div className="error-message">{error}</div>
        ) : ( // otherwise
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ITEM #</th>
                  <th>NAME</th>
                  <th>STORAGE</th>
                  <th>QUANTITY</th>
                  <th>UNIT</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map(ingredient => (
                  <tr key={ingredient.id}>
                    <td>{ingredient.id}</td>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.storage}</td>
                    <td>
                      {Number.isInteger(ingredient.total_quantity_available)
                        ? ingredient.total_quantity_available // display directly if quantity is integer
                        : Number(ingredient.total_quantity_available).toFixed(2)} { /* round quantity to two decimal places if not integer */}
                    </td>
                    <td>{ingredient.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="inventory-summary">
          Total Ingredients: {ingredients.length}
        </div>
      </div>
    </>
  );
};

export default InventoryScreen;