import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
export const OperatorRequests = () => {
    const { data } = useQuery({
        resource: "service_requests",
        metaData: {
            select: "*, users!beneficiary_id(name, email), contractor_offers(count)",
        },
    });
    console.log("Operator requests:", data);
    return (_jsx("div", { className: "hero", children: _jsx("h1", { className: "text-5xl", children: "Zapytania do Weryfikacji" }) }));
};
