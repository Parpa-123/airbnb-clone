import { toast } from "react-toastify";
import axiosInstance from "../../public/connect";
import { useState } from "react";

interface OptionsResponse {
    property_options: { value: string; label: string }[];
    amenities: { value: string; label: string }[];
    bedroom_options: { value: string; label: string }[];
    guest_options: { value: string; label: string }[];
    bathroom_options: { value: string; label: string }[];
    bed_options: { value: string; label: string }[];
    country_options?: { value: string; label: string }[];
    city_options?: { value: string; label: string }[];
}

const useOptionsService = () => {
    const [options, setOptions] = useState<OptionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOptions = async (): Promise<OptionsResponse> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get<OptionsResponse>(
                "listings/choices/form-option/"
            );

            // Set the fetched data
            setOptions(response.data);

            setLoading(false);
            return response.data;

        } catch (err: any) {
            toast.info(String(err));
            throw err;
        }
    };

    return {
        options,
        loading,
        error,
        fetchOptions,
    };
};

export default useOptionsService;
