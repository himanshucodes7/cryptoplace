import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || "CG-puNVv2Cw3NNDVeceSYsBWYUr";

    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllCoin = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
                    {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "x-cg-demo-api-key": API_KEY
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`API request failed (${response.status})`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Unexpected API response");
                }

                setAllCoin(data);
            } catch (err) {
                console.error(err);
                setAllCoin([]);
                setError("Unable to fetch market data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllCoin();
    }, [currency, API_KEY]);

    const contextValue = {
        allCoin,
        currency,
        setCurrency,
        API_KEY,
        loading,
        error
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;
