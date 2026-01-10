import { Outlet, NavLink } from "react-router-dom";

const navItems = [
    { path: "overview", label: "Overview" },
    { path: "upcoming", label: "Upcoming Trips" },
    { path: "past", label: "Past Trips" },
];

const Booking: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile/Tablet Navigation - visible only below lg breakpoint */}
            <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Bookings</h2>

                    <nav className="flex flex-row gap-2 flex-wrap">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${isActive
                                        ? "bg-[#FF385C] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop Sidebar - hidden on mobile/tablet, visible on lg+ */}
            <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h2>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                        ? "bg-[#FF385C] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 lg:p-8">
                    {/* This is where nested routes will render */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Booking;
