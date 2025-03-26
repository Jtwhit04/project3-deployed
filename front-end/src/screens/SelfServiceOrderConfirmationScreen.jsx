import React, { useContext, useEffect } from 'react';
import './SelfServiceOrderConfirmationScreen.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { TitleContext } from '../contexts/TitleContext';

const SelfServiceOrderConfirmationScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setTitle } = useContext(TitleContext);

    const { state } = useLocation();
    const { transaction_id } = state;

    useEffect(() => {
        setTitle(t("Order Confirmation"));
    })

    return (
        <div className='self-service-order-confirmation'>
            <h2>{t("Order Confirmation")}</h2>
            <img src='../../boba-icon.jpeg' alt='boba-icon' aria-label='boba icon' />
            <p>{t("Thank you for your order! Your order number is")}</p>
            <span className='transaction-id'><b>{transaction_id.toString().substring(transaction_id.toString().length - 2)}</b></span>
            <p>
                {t("Please wait for your order to be called and pick it up at the counter.")}
            </p>
            <button className='return-button' onClick={() => navigate('/self-service')}>{t("Return to Main Menu")}</button>
        </div>
    );

};

export default SelfServiceOrderConfirmationScreen;