import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
const AuthDropdown = () => {
    const { user, logout, delegatedUser } = useAuth(); // Dodajemy delegatedUser z kontekstu
    const navigate = useNavigate();
    const handleLogin = () => navigate("/login");
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    const handleOpenDelegatedProfile = () => {
        // Możesz dostosować tę funkcję według potrzeb - np. otworzenie modala, przejście do profilu itp.
        console.log("Otwieranie profilu delegowanego użytkownika:", delegatedUser);
        // navigate(`/profile/${delegatedUser?.id}`);
        // lub otworzenie modala:
        // setShowDelegatedModal(true);
    };
    if (!user) {
        return (_jsx("button", { onClick: handleLogin, className: "btn btn-sm btn-primary", children: "Zaloguj" }));
    }
    // Główny użytkownik do wyświetlenia (delegowany lub zwykły)
    const displayUser = delegatedUser || user;
    const isDelegated = !!delegatedUser;
    return (_jsxs("div", { className: "dropdown dropdown-end", children: [_jsx("label", { tabIndex: 0, className: "avatar avatar-placeholder cursor-pointer", children: _jsx("div", { className: "w-10 h-10 rounded-full bg-neutral-300 text-primary-content flex items-center justify-center font-semibold", children: displayUser.email.charAt(0).toUpperCase() }) }), _jsxs("ul", { tabIndex: 0, className: "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 mt-2", children: [isDelegated && (_jsxs(_Fragment, { children: [_jsx("li", { className: "menu-title", children: _jsx("span", { className: "text-warning font-semibold", children: "\uD83D\uDD04 Delegowany dost\u0119p" }) }), _jsx("li", { children: _jsxs("button", { onClick: handleOpenDelegatedProfile, className: "justify-between hover:bg-base-200", children: [_jsxs("div", { className: "flex flex-col items-start", children: [_jsx("span", { className: "font-semibold break-words text-sm", children: delegatedUser.email }), _jsxs("span", { className: "text-xs opacity-70", children: ["Rola: ", delegatedUser.role] })] }), _jsx("span", { className: "text-xs", children: "\uD83D\uDC41\uFE0F" })] }) }), _jsx("div", { className: "divider my-1" }), _jsx("li", { className: "menu-title", children: _jsx("span", { className: "text-xs opacity-60", children: "Twoje konto:" }) })] })), _jsx("li", { children: _jsx("span", { className: "font-semibold break-words", children: isDelegated ? user.email : displayUser.email }) }), _jsx("li", { children: _jsxs("span", { children: ["Rola: ", isDelegated ? user.role : displayUser.role] }) }), _jsx("div", { className: "divider my-1" }), _jsx("li", { children: _jsx("button", { onClick: handleLogout, className: "w-full text-left text-error", children: "Wyloguj" }) })] })] }));
};
export default AuthDropdown;
