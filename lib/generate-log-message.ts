
import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
    const { action, entityTitle, entityType } = log;

    switch (action) {
        case ACTION.CREATE:
            return `Created ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.CREATE:
            return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.CREATE:
            return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.CREATE:
            return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
    };
};




