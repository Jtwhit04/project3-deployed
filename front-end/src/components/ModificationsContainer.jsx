import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import { useTranslation } from 'react-i18next';

const ModificationsContainer = ({ currentModifications, setCurrentModifications, handleGridTitleChange }) => {
    const { t } = useTranslation();

    const [modifications, setModifications] = useState([]);

    useEffect(() => {
        handleGridTitleChange(t("Modifications"));
    }, [handleGridTitleChange, t]);

    useEffect(() => {
        const fetchModifications = async () => {
            try {
                const res = await axios.get(`${API_URL}/get-all-modifications`);
                const updatedRes = res.data.map((mod) => {
                    return { ...mod, selected: false };
                });
                setModifications(updatedRes);
            } catch (error) {
                console.error("Error fetching modifications: ", error);
            }
        }
        fetchModifications();
    }, []);

    const handleModClick = (mod) => {
        const updatedModifications = modifications.map((m) => {
            if (m.id === mod.id) {
                return { ...m, selected: !m.selected };
            }
            return m;
        });
        setModifications(updatedModifications);
        setCurrentModifications([...currentModifications, mod]);
    }

    return (
        <>
            {(modifications.map((mod) => {
                return (
                    <button
                        key={mod.id}
                        className={`item-button ${mod.selected ? 'selected' : ''}`}
                        aria-label={`${mod.name} - $${mod.cost}`}
                        onClick={() => handleModClick(mod)}
                    >
                        {t(mod.name)} - ${mod.cost}
                    </button>)
            }))}
        </>
    );
};

export default ModificationsContainer;