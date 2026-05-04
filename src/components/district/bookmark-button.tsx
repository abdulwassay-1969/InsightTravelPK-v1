'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BookmarkButtonProps = {
    districtSlug: string;
    districtName: string;
};

export default function BookmarkButton({ districtSlug, districtName }: BookmarkButtonProps) {
    const storageKey = 'insighttravelpk-bookmarks';
    const [bookmarked, setBookmarked] = useState(false);
    const [flash, setFlash] = useState('');

    useEffect(() => {
        try {
            const stored: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
            setBookmarked(stored.includes(districtSlug));
        } catch { }
    }, [districtSlug]);

    const toggle = () => {
        try {
            const stored: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
            let updated: string[];

            if (bookmarked) {
                updated = stored.filter((s) => s !== districtSlug);
                setFlash(`Removed ${districtName} from bookmarks`);
            } else {
                updated = [...stored, districtSlug];
                setFlash(`${districtName} saved to bookmarks!`);
            }

            localStorage.setItem(storageKey, JSON.stringify(updated));
            setBookmarked(!bookmarked);
            setTimeout(() => setFlash(''), 2500);
        } catch { }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Button
                onClick={toggle}
                variant={bookmarked ? 'default' : 'outline'}
                className={`gap-2 transition-all duration-300 ${bookmarked
                        ? 'bg-primary text-primary-foreground'
                        : 'border-primary text-primary hover:bg-primary/10'
                    }`}
            >
                {bookmarked ? (
                    <BookmarkCheck className="w-4 h-4" />
                ) : (
                    <Bookmark className="w-4 h-4" />
                )}
                {bookmarked ? 'Bookmarked' : 'Bookmark this District'}
            </Button>
            {flash && (
                <span className="text-sm text-muted-foreground animate-pulse">{flash}</span>
            )}
        </div>
    );
}
