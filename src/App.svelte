<script lang="ts">
  import { onMount } from "svelte";
  import Application from "./lib/tiled3d/application";
  import Toolbar from "./components/Toolbar.svelte";
  import Properties from "./components/Properties.svelte";
  import PerformanceOverlay from "./components/PerformanceOverlay.svelte";
  import SketchOptions from "./components/SketchOptions.svelte";
  import { setClearData } from "./store/propertiesStore";

  let cnv: HTMLCanvasElement;
  let rightTopCnv: HTMLCanvasElement;
  let rightBottomCnv: HTMLCanvasElement;

  let app: Application;

  onMount(async () => {
    setClearData();
    app = new Application(cnv, rightTopCnv, rightBottomCnv);
    await app.run();
  });
</script>

<main on:contextmenu|preventDefault>
  <canvas id="main-cnv" bind:this={cnv}></canvas>
  <canvas id="right-top-cnv" bind:this={rightTopCnv}></canvas>
  <canvas id="right-bottom-cnv" bind:this={rightBottomCnv}></canvas>

  <PerformanceOverlay />
  <Toolbar />
  <Properties />

  <SketchOptions />
</main>

<style>
  #main-cnv {
    width: 50vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
  }

  #right-top-cnv {
    width: 50vw;
    height: 50vh;
    position: absolute;
    top: 0;
    right: 0;
  }

  #right-bottom-cnv {
    width: 50vw;
    height: 50vh;
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
