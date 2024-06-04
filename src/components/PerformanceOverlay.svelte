<script lang="ts">
  import type { WebGPUMemoryInfo } from "../lib/utils/memory";
  import { perfInfo } from "../store/engineStore";
  import { bytesToMB } from "../lib/utils/bytes";

  let info: WebGPUMemoryInfo;

  perfInfo.subscribe((value) => {
    info = value;
  });
</script>

<div>
  {#if info != undefined}
    <h1>Resources</h1>
    {#each Object.entries(info.resources) as [title, value]}
      <p>{title} : {value}</p>
    {/each}
    <h1>Memory</h1>
    {#each Object.entries(info.memory) as [title, value]}
      <p>{title} : {bytesToMB(value)}MB</p>
    {/each}
  {/if}
</div>

<style scoped>
  div {
    position: absolute;
    top: 0;
    left: 0;

    overflow-y: scroll;

    width: 20vw;
    height: 100vh;

    background-color: rgba(47, 47, 47, 0.4);
  }
</style>
