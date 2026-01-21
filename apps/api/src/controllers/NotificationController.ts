/// <reference path="../index.d.ts" />
import type { Request, Response } from 'express';
import * as PushNotificationService from '../services/PushNotificationService';

/**
 * Register a device for push notifications
 * POST /api/notifications/register
 */
export const registerDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { token, platform } = req.body;

    if (!token || !platform) {
      res.status(400).json({ error: 'Token and platform are required' });
      return;
    }

    if (!['ios', 'android'].includes(platform)) {
      res.status(400).json({ error: 'Platform must be ios or android' });
      return;
    }

    const deviceToken = await PushNotificationService.registerDevice(
      userId,
      token,
      platform
    );

    res.status(200).json({
      message: 'Device registered successfully',
      deviceToken: {
        id: deviceToken._id,
        token: deviceToken.token,
        platform: deviceToken.platform,
        active: deviceToken.active,
      },
    });
  } catch (error) {
    console.error('Error registering device:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

/**
 * Unregister a device from push notifications
 * DELETE /api/notifications/register
 */
export const unregisterDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    await PushNotificationService.unregisterDevice(userId, token);

    res.status(200).json({ message: 'Device unregistered successfully' });
  } catch (error) {
    console.error('Error unregistering device:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};

export default {
  registerDevice,
  unregisterDevice,
};
