import React, { useContext, useEffect } from "react";
import "./SelfServiceScreen.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TitleContext } from "../contexts/TitleContext";

const SelfServiceScreen = () => {
    const navigate = useNavigate();
    const { setTitle } = useContext(TitleContext);
    const { t } = useTranslation();

    useEffect(() => {
        setTitle(t("Self Service Kiosk"));
    }, [setTitle, t]);

    return (
        <div className="self-service">
            <button className='click-anywhere-button' onClick={() => navigate("/self-service/order")}>
                <img src="../../goober_logo.png" alt="logo" aria-label="logo displaying a goober" />
                <h1
                    aria-label="self service kiosk"
                >{t('Self Service Kiosk')}</h1>
                <p
                    className="begin-order-text"
                    aria-label="click anywhere to begin ordering"
                >{t('Click anywhere to begin ordering')}</p>
            </button>
        </div>
    );
};

export default SelfServiceScreen;