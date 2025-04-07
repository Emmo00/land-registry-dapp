const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const { ADMIN_PUBLIC_KEY} = process.env;

module.exports = buildModule("LandRegistry", (m) => {
    // set admin public key
    const adminPublicKey = m.getParameter("adminPublicKey", ADMIN_PUBLIC_KEY);

    // deploy contract
    const landRegistry = m.contract("LandRegistry", [adminPublicKey]);

    // return deployed contract
    return { landRegistry };
})
