import Big, { BigNumber } from 'bignumber.js';
import { Token } from 'config/data';

const Units = {
  wei: '1',
  kwei: '1000',
  ada: '1000',
  femtoether: '1000',
  mwei: '1000000',
  babbage: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  einstein: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000'
};

export type TUnit = typeof Units;
export type UnitKeys = keyof TUnit;

class Unit {
  public unit: UnitKeys;
  public amount: BigNumber;

  constructor(amount: BigNumber, unit: UnitKeys) {
    this.unit = unit;
    this.amount = amount;
  }

  public toString(base?: number) {
    return this.amount.toString(base);
  }

  public toPrecision(precision?: number) {
    return this.amount.toPrecision(precision);
  }

  public toWei(): Wei {
    return new Wei(toWei(this.amount, this.unit));
  }

  public toGWei(): GWei {
    return new GWei(toUnit(this.amount, this.unit, 'gwei'));
  }

  public toEther(): Ether {
    return new Ether(toUnit(this.amount, this.unit, 'ether'));
  }
}

export class Ether extends Unit {
  constructor(amount: BigNumber | number | string) {
    super(new Big(amount), 'ether');
  }
}

export class Wei extends Unit {
  constructor(amount: BigNumber | number | string) {
    super(new Big(amount), 'wei');
  }
}

export class GWei extends Unit {
  constructor(amount: BigNumber | number | string) {
    super(new Big(amount), 'gwei');
  }
}

function getValueOfUnit(unit: UnitKeys) {
  return new Big(Units[unit]);
}

export function toWei(number: BigNumber, unit: UnitKeys): BigNumber {
  return number.times(getValueOfUnit(unit));
}

export function toUnit(
  number: BigNumber,
  fromUnit: UnitKeys,
  _toUnit: UnitKeys
): BigNumber {
  return toWei(number, fromUnit).div(getValueOfUnit(_toUnit));
}

export function toTokenUnit(number: BigNumber, token: Token): BigNumber {
  return number.times(new Big(10).pow(token.decimal));
}

export function toTokenDisplay(number: BigNumber, token: Token): BigNumber {
  return number.times(new Big(10).pow(-token.decimal));
}
