import { handleAuthentication, handleLogout } from "./authApi.js";
import { renderUserProfile } from "./profileComponents.js";   // <-- add this

async function initApp() {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
        await handleAuthentication();
    } else {
        await renderUserProfile();
        handleLogout();
    }
}

document.addEventListener('DOMContentLoaded', initApp);