import { setUintIfDifferent } from "../utils/dataStore";
import { hashString } from "../utils/hash";
import { decimalToFloat } from "../utils/math";
import { createDeployFunction } from "../utils/deploy";

const constructorContracts = ["RoleStore"];

const func = createDeployFunction({
  contractName: "DataStore",
  dependencyNames: constructorContracts,
  getDeployArgs: async ({ dependencyContracts }) => {
    return constructorContracts.map((dependencyName) => dependencyContracts[dependencyName].address);
  },
  libraryNames: ["GasUtils", "OrderUtils", "AdlUtils", "PositionStoreUtils", "OrderStoreUtils"],
  afterDeploy: async () => {
    await setUintIfDifferent(hashString("MAX_LEVERAGE"), decimalToFloat(100), "max leverage");
  },
});

export default func;
