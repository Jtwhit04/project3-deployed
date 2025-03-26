import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import './MenuCategories.css';
import { useTranslation } from 'react-i18next';

import MenuItemsContainer from './MenuItemsContainer';

const MenuCategories = ({ addItem }) => {
    const { t } = useTranslation();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const [menu_items, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [gridTitle, setGridTitle] = useState(t("Menu Categories"));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/get-menu-categories`);
                const formattedCategories = res.data.map(category => category.replace(/_/g, ' '));
                setCategories(formattedCategories);
            } catch (error) {
                console.error("Error fetching categories: ", error);
                setErrorMessage("Error fetching categories. Please try again.");
                setDisplayErrorMessage(true);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;

        const fetchMenuItems = async () => {
            try {
                const res = await axios.get(`${API_URL}/get-menu-items`, {
                    params: { category: selectedCategory.replace(/ /g, '_') }
                });
                setMenuItems(res.data);
                setDisplayErrorMessage(false);
            } catch (error) {
                setSelectedCategory(null);
                setErrorMessage("Error fetching menu items. Please try again.");
                setDisplayErrorMessage(true);
                console.error("Error fetching menu items: ", error);
            }
        };
        fetchMenuItems();
    }, [selectedCategory]);

    const handleGridTitleChange = (title) => {
        setGridTitle(title);
    }

    const handleBackOut = () => {
        if (!selectedItem) {
            setGridTitle(t("Menu Categories"));
            setSelectedCategory(null);
        }
        else {
            setGridTitle(t("Menu Items"));
            setSelectedItem(null);
        }
    }

    const handleSelectedItemChange = (item) => {
        setSelectedItem(item);
    }

    const handleAddItem = (item) => {
        addItem(item);
        setSelectedCategory(null);
        setSelectedItem(null);
        setGridTitle(t("Menu Categories"));
    }

    return (
        <div className="menu-wrapper" aria-label="Menu Categories">
            <h1 className="categories-title">{gridTitle}</h1>
            {!selectedCategory ? (
                <div className="categories-view">
                    <div className="categories-grid">
                        {categories.map(category => (
                            <button
                                key={category}
                                className="category-button"
                                aria-label={`${category} menu`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {t(category)}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="items-view">
                    <div className="items-header">
                        <button
                            className="menu-back-button"
                            onClick={handleBackOut}
                        >
                            {t("← Back")}
                        </button>
                    </div>

                    {menu_items && (
                        <MenuItemsContainer
                            menu_items={menu_items}
                            selectedItem={selectedItem}
                            handleSelectedItemChange={handleSelectedItemChange}
                            addItem={handleAddItem}
                            handleGridTitleChange={handleGridTitleChange}
                        />
                    )}
                </div>
            )}

            {displayErrorMessage && (
                <p className="error-message">
                    {t(errorMessage)}
                </p>
            )}
        </div>
    );
};

export default MenuCategories;