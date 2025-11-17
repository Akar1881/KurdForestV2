import { google } from 'googleapis';
import { Readable } from 'stream';
import type { SavedItem } from './types';

interface WatchlistData {
  watchlist: SavedItem[];
  favorites: SavedItem[];
  lastUpdated: string;
}

const WATCHLIST_FILENAME = 'kurdforest-watchlist.json';

export class GoogleDriveStorage {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getDrive() {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: this.accessToken });
    return google.drive({ version: 'v3', auth });
  }

  async findWatchlistFile(): Promise<string | null> {
    try {
      const drive = this.getDrive();
      const response = await drive.files.list({
        spaces: 'appDataFolder',
        fields: 'files(id, name)',
        q: `name='${WATCHLIST_FILENAME}' and trashed=false`,
      });

      const files = response.data.files;
      const fileId = files && files.length > 0 ? files[0].id! : null;
      console.log('[GoogleDrive] findWatchlistFile:', {
        found: !!fileId,
        fileId: fileId || 'none',
        filesCount: files?.length || 0,
      });
      return fileId;
    } catch (error) {
      console.error('[GoogleDrive] Error finding watchlist file:', error);
      if (error instanceof Error) {
        console.error('[GoogleDrive] Error details:', error.message, error.stack);
      }
      return null;
    }
  }

  async getWatchlistData(): Promise<WatchlistData | null> {
    try {
      const fileId = await this.findWatchlistFile();
      if (!fileId) {
        console.log('[GoogleDrive] No watchlist file found');
        return null;
      }

      const drive = this.getDrive();
      const response = await drive.files.get({
        fileId,
        alt: 'media',
      });

      console.log('[GoogleDrive] Successfully retrieved watchlist data');
      return response.data as WatchlistData;
    } catch (error) {
      console.error('[GoogleDrive] Error getting watchlist data:', error);
      if (error instanceof Error) {
        console.error('[GoogleDrive] Error details:', error.message, error.stack);
      }
      return null;
    }
  }

  async saveWatchlistData(data: WatchlistData): Promise<boolean> {
    try {
      const drive = this.getDrive();
      const fileId = await this.findWatchlistFile();
      
      const jsonData = JSON.stringify(data, null, 2);
      const buffer = Buffer.from(jsonData);

      if (fileId) {
        console.log('[GoogleDrive] Updating existing file:', fileId);
        await drive.files.update({
          fileId,
          media: {
            mimeType: 'application/json',
            body: Readable.from([buffer]),
          },
        });
        console.log('[GoogleDrive] Successfully updated file');
      } else {
        console.log('[GoogleDrive] Creating new file:', WATCHLIST_FILENAME);
        const result = await drive.files.create({
          requestBody: {
            name: WATCHLIST_FILENAME,
            parents: ['appDataFolder'],
            mimeType: 'application/json',
          },
          media: {
            mimeType: 'application/json',
            body: Readable.from([buffer]),
          },
        });
        console.log('[GoogleDrive] Successfully created file:', result.data.id);
      }

      return true;
    } catch (error) {
      console.error('[GoogleDrive] Error saving watchlist data:', error);
      if (error instanceof Error) {
        console.error('[GoogleDrive] Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const apiError = error as any;
        console.error('[GoogleDrive] API error response:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
        });
      }
      return false;
    }
  }
}
