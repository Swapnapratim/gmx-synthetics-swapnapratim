import { BigNumberish, ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { expandDecimals, decimalToFloat } from "../utils/math";
import { hashString } from "../utils/hash";

export type BaseMarketConfig = {
  reserveFactorLongs: BigNumberish;
  reserveFactorShorts: BigNumberish;

  openInterestReserveFactorLongs: BigNumberish;
  openInterestReserveFactorShorts: BigNumberish;

  minCollateralFactor: BigNumberish;
  minCollateralFactorForOpenInterestMultiplierLong: BigNumberish;
  minCollateralFactorForOpenInterestMultiplierShort: BigNumberish;

  maxLongTokenPoolAmount: BigNumberish;
  maxShortTokenPoolAmount: BigNumberish;

  maxLongTokenPoolAmountForDeposit: BigNumberish;
  maxShortTokenPoolAmountForDeposit: BigNumberish;

  maxOpenInterestForLongs: BigNumberish;
  maxOpenInterestForShorts: BigNumberish;

  maxPnlFactorForTradersLongs: BigNumberish;
  maxPnlFactorForTradersShorts: BigNumberish;

  maxPnlFactorForAdlLongs: BigNumberish;
  maxPnlFactorForAdlShorts: BigNumberish;

  minPnlFactorAfterAdlLongs: BigNumberish;
  minPnlFactorAfterAdlShorts: BigNumberish;

  maxPnlFactorForDepositsLongs: BigNumberish;
  maxPnlFactorForDepositsShorts: BigNumberish;

  maxPnlFactorForWithdrawalsLongs: BigNumberish;
  maxPnlFactorForWithdrawalsShorts: BigNumberish;

  positionFeeFactorForPositiveImpact: BigNumberish;
  positionFeeFactorForNegativeImpact: BigNumberish;

  negativePositionImpactFactor: BigNumberish;
  positivePositionImpactFactor: BigNumberish;
  positionImpactExponentFactor: BigNumberish;

  negativeMaxPositionImpactFactor: BigNumberish;
  positiveMaxPositionImpactFactor: BigNumberish;
  maxPositionImpactFactorForLiquidations: BigNumberish;

  swapFeeFactorForPositiveImpact: BigNumberish;
  swapFeeFactorForNegativeImpact: BigNumberish;

  negativeSwapImpactFactor: BigNumberish;
  positiveSwapImpactFactor: BigNumberish;
  swapImpactExponentFactor: BigNumberish;

  minCollateralUsd: BigNumberish;

  borrowingFactorForLongs: BigNumberish;
  borrowingFactorForShorts: BigNumberish;

  borrowingExponentFactorForLongs: BigNumberish;
  borrowingExponentFactorForShorts: BigNumberish;

  fundingFactor: BigNumberish;
  fundingExponentFactor: BigNumberish;
  fundingIncreaseFactorPerSecond: BigNumberish;
  fundingDecreaseFactorPerSecond: BigNumberish;
  thresholdForStableFunding: BigNumberish;
  thresholdForDecreaseFunding: BigNumberish;
  minFundingFactorPerSecond: BigNumberish;
  maxFundingFactorPerSecond: BigNumberish;

  positionImpactPoolDistributionRate: BigNumberish;
  minPositionImpactPoolAmount: BigNumberish;

  virtualMarketId?: string;
  virtualTokenIdForIndexToken?: string;

  isDisabled?: boolean;
};

export type SpotMarketConfig = Partial<BaseMarketConfig> & {
  tokens: {
    longToken: string;
    shortToken: string;
    indexToken?: never;
  };
  swapOnly: true;
};

export type PerpMarketConfig = Partial<BaseMarketConfig> & {
  tokens: {
    indexToken: string;
    longToken: string;
    shortToken: string;
  };
  swapOnly?: never;
};

export type MarketConfig = SpotMarketConfig | PerpMarketConfig;

const baseMarketConfig: BaseMarketConfig = {
  minCollateralFactor: decimalToFloat(1, 2), // 1%

  minCollateralFactorForOpenInterestMultiplierLong: 0,
  minCollateralFactorForOpenInterestMultiplierShort: 0,

  maxLongTokenPoolAmount: expandDecimals(1_000_000_000, 18),
  maxShortTokenPoolAmount: expandDecimals(1_000_000_000, 18),

  maxLongTokenPoolAmountForDeposit: expandDecimals(1_000_000_000, 18),
  maxShortTokenPoolAmountForDeposit: expandDecimals(1_000_000_000, 18),

  maxOpenInterestForLongs: decimalToFloat(1_000_000_000),
  maxOpenInterestForShorts: decimalToFloat(1_000_000_000),

  reserveFactorLongs: decimalToFloat(90, 2), // 90%,
  reserveFactorShorts: decimalToFloat(90, 2), // 90%,

  openInterestReserveFactorLongs: decimalToFloat(8, 1), // 80%,
  openInterestReserveFactorShorts: decimalToFloat(8, 1), // 80%,

  maxPnlFactorForTradersLongs: decimalToFloat(8, 1), // 80%
  maxPnlFactorForTradersShorts: decimalToFloat(8, 1), // 80%

  maxPnlFactorForAdlLongs: decimalToFloat(1, 0), // 100%, no ADL until normal operation
  maxPnlFactorForAdlShorts: decimalToFloat(1, 0), // 100%, no ADL until normal operation

  minPnlFactorAfterAdlLongs: decimalToFloat(8, 1), // 80%, no ADL until normal operation
  minPnlFactorAfterAdlShorts: decimalToFloat(8, 1), // 80%, no ADL until normal operation

  maxPnlFactorForDepositsLongs: decimalToFloat(8, 1), // 80%
  maxPnlFactorForDepositsShorts: decimalToFloat(8, 1), // 80%

  maxPnlFactorForWithdrawalsLongs: decimalToFloat(8, 1), // 80%
  maxPnlFactorForWithdrawalsShorts: decimalToFloat(8, 1), // 80%

  positionFeeFactorForPositiveImpact: decimalToFloat(5, 4), // 0.05%
  positionFeeFactorForNegativeImpact: decimalToFloat(7, 4), // 0.07%

  negativePositionImpactFactor: decimalToFloat(1, 7), // 0.00001%
  positivePositionImpactFactor: decimalToFloat(5, 8), // 0.000005%
  positionImpactExponentFactor: decimalToFloat(2, 0), // 2

  negativeMaxPositionImpactFactor: decimalToFloat(1, 2), // 1%
  positiveMaxPositionImpactFactor: decimalToFloat(1, 2), // 1%
  maxPositionImpactFactorForLiquidations: decimalToFloat(1, 2), // 1%

  swapFeeFactorForPositiveImpact: decimalToFloat(5, 4), // 0.05%,
  swapFeeFactorForNegativeImpact: decimalToFloat(7, 4), // 0.07%,

  negativeSwapImpactFactor: decimalToFloat(1, 5), // 0.001%
  positiveSwapImpactFactor: decimalToFloat(5, 6), // 0.0005%
  swapImpactExponentFactor: decimalToFloat(2, 0), // 2

  minCollateralUsd: decimalToFloat(1, 0), // 1 USD

  // factor in open interest reserve factor 80%
  borrowingFactorForLongs: decimalToFloat(625, 11), // 0.00000000625 * 80% = 0.000000005, 0.0000005% / second, 15.77% per year if the pool is 100% utilized
  borrowingFactorForShorts: decimalToFloat(625, 11), // 0.00000000625 * 80% = 0.000000005, 0.0000005% / second, 15.77% per year if the pool is 100% utilized

  borrowingExponentFactorForLongs: decimalToFloat(1),
  borrowingExponentFactorForShorts: decimalToFloat(1),

  fundingFactor: decimalToFloat(2, 8), // ~63% per year for a 100% skew
  fundingExponentFactor: decimalToFloat(1),

  fundingIncreaseFactorPerSecond: 0,
  fundingDecreaseFactorPerSecond: 0,
  thresholdForStableFunding: 0,
  thresholdForDecreaseFunding: 0,
  minFundingFactorPerSecond: 0,
  maxFundingFactorPerSecond: 0,

  positionImpactPoolDistributionRate: 0,
  minPositionImpactPoolAmount: 0,
};

const synthethicMarketConfig: Partial<BaseMarketConfig> = {
  reserveFactorLongs: decimalToFloat(8, 1), // 80%,
  reserveFactorShorts: decimalToFloat(8, 1), // 80%,

  openInterestReserveFactorLongs: decimalToFloat(7, 1), // 70%,
  openInterestReserveFactorShorts: decimalToFloat(7, 1), // 70%,

  maxPnlFactorForTradersLongs: decimalToFloat(5, 1), // 50%
  maxPnlFactorForTradersShorts: decimalToFloat(5, 1), // 50%

  maxPnlFactorForAdlLongs: decimalToFloat(45, 2), // 45%
  maxPnlFactorForAdlShorts: decimalToFloat(45, 2), // 45%

  minPnlFactorAfterAdlLongs: decimalToFloat(4, 1), // 40%
  minPnlFactorAfterAdlShorts: decimalToFloat(4, 1), // 40%

  maxPnlFactorForDepositsLongs: decimalToFloat(6, 1), // 60%
  maxPnlFactorForDepositsShorts: decimalToFloat(6, 1), // 60%

  maxPnlFactorForWithdrawalsLongs: decimalToFloat(3, 1), // 30%
  maxPnlFactorForWithdrawalsShorts: decimalToFloat(3, 1), // 30%
};

const stablecoinSwapMarketConfig: Partial<SpotMarketConfig> = {
  swapOnly: true,

  swapFeeFactorForPositiveImpact: decimalToFloat(1, 4), // 0.01%,
  swapFeeFactorForNegativeImpact: decimalToFloat(1, 4), // 0.01%,

  negativeSwapImpactFactor: decimalToFloat(5, 10), // 0.01% for 200,000 USD of imbalance
  positiveSwapImpactFactor: decimalToFloat(5, 10), // 0.01% for 200,000 USD of imbalance
};

const hardhatBaseMarketConfig: Partial<BaseMarketConfig> = {
  reserveFactorLongs: decimalToFloat(5, 1), // 50%,
  reserveFactorShorts: decimalToFloat(5, 1), // 50%,

  openInterestReserveFactorLongs: decimalToFloat(5, 1), // 50%,
  openInterestReserveFactorShorts: decimalToFloat(5, 1), // 50%,

  minCollateralFactor: decimalToFloat(1, 2), // 1%

  minCollateralFactorForOpenInterestMultiplierLong: 0,
  minCollateralFactorForOpenInterestMultiplierShort: 0,

  maxLongTokenPoolAmount: expandDecimals(1 * 1000 * 1000 * 1000, 18),
  maxShortTokenPoolAmount: expandDecimals(1 * 1000 * 1000 * 1000, 18),

  maxLongTokenPoolAmountForDeposit: expandDecimals(1 * 1000 * 1000 * 1000, 18),
  maxShortTokenPoolAmountForDeposit: expandDecimals(1 * 1000 * 1000 * 1000, 18),

  maxOpenInterestForLongs: decimalToFloat(1 * 1000 * 1000 * 1000),
  maxOpenInterestForShorts: decimalToFloat(1 * 1000 * 1000 * 1000),

  maxPnlFactorForTradersLongs: decimalToFloat(5, 1), // 50%
  maxPnlFactorForTradersShorts: decimalToFloat(5, 1), // 50%

  maxPnlFactorForAdlLongs: decimalToFloat(45, 2), // 45%
  maxPnlFactorForAdlShorts: decimalToFloat(45, 2), // 45%

  minPnlFactorAfterAdlLongs: decimalToFloat(4, 1), // 40%
  minPnlFactorAfterAdlShorts: decimalToFloat(4, 1), // 40%

  maxPnlFactorForDepositsLongs: decimalToFloat(6, 1), // 60%
  maxPnlFactorForDepositsShorts: decimalToFloat(6, 1), // 60%

  maxPnlFactorForWithdrawalsLongs: decimalToFloat(3, 1), // 30%
  maxPnlFactorForWithdrawalsShorts: decimalToFloat(3, 1), // 30%

  positiveMaxPositionImpactFactor: decimalToFloat(2, 2), // 2%
  negativeMaxPositionImpactFactor: decimalToFloat(2, 2), // 2%
  maxPositionImpactFactorForLiquidations: decimalToFloat(1, 2), // 1%
};

const config: {
  [network: string]: MarketConfig[];
} = {
  arbitrum: [
    {
      tokens: { indexToken: "BTC", longToken: "WBTC.e", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:BTC/USD"),
      virtualMarketId: hashString("SPOT:BTC/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(1300, 8),
      maxShortTokenPoolAmount: expandDecimals(45_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(1300, 8),
      maxShortTokenPoolAmountForDeposit: expandDecimals(45_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(2, 10), // 0.05% for 2,500,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(2, 10), // 0.05% for 2,500,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 50,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 10),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 10),

      maxOpenInterestForLongs: decimalToFloat(64_000_000),
      maxOpenInterestForShorts: decimalToFloat(64_000_000),
    },
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:ETH/USD"),
      virtualMarketId: hashString("SPOT:ETH/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(18_660, 18),
      maxShortTokenPoolAmount: expandDecimals(35_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(18_6600, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(35_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for 4,166,667 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for 4,166,667 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(2, 10), // 0.05% for 2,500,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(2, 10), // 0.05% for 2,500,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 50,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 10),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 10),

      maxOpenInterestForLongs: decimalToFloat(64_000_000),
      maxOpenInterestForShorts: decimalToFloat(64_000_000),
    },
    {
      tokens: { indexToken: "XRP", longToken: "WETH", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:XRP/USD"),
      virtualMarketId: hashString("SPOT:XRP/USD"),

      ...baseMarketConfig,
      ...synthethicMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(800, 18),
      maxShortTokenPoolAmount: expandDecimals(1_500_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(800, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_500_000, 6),

      negativePositionImpactFactor: decimalToFloat(28, 9),
      positivePositionImpactFactor: decimalToFloat(14, 9),

      // the swap impact factor is for WETH-stablecoin swaps
      negativeSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 5,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 9),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 9),

      // factor in open interest reserve factor 50%
      borrowingFactorForLongs: decimalToFloat(15, 9), // 0.000000015 * 50% =  0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(15, 9), // 0,000000015 * 50% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      positionImpactPoolDistributionRate: expandDecimals(811, 30), // ~70 XRP/day
      minPositionImpactPoolAmount: expandDecimals(64, 6),

      maxOpenInterestForLongs: decimalToFloat(1_000_000),
      maxOpenInterestForShorts: decimalToFloat(1_000_000),
    },
    {
      tokens: { indexToken: "DOGE", longToken: "WETH", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:DOGE/USD"),
      virtualMarketId: hashString("SPOT:DOGE/USD"),

      ...baseMarketConfig,
      ...synthethicMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(800, 18),
      maxShortTokenPoolAmount: expandDecimals(1_500_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(800, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_500_000, 6),

      negativePositionImpactFactor: decimalToFloat(26, 9),
      positivePositionImpactFactor: decimalToFloat(13, 9),

      // the swap impact factor is for WETH-stablecoin swaps
      negativeSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 2,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(5, 9),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(5, 9),

      // factor in open interest reserve factor 50%
      borrowingFactorForLongs: decimalToFloat(15, 9), // 0.000000015 * 50% =  0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(15, 9), // 0,000000015 * 50% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      positionImpactPoolDistributionRate: expandDecimals(53, 34), // ~458 DOGE/day
      minPositionImpactPoolAmount: expandDecimals(756, 8),

      maxOpenInterestForLongs: decimalToFloat(1_000_000),
      maxOpenInterestForShorts: decimalToFloat(1_000_000),
    },
    {
      tokens: { indexToken: "SOL", longToken: "SOL", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:SOL/USD"),
      virtualMarketId: hashString("SPOT:SOL/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(65_000, 9),
      maxShortTokenPoolAmount: expandDecimals(2_500_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(65_000, 9),
      maxShortTokenPoolAmountForDeposit: expandDecimals(2_500_000, 6),

      negativePositionImpactFactor: decimalToFloat(76, 10),
      positivePositionImpactFactor: decimalToFloat(38, 10),

      negativeSwapImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 2,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(5, 9),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(5, 9),

      // factor in open interest reserve factor 80%
      borrowingFactorForLongs: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      positionImpactPoolDistributionRate: expandDecimals(11, 34), // ~9.5 SOL/day
      minPositionImpactPoolAmount: expandDecimals(100, 9),

      maxOpenInterestForLongs: decimalToFloat(2_000_000),
      maxOpenInterestForShorts: decimalToFloat(2_000_000),
    },
    {
      tokens: { indexToken: "LTC", longToken: "WETH", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:LTC/USD"),
      virtualMarketId: hashString("SPOT:LTC/USD"),

      ...baseMarketConfig,
      ...synthethicMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(800, 18),
      maxShortTokenPoolAmount: expandDecimals(1_500_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(800, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_500_000, 6),

      negativePositionImpactFactor: decimalToFloat(36, 9),
      positivePositionImpactFactor: decimalToFloat(18, 9),

      // the swap impact factor is for WETH-stablecoin swaps
      negativeSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 4,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(25, 10),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(25, 10),

      // factor in open interest reserve factor 50%
      borrowingFactorForLongs: decimalToFloat(15, 9), // 0.000000015 * 50% =  0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(15, 9), // 0,000000015 * 50% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      positionImpactPoolDistributionRate: expandDecimals(266, 30), // ~0.22 LTC/day
      minPositionImpactPoolAmount: expandDecimals(39, 6), // 0.39 LTC

      maxOpenInterestForLongs: decimalToFloat(1_000_000),
      maxOpenInterestForShorts: decimalToFloat(1_000_000),
    },
    {
      tokens: { indexToken: "UNI", longToken: "UNI", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:UNI/USD"),
      virtualMarketId: hashString("SPOT:UNI/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(300_000, 18),
      maxShortTokenPoolAmount: expandDecimals(1_500_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(300_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_500_000, 6),

      negativePositionImpactFactor: decimalToFloat(42, 9),
      positivePositionImpactFactor: decimalToFloat(21, 9),

      negativeSwapImpactFactor: decimalToFloat(3, 8), // 0.05% for 16,667 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(15, 9), // 0.05% for 33,333 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 250,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(4, 8),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(4, 8),

      // factor in open interest reserve factor 80%
      borrowingFactorForLongs: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      positionImpactPoolDistributionRate: expandDecimals(70, 43), // ~60 UNI/day
      minPositionImpactPoolAmount: expandDecimals(132, 18),

      maxOpenInterestForLongs: decimalToFloat(1_000_000),
      maxOpenInterestForShorts: decimalToFloat(1_000_000),
    },
    {
      tokens: { indexToken: "LINK", longToken: "LINK", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:LINK/USD"),
      virtualMarketId: hashString("SPOT:LINK/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(260_000, 18),
      maxShortTokenPoolAmount: expandDecimals(3_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(260_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(3_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 1,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(1, 8),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(1, 8),

      // factor in open interest reserve factor 80%
      borrowingFactorForLongs: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      positionImpactPoolDistributionRate: expandDecimals(167, 43), // ~144 LINK/day
      minPositionImpactPoolAmount: expandDecimals(700, 18),

      maxOpenInterestForLongs: decimalToFloat(2_000_000),
      maxOpenInterestForShorts: decimalToFloat(2_000_000),
    },
    {
      tokens: { indexToken: "ARB", longToken: "ARB", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:ARB/USD"),
      virtualMarketId: hashString("SPOT:ARB/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(4_600_000, 18),
      maxShortTokenPoolAmount: expandDecimals(5_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(4_600_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(5_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 1,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(1, 8),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(1, 8),

      // factor in open interest reserve factor 80%
      borrowingFactorForLongs: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23,65% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(94, 10), // 0.0000000094 * 80% = 0.0000000075, 0.00000075% / second, 23.65% per year if the pool is 100% utilized

      fundingIncreaseFactorPerSecond: decimalToFloat(1, 12), // 0.000000000001, at least 5.5 hours to reach max funding
      fundingDecreaseFactorPerSecond: decimalToFloat(0), // not applicable if thresholdForDecreaseFunding = 0
      minFundingFactorPerSecond: decimalToFloat(3, 10), // 0.00000003%, 0.000108% per hour, 0.95% per year
      maxFundingFactorPerSecond: decimalToFloat(2, 8), // 0.000002%,  0.0072% per hour, 63% per year
      thresholdForStableFunding: decimalToFloat(5, 2), // 5%
      thresholdForDecreaseFunding: decimalToFloat(0), // 0%

      positionImpactPoolDistributionRate: expandDecimals(176, 44), // ~1526 ARB/day
      minPositionImpactPoolAmount: expandDecimals(6200, 18),

      maxOpenInterestForLongs: decimalToFloat(3_000_000),
      maxOpenInterestForShorts: decimalToFloat(3_000_000),
    },
    {
      tokens: { longToken: "USDC", shortToken: "USDC.e" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),

      negativeSwapImpactFactor: decimalToFloat(15, 10), // 0.01% for 66,667 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(15, 10), // 0.01% for 66,667 USD of imbalance

      swapFeeFactorForPositiveImpact: decimalToFloat(5, 5), // 0.005%,
      swapFeeFactorForNegativeImpact: decimalToFloat(2, 4), // 0.02%,
    },
    {
      tokens: { longToken: "USDC", shortToken: "USDT" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),

      negativeSwapImpactFactor: decimalToFloat(5, 9), // 0.01% for 20,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.01% for 20,000 USD of imbalance

      swapFeeFactorForPositiveImpact: decimalToFloat(5, 5), // 0.005%,
      swapFeeFactorForNegativeImpact: decimalToFloat(2, 4), // 0.02%,
    },
    {
      tokens: { longToken: "USDC", shortToken: "DAI" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 18),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 18),

      negativeSwapImpactFactor: decimalToFloat(5, 9), // 0.01% for 20,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.01% for 20,000 USD of imbalance

      swapFeeFactorForPositiveImpact: decimalToFloat(5, 5), // 0.005%,
      swapFeeFactorForNegativeImpact: decimalToFloat(2, 4), // 0.02%,
    },
  ],
  avalanche: [
    {
      tokens: { indexToken: "BTC.b", longToken: "BTC.b", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:BTC/USD"),
      virtualMarketId: hashString("SPOT:BTC/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(350, 8),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(350, 8),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 50,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 10),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 10),
    },
    {
      tokens: { indexToken: "WETH.e", longToken: "WETH.e", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:ETH/USD"),
      virtualMarketId: hashString("SPOT:ETH/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(5000, 18),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(5000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(12, 11), // 0.05% for ~4,200,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 50,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 10),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 10),
    },
    {
      tokens: { indexToken: "XRP", longToken: "WAVAX", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:XRP/USD"),
      virtualMarketId: hashString("SPOT:XRP/USD"),

      ...baseMarketConfig,
      ...synthethicMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(75_000, 18),
      maxShortTokenPoolAmount: expandDecimals(1_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(75_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      // the swap impact factor is for WAVAX-stablecoin swaps
      negativeSwapImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 5,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 9),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 9),
    },
    {
      tokens: { indexToken: "DOGE", longToken: "WAVAX", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:DOGE/USD"),
      virtualMarketId: hashString("SPOT:DOGE/USD"),

      ...baseMarketConfig,
      ...synthethicMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(75_000, 18),
      maxShortTokenPoolAmount: expandDecimals(1_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(75_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      // the swap impact factor is for WAVAX-stablecoin swaps
      negativeSwapImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 2,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(5, 9),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(5, 9),
    },
    {
      tokens: { indexToken: "SOL", longToken: "SOL", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:SOL/USD"),
      virtualMarketId: hashString("SPOT:SOL/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(50_000, 9),
      maxShortTokenPoolAmount: expandDecimals(1_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(50_000, 9),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 2,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(5, 9),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(5, 9),
    },
    {
      tokens: { indexToken: "LTC", longToken: "WAVAX", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:LTC/USD"),
      virtualMarketId: hashString("SPOT:LTC/USD"),

      ...baseMarketConfig,
      ...synthethicMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(75_000, 18),
      maxShortTokenPoolAmount: expandDecimals(1_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(75_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(8, 9), // 0.05% for 62,500 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(4, 9), // 0.05% for 125,000 USD of imbalance

      // the swap impact factor is for WAVAX-stablecoin swaps
      negativeSwapImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 4,000,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(25, 10),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(25, 10),
    },
    {
      tokens: { indexToken: "WAVAX", longToken: "WAVAX", shortToken: "USDC" },
      virtualTokenIdForIndexToken: hashString("PERP:AVAX/USD"),
      virtualMarketId: hashString("SPOT:AVAX/USD"),

      ...baseMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(200_000, 18),
      maxShortTokenPoolAmount: expandDecimals(1_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(200_000, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(1_000_000, 6),

      negativePositionImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positivePositionImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      negativeSwapImpactFactor: decimalToFloat(1, 8), // 0.05% for 50,000 USD of imbalance
      positiveSwapImpactFactor: decimalToFloat(5, 9), // 0.05% for 100,000 USD of imbalance

      // minCollateralFactor of 0.01 (1%) when open interest is 500,000 USD
      minCollateralFactorForOpenInterestMultiplierLong: decimalToFloat(2, 8),
      minCollateralFactorForOpenInterestMultiplierShort: decimalToFloat(2, 8),

      fundingIncreaseFactorPerSecond: decimalToFloat(1, 12), // 0.000000000001, at least 5.5 hours to reach max funding
      fundingDecreaseFactorPerSecond: decimalToFloat(0), // not applicable if thresholdForDecreaseFunding = 0
      minFundingFactorPerSecond: decimalToFloat(3, 10), // 0.00000003%, 0.000108% per hour, 0.95% per year
      maxFundingFactorPerSecond: decimalToFloat(2, 8), // 0.000002%,  0.0072% per hour, 63% per year
      thresholdForStableFunding: decimalToFloat(5, 2), // 5%
      thresholdForDecreaseFunding: decimalToFloat(0), // 0%
    },
    {
      tokens: { longToken: "USDC", shortToken: "USDT.e" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
    },
    {
      tokens: { longToken: "USDC", shortToken: "USDC.e" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
    },
    {
      tokens: { longToken: "USDT", shortToken: "USDT.e" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
    },
    {
      tokens: { longToken: "USDC", shortToken: "DAI.e" },

      ...baseMarketConfig,
      ...stablecoinSwapMarketConfig,

      maxLongTokenPoolAmount: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmount: expandDecimals(10_000_000, 18),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10_000_000, 6),
      maxShortTokenPoolAmountForDeposit: expandDecimals(10_000_000, 18),
    },
  ],
  arbitrumGoerli: [
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "USDC" },
      virtualMarketId: "0x04533437e2e8ae1c70c421e7a0dd36e023e0d6217198f889f9eb9c2a6727481d",

      fundingIncreaseFactorPerSecond: decimalToFloat(1, 11), // 0.000000001% per second,  0,0000036% per hour
      fundingDecreaseFactorPerSecond: decimalToFloat(5, 12), // 0.0000000005% per second, 0,0000018% per hour
      minFundingFactorPerSecond: decimalToFloat(1, 9), // 0,0000001% per second, 0.00036% per hour
      maxFundingFactorPerSecond: decimalToFloat(3, 8), // 0,000003% per second,  0,0108% per hour

      thresholdForStableFunding: decimalToFloat(5, 2), // 5%
      thresholdForDecreaseFunding: decimalToFloat(2, 2), // 2%
    },
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "DAI" },
      virtualMarketId: ethers.constants.HashZero,
    },
    { tokens: { indexToken: "WETH", longToken: "USDC", shortToken: "USDC" } },
    { tokens: { indexToken: "BTC", longToken: "WBTC", shortToken: "USDC" } },
    {
      tokens: { indexToken: "WBTC", longToken: "WBTC", shortToken: "USDC" },
      virtualMarketId: "0x11111137e2e8ae1c70c421e7a0dd36e023e0d6217198f889f9eb9c2a6727481f",
      virtualTokenIdForIndexToken: "0x04533137e2e8ae1c11111111a0dd36e023e0d6217198f889f9eb9c2a6727481d",
      positionImpactPoolDistributionRate: expandDecimals(1, 30), // 1 sat per second

      negativePositionImpactFactor: decimalToFloat(1, 9),
      positivePositionImpactFactor: decimalToFloat(5, 10),
      negativeSwapImpactFactor: decimalToFloat(1, 7),
      positiveSwapImpactFactor: decimalToFloat(5, 8),
    },
    {
      tokens: { indexToken: "WBTC", longToken: "WBTC", shortToken: "DAI" },

      negativePositionImpactFactor: decimalToFloat(1, 9),
      positivePositionImpactFactor: decimalToFloat(5, 10),
      negativeSwapImpactFactor: decimalToFloat(1, 7),
      positiveSwapImpactFactor: decimalToFloat(5, 8),
    },
    {
      tokens: { indexToken: "SOL", longToken: "WBTC", shortToken: "USDC" },
      isDisabled: false,

      negativePositionImpactFactor: decimalToFloat(1, 9),
      positivePositionImpactFactor: decimalToFloat(5, 10),
      negativeSwapImpactFactor: decimalToFloat(1, 7),
      positiveSwapImpactFactor: decimalToFloat(5, 8),
    },
    {
      tokens: { longToken: "USDC", shortToken: "USDT" },
      swapOnly: true,

      negativeSwapImpactFactor: decimalToFloat(2, 8),
      positiveSwapImpactFactor: decimalToFloat(1, 8),
    },
    {
      tokens: {
        indexToken: "DOGE",
        longToken: "WBTC",
        shortToken: "DAI",
      },
      positionImpactPoolDistributionRate: expandDecimals(1, 38), // 1 DOGE / second
      minPositionImpactPoolAmount: expandDecimals(8000, 8), // 8000 DOGE

      negativePositionImpactFactor: decimalToFloat(1, 9),
      positivePositionImpactFactor: decimalToFloat(5, 10),
      negativeSwapImpactFactor: decimalToFloat(1, 7),
      positiveSwapImpactFactor: decimalToFloat(5, 8),
    },
    {
      tokens: { indexToken: "LINK", longToken: "WBTC", shortToken: "DAI" },

      negativePositionImpactFactor: decimalToFloat(1, 9),
      positivePositionImpactFactor: decimalToFloat(5, 10),
      negativeSwapImpactFactor: decimalToFloat(1, 7),
      positiveSwapImpactFactor: decimalToFloat(5, 8),
    },
    { tokens: { indexToken: "BNB", longToken: "WBTC", shortToken: "DAI" }, isDisabled: true },
    { tokens: { indexToken: "ADA", longToken: "WBTC", shortToken: "DAI" }, isDisabled: true },
    { tokens: { indexToken: "TRX", longToken: "WBTC", shortToken: "DAI" }, isDisabled: true },
    { tokens: { indexToken: "MATIC", longToken: "WBTC", shortToken: "USDC" }, isDisabled: true },
    { tokens: { indexToken: "DOT", longToken: "WBTC", shortToken: "USDC" }, isDisabled: true },
    { tokens: { indexToken: "UNI", longToken: "WBTC", shortToken: "USDC" }, isDisabled: true },
    {
      tokens: {
        indexToken: "TEST",
        longToken: "WBTC",
        shortToken: "USDC",
      },
      negativePositionImpactFactor: decimalToFloat(26, 6), // 0.0025 %
      positivePositionImpactFactor: decimalToFloat(125, 7), // 0.00125 %
      positionImpactExponentFactor: decimalToFloat(2, 0), // 2
      negativeSwapImpactFactor: decimalToFloat(1, 5), // 0.001 %
      positiveSwapImpactFactor: decimalToFloat(5, 6), // 0.0005 %
      swapImpactExponentFactor: decimalToFloat(2, 0), // 2

      maxPnlFactorForAdlLongs: decimalToFloat(2, 2), // 2%
      maxPnlFactorForAdlShorts: decimalToFloat(2, 2), // 2%

      minPnlFactorAfterAdlLongs: decimalToFloat(1, 2), // 1%
      minPnlFactorAfterAdlShorts: decimalToFloat(1, 2), // 1%

      maxLongTokenPoolAmount: expandDecimals(10, 18),
      maxShortTokenPoolAmount: expandDecimals(300_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(300_000, 6),
      isDisabled: false,
    },

    {
      tokens: { indexToken: "WBTC", longToken: "USDC", shortToken: "USDT" },

      borrowingFactorForLongs: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized

      fundingFactor: decimalToFloat(16, 7), // ~5000% per year for a 100% skew
    },
    {
      tokens: { indexToken: "WETH", longToken: "USDC", shortToken: "DAI" },

      borrowingFactorForLongs: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized

      fundingFactor: decimalToFloat(16, 7), // ~5000% per year for a 100% skew
    },
  ],
  avalancheFuji: [
    { tokens: { indexToken: "WAVAX", longToken: "WAVAX", shortToken: "USDC" } },
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "USDC" },
      virtualMarketId: "0x04533437e2e8ae1c70c421e7a0dd36e023e0d6217198f889f9eb9c2a6727481d",

      positionImpactPoolDistributionRate: expandDecimals(3, 11), // ~0.026 ETH per day
      minPositionImpactPoolAmount: expandDecimals(1, 16), // 0.01 ETH

      openInterestReserveFactorLongs: decimalToFloat(7, 1), // 70%,
      openInterestReserveFactorShorts: decimalToFloat(7, 1), // 70%,

      maxOpenInterestForLongs: decimalToFloat(55_000),
      maxOpenInterestForShorts: decimalToFloat(40_000),
    },
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "DAI" },
      virtualMarketId: hashString("SPOT:AVAX/USD"),
      virtualTokenIdForIndexToken: "0x275d2a6e341e6a078d4eee59b08907d1e50825031c5481f9551284f4b7ee2fb9",
    },
    {
      tokens: { indexToken: "WETH", longToken: "USDC", shortToken: "USDC" },
      virtualTokenIdForIndexToken: "0x275d2a6e341e6a078d4eee59b08907d1e50825031c5481f9551284f4b7ee2fb9",
    },
    {
      tokens: { indexToken: "WBTC", longToken: "WBTC", shortToken: "USDC" },
      virtualMarketId: "0x11111137e2e8ae1c70c421e7a0dd36e023e0d6217198f889f9eb9c2a6727481f",
      virtualTokenIdForIndexToken: "0x04533137e2e8ae1c11111111a0dd36e023e0d6217198f889f9eb9c2a6727481d",
    },
    {
      tokens: { indexToken: "WBTC", longToken: "WBTC", shortToken: "DAI" },
      virtualMarketId: "0x11111137e2e8ae1c70c421e7a0dd36e023e0d6217198f889f9eb9c2a6727481f",
    },
    {
      tokens: { indexToken: "SOL", longToken: "WETH", shortToken: "USDC" },
      virtualMarketId: "0x04533437e2e8ae1c70c421e7a0dd36e023e0d6217198f889f9eb9c2a6727481d",
    },
    {
      tokens: { longToken: "USDC", shortToken: "USDT" },
      swapOnly: true,
    },
    {
      tokens: { indexToken: "DOGE", longToken: "WETH", shortToken: "DAI" },
      positionImpactPoolDistributionRate: expandDecimals(12, 33), // ~10 DOGE per day
      minPositionImpactPoolAmount: expandDecimals(1, 8),
    },
    { tokens: { indexToken: "LINK", longToken: "WETH", shortToken: "DAI" } },
    { tokens: { indexToken: "BNB", longToken: "WETH", shortToken: "DAI" } },
    { tokens: { indexToken: "ADA", longToken: "WETH", shortToken: "DAI" } },
    { tokens: { indexToken: "TRX", longToken: "WETH", shortToken: "DAI" } },
    { tokens: { indexToken: "MATIC", longToken: "WETH", shortToken: "USDC" } },
    { tokens: { indexToken: "DOT", longToken: "WETH", shortToken: "USDC" } },
    { tokens: { indexToken: "UNI", longToken: "WETH", shortToken: "USDC" } },
    {
      tokens: {
        indexToken: "TEST",
        longToken: "WETH",
        shortToken: "USDC",
      },
      negativePositionImpactFactor: decimalToFloat(25, 6), // 0.0025 %
      positivePositionImpactFactor: decimalToFloat(125, 7), // 0.00125 %
      positionImpactExponentFactor: decimalToFloat(2, 0), // 2
      negativeSwapImpactFactor: decimalToFloat(1, 5), // 0.001 %
      positiveSwapImpactFactor: decimalToFloat(5, 6), // 0.0005 %
      swapImpactExponentFactor: decimalToFloat(2, 0), // 2

      maxPnlFactorForAdlLongs: decimalToFloat(2, 2), // 2%
      maxPnlFactorForAdlShorts: decimalToFloat(2, 2), // 2%

      minPnlFactorAfterAdlLongs: decimalToFloat(1, 2), // 1%
      minPnlFactorAfterAdlShorts: decimalToFloat(1, 2), // 1%

      maxLongTokenPoolAmount: expandDecimals(10, 18),
      maxShortTokenPoolAmount: expandDecimals(300_000, 6),

      maxLongTokenPoolAmountForDeposit: expandDecimals(10, 18),
      maxShortTokenPoolAmountForDeposit: expandDecimals(300_000, 6),
    },

    {
      tokens: { indexToken: "WBTC", longToken: "USDC", shortToken: "USDT" },

      borrowingFactorForLongs: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized

      fundingFactor: decimalToFloat(16, 7), // ~5000% per year for a 100% skew
    },
    {
      tokens: { indexToken: "WETH", longToken: "USDC", shortToken: "DAI" },

      borrowingFactorForLongs: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized
      borrowingFactorForShorts: decimalToFloat(3, 7), // 0.0000003, 0.00003% / second, 946% per year if the pool is 100% utilized

      fundingFactor: decimalToFloat(16, 7), // ~5000% per year for a 100% skew
    },
  ],
  hardhat: [
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "USDC" },
    },
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "USDT" },
    },
    {
      tokens: { longToken: "WETH", shortToken: "USDC" },
      swapOnly: true,
    },
    {
      tokens: { indexToken: "WBTC", longToken: "WBTC", shortToken: "USDC" },
    },
    {
      tokens: { indexToken: "SOL", longToken: "WETH", shortToken: "USDC" },
    },
    {
      tokens: { indexToken: "WETH", longToken: "USDC", shortToken: "USDC" },
    },
  ],
  localhost: [
    {
      tokens: { indexToken: "WETH", longToken: "WETH", shortToken: "USDC" },
    },
    {
      tokens: { longToken: "WETH", shortToken: "USDC" },
      swapOnly: true,
    },
    {
      tokens: { indexToken: "SOL", longToken: "WETH", shortToken: "USDC" },
    },
  ],
};

export default async function (hre: HardhatRuntimeEnvironment) {
  const markets = config[hre.network.name];
  const tokens = await hre.gmx.getTokens();
  const defaultMarketConfig = hre.network.name === "hardhat" ? hardhatBaseMarketConfig : baseMarketConfig;
  if (markets) {
    const seen = new Set<string>();
    for (const market of markets) {
      const tokenSymbols = Object.values(market.tokens);
      const tokenSymbolsKey = tokenSymbols.join(":");
      if (seen.has(tokenSymbolsKey)) {
        throw new Error(`Duplicate market: ${tokenSymbolsKey}`);
      }
      seen.add(tokenSymbolsKey);
      for (const tokenSymbol of tokenSymbols) {
        if (!tokens[tokenSymbol]) {
          throw new Error(`Market ${tokenSymbols.join(":")} uses token that does not exist: ${tokenSymbol}`);
        }
      }

      for (const key of Object.keys(defaultMarketConfig)) {
        if (market[key] === undefined) {
          market[key] = defaultMarketConfig[key];
        }
      }
    }
  }
  return markets;
}
