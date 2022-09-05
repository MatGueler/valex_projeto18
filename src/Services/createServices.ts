import * as repository from "../Repositories/createCardRepository";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export async function getUser(idEmployer: number) {
  const getUser: any = await repository.getUserById(idEmployer);
  if (getUser.length === 0) {
    throw { code: "NotFound", message: "Esse usuário não existe" };
  }
  return getUser;
}

// Verify card
export async function getCard(typeCard: string, idEmployer: number) {
  const getCard: any = await repository.getCardByUserAndId(
    typeCard,
    idEmployer
  );
  if (getCard.length !== 0) {
    throw { code: "NotFound", message: "Esse usuário já possui esse cartão" };
  }
  return getCard;
}

export async function getCardByNumber(cardNumber: string, CVC: string) {
  const getCard: any = await repository.getCardByNumber(cardNumber);
  verifyExpirationCard(getCard[0].expirationDate);
  const validCVC = verifyCVC(CVC, getCard[0].securityCode);
  verifyCardExist(getCard);
  if (getCard[0].password !== null) {
    throw { code: "NotFound", message: "Esse cartão já está ativado" };
  }
  return getCard;
}

// verify company
export async function getCompany(apiKey: string) {
  const getCompany: any = await repository.getCompanyByKey(apiKey);
  if (getCompany.length === 0) {
    throw { code: "NotFound", message: "Essa compania não está cadastrada" };
  }
  return getCompany;
}

// Create and active card
export async function createCard(
  fullName: string,
  employeeId: number,
  typeCard: string
) {
  const cardNumber = await generateCardNumber();
  const cardName = await generateCardName(fullName);
  const nowDate = generateValidData();
  const CVC = await generateCVC();
  const cryptr = new Cryptr("myTotallySecretKey");
  const crptCVC = cryptr.encrypt(CVC);

  const card = {
    employeeId,
    cardNumber,
    cardName,
    CVC: crptCVC,
    expirationDate: nowDate.month + "/" + `${Number(nowDate.year) + 5}`,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    typeCard,
  };

  await repository.createCard(card);
  return { CVC: CVC, number: card.cardNumber, typeCard };
}

export async function activeCard(password: string, cardNumber: number) {
  const cryptPassword = bcrypt.hashSync(password, 10);
  const changePassword = repository.activeCard(cryptPassword, cardNumber);
}

export async function generateCardNumber() {
  const createNumber = faker.finance.creditCardNumber("################");
  return createNumber;
}

export async function generateCardName(fullName: string) {
  const separateName = fullName.split(" ");
  const cardName = buildCardName(separateName);

  return cardName.toLocaleUpperCase();
}

export async function generateCVC() {
  const createCVC = faker.finance.mask(3, false, false);
  return createCVC;
}

export async function getStatementByNumber(cardNumber: string) {
  const getCard: any = await repository.getCardByNumber(cardNumber);
  verifyCardExist(getCard);
  const getPaymentByCard = await repository.getPayment(cardNumber);
  const getRechargeByCard = await repository.getRecharge(cardNumber);
  const balance = calculateBalance(getPaymentByCard, getRechargeByCard);
  const statement = {
    balance,
    transactions: getPaymentByCard,
    recharges: getRechargeByCard,
  };
  return statement;
}

export async function blockCardByNumber(cardNumber: string, password: string) {
  const getCard = await repository.getCardByNumber(cardNumber);
  verifyCardExist(getCard);
  verifyCardIsBlocked(getCard);
  verifyExpirationCard(getCard[0].expirationDate);
  const verifyPassword = comparePassword(getCard[0].password, password);
  const blockCard = repository.blockCard(cardNumber);
  return true;
}

export async function unlockCardByNumber(cardNumber: string, password: string) {
  const getCard = await repository.getCardByNumber(cardNumber);
  verifyCardExist(getCard);
  verifyCardIsUnlocked(getCard);
  verifyExpirationCard(getCard[0].expirationDate);
  const verifyPassword = comparePassword(getCard[0].password, password);
  const unlockCard = repository.unlockCard(cardNumber);
  return true;
}

export async function rechargeCard(cardNumber: string, amount: number) {
  const getCard = await repository.getCardByNumber(cardNumber);
  verifyCardExist(getCard);
  verifyCardActivated(getCard[0]);
  verifyExpirationCard(getCard[0].expirationDate);
  const recharge = {
    cardId: getCard[0].id,
    amount,
  };
  const createRecharge = await repository.createRecharge(recharge);
  return true;
}

