import { ADMIN_OTP_LENGTH, CUSTOMER_OTP_LENGTH } from "@common/constants/app.constant";
import { UsedCarListingStatus } from "@common/enums/car-detail.enum";
import { UserRole } from "@common/enums/user.enum";

export class CommonHelper {
    static dateTime(date: Date | string | null | undefined): string | null {
        if (!date) return null;

        const d = date instanceof Date ? date : new Date(date);

        if (isNaN(d.getTime())) return null;

        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }

    // ============ OTP ============
    static generateOtp(length: number = CUSTOMER_OTP_LENGTH): string {
        if (process.env.NODE_ENV === 'development') {
            return '1'.repeat(length);  // e.g., 111111 or 1111
        }

        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;

        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    static generateAdminOtp(length: number = ADMIN_OTP_LENGTH): string {
        if (process.env.NODE_ENV === 'development') {
            return '2'.repeat(length);  // e.g., 111111 or 1111
        }

        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;

        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    static getRoleName(roleId: number): string {
        const roleNames: Record<number, string> = {
            [UserRole.ADMIN]: 'Admin',
            [UserRole.MANAGER]: 'Manager',
            [UserRole.INSPECTOR]: 'Inspector',
            [UserRole.STAFF]: 'Staff',
        };

        return roleNames[roleId] || 'Unknown';
    }

    static getCarListingsStatusName(statusId: UsedCarListingStatus): string {
        const statusNames: Record<UsedCarListingStatus, string> = {
            [UsedCarListingStatus.PENDING]: 'Pending',
            [UsedCarListingStatus.INSPECTION_STARTED]: 'Inspection Started',
            [UsedCarListingStatus.INSPECTION_COMPLETED]: 'Inspection Completed',
            [UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF]: 'Details Updated by Staff',
            [UsedCarListingStatus.APPROVED_BY_MANAGER]: 'Approved by Manager',
            [UsedCarListingStatus.APPROVED_BY_ADMIN]: 'Approved by Admin',
            [UsedCarListingStatus.LISTED]: 'Listed',
            [UsedCarListingStatus.SOLD]: 'Sold',
            [UsedCarListingStatus.REJECTED_BY_MANAGER]: 'Rejected by Manager',
            [UsedCarListingStatus.REJECTED_BY_ADMIN]: 'Rejected by Admin',
            [UsedCarListingStatus.REJECTED_BY_CUSTOMER]: 'Rejected by Customer',
            [UsedCarListingStatus.EXPIRED]: 'Expired',
            [UsedCarListingStatus.CANCELLED]: 'Cancelled',
        }

        return statusNames[statusId] || 'Unknown';
    }

    // ============ TEXT & STRING ============
    static text(text: string | null | undefined, defaultValue: string | null = null): string | null {
        if (text !== null && text !== undefined && text !== '') {
            return text;
        }
        return defaultValue;
    }

    // ============ Image url ============
    static buildImageUrl(key?: string | null, defaultValue: string | null = null): string | null {
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

    static capitalizeWords(input: string): string {
        if (!input) return input;

        return input
            .toLowerCase()
            .split(' ')
            .filter(Boolean)
            .map(
                word => word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(' ');
    }

    // ============ MASKING ============
    static maskMobileNumber(number: string): string {
        if (/^\d{10,}$/.test(number)) {
            return number.substring(0, 2) + '****' + number.substring(number.length - 4);
        }
        return number;
    }

    static maskRegistrationNumber(number: string): string {
        return number.substring(0, 5) + '-**-' + number.substring(number.length - 4);
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