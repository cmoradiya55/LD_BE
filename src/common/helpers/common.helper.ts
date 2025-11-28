export class CommonHelper {
    // ============ TEXT & STRING ============
    static text(text: string | null | undefined, defaultValue: string | null = null): string | null {
        if (text !== null && text !== undefined && text !== '') {
            return text;
        }
        return defaultValue;
    }

    // ============ Image url ============
    static buildImageUrl(key?: string | null, defaultValue: string | null = null): string | null {
        console.log('key', key);
        if (key !== null && key !== undefined && key !== '') {
            if (/^https?:\/\//i.test(key)) {
                return key;
            }
            return `${process.env.AWS_S3_PUBLIC_BASE_URL}/${key}`;
        }
        return defaultValue;
    }

    // ============ NUMBERS ============
    static number(num: number | string | null | undefined, defaultValue: number | null = null): number | null {
        if (num !== null && num !== undefined && num !== '') {
            return Math.round(Number(num));
        }
        return defaultValue;
    }

    static currency(amount: number | string | null | undefined, twoDecimalPlaces: boolean = true): number {
        let value = Number(amount) || 0;
        value = Math.round(value * 100) / 100;

        if (twoDecimalPlaces) {
            value = parseFloat(value.toFixed(2));
        }

        return value;
    }

    static roundToDecimal(value: number, precision: number = 3): number {
        return parseFloat(value.toFixed(precision));
    }

    // ============ BOOLEAN ============
    static bool(value: any, defaultValue: boolean = false): boolean {
        if (value === true || value === 'true' || value === 1 || value === '1') {
            return true;
        }
        return defaultValue;
    }

    // ============ MASKING ============
    static maskMobileNumber(number: string): string {
        if (/^\d{10,}$/.test(number)) {
            return number.substring(0, 2) + '****' + number.substring(number.length - 4);
        }
        return number;
    }

    // ============ HTTP OPERATIONS ============
    static getOperation(method: string): string {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'LIST';
            case 'POST':
                return 'ADD';
            case 'DELETE':
                return 'DELETE';
            case 'PUT':
            case 'PATCH':
                return 'EDIT';
            default:
                throw new Error('Undefined Method');
        }
    }

    // ============ PAGINATION ============
    static getPagination(page: number | string | null, defaultValue: number = 10): number {
        if (page) {
            return Math.round(Number(page));
        }
        return defaultValue;
    }

    // ============ NUMBER TO WORDS ============
    static numberToWord(number: number): string {
        const no = Math.floor(number);
        const decimal = Math.round((number - no) * 100);
        const decimalPart = decimal;

        const words: Record<number, string> = {
            0: '',
            1: 'one',
            2: 'two',
            3: 'three',
            4: 'four',
            5: 'five',
            6: 'six',
            7: 'seven',
            8: 'eight',
            9: 'nine',
            10: 'ten',
            11: 'eleven',
            12: 'twelve',
            13: 'thirteen',
            14: 'fourteen',
            15: 'fifteen',
            16: 'sixteen',
            17: 'seventeen',
            18: 'eighteen',
            19: 'nineteen',
            20: 'twenty',
            30: 'thirty',
            40: 'forty',
            50: 'fifty',
            60: 'sixty',
            70: 'seventy',
            80: 'eighty',
            90: 'ninety',
        };

        const digits = ['', 'hundred', 'thousand', 'lakh', 'crore'];

        const convertToWords = (num: number): string => {
            if (num === 0) return '';

            const str: string[] = [];
            let i = 0;
            let currentNum = num;

            while (currentNum > 0) {
                const divider = i === 2 ? 10 : 100;
                const part = currentNum % divider;
                currentNum = Math.floor(currentNum / divider);

                if (part) {
                    const plural = str.length && part > 9 ? 's' : '';
                    const hundred = str.length === 1 && str[0] ? ' and ' : '';

                    if (part < 21) {
                        str.push(`${words[part]} ${digits[i]}${plural} ${hundred}`);
                    } else {
                        str.push(
                            `${words[Math.floor(part / 10) * 10]} ${words[part % 10]} ${digits[i]}${plural} ${hundred}`,
                        );
                    }
                } else {
                    str.push('');
                }

                i += divider === 10 ? 1 : 2;
            }

            return str.reverse().join('').trim();
        };

        const rupees = convertToWords(no) || 'Zero';
        const paise = decimalPart > 0 ? `${convertToWords(decimal)} Paise` : '';

        const inWord = `${rupees} Rupees ${paise} Only`
            .replace(/\s+/g, ' ')
            .trim();

        return inWord
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}