export async function paymentCard(
  cardNumber: string,
  password: string,
  businessId: number,
  amount: number
) {
  const getCard = await repository.getCardByNumber(cardNumber);
  const getBusiness = await repository.getBusiness(businessId);
  comparePassword(getCard[0].password, password);
  verifyCardExist(getCard);
  verifyCardActivated(getCard[0]);
  verifyCardIsBlocked(getCard);
  verifyBusinessExist(getBusiness, getCard);
  verifyExpirationCard(getCard[0].expirationDate);
  const statement = await getStatementByNumber(cardNumber);
  verifyBalance(statement, amount);
  const payment = {
    cardId: getCard[0].id,
    businessId,
    amount,
  };
  const createPayment = await repository.createPayment(payment);
  return true;
}

export async function virtualPayment(infos: any) {
  const getCard = await repository.getCardByNumber(infos.cardNumber);
  const getBusiness = await repository.getBusiness(infos.businessId);
  verifyCardExist(getCard);
  verifyCardActivated(getCard[0]);
  verifyCardIsBlocked(getCard);
  verifyBusinessExist(getBusiness, getCard);
  verifyExpirationCard(getCard[0].expirationDate);
  const statement = await getStatementByNumber(infos.cardNumber);
  verifyBalance(statement, infos.amount);
  verifyCVC(String(infos.CVC), getCard[0].securityCode);
  verifyCardInfos(infos, getCard[0]);
  const createPayment = await repository.createPayment({
    cardId: getCard[0].id,
    businessId: infos.businessId,
    amount: infos.amount,
  });
  return true;
}

export function generateValidData() {
  const day = dayjs().format("DD");
  const month = dayjs().format("MM");
  const year = dayjs().format("YYYY");
  return { day, month, year };
}

function verifyCardInfos(infos: any, card: any) {
  if (infos.number !== card.cardNumber) {
    throw { code: "Unauthorized", message: "Incorrect data" };
  }
  if (infos.cardName.toLocaleUpperCase() !== card.cardholderName) {
    throw { code: "Unauthorized", message: "Incorrect data" };
  }
  if (card.expirationDate !== infos.expirateData) {
    throw { code: "Unauthorized", message: "Incorrect data" };
  }
}

function verifyBusinessExist(business: any, card: any) {
  if (business.length === 0) {
    throw { code: "Unauthorized", message: "This business don't exist" };
  }
  if (business[0].type !== card[0].type) {
    throw {
      code: "Unauthorized",
      message: "This business is incompatible with card",
    };
  }
}

function verifyBalance(statement: any, amount: number) {
  if (statement.balance < amount) {
    throw { code: "Unauthorized", message: "Your balance is insufficient" };
  }
}

function buildCardName(separateName: any) {
  let cardName = "";
  separateName.map((item: string, index: number) => {
    if (item.length <= 3) {
      return "";
    }
    if (index === 0 || index === separateName.length - 1) {
      cardName += item;
    } else {
      cardName += ` ${item[0]} `;
    }
  });
  return cardName;
}

function verifyCVC(CVC: string, crptCVC: string) {
  const cryptr = new Cryptr("myTotallySecretKey");
  const decryptedString = cryptr.decrypt(crptCVC);
  if (decryptedString !== CVC) {
    throw { code: "Unauthorized", message: "Incorrect data" };
  }
}

function calculateBalance(payments: any[], recharges: any[]) {
  const totalPayments = allPayments(payments);
  const totalRecharges = allRecharges(recharges);
  const balance = totalRecharges - totalPayments;
  return balance;
}

function allPayments(payments: any[]) {
  let value = 0;
  payments.map((item) => {
    value += item.amount;
  });
  return value;
}

function allRecharges(recharges: any[]) {
  let value = 0;
  recharges.map((item) => {
    value += item.amount;
  });
  return value;
}

function comparePassword(cryptPassword: string, password: string) {
  const correctPassword = bcrypt.compareSync(password, cryptPassword);
  if (correctPassword === false) {
    throw { code: "Unauthorized", message: "Senha incorreta" };
  }
  return true;
}

function verifyCardExist(getCard: any) {
  if (getCard.length === 0) {
    throw { code: "NotFound", message: "This card is not registered" };
  }
}

function verifyCardIsBlocked(getCard: any) {
  if (getCard[0].isBlocked === true) {
    throw { code: "Unauthorized", message: "This card is blocked" };
  }
}

function verifyCardIsUnlocked(getCard: any) {
  if (getCard[0].isBlocked === false) {
    throw { code: "NotFound", message: "This card is unlocked" };
  }
}

function verifyCardActivated(card: any) {
  if (card.password === null) {
    throw { code: "NotFound", message: "This card is not active" };
  }
}

function verifyExpirationCard(expiration: string) {
  const separateDateExpiration = expiration.split("/");
  const nowDate = generateValidData();
  if (
    separateDateExpiration[1] < nowDate.year ||
    (separateDateExpiration[1] === nowDate.year &&
      separateDateExpiration[0] < nowDate.month)
  ) {
    throw { code: "Unauthorized", message: "Your card has expired" };
  }
}
