import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FiPlus, FiMinus, FiUsers } from "react-icons/fi";

export interface GuestCounts {
    adults: number;
    children: number;
    infants: number;
    pets: number;
}

interface GuestSelectorProps {
    guests: GuestCounts;
    onGuestsChange: (guests: GuestCounts) => void;
    embedded?: boolean;
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
        <div className="flex items-center justify-between py-3">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{label}</span>
                <span className="text-xs text-gray-500">{description}</span>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDecrement();
                    }}
                    disabled={count <= minCount}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:border-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    <FiMinus className="w-3.5 h-3.5" />
                </button>

                <span className="w-6 text-center text-sm font-medium text-gray-900">
                    {count}
                </span>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onIncrement();
                    }}
                    disabled={count >= maxCount}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:border-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    <FiPlus className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export const GuestRowsContent: React.FC<{
    guests: GuestCounts;
    onGuestsChange: (guests: GuestCounts) => void;
}> = ({ guests, onGuestsChange }) => {
    const updateGuests = (field: keyof GuestCounts, delta: number) => {
        onGuestsChange({
            ...guests,
            [field]: Math.max(0, guests[field] + delta),
        });
    };

    return (
        <div className="divide-y divide-gray-100">
            <GuestRow
                label="Adults"
                description="Ages 13 or above"
                count={guests.adults}
                onIncrement={() => updateGuests("adults", 1)}
                onDecrement={() => updateGuests("adults", -1)}
                minCount={1}
                maxCount={16}
            />

            <GuestRow
                label="Children"
                description="Ages 2–12"
                count={guests.children}
                onIncrement={() => updateGuests("children", 1)}
                onDecrement={() => updateGuests("children", -1)}
                maxCount={15}
            />

            <GuestRow
                label="Infants"
                description="Under 2"
                count={guests.infants}
                onIncrement={() => updateGuests("infants", 1)}
                onDecrement={() => updateGuests("infants", -1)}
                maxCount={5}
            />

            <GuestRow
                label="Pets"
                description="Bringing a service animal?"
                count={guests.pets}
                onIncrement={() => updateGuests("pets", 1)}
                onDecrement={() => updateGuests("pets", -1)}
                maxCount={5}
            />

            {guests.pets > 0 && (
                <p className="pt-3 text-[11px] text-gray-500">
                    If you're bringing an assistance animal, you don't need to add them here.
                </p>
            )}
        </div>
    );
};

const GuestSelector: React.FC<GuestSelectorProps> = ({
    guests,
    onGuestsChange,
    embedded = false,
}) => {
    const totalGuests = guests.adults + guests.children;

    const getDisplayText = () => {
        const parts: string[] = [];

        if (totalGuests === 0 || (totalGuests === 1 && guests.infants === 0 && guests.pets === 0)) {
            return totalGuests === 1 ? "1 guest" : "Add guests";
        }

        parts.push(`${totalGuests} guests`);

        if (guests.infants > 0) {
            parts.push(guests.infants === 1 ? "1 infant" : `${guests.infants} infants`);
        }

        if (guests.pets > 0) {
            parts.push(guests.pets === 1 ? "1 pet" : `${guests.pets} pets`);
        }

        return parts.join(", ");
    };

    if (embedded) {
        return <GuestRowsContent guests={guests} onGuestsChange={onGuestsChange} />;
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="px-3.5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100/80 rounded-full transition-colors cursor-pointer max-w-[130px] truncate outline-none"
                    title={getDisplayText()}
                >
                    <span className="truncate">{getDisplayText()}</span>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    sideOffset={12}
                    align="end"
                    className="z-50 w-84 p-5 bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] text-gray-800 animate-in fade-in-0 zoom-in-95"
                >
                    <DropdownMenu.Label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                        <FiUsers className="w-3.5 h-3.5 text-brand" />
                        <span>Who's coming?</span>
                    </DropdownMenu.Label>

                    <GuestRowsContent guests={guests} onGuestsChange={onGuestsChange} />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default GuestSelector;
