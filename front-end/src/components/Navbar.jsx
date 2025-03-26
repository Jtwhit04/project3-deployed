import React, { useContext, useEffect, useState, useRef } from "react";
import "./Navbar.css";
import axios from "axios";
import { WEATHER_API_URL, WEATHER_API_KEY } from "../apiConfig";
import { TitleContext } from "../contexts/TitleContext";
import { useLocation } from "react-router-dom";
import ReactCountryFlag from "react-country-flag"
import { useTranslation } from "react-i18next";
import { EmployeeContext } from "../contexts/EmployeeContext";
import BackButton from "./BackButton";
import SignOutButton from "./SignOutButton";

const Navbar = () => {
    const { title } = useContext(TitleContext);
    const { employee } = useContext(EmployeeContext);
    const { i18n } = useTranslation();
    const location = useLocation();
    const [currentWeather, setCurrentWeather] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', country: 'US', name: 'English' },
        { code: 'es', country: 'ES', name: 'Español' },
        { code: 'fr', country: 'FR', name: 'Français' },
        { code: 'de', country: 'DE', name: 'Deutsch' },
        { code: 'it', country: 'IT', name: 'Italiano' },
        { code: 'tr', country: 'TR', name: 'Türkçe' },
        { code: 'ja', country: 'JP', name: '日本語' },
        { code: 'zh', country: 'CN', name: '中文' }
    ];

    useEffect(() => {
        const fetchWeather = async () => {
            const res = await axios.get(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=College Station`);
            setCurrentWeather(res.data.current);
        };
        fetchWeather();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const changeLanguage = async (language) => {
        i18n.changeLanguage(language);
        setIsDropdownOpen(false);
    }

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const showBackButton = location.pathname !== "/home" && employee !== null;
    return (
        <nav className="navbar">
            {employee && <BackButton className={showBackButton ? "visible" : "hidden"} />}
            <div className="navbar-content">
                <img className="navbar-logo" src="../../goober_logo.png" alt="GooberTea Logo" />
                <h2>{title}</h2>
            </div>
            {employee && <SignOutButton />}

            {!employee && (
                <>
                    <div className="weather-container">
                        {currentWeather && (
                            <img src={currentWeather.condition.icon} alt="weather icon" />
                        )}
                        <p className="weather-degree-text">
                            {currentWeather ? `${currentWeather.temp_f}°F` : 'Loading...'}
                        </p>
                    </div>
                    <div className="language-dropdown-container" ref={dropdownRef}>
                        <button
                            className="language-dropdown-button"
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                        >
                            <ReactCountryFlag
                                countryCode={currentLanguage.country}
                                svg
                                style={{
                                    width: '1.5em',
                                    height: '1.5em',
                                    marginRight: '8px'
                                }}
                                title={currentLanguage.name}
                            />
                            {currentLanguage.name}
                            <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="language-dropdown-menu">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`language-dropdown-item ${i18n.language === lang.code ? 'active' : ''}`}
                                        aria-label={`Switch to ${lang.name}`}
                                    >
                                        <ReactCountryFlag
                                            countryCode={lang.country}
                                            svg
                                            style={{
                                                width: '1.5em',
                                                height: '1.5em',
                                                marginRight: '8px'
                                            }}
                                            title={lang.name}
                                        />
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;