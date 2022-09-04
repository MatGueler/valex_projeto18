import connection from "../DataBase/database";

export async function getUserById(idEmployer: number) {
  const getUser = await connection.query(
    `
    SELECT * FROM employees e
    WHERE e.id = $1
    `,
    [idEmployer]
  );
  return getUser.rows;
}

// get card
export async function getCardByUserAndId(typeCard: string, idEmployer: number) {
  const getCard = await connection.query(
    `
    SELECT * FROM cards c
    WHERE c.type = $1 AND c."employeeId" = $2
    `,
    [typeCard, idEmployer]
  );
  return getCard.rows;
}

export async function getCardByNumber(cardNumber: string) {
  const getCard = await connection.query(
    `
    SELECT * FROM cards c
    WHERE c.number = $1
    `,
    [cardNumber]
  );
  return getCard.rows;
}

export async function getCompanyByKey(apiKey: string) {
  const getCompany = await connection.query(
    `
    SELECT * FROM companies c
    WHERE c."apiKey" = $1
    `,
    [apiKey]
  );
  return getCompany.rows;
}

export async function createCard(card: any) {
  await connection.query(
    `
  INSERT INTO cards (
    "employeeId",
    number,
    "cardholderName",
    "securityCode",
    "expirationDate",
    password,
    "isVirtual",
    "originalCardId",
    "isBlocked",
    type
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  `,
    [
      card.employeeId,
      card.cardNumber,
      card.cardName,
      card.CVC,
      card.expirationDate,
      card.password,
      card.isVirtual,
      card.originalCardId,
      card.isBlocked,
      card.typeCard,
    ]
  );
}

export async function activeCard(password: string, cardNumber: number) {
  console.log({ password, cardNumber });
  await connection.query(
    `
  UPDATE cards
  SET password=$1, "isBlocked" = $2
  WHERE number = $3;
  `,
    [password, false, cardNumber]
  );
}

export async function getPayment(cardNumber: string) {
  const getPayment = await connection.query(
    `
  SELECT p.*,b.name AS "businessName" FROM payments p
  JOIN businesses b ON p."businessId" = b.id
  JOIN cards c ON c.id=p."cardId"
  WHERE c.number=$1
  `,
    [cardNumber]
  );
  return getPayment.rows;
}

export async function getRecharge(cardNumber: string) {
  const getRecharge = await connection.query(
    `
    SELECT r.* FROM recharges r
    JOIN cards c ON c.id=r."cardId"
    WHERE c.number = $1
  `,
    [cardNumber]
  );
  return getRecharge.rows;
}

export async function blockCard(cardNumber: string) {
  await connection.query(
    `
  UPDATE cards
  SET "isBlocked" = $1
  WHERE number = $2;
  `,
    [true, cardNumber]
  );
}

export async function unlockCard(cardNumber: string) {
  await connection.query(
    `
  UPDATE cards
  SET "isBlocked" = $1
  WHERE number = $2;
  `,
    [false, cardNumber]
  );
}

export async function createRecharge(recharge: any) {
  await connection.query(
    `
    INSERT INTO recharges (
    "cardId",
    amount
    ) VALUES ($1,$2)
  `,
    [recharge.cardId, recharge.amount]
  );
}
