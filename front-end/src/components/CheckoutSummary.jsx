import React, { useState } from 'react';
import './CheckoutSummary.css';
import { useTranslation } from 'react-i18next';

const CheckoutSummary = ({ items, subtotal, tax, total, handleCheckout }) => {
    const { t } = useTranslation();
    const [tipOption, setTipOption] = useState(null);
    const [customTip, setCustomTip] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [tiplessAttemptCount, setTiplessAttemptCount] = useState(0);

    const onSelectTipOption = (option) => {
        setTipOption(option);
        setErrorMessage('');
        if (option !== 'custom') {
            const calculatedTip = (subtotal * (parseFloat(option) / 100)).toFixed(2);
            setCustomTip(calculatedTip);
        } else {
            setCustomTip('');
        }

        setTiplessAttemptCount(0);
    };

    const onCheckout = () => {
        const missingTip = (!tipOption || (tipOption === 'custom' && !customTip));
        if (!paymentMethod || missingTip) {
            setErrorMessage(t("Please enter a tip option and a payment method."));
            if (missingTip) {
                const newCount = tiplessAttemptCount + 1;
                setTiplessAttemptCount(newCount);
                if (newCount >= 5) {
                    setErrorMessage("Stop being a stingy brokeboi and leave a tip already");
                }
            }
            return;
        }
        setErrorMessage('');
        setTiplessAttemptCount(0);
        handleCheckout({
            tip: parseFloat(customTip),
            paymentMethod,
        });
    };

    const tipAmount = parseFloat(customTip) || 0;
    const grandTotal = (total + tipAmount).toFixed(2);

    return (
        <div className='checkout-summary'>
            <h2 aria-label='Current Order'>{t("Current Order")}</h2>
            <h3 aria-label='Items'>{t("Items")}</h3>
            <div className='checkout-summary-items'>
                {items.map((item, index) => (
                    <>
                        <div key={index} className='checkout-summary-item'>
                            <span>{t(item.name)} - ${item.cost}</span>
                        </div>
                        {items.length > 1 && <div key={index} className='checkout-summary-divider'></div>}
                    </>
                ))}
            </div>
            <div className='checkout-summary-costs-container'>
                <div className='checkout-summary-divider'></div>
                <div className='checkout-summary-subtotal'>
                    <h4>{t("Subtotal")}</h4>
                    <p>${subtotal}</p>
                </div>
                <div className='checkout-summary-tax'>
                    <h4>{t("Tax")}</h4>
                    <p>${tax}</p>
                </div>
                <div className='checkout-summary-total'>
                    <h4>{t("Total")}</h4>
                    <p>${total}</p>
                </div>
                <div className='checkout-summary-grand-total'>
                    <h4>{t("Grand Total")}</h4>
                    <p>${grandTotal}</p>
                </div>
            </div>
            <div className="checkout-summary-tip">
                <p>{t("Tip")}:</p>
                <div className="tip-options">
                    <button
                        className={tipOption === "15" ? "active" : ""}
                        onClick={() => onSelectTipOption("15")}
                    >
                        15%
                    </button>
                    <button
                        className={tipOption === "25" ? "active" : ""}
                        onClick={() => onSelectTipOption("25")}
                    >
                        25%
                    </button>
                    <button
                        className={tipOption === "50" ? "active" : ""}
                        onClick={() => onSelectTipOption("50")}
                    >
                        50%
                    </button>
                    <button
                        className={tipOption === "custom" ? "active" : ""}
                        onClick={() => onSelectTipOption("custom")}
                    >
                        {t("Custom")}
                    </button>
                </div>
                {tipOption === "custom" ? (
                    <input
                        type="number"
                        value={customTip}
                        onChange={(e) => setCustomTip(e.target.value)}
                        placeholder="0.00"
                    />
                ) : (
                    customTip && <p className="calculated-tip">{t("Calculated Tip")}: ${customTip}</p>
                )}
            </div>
            <div className="checkout-summary-payment-method">
                <p>{t("Payment Method")}:</p>
                <button
                    className={paymentMethod === "card" ? "active" : ""}
                    onClick={() => { setPaymentMethod("card"); setErrorMessage(''); }}
                >
                    {t("Card")}
                </button>
                <button
                    className={paymentMethod === "mobile" ? "active" : ""}
                    onClick={() => { setPaymentMethod("mobile"); setErrorMessage(''); }}
                >
                    {t("Mobile")}
                </button>
            </div>
            <button
                className='checkout-summary-button'
                onClick={onCheckout}
                aria-label='Checkout'
            >
                {t("Checkout")}
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default CheckoutSummary;