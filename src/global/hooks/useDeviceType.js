import { useState, useEffect } from "react";

export default function useDeviceType(breakpoint = 768) {
    const [deviceType, setDeviceType] = useState("desktop");

    useEffect(() => {
        const checkDeviceType = () => {
            setDeviceType(window.innerWidth < breakpoint ? "mobile" : "desktop");
        };

        // Initial check
        checkDeviceType();

        // Event listener
        window.addEventListener("resize", checkDeviceType);

        // Cleanup
        return () => window.removeEventListener("resize", checkDeviceType);
    }, [breakpoint]);

    return deviceType;
}