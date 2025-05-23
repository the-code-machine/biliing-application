import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";

export const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
             networkMode:"always"
        },
        mutations:{
            networkMode:"always"
        }
    }
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    return QueryClientProvider({
        client: queryClient,
        children: children,
    })
}