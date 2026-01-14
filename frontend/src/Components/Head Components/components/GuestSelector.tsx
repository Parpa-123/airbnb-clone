import React, { useState } from "react";
import { Popover, Box, Typography, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export interface GuestCounts {
    adults: number;
    children: number;
    infants: number;
    pets: number;
}

interface GuestSelectorProps {
    guests: GuestCounts;
    onGuestsChange: (guests: GuestCounts) => void;
}

interface GuestRowProps {
    label: string;
    description: string;
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    minCount?: number;
    maxCount?: number;
}

const GuestRow: React.FC<GuestRowProps> = ({
    label,
    description,
    count,
    onIncrement,
    onDecrement,
    minCount = 0,
    maxCount = 16,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
            }}
        >
            <Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#222" }}>
                    {label}
                </Typography>
                <Typography variant="body2" sx={{ color: "#717171" }}>
                    {description}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton
                    onClick={onDecrement}
                    disabled={count <= minCount}
                    sx={{
                        border: "1px solid",
                        borderColor: count <= minCount ? "#EBEBEB" : "#B0B0B0",
                        color: count <= minCount ? "#EBEBEB" : "#717171",
                        "&:hover": {
                            borderColor: "#222",
                            color: "#222",
                        },
                        width: 32,
                        height: 32,
                    }}
                    size="small"
                >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>

                <Typography
                    variant="body1"
                    sx={{
                        minWidth: 24,
                        textAlign: "center",
                        fontWeight: 500,
                    }}
                >
                    {count}
                </Typography>

                <IconButton
                    onClick={onIncrement}
                    disabled={count >= maxCount}
                    sx={{
                        border: "1px solid",
                        borderColor: count >= maxCount ? "#EBEBEB" : "#B0B0B0",
                        color: count >= maxCount ? "#EBEBEB" : "#717171",
                        "&:hover": {
                            borderColor: "#222",
                            color: "#222",
                        },
                        width: 32,
                        height: 32,
                    }}
                    size="small"
                >
                    <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>
        </Box>
    );
};

const GuestSelector: React.FC<GuestSelectorProps> = ({
    guests,
    onGuestsChange,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const updateGuests = (field: keyof GuestCounts, delta: number) => {
        onGuestsChange({
            ...guests,
            [field]: Math.max(0, guests[field] + delta),
        });
    };

    const open = Boolean(anchorEl);
    const id = open ? "guest-selector-popover" : undefined;

    const getDisplayText = () => {
        const parts: string[] = [];
        const totalGuests = guests.adults + guests.children;

        if (totalGuests === 0) {
            return "Add guests";
        }

        if (totalGuests === 1) {
            parts.push("1 guest");
        } else {
            parts.push(`${totalGuests} guests`);
        }

        if (guests.infants > 0) {
            parts.push(guests.infants === 1 ? "1 infant" : `${guests.infants} infants`);
        }

        if (guests.pets > 0) {
            parts.push(guests.pets === 1 ? "1 pet" : `${guests.pets} pets`);
        }

        return parts.join(", ");
    };

    return (
        <>
            <button
                aria-describedby={id}
                onClick={handleClick}
                className="px-6 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
                {getDisplayText()}
            </button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                disablePortal
                disableScrollLock
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            borderRadius: "24px",
                            boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                            width: 320,
                            overflow: "hidden",
                        },
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    {}
                    <GuestRow
                        label="Adults"
                        description="Ages 13 or above"
                        count={guests.adults}
                        onIncrement={() => updateGuests("adults", 1)}
                        onDecrement={() => updateGuests("adults", -1)}
                        minCount={1}
                        maxCount={16}
                    />

                    <Divider />

                    {}
                    <GuestRow
                        label="Children"
                        description="Ages 2–12"
                        count={guests.children}
                        onIncrement={() => updateGuests("children", 1)}
                        onDecrement={() => updateGuests("children", -1)}
                        maxCount={15}
                    />

                    <Divider />

                    {}
                    <GuestRow
                        label="Infants"
                        description="Under 2"
                        count={guests.infants}
                        onIncrement={() => updateGuests("infants", 1)}
                        onDecrement={() => updateGuests("infants", -1)}
                        maxCount={5}
                    />

                    <Divider />

                    {}
                    <GuestRow
                        label="Pets"
                        description="Bringing a service animal?"
                        count={guests.pets}
                        onIncrement={() => updateGuests("pets", 1)}
                        onDecrement={() => updateGuests("pets", -1)}
                        maxCount={5}
                    />

                    {}
                    {guests.pets > 0 && (
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mt: 2,
                                color: "#717171",
                                fontSize: "12px",
                            }}
                        >
                            If you're bringing a service animal, you don't need to add them here.
                        </Typography>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default GuestSelector;
