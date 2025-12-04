import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';


createRoot(document.getElementById("root")!).render(

    <MantineProvider>
  <Notifications />
<App />
</MantineProvider>
);
