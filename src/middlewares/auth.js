const adminAuth = (req, res, next) => {
    console.log('Checking admin authentication...');
    const token = "valid-token";
    const IsAuthnticated = token === "valid-token";
    if (IsAuthnticated) {
        console.log("Admin authenticated successfully.");
        next(); // Call the next middleware or route handler
    } else {
        res.status(401).send("Unauthorized: Admin authentication failed.");
    }
}
const userAuth = (req, res, next) => {
    console.log('Checking admin authentication...');
    const token = "valid-token";
    const IsAuthnticated = token === "valid-token";
    if (IsAuthnticated) {
        console.log("Admin authenticated successfully.");
        next(); // Call the next middleware or route handler
    } else {
        res.status(401).send("Unauthorized: Admin authentication failed.");
    }
}
module.exports = {
    adminAuth,
    userAuth
}