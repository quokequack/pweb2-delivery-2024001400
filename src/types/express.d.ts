import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        flash(): Record<string, string[]>;
        flash(type: string): string[];
        flash(type: string, message: string | string[]): number;
    }
}
