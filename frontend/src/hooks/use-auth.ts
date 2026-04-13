import { AuthContext } from "@/types/type";
import { useContext } from "react";


export function useAuth() {
    return useContext(AuthContext);
}
