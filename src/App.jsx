import React, { useState, useEffect, useMemo } from "react";
import JsxPreview from "./JsxPreview";

const App = () => {
  const expectedOrigin = useMemo(
    () => import.meta.env.VITE_ORIGINS?.split(",") || [],
    []
  );

  const [jsxCode, setJsxCode] = useState("");

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        !expectedOrigin.includes(event.origin) ||
        event.data?.target !== "aicademy-previewer"
      )
      return;
      console.log("☠️ ~ handleMessage ~ event:", event)
      setJsxCode(event.data?.code);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [expectedOrigin]);

  return <JsxPreview jsxCode={jsxCode} />;
};

export default App;
