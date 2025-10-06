/// <reference path="../index.d.ts" />

import type { Request, Response } from 'express';
import CryptoAssetModel from '../models/CryptoAssetModel';
import { requireAuth } from '../utils/authUtils';
import {
  handleGenericError,
  handleNotFoundError,
  handleValidationError,
} from '../utils/errorUtils';

export const getAllCryptoAssets = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const cryptoAssets = await CryptoAssetModel.find({ userId });
    res.json(cryptoAssets);
  } catch (error) {
    return handleGenericError(res, 'fetch crypto assets', error);
  }
};

export const getCryptoAssetById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const cryptoAsset = await CryptoAssetModel.findOne({ _id: id, userId });
    if (!cryptoAsset) {
      return handleNotFoundError(res, 'CryptoAsset');
    }

    res.json(cryptoAsset);
  } catch (error) {
    return handleGenericError(res, 'fetch crypto asset', error);
  }
};

export const createCryptoAsset = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { name, code, amount } = req.body;
    const cryptoAsset = new CryptoAssetModel({
      name,
      code,
      amount,
      userId,
    });
    const savedCryptoAsset = await cryptoAsset.save();

    res.status(201).json(savedCryptoAsset);
  } catch (error) {
    return handleValidationError(res, error, 'crypto asset');
  }
};

export const updateCryptoAsset = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const { name, code, amount } = req.body;
    const cryptoAsset = await CryptoAssetModel.findOneAndUpdate(
      { _id: id, userId },
      { name, code, amount },
      { new: true, runValidators: true }
    );

    if (!cryptoAsset) {
      return handleNotFoundError(res, 'CryptoAsset');
    }

    res.json(cryptoAsset);
  } catch (error) {
    return handleGenericError(res, 'update crypto asset', error);
  }
};

export const deleteCryptoAsset = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const cryptoAsset = await CryptoAssetModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!cryptoAsset) {
      return handleNotFoundError(res, 'CryptoAsset');
    }

    res.json({ message: 'Crypto asset deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete crypto asset', error);
  }
};
