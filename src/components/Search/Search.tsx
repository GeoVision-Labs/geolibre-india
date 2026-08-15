import { useState } from "react";

interface SearchProps {
        onSearch: (value: string) => void;
}

function Search({ onSearch }: SearchProps) {

        const [ value, setValue ] = useState("");

        const handleSubmit = (event: React.FormEvent) => {
                event.preventDefault();
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
                                onChange={(event) => setValue(event.target.value)}
                                style={{
                                        width: "220px",
                                        padding:"8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                }}
                        />
                        <button type="submit" style={{
                                marginLeft: "6px",
                                padding: "8px 12px",
                        }} >Search</button>
                </form>
        );
}

export default Search;