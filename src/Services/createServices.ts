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
  const validCVC = verifyCVC(CVC, getCard[0].securityCode);
  if (getCard.length === 0) {
    throw { code: "NotFound", message: "Esse cartão não está cadastrado" };
  }
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
  const expirationDate = await generateValidData();
  const CVC = await generateCVC();
  const cryptr = new Cryptr("myTotallySecretKey");
  const crptCVC = cryptr.encrypt(CVC);

  const card = {
    employeeId,
    cardNumber,
    cardName,
    CVC: crptCVC,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    typeCard,
  };

  await repository.createCard(card);
  return card;
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
  const cardName = buidCardName(separateName);

  return cardName.toLocaleUpperCase();
}

function buidCardName(separateName: any) {
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

export async function generateValidData() {
  const month = dayjs().format("MM");
  const year = Number(dayjs().format("YYYY")) + 5;
  const expirateData = month + "/" + year;
  return expirateData;
}

export async function generateCVC() {
  const createCVC = faker.finance.mask(3, false, false);
  return createCVC;
}

function verifyCVC(CVC: string, crptCVC: string) {
  const cryptr = new Cryptr("myTotallySecretKey");
  const decryptedString = cryptr.decrypt(crptCVC);
  console.log(decryptedString);
  if (decryptedString !== CVC) {
    throw { code: "Unauthorized", message: "Dados incorretos" };
  }
}

export async function getStatementByNumber(cardNumber: string) {
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

export async function blockCardByNumber(cardNumber: string, password: string) {
  const getCard = await repository.getCardByNumber(cardNumber);
  const verifyPassword = comparePassword(getCard[0].password, password);
  const blockCard = repository.blockCard(cardNumber);
  return true;
}

function comparePassword(cryptPassword: string, password: string) {
  const correctPassword = bcrypt.compareSync(cryptPassword, password);
  if (correctPassword) {
    throw { code: "Unauthorized", message: "Senha incorreta" };
  }
  return true;
}
