import React, { createContext, useState, useContext } from "react";

export interface ListingFilters {
    country?: string;
    city?: string;
    property_type?: string;
    price_per_night__lte?: number;
    price_per_night__gte?: number;
    max_guests__lte?: number;
    max_guests__gte?: number;
    check_in?: string;
    check_out?: string;
}

interface FilterContextType {
    filters: ListingFilters;
    setFilters: React.Dispatch<React.SetStateAction<ListingFilters>>;
}

export const FilterContext = createContext<FilterContextType | null>(null);

export const FilterContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFilters] = useState<ListingFilters>({});
    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
};


export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilterContext must be used within FilterContextProvider");
    }
    return context;
};
