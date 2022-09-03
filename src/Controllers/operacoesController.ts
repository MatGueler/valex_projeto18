import { Request, Response } from "express";
import * as services from "../Services/createServices";

export async function CreateCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const infos: {
    idEmployer: number;
    typeCard:
      | "groceries"
      | "restaurants"
      | "transport"
      | "education"
      | "health";
  } = req.body;

  const verifyCompany = await services.getCompany(apiKey);
  const verifyUser = await services.getUser(infos.idEmployer);
  const verifyCard = await services.getCard(infos.typeCard, infos.idEmployer);
  const createCard = await services.createCard(
    verifyUser[0].fullName,
    infos.idEmployer,
    infos.typeCard
  );
  return res.status(200).send("Card created successfully");
}

export async function ActivateCard(req: Request, res: Response) {
  const infos: {
    cardNumber: number;
    CVC: string;
    password: string;
  } = req.body;

  const verifyCard = await services.getCardByNumber(
    infos.cardNumber,
    infos.CVC
  );
  return res.status(200).send("Card activated successfully");
}
