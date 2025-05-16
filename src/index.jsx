import React from "react";

import "./styles.css";
import { PanelController } from "./controllers/PanelController.jsx";
import { CommandController } from "./controllers/CommandController.jsx";
import { About } from "./components/About.jsx";
import { Home } from './panels/Home.jsx'

import { entrypoints } from "uxp";

import 'uno.css'

const aboutController = new CommandController(({ dialog }) => <About dialog={dialog}/>, { id: "showAbout", title: "React Starter Plugin Demo", size: { width: 480, height: 480 } });

const homeController = new PanelController(()=> <Home/>, { id: 'home', menuItems: [
  { id: "reload3", label: "Reload Plugin", enabled: true, checked: false, oninvoke: () => location.reload() }
]})

entrypoints.setup({
    plugin: {
        create(plugin) {
            /* optional */ console.log("created", plugin);
        },
        destroy() {
            /* optional */ console.log("destroyed");
        }
    },
    commands: {
        showAbout: aboutController
    },
    panels: {
        home: homeController

    }
});
