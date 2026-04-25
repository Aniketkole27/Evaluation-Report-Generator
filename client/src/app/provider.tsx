
import type { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
    return (
        <>
            {/* Add global providers here */}
            {children}
        </>
    );
}

export default Providers;
