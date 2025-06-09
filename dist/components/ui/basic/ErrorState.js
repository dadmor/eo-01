import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Alert } from '../basic/Alert';
export const ErrorState = ({ error = false, title = 'Wystąpił błąd', message = 'Spróbuj ponownie.', onRetry, children = null }) => {
    if (error) {
        return _jsx(Alert, { type: "error", title: title, message: message, onRetry: onRetry });
    }
    return _jsx(_Fragment, { children: children });
};
