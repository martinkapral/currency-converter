import React, { useState, useEffect } from "react";
import { IoMdSwap } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoIosArrowRoundBack } from "react-icons/io";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("CZK");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [nameCurrency, setNameCurrency] = useState({});

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [alert, setAlert] = useState(false);

  const apiKey = "a69ed711718738087e4f0ae4";

  //FETCHING - KURZY MIEN A JEDNOTLIVE MENY Z API
  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        setExchangeRate(data.conversion_rates[toCurrency]);
        setCurrencies([...Object.keys(data.conversion_rates)]);
      });
  }, [fromCurrency, toCurrency]);

  console.log(currencies);

  // FETCHING - NAZOV MENY Z API
  useEffect(() => {
    fetch("https://openexchangerates.org/api/currencies.json")
      .then((response) => response.json())
      .then((data) => {
        setNameCurrency(data);
      });
  }, []);

  // VYMAZANIE NIEKTORYCH MIEN
  const itemsToRemove = [
    "FOK",
    "KID",
    "MRU",
    "SDG",
    "SLE",
    "SSP",
    "STN",
    "TVD",
    "VES",
    "XDR",
    "ZWL",
  ];

  const removedCurrencies = currencies.filter(
    (currency) => !itemsToRemove.includes(currency)
  );

  // TOPOVANIE MIEN NA VRCH ARRAY
  const itemsToMoveToTop = [
    "CZK",
    "EUR",
    "USD",
    "GBP",
    "CAD",
    "AUD",
    "PLN",
    "HUF",
  ];

  const remainingCurrencies = removedCurrencies.filter(
    (currency) => !itemsToMoveToTop.includes(currency)
  );

  // ARRAY TOPOVANYCH A VYMAZANYCH
  const sortedCurrencies = [...itemsToMoveToTop, ...remainingCurrencies];

  // ZAZNAMENA VPISANE CISLA
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // ZAZNAMENA Z AKEJ MENY
  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
  };

  // ZAZNAMENA DO AKEJ MENY
  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
  };

  // SWAP/VYMENA MIEN
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // VYPOCET KONVERZIE
  const convertCurrency = () => {
    return (amount * exchangeRate).toFixed(2);
  };

  // ALERT KED UZIVATEL ZADA NEVALIDNY VSTUP (V TOMTO PRIPADE PISMENO)
  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
      setAlert(true);
      setTimeout(() => setAlert(false), 2000);
    }
  };

  // CUSTOM DROPDOWNS
  const CustomDropdown1 = ({ onSelect }) => (
    <div className={isOpen1 ? "selection1" : ""}>
      {isOpen1 && (
        <div>
          <div className="options-header">
            <IoIosArrowRoundBack
              className="back"
              onClick={() => setIsOpen1(!isOpen1)}
            />
            <h3>SELECT CURRENCY</h3>
          </div>

          <div className="options" onClick={() => setIsOpen1(!isOpen1)}>
            {sortedCurrencies.map((currency) => (
              <div
                className="option"
                key={currency}
                onClick={() => onSelect(currency)}
              >
                <img
                  src={`https://wise.com/public-resources/assets/flags/rectangle/${currency.toLowerCase()}.png`}
                  alt={`${currency} flag`}
                />
                <strong>{currency}</strong>
                {nameCurrency[currency]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CustomDropdown2 = ({ onSelect }) => (
    <div className={isOpen2 ? "selection2" : ""}>
      {isOpen2 && (
        <div>
          <div className="options-header">
            <IoIosArrowRoundBack
              className="back"
              onClick={() => setIsOpen2(!isOpen2)}
            />
            <h3>SELECT CURRENCY</h3>
          </div>

          <div className="options" onClick={() => setIsOpen2(!isOpen2)}>
            {sortedCurrencies.map((currency) => (
              <div
                className="option"
                key={currency}
                onClick={() => onSelect(currency)}
              >
                <img
                  src={`https://wise.com/public-resources/assets/flags/rectangle/${currency.toLowerCase()}.png`}
                  alt={`${currency} flag`}
                />
                <strong>{currency}</strong>
                {nameCurrency[currency]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <h1>CURRENCY CONVERTER</h1>
      <div>
        <div className="container">
          <div className="from-currency">
            <p className="selector" onClick={() => setIsOpen1(!isOpen1)}>
              <img
                src={`https://wise.com/public-resources/assets/flags/rectangle/${fromCurrency.toLowerCase()}.png`}
                alt={`${fromCurrency} flag`}
              />
              {fromCurrency}
              <RiArrowDropDownLine className="down" />
            </p>
            <CustomDropdown1
              selectedCurrency={fromCurrency}
              currencies={currencies}
              onSelect={handleFromCurrencyChange}
              isOpen={isOpen1}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              value={amount}
              onChange={handleAmountChange}
              onKeyPress={handleKeyPress}
            />
            {alert && <div className="alert">Please enter only numbers</div>}
          </div>
          <button onClick={handleSwapCurrencies}>
            <span>
              <IoMdSwap />
            </span>
          </button>

          <div className="to-currency">
            <p className="selector" onClick={() => setIsOpen2(!isOpen2)}>
              <img
                src={`https://wise.com/public-resources/assets/flags/rectangle/${toCurrency.toLowerCase()}.png`}
                alt={`${toCurrency} flag`}
              />
              {toCurrency}
              <RiArrowDropDownLine className="down" />
            </p>
            <CustomDropdown2
              selectedCurrency={toCurrency}
              currencies={currencies}
              onSelect={handleToCurrencyChange}
              isOpen={isOpen2}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              value={convertCurrency()}
            ></input>
          </div>
        </div>
      </div>
      <h3>EXCHANGE RATE</h3>
      <h4>
        {amount} {fromCurrency} = {convertCurrency()} {toCurrency}
      </h4>
    </div>
  );
};

export default CurrencyConverter;
