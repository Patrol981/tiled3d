<script lang="ts">
  import { onMount } from "svelte";
  import Application from "./lib/tiled3d/application";

  let cnv: HTMLCanvasElement;
  let rightTopCnv: HTMLCanvasElement;
  let rightBottomCnv: HTMLCanvasElement;

  let app: Application;

  onMount(async () => {
    app = new Application(cnv, rightTopCnv, rightBottomCnv);
    await app.run();
  });
</script>

<main on:contextmenu|preventDefault>
  <canvas id="main-cnv" bind:this={cnv}></canvas>
  <canvas id="right-top-cnv" bind:this={rightTopCnv}></canvas>
  <canvas id="right-bottom-cnv" bind:this={rightBottomCnv}></canvas>
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
