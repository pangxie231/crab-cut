import React, { useState } from "react";
// import '@swc-uxp-wrappers/button/sp-button.js';

// import 

export const Home = () => {

  let folder

  const [isAuto, setIsAuto] = useState(true)
  /**
   * @param {InputEvent} e
   */
  const onAutoChange = (e) => {
    console.log('isAuto', isAuto)
    setIsAuto(e.target.checked)
  }

  /**
   * 切出传入图层
   * @param {import('photoshop/dom/collections/Layers').Layers} layers 
   */
  async function cutLayers(layers) {
    const { app, constants } = require("photoshop");

    for (var layer of layers) {
      const newDoc = await app.documents.add({
        fill: 'transparent'
      })
      await layer.duplicate(newDoc)
      await newDoc.trim(constants.TrimType.TRANSPARENT, true, true, true, true)
      const filename = layer.name.replace(new RegExp(`^${prefix}`), '')
      const path = await folder.createEntry(filename)
      await newDoc.saveAs.png(path)
      newDoc.closeWithoutSaving()
    }
  }

  // 获取带有指定前缀的所有图层
  // 指定前缀 px:
  const prefix = 'px:'
  function autoLayers() {
    const { app } = require('photoshop')
    const layers = app.activeDocument.layers

    const stacks = [...layers]
    const specifyLayers = []

    while(stacks.length) {
      const layer = stacks.pop()

      const isValid = layer.name.startsWith(prefix)
      if(isValid && layer.visible) {
        specifyLayers.push(layer)
      }

      if(layer.layers) {
        stacks.push(...layer.layers)
      }

    }
    
    return specifyLayers
  }

  async function cut() {
    console.log('isAuto', isAuto)

    const fs = require('uxp').storage.localFileSystem;
    const { app } = require("photoshop");
    const layers = app.activeDocument.activeLayers;

    if (!isAuto && !layers.length) {
      alert('请先选择图层!')
      return
    }


    const domains = require('uxp').storage.domains

    if (fs.supportedDomains.includes(domains.userDocuments)) {
      console.log("We can open a picker to the user's documents.")
    } else {
      alert('Unsupported!')
    }

    folder = await fs.getFolder({ initialDomain: domains.userDocuments });
    if (!folder) {
      alert('请选择文件夹!')

      return
    }

    const allLayers = autoLayers()
    await require('photoshop').core.executeAsModal(async function () {
      await cutLayers(isAuto ? allLayers : layers)
    })
  }

  return (
    <div className="h-100% flex flex-col">


      <div className="mt-auto flex flex-col">
        <div className="mb-20px">
          <div className="flex flex-col gap-8px">
            {/* <sp-checkbox checked={false} onClick={onAutoChange}>自动选择</sp-checkbox> */}
            <div className="flex items-center">
              <label className="text-12px text-#fff">
                <input onChange={onAutoChange} checked={isAuto} type="checkbox" />自动选择
              </label>
            </div>
            <span className="text-lightBlue text-14px">(自动将以px:开头的图层切出)</span>
          </div>
        </div>
        <div className="mb-8px flex justify-center">
          <sp-button onClick={cut}>🦀一键切图</sp-button>
        </div>
      </div>

    </div>
  )
}