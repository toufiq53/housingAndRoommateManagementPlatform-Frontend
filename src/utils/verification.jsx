import React from 'react';
import { MdVerified } from "react-icons/md";

/**
 * Checks if the user's email qualifies for the Facebook-style blue verified checkmark.
 * Matches toufiq8222552@gmail.com (and common typo variants).
 */
export const isVerifiedEmail = (email) => {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    return (
        normalized === 'toufiq8222552@gmail.com' ||
        normalized === 'toufiq822553@gmail.com' ||
        normalized === 'toufiq822552@gmail.com'
    );
};

/**
 * Reusable blue verified badge component styled like Facebook's badge.
 */
export const VerifiedBadge = ({ email, className = "text-[#1877F2] text-lg" }) => {
    if (!isVerifiedEmail(email)) return null;

    return (
        <span className="inline-flex items-center align-middle" title="Verified Account">
            <MdVerified className={`${className} shrink-0 drop-shadow-xs`} />
        </span>
    );
};

