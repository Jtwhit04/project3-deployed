import React, { useEffect, useState } from 'react';
import './MenuItemsContainer.css';
import { useTranslation } from 'react-i18next';
import ModificationsContainer from './ModificationsContainer';

const MenuItemsContainer = ({ menu_items, selectedItem, handleSelectedItemChange, addItem, handleGridTitleChange }) => {
    const { t } = useTranslation();
    const [currentModifications, setCurrentModifications] = useState([]);


    useEffect(() => {
        handleGridTitleChange(t("Menu Items"));
    }, [handleGridTitleChange, t]);

    const handleItemClick = (item) => {
        handleSelectedItemChange(item);
    }

    const handleConfirmItem = () => {
        const item = {
            ...selectedItem,
            modifications: currentModifications
        }
        addItem(item);
    }

    return (
        <div className='items-grid-container'>
            <div className='items-grid'>
                {!selectedItem ? (
                    menu_items.map((item) => (
                        <button
                            key={item.id}
                            className='item-button'
                            aria-label={`${item.name} - $${item.cost}`}
                            onClick={() => handleItemClick(item)}
                        >
                            {t(item.name)} - ${item.cost}
                        </button>
                    ))
                ) : (
                    <ModificationsContainer
                        currentModifications={currentModifications}
                        setCurrentModifications={setCurrentModifications}
                        handleGridTitleChange={handleGridTitleChange}
                    />
                )}
            </div>
            {selectedItem && <div className='confirm-button-container'>
                <button
                    className='confirm-button'
                    onClick={handleConfirmItem}
                    aria-label='Confirm Item'
                >
                    {t("Confirm")}
                </button>
            </div>
            }
        </div>
    );
};

export default MenuItemsContainer;