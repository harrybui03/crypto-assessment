export function formatDate(
    date: Date | number | string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    },
    locale: string = navigator.language
): string {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString(locale, options);
}

export function formatTime(
    date: Date | number | string,
    options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    },
    locale: string = navigator.language
): string {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date passed to formatTime');
        return '--:--';
    }

    return parsedDate.toLocaleTimeString(locale, options);
}

export function validateCoin(coin: string): boolean {
    return coin.trim().length > 0;
}

export function validateRange(range: string): boolean {
    const validRanges = [1, 7, 30, 90, 365];
    const numericRange = Number(range);
    return (
        !isNaN(numericRange) &&
        Number.isInteger(numericRange) &&
        validRanges.includes(numericRange)
    );
}