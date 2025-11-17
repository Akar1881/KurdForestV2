import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleDriveStorage } from '@/lib/googleDrive';
import type { SavedItem } from '@/lib/types';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('[Watchlist Sync] GET - Session status:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      user: session?.user?.email,
    });
    
    if (!session?.accessToken) {
      console.warn('[Watchlist Sync] GET - No access token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const driveStorage = new GoogleDriveStorage(session.accessToken);
    const data = await driveStorage.getWatchlistData();

    if (!data) {
      console.log('[Watchlist Sync] GET - No existing file found, returning empty data');
      return NextResponse.json({
        watchlist: [],
        favorites: [],
      });
    }

    console.log('[Watchlist Sync] GET - Successfully retrieved data:', {
      watchlistCount: data.watchlist?.length || 0,
      favoritesCount: data.favorites?.length || 0,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Watchlist Sync] GET - Error:', error);
    if (error instanceof Error) {
      console.error('[Watchlist Sync] GET - Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to get watchlist' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('[Watchlist Sync] POST - Session status:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      user: session?.user?.email,
    });
    
    if (!session?.accessToken) {
      console.warn('[Watchlist Sync] POST - No access token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { watchlist, favorites } = body as {
      watchlist: SavedItem[];
      favorites: SavedItem[];
    };

    console.log('[Watchlist Sync] POST - Saving data:', {
      watchlistCount: watchlist?.length || 0,
      favoritesCount: favorites?.length || 0,
    });

    const driveStorage = new GoogleDriveStorage(session.accessToken);
    const success = await driveStorage.saveWatchlistData({
      watchlist,
      favorites,
      lastUpdated: new Date().toISOString(),
    });

    if (!success) {
      console.error('[Watchlist Sync] POST - Failed to save to Google Drive');
      return NextResponse.json(
        { error: 'Failed to save to Google Drive' },
        { status: 500 }
      );
    }

    console.log('[Watchlist Sync] POST - Successfully saved to Google Drive');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Watchlist Sync] POST - Error:', error);
    if (error instanceof Error) {
      console.error('[Watchlist Sync] POST - Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to save watchlist' },
      { status: 500 }
    );
  }
}
