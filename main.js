
const { entrypoints } = require("uxp");
const {app, constants} = require("photoshop");

  showAlert = () => {
    alert("目前是 v0.0.1版本");
  }

  entrypoints.setup({
    commands: {
      showAlert,
    },
    panels: {
      vanilla: {
        show(node ) {
        }
      }
    }
  });


let activeLayers = []
function showLayerNames() {
    const app = require("photoshop").app;
    // const allLayers = app.activeDocument.layers;
    activeLayers = app.activeDocument.activeLayers;
    const allLayerNames = activeLayers.map(layer => layer.name);
    const sortedNames = allLayerNames.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    document.getElementById("layers").innerHTML = `
      <ul>${
        sortedNames.map(name => `<li>${name}</li>`).join("")
      }</ul>`;
}

// document.getElementById("btnPopulate").addEventListener("click", showLayerNames);

async function cut() {
  // const document = await app.open();
  const fs = require('uxp').storage.localFileSystem;
  const app = require("photoshop").app;
  const layers = activeLayers = app.activeDocument.activeLayers;


  const domains = require('uxp').storage.domains
  // debugger
  if (fs.supportedDomains.includes(domains.userDocuments)) {
    console.log("We can open a picker to the user's documents.")
  } else {
    alert('Unsupported!')
  }

  const folder = await fs.getFolder({initialDomain: domains.userDocuments});
  if(!folder) {
    alert('请选择文件夹!')

    
    return
  }
  const path = await folder.createEntry('1.png')
  console.log('🚀 ~ cut ~ path:', path)



  await require('photoshop').core.executeAsModal(async function() {
    for(var layer of layers) {
      // width: layer.bounds.width,
      // height: layer.bounds.height
      const newDoc = await app.documents.add({
        fill: 'transparent'
      })
      await layer.duplicate(newDoc)
      await newDoc.trim(constants.TrimType.TRANSPARENT, true, true, true, true)
      const path = await folder.createEntry(layer.name)
      await newDoc.saveAs.png(path)
      newDoc.closeWithoutSaving()
    }
  })

  

  // await app.activeDocument.close()
  

  // activeLayers.map((layer)=> {
  //   app.documents.add(new Document({
  //     width: 800, 
  //     height: 600,    
  //   }))
  //   .then((newDoc)=> {
  //     newDoc.createLayerGroup({
  //       fromLayers: [layer]
  //     })
    
  //   })
  // })
  
}
document.getElementById('btnCut').addEventListener('click', cut)