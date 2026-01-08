import { Outlet, NavLink } from "react-router-dom";

const Booking: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Fixed left sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h2>

                    <nav className="space-y-2">
                        <NavLink
                            to="overview"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-[#FF385C] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Overview
                        </NavLink>

                        <NavLink
                            to="upcoming"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-[#FF385C] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Upcoming Trips
                        </NavLink>

                        <NavLink
                            to="past"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-[#FF385C] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Past Trips
                        </NavLink>

                        <NavLink
                            to="cancelled"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-[#FF385C] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            Cancelled
                        </NavLink>
                    </nav>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {/* This is where nested routes will render */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Booking;
