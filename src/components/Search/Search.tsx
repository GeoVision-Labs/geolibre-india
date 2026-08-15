import { useState } from "react";
import utilityNetwork from "../../data/utility-network.json";

interface SearchProps {
        onSearch: (value: string) => void;
}

function Search({ onSearch }: SearchProps) {

        const [ value, setValue ] = useState("");
        const [showsuggestions, setShowSuggestions] = useState(false);

        const handleSubmit = (event: React.FormEvent) => {
                event.preventDefault();
                if (!value.trim()) return;
                onSearch(value.trim());
        };

        return(
                <form 
                        onSubmit={handleSubmit}
                        style={{
                                position: "absolute",
                                top: "10px",
                                left: "180px",
                                zIndex: 10,
                                background: "white",
                                padding: "8px",
                                borderRadius: "6px",
                        }}
                >
                        <input 
                                type="text"
                                value={value}
                                placeholder="Search asset..."
                                onChange={(event) => {
                                        const newValue = event.target.value;
                                        setValue(newValue);
                                        setShowSuggestions(newValue.trim().length > 0);
                                }}
                                style={{
                                        width: "220px",
                                        padding:"8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                }}
                        />
                        {showsuggestions && (
                                <div style={{
                                        position: "absolute",
                                        top: "45px",
                                        left: 0,
                                        width: "220px",
                                        background: "white",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        zIndex: 1000,
                                        maxHeight: "200px",
                                        overflowY: "auto"
                                }} >
                                        {utilityNetwork.features
                                        .filter((feature) => {
                                                const assetId = feature.properties?.assetId;
                                                return (
                                                        typeof assetId === "string" && 
                                                        assetId.toLowerCase().includes(value.trim().toLowerCase())
                                                );
                                        }).slice(0,10).map((feature) => {
                                                const assetId = feature.properties?.assetId;
                                                return(
                                                        <div
                                                        key={String(assetId)} onClick={()=>{
                                                                setValue(String(assetId));
                                                                setShowSuggestions(false);
                                                                onSearch(String(assetId));
                                                        }}
                                                        style={{
                                                                padding: "8px 10px",
                                                                cursor: "pointer",
                                                                borderRadius: "1px solid #eee"
                                                        }}>
                                                                {String(assetId)}
                                                        </div>
                                                )
                                        })}
                                </div>
                        )}
                        <button type="submit" style={{
                                marginLeft: "6px",
                                padding: "8px 12px",
                        }} >Search</button>
                </form>
        );
}

export default Search;