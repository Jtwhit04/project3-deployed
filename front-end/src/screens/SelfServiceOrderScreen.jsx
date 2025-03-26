import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { API_URL } from "../apiConfig";

import "./SelfServiceOrderScreen.css";

import MenuCategories from "../components/MenuCategories";
import OrderStatus from "../components/OrderStatus";
import CheckoutSummary from "../components/CheckoutSummary";

import { TitleContext } from "../contexts/TitleContext";

const SelfServiceOrderScreen = () => {
    const { setTitle } = useContext(TitleContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const idleTimeout = 1000 * 60;
    const [isIdle, setIdle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [kickTime, setKickTime] = useState(10);
    const intervalRef = useRef(null);

    const uniqueIDCounter = useRef(0);

    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    useIdleTimer({
        timeout: idleTimeout,
        onIdle: () => setIdle(true),
        onActive: () => setIdle(false),
        debounce: 500,
    });

    const handleIdle = useCallback(() => {
        setShowModal(true);
        setKickTime(10);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setKickTime((prev) => prev - 1);
        }, 1000);
    }, []);

    useEffect(() => {
        if (!isIdle) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setShowModal(false);
            setKickTime(10);
        } else {
            handleIdle();
        }
    }, [isIdle, handleIdle]);

    useEffect(() => {
        if (kickTime === 0 && isIdle) {
            navigate("/self-service");
        }
    }, [kickTime, isIdle, navigate]);

    useEffect(() => {
        let sub = 0;
        items.forEach((item) => {
            sub += Number(item.cost);
            item.modifications.forEach((mod) => {
                sub += Number(mod.cost
                    ? mod.cost
                    : 0);
            });
        });
        sub = Math.round(sub * 100) / 100;
        setSubtotal(sub);
        const taxCalc = Math.round(sub * 0.07 * 100) / 100;
        setTax(taxCalc);
        const totalCalc = Math.round(sub * 1.07 * 100) / 100;
        setTotal(totalCalc);
    }, [items]);

    const handleAddItem = (item) => {
        const UID = uniqueIDCounter.current++;
        const newItem = {
            ...item,
            UID: UID
        }
        setItems([...items, newItem]);

        return UID;
    };

    const handleRemoveItem = (item) => {
        const newItems = items.filter((i) => i.UID !== item.UID);
        setItems(newItems);
    }

    const handleRemoveModification = (item, modification) => {
        const newItems = items.map((i) => {
            if (i === item) {
                return {
                    ...i,
                    modifications: i.modifications.filter((m) => m !== modification),
                };
            }
            return i;
        });
        setItems(newItems);
    };

    const handleCancelClick = () => {
        if (items.length > 0) {
            setShowCancelConfirmation(true);
        } else {
            navigate("/self-service");
        }
    };

    const handleStartCheckout = () => {
        setIsCheckingOut(true);
    };

    const handleCheckout = async ({ tip, paymentMethod }) => {
        const res = await axios.post(`${API_URL}/add-transaction`, {
            discount_id: null,
            subtotal: subtotal,
            tax: tax,
            tip: tip,
            total: total,
            payment_method: paymentMethod.toUpperCase(),
            cashier_id: 0, // no cashier is logged in
            menu_items: items.map((item) => ({
                id: item.id,
                modifications: item.modifications,
            })),
        });
        setItems([]);
        navigate("/self-service/order-confirmation", { state: { transaction_id: res.data.toString() } });
    };

    const cancelOrder = () => {
        setItems([]);
        navigate("/self-service");
    }

    useEffect(() => {
        setTitle(t("Self Service Order"));
    }, [setTitle, t]);

    return (
        <>
            <div className="self-service-order-screen">
                <button
                    className="cancel-order-button"
                    onClick={handleCancelClick}
                    aria-label="Cancel Order"
                >
                    <IoClose />
                </button>
                <div className='order-screen-container'>
                    {isCheckingOut ? (
                        <CheckoutSummary
                            items={items}
                            subtotal={subtotal}
                            tax={tax}
                            total={total}
                            handleCheckout={handleCheckout}
                        />
                    ) :
                        (
                            <>
                                <div className='order-screen-left'>
                                    <MenuCategories
                                        addItem={handleAddItem} />
                                </div>
                                <div className='order-screen-right'>
                                    <OrderStatus
                                        items={items}
                                        subtotal={subtotal}
                                        tax={tax}
                                        total={total}
                                        removeItem={handleRemoveItem}
                                        removeModification={handleRemoveModification}
                                        handleStartCheckout={handleStartCheckout}
                                    />
                                </div>
                            </>
                        )}
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 aria-label="Idle Warning"
                        >
                            {t("Idle Warning")}
                        </h2>
                        <p>
                            {t("Idle Warning Text", { kickTime })}
                        </p>
                    </div>
                </div>
            )}
            {showCancelConfirmation && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{t("Cancel Order")}</h2>
                        <p>{t("Are you sure you want to cancel your order?")}</p>
                        <div className="modal-buttons">
                            <button
                                className="modal-cancel-button"
                                onClick={() => setShowCancelConfirmation(false)}
                            >
                                {t("No, Continue Order")}
                            </button>
                            <button
                                onClick={cancelOrder}
                                className="modal-confirm-button"
                            >
                                {t("Yes, Cancel Order")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SelfServiceOrderScreen;