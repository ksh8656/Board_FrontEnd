export const getAuthHeader = () => {
    const token = localStorage.getItem("bbs_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};
