import React from 'react';
import './OrderStatus.css';
import { IoClose } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

const Item = ({ item, removeItem, removeModification }) => {
    const { t } = useTranslation();
    return (
        <div className='order-status-item'>
            <div className='item-main'>
                {t(item.name)} - ${item.cost}
                <IoClose
                    aria-label={`Remove ${item.name}`}
                    className='order-status-item-remove'
                    onClick={() => removeItem(item)}
                />
            </div>
            {item.modifications && item.modifications.length > 0 && (
                <div className='item-modifications'>
                    {item.modifications.map((mod, index) => (
                        <div
                            key={index}
                            className='item-modification'
                        >
                            <span>{t(mod.name)} - ${mod.cost}</span>
                            <IoClose
                                aria-label={`Remove ${mod.name} modification`}
                                className='order-status-mod-remove'
                                onClick={() => removeModification(item, mod)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const OrderStatus = ({ items, subtotal, tax, total, removeItem, removeModification, handleStartCheckout }) => {
    const { t } = useTranslation();

    return (
        <div className='order-status'>
            <h2 aria-label='Current Order'
            >{t("Current Order")}</h2>
            <h3 aria-label='Items'>{t("Items")}</h3>
            <div className='order-status-items'>
                {items.map((item, index) => (
                    <Item key={index} item={item} removeItem={removeItem} removeModification={removeModification} />
                ))}
            </div>
            <div className='order-status-costs-container'>
                <div className='order-status-divider'></div>
                <div className='order-status-subtotal'>
                    <h4>{t("Subtotal")}</h4>
                    <p>${subtotal}</p>
                </div>
                <div className='order-status-tax'>
                    <h4>{t("Tax")}</h4>
                    <p>${tax}</p>
                </div>
                <div className='order-status-total'>
                    <h4>{t("Total")}</h4>
                    <p>${total}</p>
                </div>
            </div>
            <div className='order-status-checkout'>
                <button
                    className='order-status-checkout-button'
                    aria-label='Checkout'
                    onClick={handleStartCheckout}
                    disabled={items.length === 0}
                >
                    {t("Checkout")}
                </button>
            </div>
        </div>
    );
};

export default OrderStatus;